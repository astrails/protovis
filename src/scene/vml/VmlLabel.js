/* TODO font-size detection for baseline adjustment */
/* TODO textMargin support */

pv.VmlScene.label = function(scenes) {
  var e = scenes.$g.firstChild;
  for (var i = 0; i < scenes.length; i++) {
    var s = scenes[i];

    /* visible */
    if (!s.visible) continue;
    var fill = pv.color(s.textStyle);
    if (!fill.opacity) continue;

    /* Create VML elements as needed. */
    e = this.expect("v:shape", e);
    var vml = {root: e};
    vml.root.appendChild(vml.path = this.create("v:path"));
    vml.root.appendChild(vml.fill = this.create("v:fill"));
    vml.root.appendChild(vml.text = this.create("v:textpath"));
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
      y = Math.round(Math.sin(s.textAngle) * 1000), p;
    switch (s.textAlign) {
      case "right": {
        p = "M" + -x + "," + -y + "L0,0";
        break;
      }
      case "center": {
        p = "M" + -x + "," + -y + "L" + x + "," + y;
        break;
      }
      default: {
        p = "M0,0L" + x + "," + y;
        break;
      }
    }
    vml.path.v = p;

    vml.text.style.font = s.font;
    vml.text.style.color = "black";
    vml.text.style["alignment-baseline"] = "alphabetic";
    vml.text.style["v-text-align"] = s.textAlign;
    vml.text.string = s.text;
    e = this.append(e, scenes, i);
  }
  return e;
};
