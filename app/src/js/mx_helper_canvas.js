/**
* Get device pixel ratio and store it in mx.settings.devicePixelRatio
* @note https://stackoverflow.com/questions/15661339/how-do-i-fix-blurry-text-in-my-html5-canvas
* @return Device pixel ratio
*/
export function getPixelRatio() {
  if (! mx.settings.devicePixelRatio ) {
    var ctx = document.createElement("canvas").getContext("2d"),
      dpr = window.devicePixelRatio || 1,
      bsr = ctx.webkitBackingStorePixelRatio ||
      ctx.mozBackingStorePixelRatio ||
      ctx.msBackingStorePixelRatio ||
      ctx.oBackingStorePixelRatio ||
      ctx.backingStorePixelRatio || 1;

    mx.settings.devicePixelRatio = dpr / bsr;
  }
  return mx.settings.devicePixelRatio;
}


/**
* Create canvas accordiing to device pixel ratio
* @param {Integer} w  Width of the canvas
* @param {Integer} h  Height of the canvas
* @note https://stackoverflow.com/questions/15661339/how-do-i-fix-blurry-text-in-my-html5-canvas
* @return Canvas element
*/
export function createCanvas(w, h, ratio) {
  if (!ratio) {
    ratio = mx.helpers.getPixelRatio();
  }
  var elCanvas = mx.helpers.el("canvas",{
    width : w * ratio,
    height : h * ratio,
    style : {
      width: w + "px",
      height: h + "px"
    }
  });
  elCanvas.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
  return elCanvas;
}



