import {settings} from './data/settings.js';
import {el} from '@fxi/el';
import {Item} from './components/item.js';
import {Group} from './components/group.js';
import {ContextMenu} from './components/contextMenu.js';
import {ListenerStore} from '../listener_store/index.js';

import './style/nested_list.css';

class NestedList {
  constructor(elRoot, opt) {
    const li = this;
    li.listenerStore = new ListenerStore();
    li.setOptions(opt);
    li.setStateOrig(opt.state);
    li.setId();
    li.elRoot = elRoot;
    li.history = [];
    li.meta = [];
    li.contextMenu = null;
    li.init();
    li._is_busy = false;
    li._is_groupless = false;
  }
  /**
   * Init/destroy
   */
  init() {
    let li = this;
    li.initCustomDictItem();
    li.initState();
    li.initHistory();
    li.startListening();
    li.opt.onChange();
  }
  initState() {
    this.setState({render: true});
  }
  initHistory() {
    this.setHistory();
  }
  startListening() {
    let li = this;
    /**
     * Add base listeners
     */
    li.listenerStore.addListener({
      target: li.elRoot,
      bind: li,
      listener: handleSortStart,
      group: 'base',
      type: 'dragstart'
    });
    li.listenerStore.addListener({
      target: li.elRoot,
      bind: li,
      listener: handleContextClick,
      group: 'base',
      type: ['dblclick', 'contextmenu']
    });
    li.listenerStore.addListener({
      target: li.elRoot,
      bind: li,
      listener: handleClick,
      group: 'base',
      type: 'click'
    });
  }
  stopListening() {
    this.listenerStore.removeListenerByGroup('base');
  }
  destroy() {
    let li = this;
    li.listenerStore.destroy();
    li.clearHistory();
    li.clearAllItems();
  }
  /**
   * Get/set options
   */
  getOptions() {
    return this.opt;
  }
  setOptions(opt) {
    let li = this;
    li.opt = Object.assign({}, settings, opt);
    for (let k in li.opt) {
      let item = li.opt[k];
      if (item instanceof Function) {
        li.opt[k] = item.bind(li);
      }
    }
  }
  setId(id) {
    if (id) {
      this.opt.id = id;
    }
    this.id = this.opt.id;
  }
  setLanguage(l) {
    this.opt.language = l;
    this.refreshState();
  }
  getLanguage() {
    return this.opt.language;
  }
  getLanguageDefault() {
    return this.opt.languageDefault;
  }
  getDict() {
    return this.opt.dict;
  }
  /**
   * Sorting and ordering
   */
  filterById(ids, enable) {
    let li = this;
    let elTargets = li.getChildrenTarget();
    let clHidden = li.opt.class.itemHidden;

    enable = enable === true;
    ids = li.isArray(ids) ? ids : [ids];
    li.setModeGroupless(enable, false);

    elTargets.forEach((el) => {
      if (li.isItem(el)) {
        let id = el.id;
        if (!enable || ids.indexOf(id) > -1) {
          el.classList.remove(clHidden);
        } else {
          el.classList.add(clHidden);
        }
      }
    });
  }

