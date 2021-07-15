import {checkLanguage} from '../mx_helper_language.js';

import {el} from '@fxi/el';

class ViewBase {
  constructor(view, enable) {
    let vb = this;
    vb.view = view;
    view._vb = vb;
    vb.build(enable);
  }
  getEl() {
    return this.el;
  }
  isOpen() {
    return this.elInput.checked === true;
  }
  open() {
    if (!this.isOpen()) {
      this.elInput.checked = true;
    }
  }
  close() {
    if (this.isOpen()) {
      this.elInput.checked = false;
    }
  }
  destroy() {
    let elParent = this.el.parentElement;
    if (elParent) {
      elParent.removeChild(this.el);
    }
  }
  build(enable) {
    enable = !!enable;
    let vb = this;
    let view = vb.view;
    let lang = checkLanguage({obj: view, path: 'data.title'});

    let title = view.data.title ? view.data.title[lang] : 'Undefined';

    let elButton = el('div', {class: 'mx-view-tgl-btn'});

    let elTitle = el(
      'span',
      {class: ['mx-view-tgl-title', 'li-drag-handle']},
      title
    );

    let elBadges = el('div', {
      id: 'view_badges_' + view.id,
      class: 'mx-view-badges'
    });

    let elClasses = el(
      'span',
      {
        class: 'mx-view-item-classes'
      },
      view.data.classes,
      view.type
    );
    let elIndex = el('span', {
      class: 'mx-view-item-index'
    });
    let elToggleMore = el(
      'div',
      {
        class: 'mx-view-tgl-more-container'
      },
      el('div', {
        class: 'mx-view-tgl-more',
        dataset: {
          view_options_for: view.id
        }
      })
    );

    let elInput = el('input', {
      id: 'check_view_enable_' + view.id,
      class: 'mx-view-tgl-input',
      type: 'checkbox',
      dataset: {
        view_action_key: 'btn_toggle_view',
        view_action_target: view.id
      }
    });

    if (enable) {
      elInput.checked = true;
    }

    let elLabel = el(
      'label',
      {
        class: ['mx-view-tgl-content'],
        for: 'check_view_enable_' + view.id
      },
      elButton,
      elTitle,
      elBadges,
      elClasses,
      elIndex
    );

    let elView = el(
      'div',
      {
        dataset: {
          view_id: view.id,
          view_date_modified: view.date_modified,
          view_title: title
        },
        class: ['mx-view-item', 'mx-view-item-' + view.type, 'noselect']
      },
      elInput,
      elLabel,
      elToggleMore
    );
    vb.el = elView;
    vb.elInput = elInput;
    vb.elToggleMore = elToggleMore;
    vb.el._vb = this;
    view._el = elView;
  }
}

export {ViewBase};
