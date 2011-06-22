pv.VmlScene.image = function(scenes) {
  var e = scenes.$g.firstChild;
  for (var i = 0; i < scenes.length; i++) {
    var s = scenes[i];

    /* visible */
    if (!s.visible) continue;

    e = this.expect("v:image", e);
    var vml = {root: e};
    vml.fill = this.expect("v:fill", vml.root.firstChild, vml.root);
    vml.stroke = this.expect("v:stroke", vml.fill.nextSibling, vml.root);
    vml.root.filled = true;
    vml.root.stroked = true;

    vml.root.style.left = s.left;
    vml.root.style.top = s.top;
    vml.root.style.width = s.width;
    vml.root.style.height = s.height;
    vml.root.style.cursor = s.cursor || "auto";
    vml.root.src = s.url;
    vml.root.title = s.title || "";

    var fill = s.fillStyle;
    vml.fill.color = fill.color;
    vml.fill.opacity = fill.opacity;
    var stroke = s.strokeStyle;
    vml.stroke.color = stroke.color;
    vml.stroke.opacity = stroke.opacity * Math.min(s.lineWidth, 1);
    vml.stroke.weight = s.lineWidth + "px";

    e = this.append(e, scenes, i);
  }
  return e;
};
