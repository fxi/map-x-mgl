function n(n){return!n||(e(n)?C(n,{}):h(n)?C(n,[]):void 0)}function t(t){return!n(t)}function e(n){return!!n&&"object"==typeof n&&!Array.isArray(n)}function r(n){return e(n)&&X(n.type)&&!!n.type.match(/^(vt|rt|cc||sm||gj)$/)}function u(n,t,e){t=h(t)?t:[t];const u=!_(e)||e(n),i=t.reduce((t,e)=>t||n.type===e,!1);return r(n)&&i&&u}function i(n){return u(n,"vt")}function f(n){return u(n,"rt")}function c(n){return r(n)&&!0===n._edit}function o(n){return h(n)&&n.reduce((n,t)=>n?r(t):n,!0)}function a(n){return h(n)&&n.reduce((n,t)=>!1===n?n:m(t),!0)}function d(n,t){return h(n)&&n.every((n,e,r)=>!e||t?n<r[e+1]:n>=r[e-1])}function s(n){const t=new RegExp("MX-.{3}-.{3}-.{3}-.{3}-.{3}");return!!n&&!!n.match(t)}function g(n){return!!n.match(n)}function p(n){return h(n)&&n.every(g)}function m(n){const t=new RegExp("^MX-GJ-.{10}$|^MX-.{5}-.{5}-.{5}$");return!!n&&X(n)&&!!n.match(t)}function y(n){return e(n)&&s(n.id)}function l(n){return h(n)&&n.reduce((n,t)=>!1===n?n:y(t),!0)}function v(n){return n instanceof Promise}function A(n){return n instanceof HTMLCanvasElement}function z(n){return k(n)&&n.classList.contains("fa")}function h(n){return!!n&&"object"==typeof n&&Array.isArray(n)}function b(n){return h(n)&&n.reduce((n,t)=>!1===n?n:X(t),!0)}function j(n){return h(n)&&n.reduce((n,t)=>n?e(t):n,!0)}function O(n){return j(n)}function x(n){try{JSON.parse(n)}catch(n){return!1}return!0}function Z(n){return!$(n)&&(e(n)||h(n)||X(n)||E(n)||M(n))}function $(n){return void 0===n}function E(n){return!isNaN(parseFloat(n))&&isFinite(n)}function M(n){return!0===n||!1===n}function T(n){return e(n)&&n._canvas instanceof HTMLCanvasElement}function w(n,t,e){return t=t||0,e=e||Infinity,!(!n||"string"!=typeof n)&&(n=n.trim()).length>=t&&n.length<=e}let F=new RegExp(/^data:image\/(png|jpeg|svg);base64\,[a-zA-Z0-9\+\/\=]+$/);function R(n){try{return!(!w(n,22)||!F.test(n))&&w(n.split(",")[1],10)}catch(n){return!1}}function S(n,t){return{image:["image/apng","image/bmp","image/gif","image/jpeg","image/png","image/svg+xml","image/tiff","image/webp"]}[t].indexOf(n)>-1}function L(n){return X(n)&&/(<([^>]+)>)/i.test(n)}function N(n){return X(n)&&/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(n)}function X(n){return"string"==typeof n}function _(n){return n instanceof Function}function k(n){return n instanceof Element}function C(n,t){if(null==n||null==t)return n===t;if(n.constructor!==t.constructor)return!1;if(n instanceof Function)return n===t;if(n instanceof RegExp)return n===t;if(n===t||n.valueOf()===t.valueOf())return!0;if(Array.isArray(n)&&n.length!==t.length)return!1;if(n instanceof Date)return!1;if(!(n instanceof Object))return!1;if(!(t instanceof Object))return!1;var e=Object.keys(n);return Object.keys(t).every(function(n){return-1!==e.indexOf(n)})&&e.every(function(e){return C(n[e],t[e])})}function H(n){return X(n)&&/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(n)}function J(n){return X(n)&&(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(n)||/(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/.test(n))}export{h as isArray,O as isArrayOfObject,p as isArrayOfSourceId,b as isArrayOfString,o as isArrayOfViews,a as isArrayOfViewsId,R as isBase64img,M as isBoolean,A as isCanvas,J as isDateString,k as isElement,N as isEmail,n as isEmpty,C as isEqual,_ as isFunction,L as isHTML,z as isIconFont,x as isJson,T as isMap,t as isNotEmpty,E as isNumeric,e as isObject,y as isProject,s as isProjectId,l as isProjectsArray,v as isPromise,d as isSorted,g as isSourceId,X as isString,w as isStringRange,Z as isStringifiable,j as isTable,$ as isUndefined,H as isUrl,S as isValidType,r as isView,c as isViewEditable,m as isViewId,f as isViewRt,u as isViewType,i as isViewVt};
//# sourceMappingURL=mx_valid.mjs.map