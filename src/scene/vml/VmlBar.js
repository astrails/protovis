pv.VmlScene.bar = function(scenes) {
  var e = scenes.$g.firstChild;
  for (var i = 0; i < scenes.length; i++) {
    var s = scenes[i];

    /* visible */
    if (!s.visible) continue;
    var fill = s.fillStyle || pv.Color.none,
        stroke = s.strokeStyle || pv.Color.none;
    if (!fill.opacity && !stroke.opacity) continue;

    e = this.expect("v:rect", e);
    var vml = {root: e};
    vml.fill = this.expect("v:fill", vml.root.firstChild, vml.root);
    vml.stroke = this.expect("v:stroke", vml.fill.nextSibling, vml.root);

    vml.root.style.left = s.left;
    vml.root.style.top = s.top;
    vml.root.style.width = s.width;
    vml.root.style.height = s.height;
    vml.root.style.cursor = s.cursor;
    vml.root.style.antialias = s.antialias;
    vml.root.title = s.title || "";

    vml.fill.color = fill.color;
    vml.fill.opacity = fill.opacity;

    vml.stroke.color = stroke.color;
    vml.stroke.opacity = stroke.opacity * Math.min(s.lineWidth, 1);
    vml.stroke.weight = s.lineWidth + "px";

    e = this.append(e, scenes, i);
  }
  return e;
};
