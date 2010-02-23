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
  vml.root.appendChild(vml.fill = this.create("v:fill"));
  vml.root.appendChild(vml.stroke = this.create("v:stroke"));

  /* polygon */
  vml.root.style.cursor = s.cursor;
  vml.root.title = s.title || "";
  vml.root.points = p;

  vml.fill.color = fill.color;
  vml.fill.opacity = fill.opacity;
  vml.stroke.color = stroke.color;
  vml.stroke.opacity = stroke.opacity * Math.min(s.lineWidth, 1);
  vml.stroke.weight = s.lineWidth + "px";

  return this.append(e, scenes, 0);
};
