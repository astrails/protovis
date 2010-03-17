/**
 *
 */
pv.VmlScene = {};

/**
 *
 */
pv.VmlScene.init = function() {
  ["group", "shape", "path", "fill", "stroke",
    "polyline", "rect", "image", "textpath", "line"].forEach(function(e) {
    document.createStyleSheet().addRule("v\\:" + e, "behavior:url(#default#VML);display:inline-block");
  });
  document.namespaces.add("v", "urn:schemas-microsoft-com:vml");
  this.init = function() {};
};

/**
 *
 */
pv.VmlScene.create = function(type, parent) {
  this.init();
  var e = document.createElement(type);
  if (parent)
    parent.appendChild(e);
  return e;
};

/**
 * Expects the element <i>e</i> to be the specified type. If the element does
 * not exist, a new one is created. If the element does exist but is the wrong
 * type, it is replaced with the specified element.
 *
 * @param type {string} a VML element type, such as "v:group".
 * @return a new VML element.
 */
pv.VmlScene.expect = function(type, e, parent) {
  if (!e) return this.create(type, parent);
  if ("v:" + e.tagName == type) return e;
  var n = this.create(type);
  e.parentNode.replaceChild(n, e);
  return n;
};

/** TODO */
pv.VmlScene.append = function(e, scenes, index) {
  e.$scene = {scenes:scenes, index:index};
  if (!e.parentNode || e.parentNode.nodeType == 11)
    scenes.$g.appendChild(e);
  return e.nextSibling;
};

/** TODO */
pv.VmlScene.dispatch = pv.listener(function(e) {
  var t = e.srcElement.$scene;
  if (t) {
    e.preventDefault = function () { this.returnValue = false; };
    t.scenes.mark.dispatch(e, t.scenes, t.index);
  }
});
