pv.Layout.Rollup = function() {
  pv.Layout.Network.call(this);
  var that = this;

  /* Render rollup nodes. */
  this.node
      .data(function() { return that.scene.$rollup.nodes; })
      .size(function(d) { return d.nodes.length * 20; });

  /* Render rollup links. */
  var add = this.link.add;
  this.link
      .interpolate("polar")
      .eccentricity(.8)
      .add = function(type) {
      var mark = add.call(this, type);
      mark.parent.data(function() { return that.scene.$rollup.links; });
      return mark;
    };
};

pv.Layout.Rollup.prototype = pv.extend(pv.Layout.Network)
    .property("directed", Boolean);

pv.Layout.Rollup.prototype.x = function(f) {
  this.$x = pv.functor(f);
  return this;
};

pv.Layout.Rollup.prototype.y = function(f) {
  this.$y = pv.functor(f);
  return this;
};

pv.Layout.Rollup.prototype.init = function() {
  if (pv.Layout.Network.prototype.init.call(this)) return;
  var nodes = this.nodes(),
      links = this.links(),
      directed = this.directed(),
      n = nodes.length,
      x = [],
      y = [],
      rnindex = 0,
      rnodes = {},
      rlinks = {};

  /** @private */
  function id(i) {
    return x[i] + "," + y[i];
  }

  /* Iterate over the data, evaluating the x and y functions. */
  var stack = pv.Mark.stack;
  stack.unshift(null);
  for (var i = 0; i < n; i++) {
    pv.Mark.prototype.index = this.index = i;
    stack[0] = nodes[i];
    x[i] = this.$x.apply(this.node, stack);
    y[i] = this.$y.apply(this.node, stack);
  }
  delete this.index;
  stack.shift();

  /* Compute rollup nodes. */
  for (var i = 0; i < nodes.length; i++) {
    var nodeId = id(i),
        rn = rnodes[nodeId];
    if (!rn) {
      rn = rnodes[nodeId] = pv.extend(nodes[i]);
      rn.index = rnindex++;
      rn.x = x[i];
      rn.y = y[i];
      rn.nodes = [];
    }
    rn.nodes.push(nodes[i]);
  }

  /* Compute rollup links. */
  for (var i = 0; i < links.length; i++) {
    var source = links[i].sourceNode,
        target = links[i].targetNode,
        rsource = rnodes[id(source.index)],
        rtarget = rnodes[id(target.index)],
        reverse = !directed && rsource.index > rtarget.index,
        linkId = reverse
            ? rtarget.index + "," + rsource.index
            : rsource.index + "," + rtarget.index,
        rl = rlinks[linkId];
    if (!rl) {
      rl = rlinks[linkId] = {
        sourceNode: rsource,
        targetNode: rtarget,
        linkValue: 0,
        links: []
      };
    }
    rl.links.push(links[i]);
    rl.linkValue += links[i].linkValue;
  }

  /* Export the rolled up nodes and links to the scene. */
  this.scene.$rollup = {
    nodes: pv.values(rnodes),
    links: pv.values(rlinks)
  };
};
