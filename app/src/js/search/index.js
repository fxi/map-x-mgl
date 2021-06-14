import {ButtonCircle} from './../icon_flash';
import {modalConfirm} from './../mx_helper_modal.js';
import {storyRead} from './../mx_helper_story.js';
import {viewToMetaModal} from './../mx_helper_map_view_metadata.js';
import {getDictItem} from './../mx_helper_language.js';
import {EventSimple} from './../listener_store';
import {viewsListAddSingle} from './../mx_helper_map_view_ui.js';
import {el, elSpanTranslate, elButtonIcon} from '../el_mapx/index.js';
import {
  zoomToViewId,
  getView,
  getViewRemote,
  viewAdd,
  viewRemove,
  getViewsOpen
} from './../mx_helper_map.js';
import {
  isStory,
  isView,
  isArray,
  isStringRange,
  isBoolean
} from './../is_test/index.js';

import {def} from './default.js';
class Search extends EventSimple {
  constructor(opt) {
    super();
    const s = this;
    s.setOpt(opt);
    return s;
  }

  async initCheck() {
    const s = this;
    if (s._init) {
      return;
    }
    s._init = true;
    s._filters = {};
    /**
     * Dynamic import
     */
    await import('./style.less');
    await import('./style_flatpickr.less');
    await import('/node_modules/nouislider/distribute/nouislider.css');

    s._nouislider = (await import('nouislider')).default;
    s._MeiliSearch = (await import('meilisearch')).MeiliSearch;
    s._flatpickr = (await import('flatpickr')).default;
    s._flatpickr_langs = await import('./flatpickr_locales');
    s._elContainer = document.querySelector(s.opt('container'));
    s._meili = new s._MeiliSearch({
      host: `${s.opt('protocol')}${s.opt('host')}:${s.opt('port')}`,
      apiKey: s.opt('key') || null
    });

    /**
     * Build ui
     */
    await s.setLanguage({reset: false});
    await s.build();

    /*
     * Autocomplete (mhé)
     */
    if (s.opt('autocomplete')) {
      s.Tribute = (await import('tributejs')).default;
      import('./style_tribute.less');
      s._init_tribute(s._elInput, s._elInputContainer);
    }
    await s.update();
    s.fire('ready');
    return s;
  }

  opt(k) {
    return this._opt[k];
  }

  setOpt(opt) {
    const s = this;
    if (!s._opt) {
      s._opt = def;
    }
    Object.assign(s._opt, opt);
    s.fire('options_update', opt);
  }

  get isReady() {
    return !!this._init;
  }

  async setLanguage(opt) {
    const s = this;
    opt = Object.assign({}, {reset: true, language: null}, opt);
    if (opt.language) {
      s.setOpt({language: opt.language});
    }
    await s.setIndex();
    await s.setLocaleFlatpickr();
    if (opt.reset) {
      s.reset();
    }
  }

  async setLocaleFlatpickr(lang) {
    const s = this;
    if (!lang) {
      lang = s.opt('language');
    }
    if (!s._flatpickr_langs) {
      return;
    }

    /**
     * The module returns key with full language name.. e.g. "Russian".
     * instead of language code.
     * -> `locs.default[lang]` as workaround ?
     */
    let locFun = s._flatpickr_langs[lang];
    if (!locFun) {
      locFun = s._flatpickr_langs['en'];
    }
    const locs = await locFun();
    let loc = s._flatpickr.l10ns.default;

    if (locs) {
      const locLang = locs.default[lang];
      if (locLang) {
        loc = locLang;
      }
    }
    if (loc) {
      s._flatpickr.localize(loc);
    }
    if (s._flatpickr_filters) {
      for (let f of s._flatpickr_filters) {
        f.set('locale', lang);
      }
    }
  }

  async setIndex(id) {
    const s = this;
    if (!id) {
      id = s.template(s.opt('index_template'));
    }
    s.setOpt({index: id});
    if (!s._meili) {
      return;
    }
    s._index = await s._meili.getIndex(id);
  }

