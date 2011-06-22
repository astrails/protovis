/* TODO font-size detection for baseline adjustment */

pv.VmlScene.label = function(scenes) {
  var e = scenes.$g.firstChild;
  for (var i = 0; i < scenes.length; i++) {
    var s = scenes[i];

    /* visible */
    if (!s.visible) continue;
    var fill = s.textStyle;
    if (!fill.opacity || !s.text) continue;

    /* Create VML elements as needed. */
    e = this.expect("v:shape", e);
    var vml = {root: e};
    vml.path = this.expect("v:path", vml.root.firstChild, vml.root);
    vml.fill = this.expect("v:fill", vml.path.nextSibling, vml.root);
    vml.text = this.expect("v:textpath", vml.fill.nextSibling, vml.root);
    vml.root.filled = true;
    vml.root.stroked = false;
    vml.root.style.width = "100%";
    vml.root.style.height = "100%";
    vml.path.textpathok = true;
    vml.text.on = true;

    var dx = 0, dy = 0, size = 10;
    switch (s.textBaseline) {
      case "top": {
        dx = Math.round(-Math.sin(s.textAngle) * size);
        dy = Math.round(Math.cos(s.textAngle) * size);
        break;
      }
      case "bottom": {
        dx = -Math.round(-Math.sin(s.textAngle) * size);
        dy = -Math.round(Math.cos(s.textAngle) * size);
        break;
      }
    }

    vml.root.style.left = s.left + dx;
    vml.root.style.top = s.top + dy;

    vml.fill.color = fill.color;
    vml.fill.opacity = fill.opacity;

    var x = Math.round(Math.cos(s.textAngle) * 1000),
        y = Math.round(Math.sin(s.textAngle) * 1000),
       mx = Math.round(Math.cos(s.textAngle) * s.textMargin),
       my = Math.round(Math.sin(s.textAngle) * s.textMargin),
       p;
    switch (s.textAlign) {
      case "right": {
        p = "M" + -x + "," + -y + "L" + -mx + "," + -my;
        break;
      }
      case "center": {
        p = "M" + -x + "," + -y + "L" + x + "," + y;
        break;
      }
      default: {
        p = "M" + mx + "," + my + "L" + x + "," + y;
        break;
      }
    }
    vml.path.v = p;

    vml.text.style.font = s.font;
    vml.text.style.color = "black";
    vml.text.style.antialias = s.antialias;
    vml.text.style["alignment-baseline"] = "alphabetic";
    vml.text.style["v-text-align"] = s.textAlign;
    vml.text.string = s.text;
    e = this.append(e, scenes, i);
  }
  return e;
};
