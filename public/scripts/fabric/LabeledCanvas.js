// impt 
fabric.LabeledCanvas = fabric.util.createClass(fabric.Canvas, {
    initialize: function(el, options) {
        options || (options = { });
        this.callSuper('initialize', el, options);
        this._id = options._id;
        this.name = options.name;
        this.type = 'labeled-canvas';
    },
    toObject: function() {
        return fabric.util.object.extend(this.callSuper('toObject'), {
            _id: this._id,
            name: this.name,
            type: 'labeled-canvas'
        });
    },
    toJSON: function() {
        return fabric.util.object.extend(this.callSuper('toJSON'), {
            _id: this._id,
            name: this.name,
            type: 'labeled-canvas'
        });
    }
});
/**
 *
 * http://jsfiddle.net/rwaldron/j3vST/
 *
 * @param id
 * @returns {*}
 */
fabric.LabeledCanvas.prototype.findById = function(id){
    return this.getObjects().filter(function( obj ) {
        return obj._id === id;
    })[ 0 ];
}