import {el} from '@fxi/el';
import * as is from '@fxi/mx_valid';

const defaults = {
  title: 'test',
  container: document.body,
  groups: []
};
const defaultsTests = {
  tests: [],
  name: 'test',
  ignore: false,
  timeout: 10000
};
const defaultsTest = {
  test: () => {
    return false;
  },
  name: 'test',
  ignore: false,
  timeout: 10000
};
const queue = [];

/**
 * Testing process
 *
 * @example
 * const t = new Testing({
 *   container :  elResults,
 *   title : 'mapx sdk test'
 * })
 *
 *
 * t.check('get view list',{
 *    init : ()=>{
 *      return mapx.ask('get_views');
 *    },
 *   tests : [{
 *      name : 'is array',
 *      test : (r)=>Array.isArray(r)
 *   }]
 * })
 */

export class Testing {
  constructor(opt) {
    const t = this;
    t.h = is;
    t.opt = Object.assign({}, defaults, opt);
    t._results = [];
  }

  destroy() {
    const t = this;
    t._destroyed = true;
    t.opt.tests = [];
  }

  run(opt) {
    const t = this;
    opt = Object.assign({}, opt);
    if (is.isFunction(opt.finally)) {
      t._finally = opt.finally;
    }
    t._next();
  }

  async _next() {
    const t = this;
    const c = queue.shift();
    if (c) {
      await c();
      return t._next();
    } else {
      if (t._finally) {
        return t._finally();
      }
    }
  }

  stop(msg) {
    throw new Error(msg);
  }

  check(title, opt) {
    const t = this;
    opt = Object.assign({}, defaultsTests, opt);
    if (!t._is_in_opt_set('titles', title)) {
      return;
    }
    if (!t._is_in_opt_set('groups', opt.group)) {
      return;
    }

    const result = {
      title :  title,
      message : '',
      tests : []
    }
    t._results.push(result);

    queue.push(async () => {
      let pass = true; 
      const uiSection = t._ui_section(title);
      try {
        const initSuccess = t._promise(opt.init);
        const initTimeout = t._promise_timeout(opt.timeout);
        /**
         * Race between timeout and success
         */
        const data = await Promise.race([initSuccess, initTimeout]);

        if (data === 'timeout') {
          /**
           * Timeout returned before success
           */
          result.message = `timeout ( ${opt.timeout} ms)`;
          uiSection.icon.innerText = '⏱';
          uiSection.text.innerText = `: ${result.message} `;
          return;
        } else {
          /**
           * Launch each tests
           */
          const success = await nextTest(data);

          if (success === false) {
            t.stop(`Failed`);
          }
          return true;
        }
      } catch (e) {
        handleErrorSection(e);
      }

      function handleErrorSection(e) {
        uiSection.text.innerText = `: failed ( ${e} )`;
        uiSection.icon.innerText = '🐞';
      }

      async function nextTest(data) {

        const test = opt.tests.shift();
        if (!pass) {
          return false;
        }
        if (!test) {
          return null;
        }

        const it = Object.assign({}, defaultsTest, test);
        const uiResult = t._ui_result(it.name, uiSection);
        if (it.ignore) {
          return null;
        }
        const r = {
          success : false,
          message : '',
          name : it.name,
          timing :0
        };
        result.tests.push(r);
        const resSuccess = t._promise(it.test, data);
        const resTimeout = t._promise_timeout(it.timeout);
        /**
         * Race between timeout and success
         */ const start = performance.now();
        const resOut = await Promise.race([resSuccess, resTimeout]);
        r.success = resOut === true;
        r.timing = Math.round((performance.now() - start) * 1e4) / 1e4;
        /**
         * Timeout resolve first
         */ if (resOut === 'timeout') {
          r.success = pass;
          r.message = `timeout ( ${it.timeout} ms)` 
          uiResult.icon.innerText = '⏱';
          uiResult.text.innerText = `: ${r.message}`;
          pass = false;
        } else {
          /**
           * Test resolve first
           */

          uiResult.icon.innerText = r.success ? '✅' : '❌';
          r.message = r.success ? '' : JSON.stringify(resOut); 
          uiResult.text.innerText = r.message;
        }
        /**
         * Add timing info
         */ uiResult.timing.innerText = ` (timing :${r.timing} ms) `;

        if (!pass || !r.success) {
          handleErrorSection();
          return false;
        } else {
          return nextTest(data);
        }
      }
    });
  }
  _promise_timeout(ms) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('timeout');
      }, ms || 1000);
    });
  }
  _promise(cb, data) {
    cb = is.isFunction(cb) ? cb : () => {};
    return new Promise(async (resolve, reject) => {
      try {
        const res = await cb(data);
        if (res instanceof Promise) {
          const out = await res;
          resolve(out);
        } else {
          resolve(res);
        }
      } catch (e) {
        reject(e);
      }
    });
  }
  _ui_section(title) {
    const t = this;
    let elIcon, elTitle, elText, elList;
    const elSection = el(
      'div',
      {
        style: {
          padding: '10px'
        }
      },
      el(
        'b',
        (elIcon = el('span')),
        (elTitle = el('span', title)),
        (elText = el('span'))
      ),
      (elList = el('ul'))
    );
    t.opt.container.appendChild(elSection);
    return {
      icon: elIcon,
      title: elTitle,
      text: elText,
      list: elList
    };
  }
  _ui_result(name, section) {
    const t = this;
    let elIcon, elTitle, elText, elTiming;
    const elLi = el(
      'li',
      (elIcon = el('span')),
      (elTitle = el('span', name)),
      (elText = el('span')),
      (elTiming = el('span', {style: {color: '#ccc'}}))
    );
    section.list.appendChild(elLi);
    return {
      icon: elIcon,
      title: elTitle,
      text: elText,
      timing: elTiming
    };
  }
  _is_in_opt_set(set, value) {
    let out = false;
    if (this.opt[set] !== undefined && this.opt[set].length === 0) {
      out = true;
    } else if (value !== undefined) {
      out = this.opt[set].includes(value);
    }
    return out;
  }
}
