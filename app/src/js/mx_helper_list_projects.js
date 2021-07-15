import {cleanDiacritic} from './string_util/';

export function renderUserProjectsList(o) {
  var h = mx.helpers;
  var el = h.el;
  var elDest, elContainer, elProjects, elSearchInput, elsRows;
  var cnt = 0;
  var dat = o.projects;
  var idCol = o.idCol || dat.id ? 'id' : 'project';
  var nRow = dat[idCol].length;
  var titles = Object.keys(dat);
  var nCol = titles.length;
  var userIsGuest = h.path(mx, 'settings.user.guest') === true;

  /* render */

  render();

  /**
   * Helpers
   */

  function wait() {
    window.setTimeout(render, 1);
  }

  function render() {
    elDest = document.getElementById(o.idList);
    if (cnt++ < 5) {
      if (elDest) {
        build();
        addToDest();
      } else {
        console.log('El dest for project rendering is not here yet, wait');
        wait();
      }
    }
  }

  /**
   * Final step: add to destination el
   */

  function addToDest() {
    elDest.appendChild(elContainer);
  }

  /**
   * Main build function
   */
  function build() {
    elContainer = el(
      'div',
      {
        class: 'mx-list-projects-container'
      },
      (elSearchInput = el('input', {
        class: 'mx-list-projects-search'
      })),
      (elProjects = el(
        'div',
        {
          class: 'mx-list-projects'
        },
        (elsRows = [el('div')])
      ))
    );

    buildSearch();
    buildRows();
    listen();
  }

  /**
   * Clean remove listener
   */
  function detach() {
    mx.listeners.removeListenerByGroup('project_list');
  }

  /**
   * Enable listener
   */
  function listen() {
    detach();
    mx.listeners.addListener({
      target: elSearchInput,
      bind: elSearchInput,
      type: 'keyup',
      idGroup: 'project_list',
      callback: filterList,
      debounce: true,
      debounceTime: 100
    });
    mx.listeners.addListener({
      target: elProjects,
      bind: elProjects,
      type: ['click','keydown'],
      idGroup: 'project_list',
      callback: handleClick,
      debounce: true,
      debounceTime: 100
    });
  }

  /**
   * Handle click
   */
  function handleClick(e) {
    const el = e.target;
    const ds = el.dataset;
    if(e.type === 'keydown' && e.key !== 'Enter' ){
       return;
    }

    const actions = {
      request_membership: ()=>{
        if (ds.allow_join === 'true' && !userIsGuest) {
          h.requestProjectMembership(ds.request_membership);
        }
      },
      load_project: ()=>{
        h.setProject(ds.load_project, {
          onSuccess: detach
        });
      }
    };

    Object.keys(actions).forEach((a) => {
      if (ds[a]) {
        actions[a]();
      }
    });
  }

  /**
   * Update list
   */
  function filterList(e) {
    var elTarget = e.target;
    var elRow, textSearch, textRow;
    var i, iL;
    if (elTarget && elTarget.dataset.project_search) {
      textSearch = cleanString(elTarget.value);
      for (i = 0, iL = elsRows.length; i < iL; i++) {
        elRow = elsRows[i];
        if (elRow.dataset && elRow.dataset.text) {
          textRow = elRow.dataset.text;
          if (textRow.match(textSearch)) {
            elRow.style.display = 'block';
          } else {
            elRow.style.display = 'none';
          }
        }
      }
    }
  }

  /**
   * Build rows
   */
  function buildRows() {
    var i,
      iL,
      j,
      jL,
      row = {};
    for (i = 0, iL = nRow; i < iL; i++) {
      row = {};
      for (j = 0, jL = nCol; j < jL; j++) {
        row[titles[j]] = dat[titles[j]][i];
      }
      if (row.id !== mx.settings.project.id) {
        var elRow = buildRow(row);
        elsRows.push(elRow);
        elProjects.appendChild(elRow);
      }
    }

    //elsRows = elProjects.querySelectorAll('.mx-list-projects-row');
  }

  /**
   * Simple search tool
   */
  function buildSearch() {
    elSearchInput.dataset.project_search = true;
    h.getDictItem('project_search_values').then(function(txt) {
      elSearchInput.placeholder = txt;
    });
  }

  /**
   * clean strings
   */
  function cleanString(str) {
    return cleanDiacritic(str.toLowerCase());
  }

  function buildRow(row) {
    /*
     * Create content
     */
    let elRowBadges;
    let elRow = el(
      'div',
      {
        class: 'mx-list-projects-row',
        tabindex: 0,
        dataset: {
          text: cleanString(row.description + ' ' + row.title),
          load_project: row[idCol]
        }
      },
      el(
        'div',
        {
          class: 'mx-list-projects-top'
        },
        el(
          'h4',
          {
            class: 'mx-list-projects-title'
          },
          row.title
        ),
        (elRowBadges = el('div', {
          class: 'mx-list-project-opt'
        }))
      ),
      el(
        'div',
        {
          class: 'mx-list-projects-bottom'
        },
        el(
          'div',
          {
            class: 'mx-list-projects-left'
          },
          el(
            'div',
            {
              class: 'mx-list-projects-desc'
            },
            row.description
          )
        ),
        el('div', {
          class: 'mx-list-project-right'
        })
      )
    );

    makeBadges({
      dat: row,
      elTarget: elRowBadges
    });

    return elRow;
  }

  /**
   * helpers
   */

  function makeBadges(opt) {
    var dat = opt.dat;
    var elBadgeContainer = el('div');
    var roles = ['admin', 'publisher', 'member'];
    var roleSet =  false;
    opt.elTarget.appendChild(elBadgeContainer);
    roles.forEach((r) => {
      if (!roleSet && dat[r]) {
        roleSet = true;
        var elBadgeMember = el('span', {class: 'mx-badge-role'});
        elBadgeContainer.appendChild(elBadgeMember);
        h.getDictItem(r).then(function(t) {
          elBadgeMember.innerText = t;
        });
      }
    });
    /* Join Button if no role  */
    makeJoinButton({
      dat: dat,
      elTarget: opt.elTarget
    });
  }

  function makeJoinButton(opt) {
    var dat = opt.dat;
    var elBtn = el('a');
    if (!(dat.member || dat.admin || dat.publisher) && !userIsGuest) {
      elBtn.href = '#';
      elBtn.dataset.request_membership = dat[idCol];
      elBtn.dataset.allow_join = dat.allow_join;
      if (!dat.allow_join) {
        elBtn.classList.add('mx-not-allowed');
      }

      h.getDictItem('btn_join_project', mx.settings.language).then(function(
        it
      ) {
        elBtn.innerText = it;
      });
      opt.elTarget.appendChild(elBtn);
    }
  }
}
