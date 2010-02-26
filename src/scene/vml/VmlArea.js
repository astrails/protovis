pv.VmlScene.area = function(scenes) {
  var e = scenes.$g.firstChild;
  if (!scenes.length) return e;
  var s = scenes[0];

  /* segmented */
  if (s.segmented) return this.areaSegment(scenes);

  /* visible */
  if (!s.visible) return e;
  var fill = s.fillStyle || pv.Color.none,
      stroke = s.strokeStyle || pv.Color.none;
  if (!fill.opacity && !stroke.opacity) return e;

  /* points */
  var p = "";
  for (var i = 0; i < scenes.length; i++) {
    var si = scenes[i];
    p += si.left + "," + si.top + " ";
  }
  for (var j = scenes.length - 1; j >= 0; j--) {
    var sj = scenes[j];
    p += (sj.left + sj.width) + "," + (sj.top + sj.height) + " ";
  }

  e = this.expect("v:polyline", e);
  var vml = {root: e};
  vml.fill = this.expect("v:fill", vml.root.firstChild, vml.root);
  vml.stroke = this.expect("v:stroke", vml.fill.nextSibling, vml.root);

  /* polygon */
  vml.root.style.cursor = s.cursor;
  vml.root.style.antialias = s.antialias;
  vml.root.title = s.title || "";
  // Changing the 'points' attribute produces the error "Object doesn't
  // support this property or method" when the node is in the DOM. Remove
  // it; we'll add it back at the end.
  if (vml.root.parentNode)
    vml.root.parentNode.removeChild(vml.root);
  vml.root.points = p;

  vml.fill.color = fill.color;
  vml.fill.opacity = fill.opacity;
  vml.stroke.color = stroke.color;
  vml.stroke.opacity = stroke.opacity * Math.min(s.lineWidth, 1);
  vml.stroke.weight = s.lineWidth + "px";

  return this.append(e, scenes, 0);
};