  async build() {
    const s = this;
    if (s._built) {
      return;
    }
    s._built = true;

    /**
     * Results and pagination
     */
    s._elResults = el('div', {class: ['search--results']});
    s._elPagination = el('div', {class: ['search--pagination']});

    /**
     * Filters and facet
     */
    s._elFiltersFacets = el('div', {class: 'search--filter-facets'});
    s._elFiltersDate = el('div', {class: 'search--filter-dates'});
    s._elFiltersDateGroup = el('details', [
      el('summary', elSpanTranslate('search_filter_date_details')),
      s._elFiltersDate
    ]);
    s._elFiltersYearsRange = el('div', {
      class: ['search--filter-years', 'mx-slider-container']
    });
    s._elFilters = el(
      'div',
      {
        class: ['search--filters', 'search--hidden']
      },
      s._elFiltersYearsRange,
      s._elFiltersFacets,
      s._elFiltersDateGroup
    );

    /**
     * Stats
     */
    s._elStatHits = el('span', {
      class: ['search--stats-item']
    });
    s._elStats = el(
      'div',
      {
        class: ['search--stats']
      },
      s._elStatHits
    );

    /**
     * Search header
     */

    s._elHeader = el(
      'div',
      {
        class: 'search--header'
      },
      await s._build_input({
        key_label: 'search_title',
        key_placeholder: 'search_placeholder'
      }),
      s._elSliderYearContainer,
      s._elFilters
    );

    /**
     * Search complete
     */

    s._elSearch = el(
      'div',
      {
        class: ['search--container'],
        on: ['click', s._handle_click.bind(s)]
      },
      s._elHeader,
      s._elResults,
      s._elPagination,
      s._elStats
    );

    s._elContainer.appendChild(s._elSearch);

    /**
     * Filters
     */
    await s._build_filter_date();
    await s._build_filter_years_range();
  }

  _update_facets(distrib) {
    const s = this;
    clearTimeout(s._timeout_facets);
    s._timeout_facets = setTimeout(() => {
      const attrKeys = s.opt('keywords').map((k) => k.type);

      for (let attr of attrKeys) {
        /**
         * source_keyword, source_keywords_m49, view_type
         */
        const tags = distrib[attr];
        for (let tag in tags) {
          if (tag) {
            const k = `${attr}:${tag}`;
            /**
             * Label or key, e.g. vt, environment, global
             */
            const count = tags[tag];
            const facet = s._facets[k];
            facet.count = count;
          }
        }
      }
    }, 200);
  }

  _build_facets(distrib) {
    if (!distrib) {
      console.warn('No facet distribution');
      return el('span', '');
    }
    const s = this;
    s._facets = {};
    s._facets_containers = [];
    const attrKeys = s.opt('keywords').map((k) => k.type);
    const frag = new DocumentFragment();

    for (let attr of attrKeys) {
      const aConf = s.opt('keywords').find((k) => k.type == attr);
      const subgroups = aConf.subgroups;
      /**
       * source_keyword, source_keywords_m49, view_type
       */
      const {elFacetGroup, elFacetItems} = build_facets_group(attr);
      s._facets_containers.push(elFacetItems);
      frag.appendChild(elFacetGroup);

      /**
       * Create sub group
       */

      if (subgroups) {
        elFacetItems.className = '';
        for (let g of subgroups) {
          const {elFacetGroup: elFg, elFacetItems: elFi} = build_facets_group(
            g.key
          );
          elFacetItems.appendChild(elFg);
          g._elSubFacetItems = elFi;
        }
      }

      const values = distrib[attr];
      /**
       * Values format :
       * {
       *   "landmines":12,
       *   "3w": 1,
       *   "abt 11": 6,
       *   "abt" 12": 1,
       *   "accessibility": 1,
       *   "activities": 1,
       *   "administrative": 1
       *   <...>
       * }
       */

      for (let value in values) {
        /**
         * Value type is string, e.g. :
         * "landmines"
         */
        if (value) {
          const k = `${attr}:${value}`;
          const fc = new Facet({
            count: values[value],
            label: value,
            group: attr,
            checked: false,
            id: k
          });
          s._facets[k] = fc;
          if (!subgroups) {
            elFacetItems.appendChild(fc.el);
            continue;
          }
          for (let g of subgroups) {
            const isMatch = value.match(g.match);
            const isExclude = value.match(g.exclude);
            if (isMatch && !isExclude) {
              g._elSubFacetItems.appendChild(fc.el);
            }
          }
        }
      }
    }

    function build_facets_group(key) {
      let elFacetItems;
      const elFacetGroup = el(
        'div',
        {
          class: 'search--filter-facets-group'
        },
        [
          el(
            'label',
            {
              class: 'search--filter-group-title'
            },
            elSpanTranslate(`search_${key}`)
          ),
          (elFacetItems = el('div', {
            class: 'search--filter-facets-items'
          }))
        ]
      );

      return {elFacetItems, elFacetGroup};
    }

    return frag;
  }

