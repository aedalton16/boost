var fabric = require('fabric').fabric;
var LabeledCircle = fabric.util.createClass(fabric.Circle, {
  type: 'labeled-circle',
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

LabeledCircle.fromObject = function(o, callback){
  return new LabeledCircle(o);
};

module.exports = LabeledCircle;
