/**
 *
 */
pv.VmlScene = {};

/**
 *
 */
pv.VmlScene.init = function() {
  document.createStyleSheet().addRule("v\\:*", "behavior:url(#default#VML);display:inline-block");
  document.namespaces.add("v", "urn:schemas-microsoft-com:vml");
  this.init = function() {};
};

/**
 *
 */
pv.VmlScene.create = function(type) {
  this.init();
  return document.createElement(type);
};

/**
 * Expects the element <i>e</i> to be the specified type. If the element does
 * not exist, a new one is created. If the element does exist but is the wrong
 * type, it is replaced with the specified element.
 *
 * @param type {string} a VML element type, such as "v:group".
 * @return a new VML element.
 */
pv.VmlScene.expect = function(type, e) {
  if (!e) return this.create(type);
//  if (e.tagName == "a") e = e.firstChild;
  if (e.tagName == type) return e;
  var n = this.create(type);
  e.parentNode.replaceChild(n, e);
  return n;
};

/** TODO */
pv.VmlScene.append = function(e, scenes, index) {
//  e.$scene = {scenes:scenes, index:index};
//  e = this.title(e, scenes[index]);
  if (!e.parentNode || e.parentNode.nodeType == 11)
    scenes.$g.appendChild(e);
  return e.nextSibling;
};
