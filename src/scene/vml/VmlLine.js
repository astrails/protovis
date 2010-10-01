pv.VmlScene.line = function(scenes) {
  var e = scenes.$g.firstChild;
  if (scenes.length < 2) return e;
  var s = scenes[0];

  /* segmented */
  if (s.segmented) return this.lineSegment(scenes);

  /* visible */
  if (!s.visible) return e;
  var fill = s.fillStyle, stroke = s.strokeStyle;
  if (!fill.opacity && !stroke.opacity) return e;

  /* points */
  var p;
  for (var i = 0; i < scenes.length; i++) {
    var si = scenes[i], x = Math.round(si.left), y = Math.round(si.top);
    if (isNaN(x)) x = 0;
    if (isNaN(y)) y = 0;
    if (!p) p = "m" + x + "," + y + "l";
    else p += x + "," + y + " ";
  }

  e = this.expect("v:shape", e);
  var vml = {root: e};
  vml.path = this.expect("v:path", vml.root.firstChild, vml.root);
  vml.fill = this.expect("v:fill", vml.path.nextSibling, vml.root);
  vml.stroke = this.expect("v:stroke", vml.fill.nextSibling, vml.root);

  /* polygon */
  vml.root.style.width = "100%";
  vml.root.style.height = "100%";
  vml.root.style.cursor = s.cursor || "auto";
  vml.root.style.antialias = s.antialias;
  vml.root.title = s.title || "";
  vml.path.v = p;

  vml.fill.color = fill.color;
  vml.fill.opacity = fill.opacity;
  vml.stroke.color = stroke.color;
  vml.stroke.opacity = stroke.opacity * Math.min(s.lineWidth, 1);
  vml.stroke.weight = s.lineWidth + "px";
  return this.append(e, scenes, 0);
};
