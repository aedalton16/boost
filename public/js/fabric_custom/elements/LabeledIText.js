var fabric = require('fabric').fabric;
var LabeledIText = fabric.util.createClass(fabric.IText, {
  type: 'labeled-i-text',
  initialize: function(text, options) {
    options || (options = { });
    text || (text = '');
    this.callSuper('initialize', text, options);
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

LabeledIText.fromObject = function(o, callback){
  return new LabeledIText(o.text, o);
};

module.exports = LabeledIText;
