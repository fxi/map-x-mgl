"undefined"===typeof window||window.ICON_FONT_STYLE?"undefined"!==typeof window&&window.ICON_FONT_STYLE&&window.ICON_FONT_STYLE.update&&window.ICON_FONT_STYLE.update({fontName:"mx-icons-font",styleContent:'@font-face {\n\tfont-family: "mx-icons-font";\n\tsrc:url("mx-icons-font.ttf?cd29722e76db91d15abf5c3b25b7139e") format("truetype"),\n\turl("mx-icons-font.eot?cd29722e76db91d15abf5c3b25b7139e#iefix") format("embedded-opentype"),\n\turl("mx-icons-font.woff?cd29722e76db91d15abf5c3b25b7139e") format("woff"),\n\turl("mx-icons-font.svg?cd29722e76db91d15abf5c3b25b7139e#mx-icons-font") format("svg");\n}'}):window.ICON_FONT_STYLE={fontName:"mx-icons-font",styleContent:'@font-face {\n\tfont-family: "mx-icons-font";\n\tsrc:url("mx-icons-font.ttf?cd29722e76db91d15abf5c3b25b7139e") format("truetype"),\n\turl("mx-icons-font.eot?cd29722e76db91d15abf5c3b25b7139e#iefix") format("embedded-opentype"),\n\turl("mx-icons-font.woff?cd29722e76db91d15abf5c3b25b7139e") format("woff"),\n\turl("mx-icons-font.svg?cd29722e76db91d15abf5c3b25b7139e#mx-icons-font") format("svg");\n}'},webpackJsonp([40,57],{171:function(e,t,n){function i(e){return(i="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}!function(){"use strict";JSONEditor.defaults.resolvers.unshift(function(e){if("string"===e.type&&"textarea"===e.format&&e.options&&"ace"===e.options.editor)return"ace"}),JSONEditor.defaults.editors.ace=JSONEditor.defaults.editors.string.extend({refreshValue:function(){this.value=this.value||"",this.serialized=this.value},setValue:function(e,t,n){if((!this.template||n)&&(null===e||"undefined"===typeof e?e="":"object"===i(e)?e=JSON.stringify(e):"string"!==typeof e&&(e=""+e),e!==this.serialized)){var o=this.sanitize(e);if(this.input.value!==o){this.value=o,this.ace_editor&&this.ace_editor.setValue(o);var a=n||this.getValue()!==e;this.refreshValue(),t?this.is_dirty=!1:"change"===this.jsoneditor.options.show_errors&&(this.is_dirty=!0),this.adjust_height&&this.adjust_height(this.input),this.onChange(a)}}},afterInputReady:function(){var e=this,t=this.options.language;e.options.hidden?e.theme.afterInputReady(e.input):n.e(53).then(n.bind(null,436)).then(function(e){return window.ace=e,Promise.all([function(e){var t;switch(e){case"html":t=n.e(45).then(n.bind(null,431));break;case"javascript":t=n.e(52).then(n.bind(null,434));break;default:t=n.e(55).then(n.bind(null,435))}return t}(t),n.e(54).then(n.bind(null,437)),n.e(44).then(n.bind(null,438))])}).then(function(n){e.ace_container=document.createElement("div"),e.ace_container.style.width="100%",e.ace_container.style.position="relative",e.input.parentNode.insertBefore(e.ace_container,e.input),e.input.style.display="none",e.ace_editor=window.ace.edit(e.ace_container),e.ace_editor.setValue(e.getValue()||""),e.ace_editor.getSession().setMode("ace/mode/"+t),e.ace_editor.getSession().selection.clearSelection(),e.ace_editor.setTheme("ace/theme/github"),e.ace_editor.setOptions({minLines:1,maxLines:1/0}),e.ace_editor.on("change",function(){var t=e.ace_editor.getValue()||"";e.value=t,e.refreshValue(),e.is_dirty=!0,e.onChange(!0)}),e.theme.afterInputReady(e.input);var i=document.createElement("div");if(!0===e.options.readOnly&&e.ace_editor.setReadOnly(!0),("javascript"==t||"json"==t)&&!0!==e.options.readOnly){var o=document.createElement("button");o.className="btn btn-info",o.innerHTML="tidy",o.addEventListener("click",function(){var t=n[2],i=e.ace_editor.getSession();new Promise(function(e,t){e(i.getValue()||"")}).then(function(e){return t(e)}).then(function(e){i.setValue(e)}).catch(function(e){mx.helpers.modal({id:"modalError",title:"Error",content:"<p>Error during tidy process :"+e})})}),i.appendChild(o)}if(e.options.htmlHelp){var a=mx.helpers.textToDom(e.options.htmlHelp),s=document.createElement("button");s.className="btn btn-info",s.innerHTML="help",s.addEventListener("click",function(){mx.helpers.modal({id:"modalHelp",title:"Map-x help",content:a})}),i.appendChild(s)}e.input.parentNode.insertBefore(i,e.ace_container)})},disable:function(){this.input.disabled=!0,this.ace_editor&&this.ace_editor.setReadOnly(!0),this._super()},enable:function(){this.always_disabled||(this.input.disabled=!1,this.ace_editor&&this.ace_editor.setReadOnly(!1)),this._super()},destroy:function(){this.ace_editor&&this.ace_editor.destroy()}})}()},29:function(e,t,n){var i="ICON-FONT-FILE-STYLE";function o(e){return(e||window.ICON_FONT_STYLE).styleContent||""}function a(e){var t=document.createElement("style"),n=document.getElementsByTagName("head")[0];t.innerHTML=o(e),t.id=i,t.type="text/css",n?n.appendChild(t):window.addEventListener("load",function(){n.appendChild(t)})}e.exports=function(){window.HAS_CREATE_FONT_STYLE||(a(),window.HAS_CREATE_FONT_STYLE=!0)}}});