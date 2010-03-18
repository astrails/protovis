pv.VmlScene.wedge = function(scenes) {
  var e = scenes.$g.firstChild;
  for (var i = 0; i < scenes.length; i++) {
    var s = scenes[i];

    /* visible */
    if (!s.visible) continue;
    var fill = s.fillStyle, stroke = s.strokeStyle;
    if (!fill.opacity && !stroke.opacity) continue;

    /* points */
    var r1 = Math.round(s.innerRadius), r2 = Math.round(s.outerRadius), d;
    if (s.angle >= 2 * Math.PI) {
      if (r1) {
        d = "AE0,0 " + r2 + "," + r2 + " 0 23592960"
          + "AL0,0 " + r1 + "," + r1 + " 0 23592960";
      } else {
        d = "AE0,0 " + r2 + "," + r2 + " 0 23592960";
      }
    } else {
      var sa = Math.round(s.startAngle / Math.PI * 11796480),
        a = Math.round(s.angle / Math.PI * 11796480);
      if (r1) {
        d = "AE 0,0 " + r2 + "," + r2 + " " + -sa + " " + -a
          + " 0,0 " + r1 + "," + r1 + " " + -(sa + a) + " " + a
          + "X";
      } else {
        d = "M0,0"
          + "AE0,0 " + r2 + "," + r2 + " " + -sa + " " + -a
          + "X";
      }
    }

    e = this.expect("v:shape", e);
    var vml = {root: e};
    vml.path = this.expect("v:path", vml.root.firstChild, vml.root);
    vml.fill = this.expect("v:fill", vml.path.nextSibling, vml.root);
    vml.stroke = this.expect("v:stroke", vml.fill.nextSibling, vml.root);
    // vml.root.setAttribute("fill-rule", "evenodd");

    /* path */
    vml.root.style.left = s.left;
    vml.root.style.top = s.top;
    vml.root.style.width = "100%";
    vml.root.style.height = "100%";
    vml.root.style.cursor = s.cursor;
    vml.root.style.antialias = s.antialias;
    vml.root.title = s.title || "";

    vml.fill.color = fill.color;
    vml.fill.opacity = fill.opacity;
    vml.stroke.color = stroke.color;
    vml.stroke.opacity = stroke.opacity * Math.min(s.lineWidth, 1);
    vml.stroke.weight = s.lineWidth + "px";

    vml.path.v = d;

    e = this.append(e, scenes, i);
  }
  return e;
};