  async _build_filter_years_range() {
    const s = this;
    /**
     * Year slider container and labels
     */
    const yMin = s.opt('dates').year_min;
    const yMax = s.opt('dates').year_max;

    const elSliderYear = el('div');
    const elSliderYearInputMin = el('span', {
      class: 'search--filter-years-value'
    });
    const elSliderYearTitle = elSpanTranslate('search_year_composite_range');

    const elSliderYearInputMax = el('span', {
      class: 'search--filter-years-value'
    });

    const elSliderYearRowTop = el(
      'div',
      {
        class: 'search--filter-years-row'
      },
      [elSliderYearInputMin, elSliderYearTitle, elSliderYearInputMax]
    );
    const elSliderYearRowBottom = el(
      'div',
      {
        class: 'search--filter-years-row'
      },
      [el('span', `${yMin}`), el('span', `${yMax}`)]
    );

    s._elFiltersYearsRange.appendChild(elSliderYearRowTop);
    s._elFiltersYearsRange.appendChild(elSliderYear);
    s._elFiltersYearsRange.appendChild(elSliderYearRowBottom);

    /**
     * Slider
     */
    s._year_slider = s._nouislider.create(elSliderYear, {
      range: {min: yMin, max: yMax},
      step: 1,
      start: [yMin, yMax],
      connect: true,
      behaviour: 'drag',
      tooltips: false
    });
    /**
     * - drag produce end event
     * - update produce set event
     * -> unable to have a smart way of handling fast changes
     * -> using 'update' for all
     */
    s._year_slider.on('update', update);
    /**
     * Update filters
     */
    async function update(d) {
      const start = parseInt(d[0]);
      const end = parseInt(d[1]);
      const attrStart = 'range_start_at_year';
      const attrEnd = 'range_end_at_year';
      /**
       * Strict
       * :) [--|___-|--]
       * :( [-_|___-|--]
       * const strFilter = `${attrStart} >= ${start} AND ${attrEnd} <= ${end}`;
       *
       * Partial
       * :) [--|___-|--]
       * :) [-_|___-|--]
       * :) [--|---_|__]
       * :( [__|----|--]
       */
      const strFilter = `${attrStart} <= ${end} AND ${attrEnd} >= ${start}`;
      elSliderYearInputMin.dataset.year = start;
      elSliderYearInputMax.dataset.year = end;
      s.setFilter('range_years', strFilter);
      await s.update();
    }
  }
  /**
   * Build filter date for each item in options > attributes > date
   * connect flatpickr and add to UI
   */
  async _build_filter_date() {
    const s = this;
    const attrDate = s.opt('attributes').date;
    const attrDateRange = s.opt('attributes').date_range;
    s._flatpickr_filters = [];
    const attrDateItems = attrDate.map((attr) => {
      return {attr, range: false};
    });
    attrDateItems.push(
      ...attrDateRange.map((attr) => {
        return {attr, range: true};
      })
    );
    const txtPlaceholder = await getDictItem('search_filter_date_placeholder');
    for (let item of attrDateItems) {
      /**
       * Layout
       */
      const elFilterDate = el('input', {
        type: 'text',
        class: 'search--filter-date-input',
        dataset: {
          lang_key: 'source_filter_date_placeholder',
          lang_type: 'placeholder'
        },
        placeholder: txtPlaceholder,
        id: Math.random().toString(32)
      });
      const elFilterDateLabel = el(
        'label',
        {
          class: 'search--filter-date-label',
          for: elFilterDate.id
        },
        elSpanTranslate(`search_filter_${item.attr}`)
      );
      const elFilterContainer = el('div', {class: 'search--filter-date-item'}, [
        elFilterDateLabel,
        elFilterDate
      ]);
      s._elFiltersDate.appendChild(elFilterContainer);
      /**
       * Date picker
       */
      const fpickr = s._flatpickr(elFilterDate, {
        mode: item.range ? 'range' : 'single',
        allowInput: true,
        onChange: async (e) => {
          let strFilter = '';
          if (item.range) {
            if (e[0]) {
              strFilter = `${item.attr} >= ${(e[0] * 1) / 1000}`;
            }
            if (e[1]) {
              strFilter = `${strFilter} AND ${item.attr}<=${(e[1] * 1) / 1000}`;
            }
          } else {
            const isStart = item.attr.includes('_start_');
            if (e[0]) {
              strFilter = `${item.attr}${isStart ? '>' : '<'}=${(e[0] * 1) /
                1000}`;
            }
          }
          s.setFilter(item.attr, strFilter);
          await s.update();
        }
      });
      s._flatpickr_filters.push(fpickr);
    }
  }
  /**
   * Input builder
   * @param {Options} opt Options
   * @param {String} opt.key_placeholder translation key for the placeholder
   */
  async _build_input(opt) {
    const s = this;
    const id = Math.random().toString(32);
    opt = Object.assign({}, {key_placeholder: null}, opt);
    s._elInput = el('input', {
      class: 'search--input',
      id: id,
      type: 'text',
      dataset: {
        lang_key: opt.key_placeholder,
        lang_type: 'placeholder'
      },
      placeholder: await getDictItem(opt.key_placeholder),
      on: {
        input: async () => {
          await s.update();
        }
      }
    });
    s._elInputContainer = el(
      'div',
      {
        class: 'search--input-container'
      },
      s._elInput,
      elButtonIcon('search_clear_query', {
        icon: 'fa-times',
        mode: 'icon',
        classes: [],
        dataset: {action: 'search_clear'}
      }),
      elButtonIcon('search_filters', {
        icon: 'fa-filter',
        mode: 'icon',
        classes: [],
        dataset: {action: 'toggle_filters'},
        content: s._elFilterFlag = el('span', {
          class: ['search--flag']
        })
      })
    );
    return s._elInputContainer;
  }
  getFacetsArray() {
    const s = this;
    const out = [];
    if (!s._facets) {
      return out;
    }
    for (let n in s._facets) {
      out.push(s._facets[n]);
    }
    // slower ? return Object.values(s._facets);
    return out;
  }
  clear() {
    const s = this;
    if (!s._built) {
      return;
    }
    s._elInput.value = '';
    const facets = s.getFacetsArray();
    for (let facet of facets) {
      if (facet.checked) {
        facet.checked = false;
      }
    }
    const dates = s._flatpickr_filters;
    for (let date of dates) {
      date.clear();
    }
  }
  async reset() {
    const s = this;
    if (!s._built) {
      return;
    }
    s._elInput.value = '';
    const facets = s.getFacetsArray();
    for (let facet of facets) {
      facet.destroy();
    }
    delete s._facets;
    const dates = s._flatpickr_filters;
    for (let date of dates) {
      date.clear();
    }
    await s.update();
  }
  async _handle_click(e) {
    const s = this;
    const ds = e.target?.dataset || {};
    const action = ds.action;
    try {
      switch (action) {
        case 'search_year_set_min':
          {
            const values = s._year_slider.get();
            values[0] = ds.year;
            s._year_slider.set(values);
          }
          break;
        case 'search_year_set_max':
          {
            const values = s._year_slider.get();
            values[1] = ds.year;
            s._year_slider.set(values);
          }
          break;
        case 'toggle_filters':
          {
            s._elFilters.classList.toggle('search--hidden');
            s.vFeedback(e);
          }
          break;
        case 'update_facet_filter':
          await s.update();
          setTimeout(() => {
            e.target.scrollIntoView({block: 'center', inline: 'nearest'});
          }, 200);
          break;
        case 'search_clear':
          {
            s._elInput.value = '';
            s.vFeedback(e);
            s.clear();
          }
          break;
        case 'search_set_page':
          {
            s.vFeedback(e);
            await s.update(ds.page);
          }
          break;
        case 'search_keyword_toggle':
          {
            const keyword = ds.keyword;
            const type = ds.type;
            const facet = s._facets[`${type}:${keyword}`];
            if (facet) {
              facet.checked = !facet.checked;
              await s.update();
            }
          }
          break;
        case 'search_view_link':
          {
            s.vFeedback(e);
            const idView = ds.id_view;
            const urlStatic = new URL(window.location);
            urlStatic.search = '';
            urlStatic.pathname = s.opt('link_pathname');
            urlStatic.searchParams.append('views', idView);
            urlStatic.searchParams.append('zoomToViews', true);
            window.open(urlStatic, '_newtab');
          }
          break;
        case 'search_view_toggle':
          {
            s.vFeedback(e);
            const idView = ds.id_view;
            let view = getView(idView);
            const isValid = isView(view);
            const viewIsOpen = getViewsOpen().includes(idView);
            if (!isValid) {
              view = await getViewRemote(idView);
              if (isView(view)) {
                view._drop_shared = true;
                await viewsListAddSingle(view, {open: false});
              }
            }
            if (!isView(view)) {
              return;
            }
            if (viewIsOpen) {
              await viewRemove(view);
            } else {
              await viewAdd(view);
              /**
               * All views exept story : zoom
               */

              if (!isStory(view)) {
                await zoomToViewId(idView);
                return;
              }
              /**
               * Story handling
               */
              const confirmed = await modalConfirm({
                title: elSpanTranslate('search_story_auto_play_confirm_title'),
                content: elSpanTranslate('search_story_auto_play_confirm')
              });
              if (!confirmed) {
                return;
              }
              storyRead({
                view: view
              });
            }
          }
          break;
        case 'search_show_view_meta':
          {
            const idView = ds.id_view;
            viewToMetaModal(idView);
            s.vFeedback(e);
          }
          break;
        default:
          null;
      }
    } catch (e) {
      console.warn('Search action handler failed ', e);
    }
  }
  vFeedback(event) {
    new ButtonCircle({
      x: event.clientX,
      y: event.clientY
    });
  }
  _build_result_list(hits) {
    const s = this;
    const frag = new DocumentFragment();
    const confKeywords = s.opt('keywords');
    const sliderYears = s._year_slider.get().map(v=>parseInt(v*1));
    for (let v of hits) {
      /**
       * Add keywords buttons
       */
      const elKeywords = el('div', {class: ['search--button-group']});
      for (let k of confKeywords) {
        let keywords = v[k.type];
        if (keywords) {
          if (!isArray(keywords)) {
            keywords = [keywords];
          }
          for (let keyword of keywords) {
            if (isStringRange(keyword, 2)) {
              const facetEnabled = s.hasFilterFacet(k.type, keyword);
              const clEnabled = facetEnabled ? 'enabled' : 'disabled';
              const elKeyword = el(
                'div',
                {
                  class: [
                    'search--button-keyword',
                    `search--button-keyword-${clEnabled}`
                  ],
                  dataset: {
                    action: 'search_keyword_toggle',
                    keyword: keyword,
                    type: k.type
                  }
                },
                [
                  el('i', {
                    class: ['fa', k.icon]
                  }),
                  elSpanTranslate(keyword)
                ]
              );
              elKeywords.appendChild(elKeyword);
            }
          }
        }
      }
      /**
       * Add years keyword
       */
      const emphaseYearStart = sliderYears.includes(v.range_start_at_year);
      const emphaseYearEnd = sliderYears.includes(v.range_end_at_year);
      const elYears = el('div', {class: ['search--button-group']}, [
        el(
          'div',
          {
            class: [
              'search--button-keyword',
              emphaseYearStart ? `search--button-keyword-enabled` : null
            ],
            dataset: {
              action: 'search_year_set_min',
              year: v.range_start_at_year
            }
          },
          [
            el('i', {
              class: ['fa', 'fa-hourglass-start']
            }),
            el('span', `${v.range_start_at_year}`)
          ]
        ),
        el(
          'div',
          {
            class: [
              'search--button-keyword',
              emphaseYearEnd ? `search--button-keyword-enabled` : null
            ],
            dataset: {
              action: 'search_year_set_max',
              year: v.range_end_at_year
            }
          },
          [
            el('i', {
              class: ['fa', 'fa-hourglass-end']
            }),
            el('span', `${v.range_end_at_year}`)
          ]
        )
      ]);
      /**
       * Add actions
       */
      const elButtonsBar = el(
        'div',
        {class: ['search--button-group', 'search--button-group-right']},
        [
          el(
            'div',
            {
              class: ['search--button-keyword'],
              dataset: {action: 'search_view_link', id_view: v.view_id}
            },
            [
              el('i', {
                class: ['fa', 'fa-external-link']
              }),
              elSpanTranslate('search_view_link')
            ]
          ),
          el(
            'div',
            {
              class: ['search--button-keyword'],
              dataset: {action: 'search_show_view_meta', id_view: v.view_id}
            },
            [
              el('i', {
                class: ['fa', 'fa-info-circle']
              }),
              elSpanTranslate('search_show_view_meta')
            ]
          ),
          el(
            'div',
            {
              class: ['search--button-keyword'],
              dataset: {action: 'search_view_toggle', id_view: v.view_id}
            },
            [
              el('i', {
                class: ['fa', 'fa-toggle-off']
              }),
              elSpanTranslate('search_view_toggle')
            ]
          )
        ]
      );
      frag.appendChild(
        el(
          'div',
          {class: ['search--results-item']},
          el(
            'div',
            {class: 'search--item-title'},
            el('span', s.formatCroppedText(v._formatted.view_title))
          ),
          el(
            'p',
            {
              class: ['search--item-info']
            },
            [
              {key: 'view_abstract', id: 'view_id', type: 'view'},
              {key: 'source_title', id: 'source_id', type: 'source'},
              {key: 'source_abstract', id: null, type: null},
              {key: 'project_title', id: 'project_id', type: 'project'}
            ].map((row) => {
              return el(
                'span',
                {
                  class: ['search--item-info-snipet', 'hint--top'],
                  dataset: {
                    lang_key: `search_${row.key}`,
                    lang_type: 'tooltip'
                  }
                },
                s.formatCroppedText(v._formatted[row.key])
              );
            })
          ),
          elButtonsBar,
          elKeywords,
          elYears
        )
      );
    }
    return frag;
  }
  destroy() {
    const s = this;
    s._elSearch.remove();
    s.ac.destroy();
  }
  /**
   * Split text on n words using details element.
   * @param {String} str string
   * @param {Integer} max Number of words to use
   * @return {String} If max number of word reached,string with <details>+<summary>
   */

