var mongoose = require('mongoose');

module.exports = mongoose.model('Note', {
	text : {type : String, default: ''}
});