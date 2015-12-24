var fabric = require('fabric').fabric;
var LabeledPolygon = fabric.util.createClass(fabric.Polygon, {
  type: 'labeled-polygon',
  initialize: function(options) {
    options || (options = { });
    this.callSuper('initialize', options);
    this.set('_id', options._id);
    this.set('drawingId', options.drawingId);
  },
  toObject: function() {
    return fabric.util.object.extend(this.callSuper('toObject'), {
      _id: this.get('_id'),
      drawingId: this.get('drawingId')
    });
  }
});

LabeledPolygon.fromObject = function(o, callback){
  return new LabeledPolygon(o);
};

module.exports = LabeledPolygon;