  cutext(str, max) {
    max = max || 50;
    // NOTE: Can split html div. but description should not contain html.
    const wrds = (str || '').split(/\b/);
    const strShow = wrds.filter((w, i) => i <= max).join('');
    const strHide = wrds.filter((w, i) => i > max).join('');
    if (strHide.length === 0) {
      return el('span', str);
    }
    const elSummary = el('summary', strShow);
    const elHide = el('span', strHide);
    return el(
      'details',
      {
        class: ['search--cutext']
      },
      elSummary,
      elHide
    );
  }
  /**
   * Format cropped text: add ellipsis when needed
   * @param {String} str Croped tring to format
   * @return {String} str String formated like '...on mercury analysis' or 'A mercury analysis...' ;
   */

  formatCroppedText(str) {
    if (!isStringRange(str, 1)) {
      return '';
    }
    if (str[0] !== str[0].toUpperCase()) {
      str = `…${str}`;
    }
    if (['.', '!', '?'].indexOf(str[str.length - 1]) === -1) {
      str = `${str}…`;
    }
    return str;
  }
  getFilters(op) {
    op = op || 'AND';
    const s = this;
    const filters = [];
    const inputFilters = s._filters;
    for (const id in inputFilters) {
      const filter = inputFilters[id];
      if (filter) {
        filters.push(filter);
      }
    }
    return filters.join(` ${op} `);
  }
  setFilter(id, value) {
    const s = this;
    s._filters[id] = value;
  }
  getFiltersFacets(op) {
    const s = this;
    op = op || 'AND';
    const inner = [];
    const outer = [];
    if (!s._facets) {
      return;
    }
    const keys = Object.keys(s._facets);
    for (let key of keys) {
      const facet = s._facets[key];
      if (facet.checked) {
        if (op === 'AND') {
          inner.push(key);
        } else {
          outer.push(key);
        }
      }
    }
    if (outer.length) {
      inner.push(outer);
    }
    if (inner.length) {
      return inner;
    }
    return;
  }
  /**
   * Check if keyword/tag has enabled facet
   * @param {String} attr Attribute (eg. keyword type)
   * @param {String} tag Keyword/tag
   * @return {Boolean}
   */
  hasFilterFacet(attr, tag) {
    const s = this;
    let out = false;
    const id = `${attr}:${tag}`;
    const facets = s.getFacetsArray();
    for (let f of facets) {
      if (!out) {
        out = f.checked && f.id === id;
      }
    }
    return out;
  }
  setFlag(opt) {
    if (opt.enable) {
      opt.target.classList.add('active');
    } else {
      opt.target.classList.remove('active');
    }
  }
  /**
   * Update the results, and set the page
   * @param {Integer} page Page number - saved in pagination.
   */
  async update(page) {
    const s = this;
    await s.initCheck();
    s._timer_debounce = performance.now();
    try {
      const timer = s._timer_debounce;
      const attr = s.opt('attributes');
      const attrKeys = s.opt('keywords').map((k) => k.type);
      const strFilters = s.getFilters();
      const facetFilters = s.getFiltersFacets();

      s.setFlag({
        target: s._elFilterFlag,
        enable: !!facetFilters && !!facetFilters.length
      });
      /**
       * Prevent extrem quick chamges
       * -> Do not render further.
       */
      if (s._timer_debounce !== timer) {
        return;
      }
      const results = await s.search({
        q: s._elInput.value,
        offset: page * 20,
        limit: 20,
        filters: strFilters || null,
        facetFilters: facetFilters || null,
        attributesToRetrieve: attr.retrieve,
        attributesToHighlight: attr.text,
        attributesToCrop: attr.text,
        facetsDistribution: attrKeys,
        matches: false
      });
      /**
       * Search is not cancellable, but if the timer
       * has changed, another request is on its way.
       * -> Do not render further.
       */
      if (s._timer_debounce !== timer) {
        return;
      }
      s._results = results;
      await s._update_stats(results);
      const fragItems = s._build_result_list(results.hits);
      s._elResults.replaceChildren(fragItems);
      s._update_toggles_icons();
      const elPaginationItems = s._build_pagination_items(results);
      s._elPagination.replaceChildren(elPaginationItems);
      /**
       * ⚠️  fragile: if the list is not complete, subsequent search
       * will not display new facets.
       */

      if (!s._facets) {
        const fragFacet = s._build_facets(results.facetsDistribution);
        s._elFiltersFacets.replaceChildren(fragFacet);
      } else {
        s._update_facets(results.facetsDistribution);
      }
    } catch (e) {
      console.warn('Issue while searching', {error: e});
    }
  }
  /**
   * Update open/close tag
   */
  _update_toggles_icons() {
    const s = this;
    if (!s._elResults) {
      return;
    }
    const idViewsOpen = getViewsOpen();
    const elsToggle = s._elResults.querySelectorAll(
      '[data-action="search_view_toggle"]'
    );
    for (let elT of elsToggle) {
      const idView = elT.dataset.id_view;
      const isOpen = idViewsOpen.includes(idView);
      const elIcon = elT.querySelector('i');
      if (isOpen) {
        elIcon.classList.replace('fa-toggle-off', 'fa-toggle-on');
      } else {
        elIcon.classList.replace('fa-toggle-on', 'fa-toggle-off');
      }
    }
  }
  /**
   * Search on current index, with default params.
   * @param {Object} opt Options for index.search
   * @return {Object} Search result
   */
  async search(opt) {
    const s = this;
    const search = Object.assign(
      {},
      {
        q: '',
        offset: 0,
        limit: 20,
        filters: null,
        facetFilters: null,
        facetsDistribution: null,
        attributesToRetrieve: ['*'],
        attributesToCrop: null,
        cropLength: 60,
        attributesToHighlight: null,
        matches: false
      },
      opt
    );
    return await s._index.search(search.q, search);
  }
  /**
   * Update stats
   */
  async _update_stats(results) {
    const s = this;
    const nPage = Math.ceil(results.nbHits / results.limit);
    const cPage = Math.ceil(
      nPage - (results.nbHits - results.offset) / results.limit
    );
    const strTime = `${results.processingTimeMs} ms`;
    const strNbHit = `${results.nbHits} `;
    const tmpl = await getDictItem('search_results_stats');
    const txt = s.template(tmpl, {strNbHit, strTime, cPage, nPage});
    s._elStatHits.setAttribute('stat', txt);
  }
  /**
   * Pagination builder
   */
  _build_pagination_items(results) {
    const elItems = el('div', {class: ['search--pagination-items']});
    const nPage = Math.ceil(results.nbHits / results.limit);
    const cPage =
      Math.ceil(nPage - (results.nbHits - results.offset) / results.limit) - 1;
    let type = '';
    let fillerPos = [];
    /*
     * Pagination layout
     */
    if (nPage <= 10) {
      /**
       * oooooooXoo
       */
      type = 'all';
    } else if (cPage < 4) {
      /**
       * ooXoo ooo
       */
      type = '5_3';
      fillerPos.push(6);
    } else if (cPage > nPage - 4) {
      /**
       * ooo oXooo
       */
      type = '3_5';
      fillerPos.push(4);
    } else {
      /**
       * ooo oXo ooo
       */
      type = '3_5_3';
      fillerPos.push(...[3, nPage - 4]);
    }
    /**
     * Populate pagination
     */
    for (let i = 0; i < nPage; i++) {
      let add = false;
      switch (type) {
        case 'all':
          add = true;
          break;
        case '3_5_3':
          if (
            i < 3 ||
            i === cPage - 2 ||
            i === cPage - 1 ||
            i === cPage ||
            i === cPage + 1 ||
            i === cPage + 2 ||
            i > nPage - 4
          ) {
            add = true;
          }
          break;
        case '5_3':
          if (i < 5 || i > nPage - 4) {
            add = true;
          }
          break;
        case '3_5':
          if (i < 3 || i > nPage - 6) {
            add = true;
          }
          break;
        default:
      }
      /**
       * Add filler if needed
       */
      if (fillerPos.includes(i)) {
        const elFiller = el('span', {
          class: ['search--pagination-item-filler']
        });
        elItems.appendChild(elFiller);
      }
      if (add) {
        /**
         * Build item
         */
        let elItem;
        const elItemContainer = el(
          'span',
          {
            class: ['search--pagination-item-container'],
            dataset: {
              action: 'search_set_page',
              page: i
            }
          },
          (elItem = el('span', {
            class: ['search--pagination-item'],
            dataset: {page: i + 1}
          }))
        );
        /**
         * The item is the current page
         */
        if (i === cPage) {
          elItem.classList.add('active');
          elItem.setAttribute('disabled', true);
        }
        /**
         * Add the item
         */

        elItems.appendChild(elItemContainer);
      }
    }
    return elItems;
  }
  /**
   * Simple template parser
   * @param {String} template string
   * @param {Object} data Object with key : value pair
   * @return {String} template with replaced values
   */

