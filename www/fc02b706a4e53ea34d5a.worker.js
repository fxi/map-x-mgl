!function(e){function t(r){if(n[r])return n[r].exports;var i=n[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=2)}([function(e,t){function n(){throw new Error("setTimeout has not been defined")}function r(){throw new Error("clearTimeout has not been defined")}function i(e){if(u===setTimeout)return setTimeout(e,0);if((u===n||!u)&&setTimeout)return u=setTimeout,setTimeout(e,0);try{return u(e,0)}catch(t){try{return u.call(null,e,0)}catch(t){return u.call(this,e,0)}}}function o(e){if(h===clearTimeout)return clearTimeout(e);if((h===r||!h)&&clearTimeout)return h=clearTimeout,clearTimeout(e);try{return h(e)}catch(t){try{return h.call(null,e)}catch(t){return h.call(this,e)}}}function s(){g&&p&&(g=!1,p.length?y=p.concat(y):m=-1,y.length&&a())}function a(){if(!g){var e=i(s);g=!0;for(var t=y.length;t;){for(p=y,y=[];++m<t;)p&&p[m].run();m=-1,t=y.length}p=null,g=!1,o(e)}}function l(e,t){this.fun=e,this.array=t}function c(){}var u,h,f=e.exports={};!function(){try{u="function"==typeof setTimeout?setTimeout:n}catch(e){u=n}try{h="function"==typeof clearTimeout?clearTimeout:r}catch(e){h=r}}();var p,y=[],g=!1,m=-1;f.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];y.push(new l(e,t)),1!==y.length||g||i(a)},l.prototype.run=function(){this.fun.apply(null,this.array)},f.title="browser",f.browser=!0,f.env={},f.argv=[],f.version="",f.versions={},f.on=c,f.addListener=c,f.once=c,f.off=c,f.removeListener=c,f.removeAllListeners=c,f.emit=c,f.prependListener=c,f.prependOnceListener=c,f.listeners=function(e){return[]},f.binding=function(e){throw new Error("process.binding is not supported")},f.cwd=function(){return"/"},f.chdir=function(e){throw new Error("process.chdir is not supported")},f.umask=function(){return 0}},function(e,t,n){"use strict";function r(e,t,n){if(null!==e){var i,o,s,a,l,c,u,h,f,p,y=0,g=0,m=e.type,d="FeatureCollection"===m,_="Feature"===m,b=d?e.features.length:1;for(i=0;i<b;i++)for(f=d?e.features[i].geometry:_?e.geometry:e,p=!!f&&"GeometryCollection"===f.type,u=p?f.geometries.length:1,o=0;o<u;o++){var v=0;if(null!==(c=p?f.geometries[o]:f)){h=c.coordinates;var w=c.type;switch(y=!n||"Polygon"!==w&&"MultiPolygon"!==w?0:1,w){case null:break;case"Point":t(h,g,i,v),g++,v++;break;case"LineString":case"MultiPoint":for(s=0;s<h.length;s++)t(h[s],g,i,v),g++,"MultiPoint"===w&&v++;"LineString"===w&&v++;break;case"Polygon":case"MultiLineString":for(s=0;s<h.length;s++){for(a=0;a<h[s].length-y;a++)t(h[s][a],g,i,v),g++;"MultiLineString"===w&&v++}"Polygon"===w&&v++;break;case"MultiPolygon":for(s=0;s<h.length;s++){for(a=0;a<h[s].length;a++)for(l=0;l<h[s][a].length-y;l++)t(h[s][a][l],g,i,v),g++;v++}break;case"GeometryCollection":for(s=0;s<c.geometries.length;s++)r(c.geometries[s],t,n);break;default:throw new Error("Unknown Geometry Type")}}}}}function i(e,t,n,i){var o=n;return r(e,function(e,r,i,s){o=0===r&&void 0===n?e:t(o,e,r,i,s)},i),o}function o(e,t){var n;switch(e.type){case"FeatureCollection":for(n=0;n<e.features.length;n++)t(e.features[n].properties,n);break;case"Feature":t(e.properties,0)}}function s(e,t,n){var r=n;return o(e,function(e,i){r=0===i&&void 0===n?e:t(r,e,i)}),r}function a(e,t){if("Feature"===e.type)t(e,0);else if("FeatureCollection"===e.type)for(var n=0;n<e.features.length;n++)t(e.features[n],n)}function l(e,t,n){var r=n;return a(e,function(e,i){r=0===i&&void 0===n?e:t(r,e,i)}),r}function c(e){var t=[];return r(e,function(e){t.push(e)}),t}function u(e,t){var n,r,i,o,s,a,l,c,u=0,h="FeatureCollection"===e.type,f="Feature"===e.type,p=h?e.features.length:1;for(n=0;n<p;n++){for(a=h?e.features[n].geometry:f?e.geometry:e,c=h?e.features[n].properties:f?e.properties:{},l=!!a&&"GeometryCollection"===a.type,s=l?a.geometries.length:1,i=0;i<s;i++)if(null!==(o=l?a.geometries[i]:a))switch(o.type){case"Point":case"LineString":case"MultiPoint":case"Polygon":case"MultiLineString":case"MultiPolygon":t(o,u,c);break;case"GeometryCollection":for(r=0;r<o.geometries.length;r++)t(o.geometries[r],u,c);break;default:throw new Error("Unknown Geometry Type")}else t(null,u,c);u++}}function h(e,t,n){var r=n;return u(e,function(e,i,o){r=0===i&&void 0===n?e:t(r,e,i,o)}),r}function f(e,t){u(e,function(e,n,r){var i=null===e?null:e.type;switch(i){case null:case"Point":case"LineString":case"Polygon":return void t(m(e,r),n,0)}var o;switch(i){case"MultiPoint":o="Point";break;case"MultiLineString":o="LineString";break;case"MultiPolygon":o="Polygon"}e.coordinates.forEach(function(e,i){t(m({type:o,coordinates:e},r),n,i)})})}function p(e,t,n){var r=n;return f(e,function(e,i,o){r=0===i&&0===o&&void 0===n?e:t(r,e,i,o)}),r}function y(e,t){f(e,function(e,n,r){var o=0;if(e.geometry){var s=e.geometry.type;"Point"!==s&&"MultiPoint"!==s&&i(e,function(i,s){var a=d([i,s],e.properties);return t(a,n,r,o),o++,s})}})}function g(e,t,n){var r=n,i=!1;return y(e,function(e,o,s,a){r=!1===i&&void 0===n?e:t(r,e,o,s,a),i=!0}),r}function m(e,t){if(void 0===e)throw new Error("No geometry passed");return{type:"Feature",properties:t||{},geometry:e}}function d(e,t){if(!e)throw new Error("No coordinates passed");if(e.length<2)throw new Error("Coordinates must be an array of two or more positions");return{type:"Feature",properties:t||{},geometry:{type:"LineString",coordinates:e}}}function _(e,t){if(!e)throw new Error("geojson is required");var n=e.geometry?e.geometry.type:e.type;if(!n)throw new Error("invalid geojson");if("FeatureCollection"===n)throw new Error("FeatureCollection is not supported");if("GeometryCollection"===n)throw new Error("GeometryCollection is not supported");var r=e.geometry?e.geometry.coordinates:e.coordinates;if(!r)throw new Error("geojson must contain coordinates");switch(n){case"LineString":return void t(r,0,0);case"Polygon":case"MultiLineString":for(var i=0,o=0;o<r.length;o++)"MultiLineString"===n&&(i=o),t(r[o],o,i);return;case"MultiPolygon":for(var s=0;s<r.length;s++)for(var a=0;a<r[s].length;a++)t(r[s][a],a,s);return;default:throw new Error(n+" geometry not supported")}}function b(e,t,n){var r=n;return _(e,function(e,i,o){r=0===i&&void 0===n?e:t(r,e,i,o)}),r}Object.defineProperty(t,"__esModule",{value:!0}),t.coordEach=r,t.coordReduce=i,t.propEach=o,t.propReduce=s,t.featureEach=a,t.featureReduce=l,t.coordAll=c,t.geomEach=u,t.geomReduce=h,t.flattenEach=f,t.flattenReduce=p,t.segmentEach=y,t.segmentReduce=g,t.feature=m,t.lineString=d,t.lineEach=_,t.lineReduce=b},function(e,t,n){"use strict";function r(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}var i=n(3),o=r(i),s=n(1),a=n(10),l=function(e){return e&&e.__esModule?e:{default:e}}(a),c=n(11),u=r(c),h=n(12),f=r(h),p={Point:"circle",MultiPoint:"line",LineString:"line",MultiLineString:"line",Polygon:"fill",MultiPolygon:"fill",GeometryCollection:"fill"};postMessage({progress:0,message:"start"}),onmessage=function(e){try{var t="",n=e.data,r=n.data,i=n.fileName,a=(n.fileType,0),c=function(){return new Date-a},h=function(){return" "+c()+" ms "};!function(){a=new Date}();var y=o.hint(r),g=y.filter(function(e){return"error"==e.level}),m=y.filter(function(e){return"message"==e.level});if(postMessage({progress:60,message:"Validation done in "+h()}),m.length>0&&(m.length+" warning message(s) found. Check the console for more info",postMessage({progress:75,message:m.length+" warnings found. Please check the console."}),m.forEach(function(e){console.log({file:i,warnings:JSON.stringify(e)})})),g.length>0)return t=g.length+" errors found. Please check the console.",postMessage({progress:100,message:t,errorMessage:t}),void g.forEach(function(e){console.log({file:i,errors:e})});var d=[];d=r.features?r.features.map(function(e){return e.geometry&&e.geometry.type?e.geometry.type:void 0}).filter(function(e,t,n){return n.indexOf(e)===t&&void 0!==e}):[r.geometry.type],postMessage({progress:90,message:"Geometry type found in "+h()}),(0,s.featureEach)(r,function(e,t){null===e.geometry&&(e.geometry={type:d[0],coordinates:[]})});var _,b={};b.tmp={},b.init=!1,(0,s.propEach)(r,function(e){if(!b.init){for(_ in e)b.tmp[_]=[];b.init=!0}for(_ in e)b.tmp[_]&&e[_]&&b.tmp[_].push(e[_])});for(_ in b.tmp)b[_]=u.getArrayStat({arr:b.tmp[_],stat:"distinct"});delete b.tmp,delete b.init;var v=(0,l.default)(r);if(Math.round(v[0])>180||Math.round(v[0])<-180||Math.round(v[1])>90||Math.round(v[1])<-90||Math.round(v[2])>180||Math.round(v[2])<-180||Math.round(v[3])>90||Math.round(v[3])<-90)return t=i+" : extent seems to be out of range: "+v,postMessage({progress:100,msssage:t,errorMessage:t}),void console.log({errors:t});postMessage({progress:80,message:"extent found in "+h()});if(d=r.features?r.features.map(function(e){return p[e.geometry.type]}).filter(function(e,t,n){return n.indexOf(e)===t}):[p[r.geometry.type]],postMessage({progress:90,message:"Geom type is "+d+". Found in "+h()}),d.length>1){var w="Multi geometry not yet implemented";return postMessage({progress:100,msssage:w,errorMessage:i+": "+w}),void console.log({errors:i+": "+w+".("+d+")"})}var k="MX-DROP-"+i,x=k+"-SRC",S=Math.random(),M=f.randomHsl(.3,S),P=f.randomHsl(.9,S),E=d[0],j={circle:{id:k,source:x,type:E,paint:{"circle-color":M,"circle-radius":10,"circle-stroke-width":1,"circle-stroke-color":P}},fill:{id:k,source:x,type:E,paint:{"fill-color":M,"fill-outline-color":P}},line:{id:k,source:x,type:E,paint:{"line-color":M,"line-width":10}}};postMessage({progress:99,message:"Worker job done in "+h(),id:k,extent:v,attributes:b,layer:j[E],geojson:r})}catch(e){console.log(e),postMessage({progress:100,errorMessage:"An error occured, check the console"})}}},function(e,t,n){function r(e,t){var n,r=[];if("object"==typeof e)n=e;else{if("string"!=typeof e)return[{message:"Expected string or object as input",line:0}];try{n=i.parse(e)}catch(e){var s=e.message.match(/line (\d+)/),a=parseInt(s[1],10);return[{line:a-1,message:e.message,error:e}]}}return r=r.concat(o.hint(n,t))}var i=n(4),o=n(8);e.exports.hint=r},function(e,t,n){(function(e,r){var i=function(){function e(){this.yy={}}var t=function(e,t,n,r){for(n=n||{},r=e.length;r--;n[e[r]]=t);return n},n=[1,12],r=[1,13],i=[1,9],o=[1,10],s=[1,11],a=[1,14],l=[1,15],c=[14,18,22,24],u=[18,22],h=[22,24],f={trace:function(){},yy:{},symbols_:{error:2,JSONString:3,STRING:4,JSONNumber:5,NUMBER:6,JSONNullLiteral:7,NULL:8,JSONBooleanLiteral:9,TRUE:10,FALSE:11,JSONText:12,JSONValue:13,EOF:14,JSONObject:15,JSONArray:16,"{":17,"}":18,JSONMemberList:19,JSONMember:20,":":21,",":22,"[":23,"]":24,JSONElementList:25,$accept:0,$end:1},terminals_:{2:"error",4:"STRING",6:"NUMBER",8:"NULL",10:"TRUE",11:"FALSE",14:"EOF",17:"{",18:"}",21:":",22:",",23:"[",24:"]"},productions_:[0,[3,1],[5,1],[7,1],[9,1],[9,1],[12,2],[13,1],[13,1],[13,1],[13,1],[13,1],[13,1],[15,2],[15,3],[20,3],[19,1],[19,3],[16,2],[16,3],[25,1],[25,3]],performAction:function(e,t,n,r,i,o,s){var a=o.length-1;switch(i){case 1:this.$=e.replace(/\\(\\|")/g,"$1").replace(/\\n/g,"\n").replace(/\\r/g,"\r").replace(/\\t/g,"\t").replace(/\\v/g,"\v").replace(/\\f/g,"\f").replace(/\\b/g,"\b");break;case 2:this.$=Number(e);break;case 3:this.$=null;break;case 4:this.$=!0;break;case 5:this.$=!1;break;case 6:return this.$=o[a-1];case 13:this.$={},Object.defineProperty(this.$,"__line__",{value:this._$.first_line,enumerable:!1});break;case 14:case 19:this.$=o[a-1],Object.defineProperty(this.$,"__line__",{value:this._$.first_line,enumerable:!1});break;case 15:this.$=[o[a-2],o[a]];break;case 16:this.$={},this.$[o[a][0]]=o[a][1];break;case 17:this.$=o[a-2],void 0!==o[a-2][o[a][0]]&&(this.$.__duplicateProperties__||Object.defineProperty(this.$,"__duplicateProperties__",{value:[],enumerable:!1}),this.$.__duplicateProperties__.push(o[a][0])),o[a-2][o[a][0]]=o[a][1];break;case 18:this.$=[],Object.defineProperty(this.$,"__line__",{value:this._$.first_line,enumerable:!1});break;case 20:this.$=[o[a]];break;case 21:this.$=o[a-2],o[a-2].push(o[a])}},table:[{3:5,4:n,5:6,6:r,7:3,8:i,9:4,10:o,11:s,12:1,13:2,15:7,16:8,17:a,23:l},{1:[3]},{14:[1,16]},t(c,[2,7]),t(c,[2,8]),t(c,[2,9]),t(c,[2,10]),t(c,[2,11]),t(c,[2,12]),t(c,[2,3]),t(c,[2,4]),t(c,[2,5]),t([14,18,21,22,24],[2,1]),t(c,[2,2]),{3:20,4:n,18:[1,17],19:18,20:19},{3:5,4:n,5:6,6:r,7:3,8:i,9:4,10:o,11:s,13:23,15:7,16:8,17:a,23:l,24:[1,21],25:22},{1:[2,6]},t(c,[2,13]),{18:[1,24],22:[1,25]},t(u,[2,16]),{21:[1,26]},t(c,[2,18]),{22:[1,28],24:[1,27]},t(h,[2,20]),t(c,[2,14]),{3:20,4:n,20:29},{3:5,4:n,5:6,6:r,7:3,8:i,9:4,10:o,11:s,13:30,15:7,16:8,17:a,23:l},t(c,[2,19]),{3:5,4:n,5:6,6:r,7:3,8:i,9:4,10:o,11:s,13:31,15:7,16:8,17:a,23:l},t(u,[2,17]),t(u,[2,15]),t(h,[2,21])],defaultActions:{16:[2,6]},parseError:function(e,t){function n(e,t){this.message=e,this.hash=t}if(!t.recoverable)throw n.prototype=Error,new n(e,t);this.trace(e)},parse:function(e){var t=this,n=[0],r=[null],i=[],o=this.table,s="",a=0,l=0,c=0,u=i.slice.call(arguments,1),h=Object.create(this.lexer),f={yy:{}};for(var p in this.yy)Object.prototype.hasOwnProperty.call(this.yy,p)&&(f.yy[p]=this.yy[p]);h.setInput(e,f.yy),f.yy.lexer=h,f.yy.parser=this,void 0===h.yylloc&&(h.yylloc={});var y=h.yylloc;i.push(y);var g=h.options&&h.options.ranges;"function"==typeof f.yy.parseError?this.parseError=f.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var m,d,_,b,v,w,k,x,S,M=function(){var e;return e=h.lex()||1,"number"!=typeof e&&(e=t.symbols_[e]||e),e},P={};;){if(_=n[n.length-1],this.defaultActions[_]?b=this.defaultActions[_]:(null!==m&&void 0!==m||(m=M()),b=o[_]&&o[_][m]),void 0===b||!b.length||!b[0]){var E="";S=[];for(w in o[_])this.terminals_[w]&&w>2&&S.push("'"+this.terminals_[w]+"'");E=h.showPosition?"Parse error on line "+(a+1)+":\n"+h.showPosition()+"\nExpecting "+S.join(", ")+", got '"+(this.terminals_[m]||m)+"'":"Parse error on line "+(a+1)+": Unexpected "+(1==m?"end of input":"'"+(this.terminals_[m]||m)+"'"),this.parseError(E,{text:h.match,token:this.terminals_[m]||m,line:h.yylineno,loc:y,expected:S})}if(b[0]instanceof Array&&b.length>1)throw new Error("Parse Error: multiple actions possible at state: "+_+", token: "+m);switch(b[0]){case 1:n.push(m),r.push(h.yytext),i.push(h.yylloc),n.push(b[1]),m=null,d?(m=d,d=null):(l=h.yyleng,s=h.yytext,a=h.yylineno,y=h.yylloc,c>0&&c--);break;case 2:if(k=this.productions_[b[1]][1],P.$=r[r.length-k],P._$={first_line:i[i.length-(k||1)].first_line,last_line:i[i.length-1].last_line,first_column:i[i.length-(k||1)].first_column,last_column:i[i.length-1].last_column},g&&(P._$.range=[i[i.length-(k||1)].range[0],i[i.length-1].range[1]]),void 0!==(v=this.performAction.apply(P,[s,l,a,f.yy,b[1],r,i].concat(u))))return v;k&&(n=n.slice(0,-1*k*2),r=r.slice(0,-1*k),i=i.slice(0,-1*k)),n.push(this.productions_[b[1]][0]),r.push(P.$),i.push(P._$),x=o[n[n.length-2]][n[n.length-1]],n.push(x);break;case 3:return!0}}return!0}},p=function(){return{EOF:1,parseError:function(e,t){if(!this.yy.parser)throw new Error(e);this.yy.parser.parseError(e,t)},setInput:function(e,t){return this.yy=t||this.yy||{},this._input=e,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var e=this._input[0];return this.yytext+=e,this.yyleng++,this.offset++,this.match+=e,this.matched+=e,e.match(/(?:\r\n?|\n).*/g)?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),e},unput:function(e){var t=e.length,n=e.split(/(?:\r\n?|\n)/g);this._input=e+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-t),this.offset-=t;var r=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),n.length-1&&(this.yylineno-=n.length-1);var i=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:n?(n.length===r.length?this.yylloc.first_column:0)+r[r.length-n.length].length-n[0].length:this.yylloc.first_column-t},this.options.ranges&&(this.yylloc.range=[i[0],i[0]+this.yyleng-t]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){return this.options.backtrack_lexer?(this._backtrack=!0,this):this.parseError("Lexical error on line "+(this.yylineno+1)+". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})},less:function(e){this.unput(this.match.slice(e))},pastInput:function(){var e=this.matched.substr(0,this.matched.length-this.match.length);return(e.length>20?"...":"")+e.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var e=this.match;return e.length<20&&(e+=this._input.substr(0,20-e.length)),(e.substr(0,20)+(e.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var e=this.pastInput(),t=new Array(e.length+1).join("-");return e+this.upcomingInput()+"\n"+t+"^"},test_match:function(e,t){var n,r,i;if(this.options.backtrack_lexer&&(i={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(i.yylloc.range=this.yylloc.range.slice(0))),r=e[0].match(/(?:\r\n?|\n).*/g),r&&(this.yylineno+=r.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:r?r[r.length-1].length-r[r.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+e[0].length},this.yytext+=e[0],this.match+=e[0],this.matches=e,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(e[0].length),this.matched+=e[0],n=this.performAction.call(this,this.yy,this,t,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),n)return n;if(this._backtrack){for(var o in i)this[o]=i[o];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var e,t,n,r;this._more||(this.yytext="",this.match="");for(var i=this._currentRules(),o=0;o<i.length;o++)if((n=this._input.match(this.rules[i[o]]))&&(!t||n[0].length>t[0].length)){if(t=n,r=o,this.options.backtrack_lexer){if(!1!==(e=this.test_match(n,i[o])))return e;if(this._backtrack){t=!1;continue}return!1}if(!this.options.flex)break}return t?!1!==(e=this.test_match(t,i[r]))&&e:""===this._input?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+". Unrecognized text.\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var e=this.next();return e||this.lex()},begin:function(e){this.conditionStack.push(e)},popState:function(){return this.conditionStack.length-1>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(e){return e=this.conditionStack.length-1-Math.abs(e||0),e>=0?this.conditionStack[e]:"INITIAL"},pushState:function(e){this.begin(e)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(e,t,n,r){switch(n){case 0:break;case 1:return 6;case 2:return t.yytext=t.yytext.substr(1,t.yyleng-2),4;case 3:return 17;case 4:return 18;case 5:return 23;case 6:return 24;case 7:return 22;case 8:return 21;case 9:return 10;case 10:return 11;case 11:return 8;case 12:return 14;case 13:return"INVALID"}},rules:[/^(?:\s+)/,/^(?:(-?([0-9]|[1-9][0-9]+))(\.[0-9]+)?([eE][-+]?[0-9]+)?\b)/,/^(?:"(?:\\[\\"bfnrt\/]|\\u[a-fA-F0-9]{4}|[^\\\0-\x09\x0a-\x1f"])*")/,/^(?:\{)/,/^(?:\})/,/^(?:\[)/,/^(?:\])/,/^(?:,)/,/^(?::)/,/^(?:true\b)/,/^(?:false\b)/,/^(?:null\b)/,/^(?:$)/,/^(?:.)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6,7,8,9,10,11,12,13],inclusive:!0}}}}();return f.lexer=p,e.prototype=f,f.Parser=e,new e}();t.parser=i,t.Parser=i.Parser,t.parse=function(){return i.parse.apply(i,arguments)},t.main=function(r){r[1]||(console.log("Usage: "+r[0]+" FILE"),e.exit(1));var i=n(6).readFileSync(n(7).normalize(r[1]),"utf8");return t.parser.parse(i)},void 0!==r&&n.c[n.s]===r&&t.main(e.argv.slice(1))}).call(t,n(0),n(5)(e))},function(e,t){e.exports=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children||(e.children=[]),Object.defineProperty(e,"loaded",{enumerable:!0,get:function(){return e.l}}),Object.defineProperty(e,"id",{enumerable:!0,get:function(){return e.i}}),e.webpackPolyfill=1),e}},function(e,t){},function(e,t,n){(function(e){function n(e,t){for(var n=0,r=e.length-1;r>=0;r--){var i=e[r];"."===i?e.splice(r,1):".."===i?(e.splice(r,1),n++):n&&(e.splice(r,1),n--)}if(t)for(;n--;n)e.unshift("..");return e}function r(e,t){if(e.filter)return e.filter(t);for(var n=[],r=0;r<e.length;r++)t(e[r],r,e)&&n.push(e[r]);return n}var i=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/,o=function(e){return i.exec(e).slice(1)};t.resolve=function(){for(var t="",i=!1,o=arguments.length-1;o>=-1&&!i;o--){var s=o>=0?arguments[o]:e.cwd();if("string"!=typeof s)throw new TypeError("Arguments to path.resolve must be strings");s&&(t=s+"/"+t,i="/"===s.charAt(0))}return t=n(r(t.split("/"),function(e){return!!e}),!i).join("/"),(i?"/":"")+t||"."},t.normalize=function(e){var i=t.isAbsolute(e),o="/"===s(e,-1);return e=n(r(e.split("/"),function(e){return!!e}),!i).join("/"),e||i||(e="."),e&&o&&(e+="/"),(i?"/":"")+e},t.isAbsolute=function(e){return"/"===e.charAt(0)},t.join=function(){var e=Array.prototype.slice.call(arguments,0);return t.normalize(r(e,function(e,t){if("string"!=typeof e)throw new TypeError("Arguments to path.join must be strings");return e}).join("/"))},t.relative=function(e,n){function r(e){for(var t=0;t<e.length&&""===e[t];t++);for(var n=e.length-1;n>=0&&""===e[n];n--);return t>n?[]:e.slice(t,n-t+1)}e=t.resolve(e).substr(1),n=t.resolve(n).substr(1);for(var i=r(e.split("/")),o=r(n.split("/")),s=Math.min(i.length,o.length),a=s,l=0;l<s;l++)if(i[l]!==o[l]){a=l;break}for(var c=[],l=a;l<i.length;l++)c.push("..");return c=c.concat(o.slice(a)),c.join("/")},t.sep="/",t.delimiter=":",t.dirname=function(e){var t=o(e),n=t[0],r=t[1];return n||r?(r&&(r=r.substr(0,r.length-1)),n+r):"."},t.basename=function(e,t){var n=o(e)[2];return t&&n.substr(-1*t.length)===t&&(n=n.substr(0,n.length-t.length)),n},t.extname=function(e){return o(e)[3]};var s="b"==="ab".substr(-1)?function(e,t,n){return e.substr(t,n)}:function(e,t,n){return t<0&&(t=e.length+t),e.substr(t,n)}}).call(t,n(0))},function(e,t,n){function r(e,t){function n(e){if(t&&!1===t.noDuplicateMembers||!e.__duplicateProperties__||v.push({message:"An object contained duplicate members, making parsing ambigous: "+e.__duplicateProperties__.join(", "),line:e.__line__}),!o(e,"type","string"))if(S[e.type])e&&S[e.type](e);else{var n=M[e.type.toLowerCase()];void 0!==n?v.push({message:"Expected "+n+" but got "+e.type+" (case sensitive)",line:e.__line__}):v.push({message:"The type "+e.type+" is unknown",line:e.__line__})}}function r(e,t){return e.every(function(e){return null!==e&&typeof e===t})}function o(e,t,n){if(void 0===e[t])return v.push({message:'"'+t+'" member required',line:e.__line__});if("array"===n){if(!Array.isArray(e[t]))return v.push({message:'"'+t+'" member should be an array, but is an '+typeof e[t]+" instead",line:e.__line__})}else{if("object"===n&&e[t]&&"Object"!==e[t].constructor.name)return v.push({message:'"'+t+'" member should be '+n+", but is an "+e[t].constructor.name+" instead",line:e.__line__});if(n&&typeof e[t]!==n)return v.push({message:'"'+t+'" member should be '+n+", but is an "+typeof e[t]+" instead",line:e.__line__})}}function s(e){if(c(e),u(e),void 0!==e.properties&&v.push({message:'FeatureCollection object cannot contain a "properties" member',line:e.__line__}),void 0!==e.coordinates&&v.push({message:'FeatureCollection object cannot contain a "coordinates" member',line:e.__line__}),!o(e,"features","array")){if(!r(e.features,"object"))return v.push({message:"Every feature must be an object",line:e.__line__});e.features.forEach(b)}}function a(e,n){if(!Array.isArray(e))return v.push({message:"position should be an array, is a "+typeof e+" instead",line:e.__line__||n});if(e.length<2)return v.push({message:"position must have 2 or more elements",line:e.__line__||n});if(e.length>3)return v.push({message:"position should not have more than 3 elements",line:e.__line__||n});if(!r(e,"number"))return v.push({message:"each element in a position must be a number",line:e.__line__||n});if(t&&t.precisionWarning){if(w===k)return w+=1,v.push({message:"truncated warnings: we've encountered coordinate precision warning "+k+" times, no more warnings will be reported",level:"message",line:e.__line__||n});w<k&&e.forEach(function(t){var r=0,i=String(t).split(".")[1];if(void 0!==i&&(r=i.length),r>x)return w+=1,v.push({message:"precision of coordinates should be reduced",level:"message",line:e.__line__||n})})}}function l(e,t,n,r){if(void 0===r&&void 0!==e.__line__&&(r=e.__line__),0===n)return a(e,r);if(1===n&&t)if("LinearRing"===t){if(!Array.isArray(e[e.length-1]))return v.push({message:"a number was found where a coordinate array should have been found: this needs to be nested more deeply",line:r}),!0;if(e.length<4&&v.push({message:"a LinearRing of coordinates needs to have four or more positions",line:r}),e.length&&(e[e.length-1].length!==e[0].length||!e[e.length-1].every(function(t,n){return e[0][n]===t})))return v.push({message:"the first and last positions in a LinearRing of coordinates must be the same",line:r}),!0}else if("Line"===t&&e.length<2)return v.push({message:"a line needs to have two or more coordinates to be valid",line:r});if(Array.isArray(e)){return e.map(function(e){return l(e,t,n-1,e.__line__||r)}).some(function(e){return e})}v.push({message:"a number was found where a coordinate array should have been found: this needs to be nested more deeply",line:r})}function c(e){if(e.crs){"object"==typeof e.crs&&e.crs.properties&&"urn:ogc:def:crs:OGC:1.3:CRS84"===e.crs.properties.name?v.push({message:"old-style crs member is not recommended, this object is equivalent to the default and should be removed",line:e.__line__}):v.push({message:"old-style crs member is not recommended",line:e.__line__})}}function u(e){if(e.bbox)return Array.isArray(e.bbox)?(r(e.bbox,"number")||v.push({message:"each element in a bbox member must be a number",line:e.bbox.__line__}),4!==e.bbox.length&&6!==e.bbox.length&&v.push({message:"bbox must contain 4 elements (for 2D) or 6 elements (for 3D)",line:e.bbox.__line__}),v.length):void v.push({message:"bbox member must be an array of numbers, but is a "+typeof e.bbox,line:e.__line__})}function h(e){void 0!==e.properties&&v.push({message:'geometry object cannot contain a "properties" member',line:e.__line__}),void 0!==e.geometry&&v.push({message:'geometry object cannot contain a "geometry" member',line:e.__line__}),void 0!==e.features&&v.push({message:'geometry object cannot contain a "features" member',line:e.__line__})}function f(e){c(e),u(e),h(e),o(e,"coordinates","array")||a(e.coordinates)}function p(e){c(e),u(e),o(e,"coordinates","array")||l(e.coordinates,"LinearRing",2)||i(e,v)}function y(e){c(e),u(e),o(e,"coordinates","array")||l(e.coordinates,"LinearRing",3)||i(e,v)}function g(e){c(e),u(e),o(e,"coordinates","array")||l(e.coordinates,"Line",1)}function m(e){c(e),u(e),o(e,"coordinates","array")||l(e.coordinates,"Line",2)}function d(e){c(e),u(e),o(e,"coordinates","array")||l(e.coordinates,"",1)}function _(e){c(e),u(e),o(e,"geometries","array")||(r(e.geometries,"object")||v.push({message:"The geometries array in a GeometryCollection must contain only geometry objects",line:e.__line__}),1===e.geometries.length&&v.push({message:"GeometryCollection with a single geometry should be avoided in favor of single part or a single object of multi-part type",line:e.geometries.__line__}),e.geometries.forEach(function(t){t&&("GeometryCollection"===t.type&&v.push({message:"GeometryCollection should avoid nested geometry collections",line:e.geometries.__line__}),n(t))}))}function b(e){c(e),u(e),void 0!==e.id&&"string"!=typeof e.id&&"number"!=typeof e.id&&v.push({message:'Feature "id" member must have a string or number value',line:e.__line__}),void 0!==e.features&&v.push({message:'Feature object cannot contain a "features" member',line:e.__line__}),void 0!==e.coordinates&&v.push({message:'Feature object cannot contain a "coordinates" member',line:e.__line__}),"Feature"!==e.type&&v.push({message:"GeoJSON features must have a type=feature member",line:e.__line__}),o(e,"properties","object"),o(e,"geometry","object")||e.geometry&&n(e.geometry)}var v=[],w=0,k=10,x=6,S={Point:f,Feature:b,MultiPoint:d,LineString:g,MultiLineString:m,FeatureCollection:s,GeometryCollection:_,Polygon:p,MultiPolygon:y},M=Object.keys(S).reduce(function(e,t){return e[t.toLowerCase()]=t,e},{});return"object"!=typeof e||null===e||void 0===e?(v.push({message:"The root of a GeoJSON object must be an object.",line:0}),v):(n(e),v.forEach(function(e){({}).hasOwnProperty.call(e,"line")&&void 0===e.line&&delete e.line}),v)}var i=n(9);e.exports.hint=r},function(e,t){function n(e){return e*Math.PI/180}function r(e){var t=0;if(e.length>2)for(var r,i,o=0;o<e.length-1;o++)r=e[o],i=e[o+1],t+=n(i[0]-r[0])*(2+Math.sin(n(r[1]))+Math.sin(n(i[1])));return t>=0}function i(e){if(e&&e.length>0){if(r(e[0]))return!1;if(!e.slice(1,e.length).every(r))return!1}return!0}function o(e){return"Polygon"===e.type?i(e.coordinates):"MultiPolygon"===e.type?e.coordinates.every(i):void 0}e.exports=function(e,t){o(e)||t.push({message:"Polygons and MultiPolygons should follow the right-hand rule",level:"message",line:e.__line__})}},function(e,t,n){var r=n(1).coordEach;e.exports=function(e){var t=[1/0,1/0,-1/0,-1/0];return r(e,function(e){t[0]>e[0]&&(t[0]=e[0]),t[1]>e[1]&&(t[1]=e[1]),t[2]<e[0]&&(t[2]=e[0]),t[3]<e[1]&&(t[3]=e[1])}),t}},function(e,t,n){"use strict";function r(e){for(var t=e.length,n=[];t--;)n[t]=e[t];return n}function i(e){function t(e,t){return e-t}if(void 0===e.arr||e.arr.constructor!=Array||0===e.arr.length)return[];"quantile"==e.stat&&e.percentile&&e.percentile.constructor==Array&&(e.stat="quantiles");var n=r(e.arr),s=e.stat?e.stat:"max",a=n.length,l=a;return{max:function(){for(var e=-1/0,t=0;l--;)(t=n.pop())>e&&(e=t);return e},min:function(){for(var e=1/0;l--;){var t=n.pop();t<e&&(e=t)}return e},sum:function(){for(var e=0;l--;)e+=n.pop();return e},mean:function(){return i({stat:"sum",arr:n})/a},median:function(){return i({stat:"quantile",arr:n,percentile:50})},quantile:function(){var r;n.sort(t),e.percentile=e.percentile?e.percentile:50;var i=e.percentile/100*(n.length-1);if(Math.floor(i)==i)r=n[i];else{var o=Math.floor(i),s=i-o;r=n[o]+(n[o+1]-n[o])*s}return r},quantiles:function(){var t={};return e.percentile.forEach(function(e){var r=i({stat:"quantile",arr:n,percentile:e});t[e]=r}),t},distinct:function(){for(var e={},t=[];l--;)n[l]&&!e[n[l]]&&(e[n[l]]=!0,t.push(n[l]));return t},frequency:function(){var t=n[0]&&"object"==o(n[0])&&n[0].constructor==Object,r=e.colNames;if(t){if(r.constructor!=Array)throw"colnames must be array";0==r.length&&(r=Object.keys(n[0]))}else r=i({stat:"distinct",arr:n});for(var s,a,l={},c=0,u=r.length;c<u;c++){a=r[c],l[a]=t?{}:0;for(var h=0,f=n.length;h<f;h++)t?(s=n[h][a]||null,l[a][s]=l[a][s]+1||1):n[h]==a&&l[a]++}return l},sumBy:function(){var t=e.colNames;if(t.constructor!=Array)throw"colnames must be array";0==t.length&&(t=Object.keys(n[1]));for(var r,i,o,s={},a=0,l=t.length;a<l;a++){o=t[a];for(var c=0,u=n.length;c<u;c++)r=n[c][o]||0,i=s[o]||0,s[o]=i+r}return s}}[s](e)}Object.defineProperty(t,"__esModule",{value:!0});var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};t.cloneArray=r,t.getArrayStat=i},function(e,t,n){"use strict";function r(e,t,n,r){return void 0===e&&(e=1),void 0===n&&(n=100),void 0==r&&(r=50),(t<0||t>1||void 0===t)&&(t=Math.random()),"hsla("+360*t+", "+n+"% , "+r+"% , "+e+")"}function i(e,t){var n,r=e.replace("#",""),i="rgb";for(r=r.match(new RegExp("(.{"+r.length/3+"})","g")),n=0;n<r.length;n++)r[n]=parseInt(1==r[n].length?r[n]+r[n]:r[n],16);return void 0!==t&&(t>1&&(t=1),t<0&&(t=0),r.push(t),i="rgba"),i+"("+r.join(",")+")"}function o(e){return e=e.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i),e&&4===e.length?"#"+("0"+parseInt(e[1],10).toString(16)).slice(-2)+("0"+parseInt(e[2],10).toString(16)).slice(-2)+("0"+parseInt(e[3],10).toString(16)).slice(-2):""}function s(e,t){var n,r,i={alpha:1,color:"#000"},s=document.createElement("div");return s.style.color=e,r=s.style.color,r&&(n=r.split(", ")[3],n&&(i.alpha=1*n.replace(")","")),i.color=o(r)),t&&(i=i.color),i}function a(e){var t,n=1*e.min||0,i=1*e.max||0,o=1*e.colMin||0,a=1*e.colMax||1,l=e.val;return n==i||(t=(l-n)/(i-n)),t*=a-o,t=r(1,t),s(t,!0)}Object.defineProperty(t,"__esModule",{value:!0}),t.randomHsl=r,t.hex2rgba=i,t.rgba2hex=o,t.color2obj=s,t.colorLinear=a}]);