  /**
   * Target management
   */
  getTarget(el) {
    let li = this;
    if (li.isTarget(el)) {
      return el;
    }
    while (el && el.parentNode && !li.isTarget(el)) {
      el = el.parentNode;
    }
    return el || li.elRoot;
  }
  getChildrenTarget(el, direct) {
    let li = this;
    el = el || li.elRoot;
    if (!li.isGroup(el)) {
      el = li.getGroup(el);
    }
    let pref = direct ? ':scope > ' : '';
    let els = el.querySelectorAll(
      `${pref}.${li.opt.class.draggable}, ${pref}.${li.opt.class.group}`
    );
    return els;
  }
  hasChildrenTarget(el, direct) {
    let els = this.getChildrenTarget(el, direct);
    return els.length > 0;
  }
  getFirstTarget(el, direct) {
    let els = this.getChildrenTarget(el, direct);
    return els[0];
  }
  getLastTarget(el, direct) {
    let els = this.getChildrenTarget(el, direct);
    return els[els.length - 1];
  }
  getNextTarget(el) {
    return el.nextElementSibling;
  }
  getPreviousTarget(el) {
    return el.previousElementSibling;
  }
  getItemContent(el) {
    let li = this;
    if (li.isItem(el)) {
      return el.querySelector('.' + li.opt.class.itemContent);
    }
  }
  getGroup(el) {
    let li = this;
    while (el && (el = el.parentNode) && !li.isGroup(el)) {
      el = el.parentNode;
    }
    return el || li.elRoot;
  }
  getGroupById(id) {
    let li = this;
    return li.elRoot.querySelector(`#${id}`);
  }
  getGroupId(el) {
    let li = this;
    let elGrp = li.getGroup(el);
    if (elGrp === li.elRoot) {
      return 'root';
    } else {
      return elGrp.id;
    }
  }
  getGroupTitleObject(el) {
    let li = this;
    let titleObject = {};
    if (li.isGroup(el)) {
      titleObject = JSON.parse(el.dataset.li_title || '{}');
      titleObject = li.validateGroupTitleObject(titleObject);
    }
    return titleObject;
  }
  getGroupTitle(el) {
    let li = this;
    if (li.isGroup(el)) {
      return el.querySelector('.' + li.opt.class.groupTitle).innerText;
    }
  }
  getGroupLabel(el) {
    let li = this;
    if (li.isGroup(el)) {
      return el.querySelector('.' + li.opt.class.groupLabel);
    }
  }
  getGroupColor(el) {
    let li = this;
    if (li.isGroup(el)) {
      return el.dataset.li_color || this.opt.colorDefault;
    }
  }
  moveTargetTop(el) {
    let li = this;
    let elGroup = li.getGroup(el);
    let elFirst = li.getFirstTarget(elGroup, true);
    if (li.isTarget(elFirst)) {
      elGroup.insertBefore(el, elFirst);
    }
  }
  moveTargetUp(el) {
    let li = this;
    let elPrevious = li.getPreviousTarget(el);
    if (li.isTarget(elPrevious)) {
      let elGroup = li.getGroup(el);
      elGroup.insertBefore(el, elPrevious);
    }
  }
  moveTargetDown(el) {
    let li = this;
    let elNext = li.getNextTarget(el);
    if (li.isTarget(elNext)) {
      let elGroup = li.getGroup(el);
      let elNextAfter = li.getNextTarget(elNext);
      if (elNextAfter) {
        elGroup.insertBefore(el, elNextAfter);
      } else {
        elGroup.appendChild(el);
      }
    }
  }
  moveTargetBottom(el) {
    let li = this;
    let elGroup = li.getGroup(el);
    if (li.isGroup(elGroup)) {
      elGroup.appendChild(el);
    }
  }
  groupCollapse(el, collapse, save) {
    let li = this;
    collapse = collapse === true;
    save = save === true;
    if (li.isGroup(el)) {
      if (collapse) {
        el.classList.add(li.opt.class.groupCollapsed);
      } else {
        el.classList.remove(li.opt.class.groupCollapsed);
      }
      if (save) {
        li.saveStateStorage();
      }
    }
  }
  groupToggle(el, save) {
    let li = this;
    save = save === true;
    if (li.isGroup(el)) {
      let isCollapsed = li.isGroupCollapsed(el);
      li.groupCollapse(el, !isCollapsed, save);
    }
  }
  isGroupCollapsed(el) {
    return el.classList.contains(this.opt.class.groupCollapsed);
  }
  isGroupVisible(el) {
    let li = this;
    let isVisible = !el.classList.contains(li.opt.class.groupInvisible);
    return isVisible;
  }
  setGroupVisibility(el, visible) {
    let li = this;
    visible = visible === true;
    if (li.isGroup(el)) {
      if (visible) {
        el.classList.remove(li.opt.class.groupInvisible);
      } else {
        el.classList.add(li.opt.class.groupInvisible);
      }
    }
  }

