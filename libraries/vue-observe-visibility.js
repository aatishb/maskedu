var VueObserveVisibility=function(e){"use strict";!function(){function e(e){this.value=e}function t(t){var r,n;function i(r,n){try{var s=t[r](n),a=s.value;a instanceof e?Promise.resolve(a.value).then(function(e){i("next",e)},function(e){i("throw",e)}):o(s.done?"return":"normal",s.value)}catch(e){o("throw",e)}}function o(e,t){switch(e){case"return":r.resolve({value:t,done:!0});break;case"throw":r.reject(t);break;default:r.resolve({value:t,done:!1})}(r=r.next)?i(r.key,r.arg):n=null}this._invoke=function(e,t){return new Promise(function(o,s){var a={key:e,arg:t,resolve:o,reject:s,next:null};n?n=n.next=a:(r=n=a,i(e,t))})},"function"!=typeof t.return&&(this.return=void 0)}"function"==typeof Symbol&&Symbol.asyncIterator&&(t.prototype[Symbol.asyncIterator]=function(){return this}),t.prototype.next=function(e){return this._invoke("next",e)},t.prototype.throw=function(e){return this._invoke("throw",e)},t.prototype.return=function(e){return this._invoke("return",e)}}();var t=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},r=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),n=function(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t];return r}return Array.from(e)};var i=function(){function e(r,n,i){t(this,e),this.el=r,this.observer=null,this.createObserver(n,i)}return r(e,[{key:"createObserver",value:function(e,t){var r,i,o,s,a,l,u,c=this;this.observer&&this.destroyObserver(),this.options="function"==typeof(r=e)?{callback:r}:r,this.callback=this.options.callback,this.callback&&this.options.throttle&&(this.callback=(i=this.callback,o=this.options.throttle,s=void 0,a=void 0,l=void 0,(u=function(e){for(var t=arguments.length,r=Array(t>1?t-1:0),u=1;u<t;u++)r[u-1]=arguments[u];l=r,s&&e===a||(a=e,clearTimeout(s),s=setTimeout(function(){i.apply(void 0,[e].concat(n(l))),s=0},o))})._clear=function(){clearTimeout(s)},u)),this.oldResult=void 0,this.observer=new IntersectionObserver(function(e){var t=e[0];if(c.callback){var r=t.isIntersecting&&t.intersectionRatio>=c.threshold;if(r===c.oldResult)return;c.oldResult=r,c.callback(r,t)}},this.options.intersection),t.context.$nextTick(function(){c.observer.observe(c.el)})}},{key:"destroyObserver",value:function(){this.observer&&this.observer.disconnect(),this.callback&&this.callback._clear&&this.callback._clear()}},{key:"threshold",get:function(){return this.options.intersection&&this.options.intersection.threshold||0}}]),e}();function o(e,t,r){var n=t.value;if("undefined"==typeof IntersectionObserver)console.warn("[vue-observe-visibility] IntersectionObserver API is not available in your browser. Please install this polyfill: https://github.com/w3c/IntersectionObserver/tree/master/polyfill");else{var o=new i(e,n,r);e._vue_visibilityState=o}}var s={bind:o,update:function(e,t,r){var n=t.value;if(!function e(t,r){if(t===r)return!0;for(var n in t)if(e(t[n],r[n]))return!0;return!1}(n,t.oldValue)){var i=e._vue_visibilityState;i?i.createObserver(n,r):o(e,{value:n},r)}},unbind:function(e){var t=e._vue_visibilityState;t&&(t.destroyObserver(),delete e._vue_visibilityState)}};function a(e){e.directive("observe-visibility",s)}var l={version:"0.4.2",install:a},u=null;return"undefined"!=typeof window?u=window.Vue:"undefined"!=typeof global&&(u=global.Vue),u&&u.use(l),e.install=a,e.ObserveVisibility=s,e.default=l,e}({});