  template(str, data) {
    const s = this;
    if (!data) {
      data = s._opt;
    }
    return str.replace(/{{([^{}]+)}}/g, (matched, key) => {
      return data[key];
    });
  }
}
class Facet {
  constructor(opt) {
    const fc = this;
    fc._opt = Object.assign(
      {},
      {
        count: 0,
        label: null,
        id: null,
        group: null,
        checked: false,
        order: 0,
        enable: true
      },
      opt
    );
    fc.init();
  }
  init() {
    const fc = this;
    if (fc._init) {
      return;
    }
    fc.build();
    fc._init = true;
  }
  destroy() {
    const fc = this;
    fc._elTag.remove();
  }
  build() {
    const fc = this;
    fc._elCheckbox = el('input', {
      class: 'search--filter-facet-item-input',
      type: 'checkbox',
      dataset: {
        action: 'update_facet_filter'
      },
      id: Math.random().toString(32)
    });
    const elLabelContent = elSpanTranslate(fc._opt.label);
    fc._elLabel = el(
      'label',
      {class: 'search--filter-facet-item-label', for: fc._elCheckbox.id},
      elLabelContent
    );
    fc._elCount = el('span', {
      count: fc._opt.count,
      class: 'search--filter-facet-item-count'
    });
    fc._elTag = el(
      'div',
      {
        class: 'search--filter-facet-item',
        style: {
          order: 1000 - fc._opt.count
        }
      },
      [fc._elCheckbox, fc._elLabel, fc._elCount]
    );
  }
  get id() {
    return this._opt.id;
  }
  get el() {
    return this._elTag;
  }
  get checked() {
    return this._elCheckbox.checked === true;
  }
  set checked(enable) {
    this._elCheckbox.checked = enable;
  }
  get enable() {
    return this._opt.enable;
  }
  set enable(value) {
    const fc = this;
    if (!isBoolean(value)) {
      value = true;
    }
    if (value === fc.enable) {
      return;
    }
    fc._opt.enable = value;
    if (value) {
      fc._elTag.classList.remove('disabled');
    } else {
      fc._elTag.classList.add('disabled');
    }
  }
  get order() {
    return this._opt.order;
  }
  set order(pos) {
    const fc = this;
    if (pos === fc.order) {
      return;
    }
    fc._opt.order = pos;
    fc._elTag.style.order = pos;
  }
  get count() {
    return this._opt.count;
  }
  set count(c) {
    const fc = this;
    if (c === fc.count) {
      return;
    }
    fc._opt.count = c;
    fc._elCount.setAttribute('count', c);
    fc.enable = !!c;
    fc.order = 1000 - c;
  }
}
export {Search};