  setGroupLabel(el, label) {
    let li = this;
    let elGroup = li.isGroup(el) ? el : li.getGroup(el);
    if (!elGroup) {
      return;
    }
    let elGroupLabel = li.getGroupLabel(elGroup);
    if (li.isElement(label)) {
      li.removeContent(elGroupLabel);
      elGroupLabel.appendChild(label);
    } else {
      elGroupLabel.innerText = label || '';
    }
  }
  setModeGroupless(groupless, save) {
    let li = this;
    groupless = groupless === true;
    let skipSave = save === false;
    let el = li.elRoot;
    let els = li.getChildrenTarget(el);
    li.addUndoStep();
    els.forEach((el) => {
      if (li.isGroup(el)) {
        li.setGroupVisibility(el, !groupless);
      }
    });
    /*  if (!groupless) {*/
    //li.resetState();
    /*}*/
    if (!skipSave) {
      li.saveStateStorage();
    }
    li._is_groupless = groupless;
  }
  isModeGroupless() {
    return this._is_groupless;
  }
  setGroupTitle(el, title) {
    let li = this;
    let lang = li.getLanguage();
    let isGroup = li.isGroup(el);
    if (!isGroup) {
      return;
    }
    let elTitle = el.querySelector('.' + li.opt.class.groupTitle);
    let titleObject = li.getGroupTitleObject(el);
    let oldTitle = titleObject[lang];
    title = title || oldTitle || li.d('group_new_title');
    titleObject[lang] = title;
    elTitle.innerText = title;
    el.dataset.li_title = JSON.stringify(titleObject);
  }
  setGroupColor(el, color) {
    let li = this;
    let isGroup = li.isGroup(el);
    if (!isGroup) {
      return;
    }
    el.style.borderColor = color;
    el.dataset.li_color = color;
  }

  /**
   *
   */

  /**
   * State management
   */
  getState(opt) {
    const li = this;
    opt = opt || {};
    let out = [];
    let elDrags = li.getChildrenTarget(li.elRoot);
    elDrags.forEach((el) => {
      let isGroup = li.isGroup(el);
      let isItem = li.isItem(el);
      let s = {
        id: el.id,
        group: li.getGroupId(el),
        type: isGroup ? 'group' : 'item'
      };
      if (isGroup) {
        s.title = JSON.parse(el.dataset.li_title) || {en: el.id};
        s.color = el.dataset.li_color || li.opt.colorDefault;
        s.date = el.dataset.li_date || Date.now();
        s.collapsed = li.isGroupCollapsed(el);
        s.invisible = !li.isGroupVisible(el);
      }
      if (isItem) {
        let elContent = li.getItemContent(el);
        if (opt.keepItemContent) {
          s.content = elContent;
        }
      }
      out.push(s);
    });
    return out;
  }
  getStateHash(i) {
    let hash = i
      .map((s) =>
        [s.id, s.group, s.type, s.title ? JSON.stringify(s.title) : ''].join(
          ':'
        )
      )
      .join(':');
    return hash;
  }
  areStateDifferent(a, b) {
    return this.getStateHash(a) !== this.getStateHash(b);
  }
  getPreviousState() {
    let li = this;
    if (li.hasHistory()) {
      return li.history[li.history.length - 1];
    }
  }
  saveStateStorage() {
    let li = this;
    let state = li.getState();
    let history = li.getHistory();
    if (li.isModeGroupless()) {
      return;
    }
    li.opt.onChange(state);
    li.setStateStored(state);
    li.setHistoryStored(history);
  }
  setStateStored(state) {
    let li = this;
    let key = li.getStorageKey('state');
    if (state && window.localStorage) {
      li.log('save state');
      window.localStorage.setItem(key, JSON.stringify(state));
    }
  }

  /**
   * Metadata management
   */
  setItemMeta(key, value) {
    return {key, value};
  }

  /**
   * History management
   */
  setHistoryStored(history) {
    let li = this;
    let key = li.getStorageKey('history');
    let isValid = li.isArray(history) && history.length > 0;
    if (isValid && window.localStorage) {
      li.log('save history');
      let historyClone = li.cloneObject(history);
      historyClone.forEach((state) => {
        state.forEach((s) => {
          s.content = null;
          s.render = true;
        });
      });
      window.localStorage.setItem(key, JSON.stringify(historyClone));
    }
  }
  getStorageKey(type) {
    return this.id + '_' + this.opt.localStorageKeys[type || 'state'];
  }
  getHistory() {
    return this.history;
  }
  setHistory(history) {
    this.history = this.isArray(history) ? history : this.getHistoryStored();
  }
  getHistoryStored() {
    let li = this;
    let key = li.getStorageKey('history');
    let history = [];
    if (window.localStorage) {
      let historyStored = JSON.parse(window.localStorage.getItem(key));
      if (historyStored) {
        history = historyStored;
      }
    }
    return history;
  }
  getStateStored() {
    let li = this;
    let key = li.getStorageKey('state');
    if (window.localStorage) {
      return JSON.parse(window.localStorage.getItem(key));
    }
    return [];
  }
  addUndoStep() {
    let li = this;
    let hasDiff = true;
    let state = li.getState({keepItemContent: true});
    let lastState;
    if (li.hasHistory()) {
      lastState = li.getPreviousState();
      hasDiff = li.areStateDifferent(lastState, state);
    }
    if (hasDiff) {
      li.history.push(state);
    }
    if (li.history.length > li.opt.maxHistoryLength) {
      li.history.splice(0, 1);
    }
  }
  clearHistory() {
    this.history.length = 0;
  }
  clearMeta() {
    this.meta.length = 0;
  }
  hasHistory() {
    return this.history.length > 0;
  }
  undo() {
    let li = this;
    li.clearAllItems();
    let last = li.history.pop();
    li.setState({
      render: false,
      state: last,
      useStateStored: false,
      debug: true
    });
  }

