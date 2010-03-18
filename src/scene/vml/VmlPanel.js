/*
 * TODO
 * - optimize: dirty bit
 * - z-index
 */

pv.VmlScene.panel = function(scenes) {
  var g = scenes.$g, e = g && g.firstChild;
  for (var i = 0; i < scenes.length; i++) {
    var s = scenes[i];

    /* visible */
    if (!s.visible) continue;

    var width = s.width + s.left + s.right;
    var height = s.height + s.top + s.bottom;

    /* vml */
    if (!scenes.parent) {
      s.canvas.style.position = "relative";
      s.canvas.style.display = "inline-block";
      s.canvas.style.width = width;
      s.canvas.style.height = height;
      s.canvas.style.overflow = "hidden";
      g = s.canvas.firstChild;
      if (!g) {
        s.canvas.appendChild(g = this.create("v:group"));
        g.onclick
            = g.onmousedown
            = g.onmouseup
            = g.onmousemove
            = g.onmouseout
            = g.onmouseover
            = pv.VmlScene.dispatch;
      }
      scenes.$g = g;
      g.style.position = "relative";
      g.style.width = width;
      g.style.height = height;
      g.coordsize = width + "," + height;
      // Adjust for 1 pixel VML margin that I can find no other way of removing.
      g.style.top = "-1px";
      g.style.left = "-1px";
      if (typeof e == "undefined") e = g.firstChild;
    }

    // v:group doesn't get the full width and height unless it has
    // an inner shape with full width and height.
    e = this.expect("v:rect", e);
    e.style.position = "absolute";
    e.style.width = width;
    e.style.height = height;
    e.stroked = false;
    e.filled = false;
    e = this.append(e, scenes, i);

    /* fill */
    e = this.fill(e, scenes, i);

    /* children */
    for (var j = 0; j < s.children.length; j++) {
      s.children[j].$g = e = this.expect("v:group", e);
      e.style.position = "absolute";
      e.style.width = s.width;
      e.style.height = s.height;
      e.style.left = s.left;
      e.style.top = s.top;
      e.coordsize = s.width + "," + s.height;
      this.updateAll(s.children[j]);
      if (!e.parentNode || e.parentNode.nodeType == 11) g.appendChild(e);
      e = e.nextSibling;
    }

    /* stroke */
    e = this.stroke(e, scenes, i);
  }
  return e;
};

pv.VmlScene.fill = function(e, scenes, i) {
  var s = scenes[i], fill = s.fillStyle;
  if (fill.opacity) {
    e = this.expect("v:rect", e);
    e.style.position = "absolute";
    e.style.left = s.left;
    e.style.top = s.top;
    e.style.width = s.width;
    e.style.height = s.height;
    e.style.cursor = s.cursor;
    e.style.antialias = s.antialias;
    e.stroked = false;
    var c = this.expect("v:fill", e.firstChild, e);
    c.color = fill.color;
    c.opacity = fill.opacity;
    e = this.append(e, scenes, i);
  }
  return e;
};

pv.VmlScene.stroke = function(e, scenes, i) {
  var s = scenes[i], stroke = s.strokeStyle;
  if (stroke.opacity) {
    e = this.expect("v:rect", e);
    e.style.position = "absolute";
    e.style.left = s.left;
    e.style.top = s.top;
    e.style.width = s.width;
    e.style.height = s.height;
    e.style.cursor = s.cursor;
    e.style.antialias = s.antialias;
    e.filled = false;
    var c = this.expect("v:stroke", e.firstChild, e);
    c.color = stroke.color;
    c.opacity = stroke.opacity * Math.min(s.lineWidth, 1);
    c.weight = s.lineWidth + "px";
    e = this.append(e, scenes, i);
  }
  return e;
};
