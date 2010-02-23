pv.VmlScene.rule = function(scenes) {
  var e = scenes.$g.firstChild;
  for (var i = 0; i < scenes.length; i++) {
    var s = scenes[i];

    /* visible */
    if (!s.visible) continue;
    var stroke = s.strokeStyle || pv.Color.none;
    if (!stroke.opacity) continue;

    e = this.expect("v:line", e);
    var vml = {root: e};
    vml.root.appendChild(vml.stroke = this.create("v:stroke"));

    /* line */
    vml.root.title = s.title;
    vml.root.style.cursor = s.cursor;
    vml.root.from = s.left + "," + s.top;
    vml.root.to = (s.left + s.width) + "," + (s.top + s.height);

    var color = pv.color(s.strokeStyle);
    vml.stroke.color = color.color;
    vml.stroke.opacity = color.opacity * Math.min(s.lineWidth, 1);
    vml.stroke.weight = s.lineWidth + "px";

    e = this.append(e, scenes, i);
  }
  return e;
};