  /**
   * Empty mode
   */
  setEmptyMode(empty) {
    let li = this;
    let id = 'liEmptyLabel';
    let elLabel = el('div', li.opt.emptyLabel);
    li.clearAllItems();
    if (empty) {
      li.addItem({
        id: id,
        type: 'item',
        el: elLabel
      });
    }
  }

  /**
   * State management
   */
  refreshState() {
    let li = this;
    let state = li.getState({keepItemContent: true});
    li.setState({render: false, state: state, useStateStored: false});
  }
  resetState() {
    let li = this;
    let state = li.getStateOrig();
    li.addUndoStep();
    li.clearAllItems();
    li.setState({render: true, state: state, useStateStored: false});
    li.saveStateStorage();
  }
  setState(opt) {
    let li = this;
    li.clearAllItems();
    opt = opt || {};
    opt = Object.assign({}, li.opt, opt);
    let state = opt.state || li.getStateOrig();
    if (opt.useStateStored) {
      state = li.getStateStored();
      let isValid = li.isArray(state) && state.length > 0;
      if (isValid && opt.autoMergeState) {
        let stateOrig = li.getStateOrig();
        let allStoredIds = state.map((i) => i.id);
        let allOrigIds = stateOrig.map((i) => i.id);
        stateOrig.forEach((s) => {
          if (allStoredIds.indexOf(s.id) === -1) {
            state.push(s);
          }
        });
        state = state.filter((s) => {
          return s.type === 'group' || allOrigIds.indexOf(s.id) > -1;
        });
      }
    }
    state = state || li.getStateOrig();
    /*
     * If the state is empty,
     * add empty label
     */
    let emptyState = state.length === 0;
    if (emptyState) {
      /*
       * Render empty label
       */
      li.setEmptyMode(state.length > 1);
    } else {
      /*
       * Render state item
       */
      state.forEach((s) => {
        if (s.type === 'group') {
          li.addGroup(s);
        } else {
          s.render = opt.render;
          li.addItem(s);
        }
      });
    }
  }
  getStateOrig() {
    return this._state_orig || [];
  }
  setStateOrig(state) {
    this._state_orig = this.cloneObject(state || []);
  }
  clearAllItems() {
    let li = this;
    let els = li.getChildrenTarget(li.elRoot);
    els.forEach((el) => {
      li.removeElement(el);
    });
  }
  addItem(attr) {
    let li = this;
    attr.render = attr.render || !attr.content || false;
    let isGroup = li.isGroup(attr.group);
    var elGroupParent = isGroup
      ? attr.group
      : li.getGroupById(attr.group) || li.elRoot;
    let item = new Item(attr, li);
    let elItem = item.el;
    let elContent = item.elContent;
    elGroupParent.appendChild(elItem);
    if (attr.render) {
      li.opt.onRenderItemContent(elContent, attr);
    }
    if (attr.moveTop) {
      li.moveTargetTop(elItem);
    }
    li.makeIgnoredClassesDraggable(elItem);
    return elItem;
  }

  addGroup(attr) {
    let li = this;
    let isGroup = li.isGroup(attr.group);
    let hasContent = li.isTarget(attr.content);
    let targetAfter = null;
    if (hasContent) {
      targetAfter = li.getNextTarget(attr.content);
    }
    var elGroupParent = isGroup
      ? attr.group
      : li.getGroupById(attr.group) || li.elRoot;
    let group = new Group(attr, li);
    let elGroup = group.el;
    if (targetAfter) {
      targetAfter.parentElement.insertBefore(elGroup, targetAfter);
    } else {
      elGroupParent.appendChild(elGroup);
    }
    return elGroup;
  }

  removeItemById(id) {
    let li = this;
    let elItem = li.elRoot.querySelector('#' + id);
    li.removeElement(elItem);
  }

  removeGroupById(id) {
    let li = this;
    let elGroup = li.elRoot.querySelector('#' + id);
    li.removeGroup(elGroup);
  }
  removeGroup(elGroup) {
    let li = this;
    let isValid = li.isGroup(elGroup) && elGroup !== li.elRoot;
    if (isValid) {
      let elParent = li.getGroup(elGroup);
      let els = li.getChildrenTarget(elGroup, true);
      els.forEach((el) => {
        elParent.appendChild(el);
      });
      li.removeElement(elGroup);
    }
  }
  /**
   * Helpers
   */
  setUiDraggingStart() {
    let li = this;
    setTimeout(() => {
      document.body.classList.add(li.opt.class.globalDragging);
    }, 100);
  }
  setUiDraggingEnd() {
    let li = this;
    setTimeout(() => {
      document.body.classList.remove(li.opt.class.globalDragging);
    }, 10);
  }
  setBusy(busy) {
    this._is_busy = busy === true;
  }
  isBusy() {
    return this._is_busy === true;
  }
  cloneObject(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
  el(...opt) {
    return el(...opt);
  }
  log(...msg) {
    if (this.opt.mode.indexOf('debug') > -1) {
      console.log(...msg);
    }
  }
  removeElement(el) {
    if (el.remove) {
      el.remove();
    } else if (el.parentElement) {
      el.parentElement.removeChild(el);
    }
  }
  removeContent(el) {
    while (el.firstElementChild) {
      el.removeChild(el.firstElementChild);
    }
  }
  d(id) {
    // translate based on id
    let li = this;
    let lang = li.getLanguage();
    let langDef = li.getLanguageDefault();
    let dict = li.getDict();
    let item = dict.find((t) => t.id === id) || {};
    let txt = item[lang] || item[langDef];
    let cap = item.capitalize === true;
    if (txt) {
      txt = li.parseTemplate(txt, dict);
      if (cap) {
        txt = li.capitalizeFirst(txt);
      }
      return txt;
    }

    return id;
  }
  updateDictItems(items) {
    let li = this;
    let dict = li.getDict();
    items = li.isArray(items) ? items : [items];
    let keys = items.map((i) => i.id);
    dict.forEach((d, i) => {
      let pos = keys.indexOf(d.id);
      if (pos > -1) {
        dict[i] = items[pos];
      }
    });
  }
  initCustomDictItem() {
    let items = this.opt.customDictItems;
    if (items) {
      this.updateDictItems(items);
    }
  }

  parseTemplate(template, dict) {
    let li = this;
    let lang = li.getLanguage();
    return template.replace(/{{([^{}]+)}}/g, (m, k) => {
      let item = dict.filter((d) => d.id === k)[0];
      if (li.isObject(item)) {
        return item[lang] || key;
      }
      return key;
    });
  }
  capitalizeFirst(txt) {
    return txt.replace(/^\w/, (m) => m.toUpperCase());
  }

  asBoolean(item) {
    return typeof item !== 'undefined' && (item === 'true' || item === true);
  }
  isElement(el) {
    return el && el instanceof Element;
  }
  isHTMLCollection(el) {
    return el && el instanceof HTMLCollection;
  }
  isFunction(item) {
    return item && item instanceof Function;
  }
  randomId() {
    let li = this;
    return (
      li.opt.prefix +
      '_' +
      Math.random()
        .toString(32)
        .substr(2, 9)
    );
  }
  isArray(item) {
    return !!item && Array.isArray(item);
  }
  isObject(item) {
    return !!item && typeof item === 'object' && !Array.isArray(item);
  }
  isDraggable(el) {
    return (
      this.isElement(el) && el.classList.contains(this.opt.class.draggable)
    );
  }
  isItem(el) {
    return this.isElement(el) && el.classList.contains(this.opt.class.item);
  }
  isRoot(el) {
    return el === this.elRoot;
  }
  isGroup(el) {
    return (
      this.isElement(el) &&
      (el.classList.contains(this.opt.class.group) || this.isRoot(el))
    );
  }
  isTarget(el) {
    return this.isDraggable(el) || this.isGroup(el);
  }
  isChildOf(elTest, elOther) {
    return elOther.contains(elTest);
  }
  isParentOf(elTest, elOther) {
    return elTest.contains(elOther);
  }
  isSiblingOf(elTest, elOther) {
    return (
      elTest.nextElementSibling === elOther ||
      elTest.previousElementSibling === elOther
    );
  }
  getDistanceFromTo(elTest, elOther) {
    let li = this;
    if (!li.isElement(elTest) || !li.isElement(elOther)) {
      return {
        dY: Infinity,
        dX: Infinity
      };
    }
    let rA = elTest.getBoundingClientRect();
    let rB = elOther.getBoundingClientRect();
    return {
      dY: Math.abs(rA.top + rA.height / 2 - (rB.top + rB.height / 2)),
      dX: Math.abs(rA.left + rA.width / 2 - (rB.left + rB.width / 2))
    };
  }
  isSameElement(elTarget, elDrop) {
    return elTarget === elDrop;
  }
  validateColor(color) {
    return /^#[0-9A-F]{6}$/i.test(color) ? color : this.opt.colorDefault;
  }
  validateGroupTitleObject(title) {
    let li = this;
    title = li.isObject(title) ? title : {};
    let lang = li.getLanguage();
    let langDefault = li.getLanguageDefault();
    let hasTitle = title[lang];
    let hasTitleDefault = title[langDefault];
    if (!hasTitleDefault) {
      if (!hasTitle) {
        title[langDefault] = li.d('group_new_title');
      } else {
        title[langDefault] = title[lang];
      }
    }
    return title;
  }
  /**
   * The only way found to avoid non-draggable children
   * to be dragged is to set the draggable attribute to true
   * and when the dragstart begin, prevent default and return
   * see https://jsfiddle.net/fxi/tyw0zn7h/;
   */
  makeIgnoredClassesDraggable(el) {
    let li = this;
    let cl = '.' + li.opt.customClassDragIgnore.join(',.');
    el.querySelectorAll(cl).forEach((el) => {
      el.setAttribute('draggable', true);
    });
  }
  isIgnoredElement(el) {
    return this.opt.customClassDragIgnore.reduce((a, c) => {
      return a || el.classList.contains(c);
    }, false);
  }
}

export {NestedList};

/**
 * Start sort event listener
 */
function handleSortStart(evt) {
  let li = this;
  li.elDrag = evt.target;
  /**
   * prevent if event comes from ignored see comment
   * for makeIgnoredClassesDraggable
   **/
  if (li.isIgnoredElement(li.elDrag)) {
    evt.preventDefault();
    return;
  }

  li.opt.onSortStart(evt);
  li.setUiDraggingStart();

  li.elDrag.classList.add(li.opt.class.dragged);
  evt.dataTransfer.effectAllowed = 'move';
  // keep this version in history;
  li.addUndoStep();
  if (li.opt.setDragImage) {
    let elDragImage = li.opt.setDragImage(li.elDrag);
    let rectImage = elDragImage.getBoundingClientRect();
    let dragOffsetTop = evt.clientY - rectImage.top;
    let dragOffsetLeft = evt.clientX - rectImage.left;
    evt.dataTransfer.setDragImage(elDragImage, dragOffsetLeft, dragOffsetTop);
  }
  evt.dataTransfer.setData('Text', li.opt.setTextData(li.elDrag));
  li.elNext = li.elDrag.nextSibling;
  li.listenerStore.addListener({
    target: li.elRoot,
    bind: li,
    type: 'dragover',
    group: 'dragevent',
    listener: handleSortOver,
    debounce: true
  });
  li.listenerStore.addListener({
    target: li.elRoot,
    bind: li,
    type: 'dragenter',
    group: 'dragevent',
    listener: handleSortEnter
  });
  li.listenerStore.addListener({
    target: li.elRoot,
    bind: li,
    type: 'dragend',
    group: 'dragevent',
    listener: handleSortEnd
  });
}
/**
 * Enter event listener
 */
function handleSortEnter(evt) {
  let li = this;
  li.opt.onSortEnter(evt);
}
/**
 * Over event listener
 */
function handleSortOver(evt) {
  let li = this;
  li.log('over');
  li.opt.onSortOver(evt);
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'move';
  let elTarget = li.getTarget(evt.target);
  /**
   * Target evaluation
   */
  let areElements = li.isElement(elTarget) && li.isElement(li.elDrag);
  if (!areElements) {
    return;
  }
  let isNotTarget = !li.isTarget(elTarget);
  let isChildren = li.isChildOf(elTarget, li.elDrag);
  let isItself = li.isSameElement(elTarget, li.elDrag);
  if (isNotTarget || isItself || isChildren) {
    return;
  }
  evt.stopPropagation();
  evt.stopImmediatePropagation();
  let isGroup = li.isGroup(elTarget);
  let isGroupCollapsed = isGroup && li.isGroupCollapsed(elTarget);
  let elDrag = li.elDrag;
  let elGroup = null;
  let elInsert = null;
  let elFirst = null;
  let isValid = false;
  let groupHasItems = false;
  /**
   *   Curlir position above target
   *
   *   /---------\
   *   |         | <- insert before
   *   |---------|
   *   |         | <- insert after
   *   \---------/
   */
  let rDest = elTarget.getBoundingClientRect();
  let insertAfter = evt.clientY > rDest.top + rDest.height / 2;
  let atGroupEdgeBottom =
    isGroup && evt.clientY > rDest.bottom - rDest.height / 10;
  let atGroupEdgeTop = isGroup && evt.clientY < rDest.top + rDest.height / 10;
  try {
    /**
     * Insert in list : if empty or if insert after, appendChild,
     * else insert before first
     */
    if (!isGroup || isGroupCollapsed || atGroupEdgeTop || atGroupEdgeBottom) {
      elGroup = li.getGroup(elTarget);
      elInsert =
        insertAfter || atGroupEdgeBottom
          ? li.getNextTarget(elTarget)
          : elTarget;
      isValid =
        !li.isSameElement(elInsert, elDrag) &&
        !li.isSameElement(elInsert, elGroup);
      if (isValid) {
        //li.log('insert item ' + (insertAfter ? 'after' : 'before'));
        elGroup.insertBefore(elDrag, elInsert);
      }
      return;
    }
    /**
     * Insert in group : if empty or if insert after, appendChild,
     * else insert before first
     */
    if (isGroup) {
      elGroup = elTarget;
      groupHasItems = li.hasChildrenTarget(elGroup);
      if (!groupHasItems || insertAfter) {
        //li.log('insert group last');
        elGroup.appendChild(elDrag);
      } else {
        elFirst = li.getFirstTarget(elGroup);
        isValid =
          !li.isSameElement(elFirst, elDrag) &&
          !li.isSameElement(elFirst, elGroup);
        if (isValid) {
          //li.log('insert group first');
          elGroup.insertBefore(elDrag, elFirst);
        }
      }
      return;
    }
  } catch (e) {
    console.warn(e);
  }
}
/**
 * Sort end event listener
 */
function handleSortEnd(evt) {
  evt.preventDefault();
  let li = this;
  li.opt.onSortEnd(evt);
  li.elDrag.classList.remove(li.opt.class.dragged);
  li.listenerStore.removeListenerByGroup('dragevent');
  if (li.elNext !== li.elDrag.nextSibling) {
    li.opt.onSortDone(li.elDrag);
  }
  li.elDrag = null;
  li.setUiDraggingEnd();
  li.saveStateStorage();
}
/**
 * Click in context menu event listener
 */
function handleContextClick(evt) {
  evt.preventDefault();
  let li = this;
  if (li.contextMenu instanceof ContextMenu) {
    li.contextMenu.destroy();
  }
  li.contextMenu = new ContextMenu(evt, li);
}
/**
 * Click general listener
 */
function handleClick(evt) {
  let li = this;
  let elTarget = li.getTarget(evt.target);
  let idAction = elTarget.dataset.li_id_action;
  let idType = elTarget.dataset.li_event_type;
  let isValidEvent = idType === 'click' && idAction && li.isTarget(elTarget);
  if (isValidEvent) {
    if (isValidEvent && idAction === 'li_group_toggle') {
      li.groupToggle(elTarget, true);
    }
  }
}