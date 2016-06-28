var mongoose = require('mongoose'),
	Schema = mongoose.Schema; 

var ClassroomSchema = mongoose.Schema({
	created: {
		type: Date, 
		default: Date.now
	},
	_creator: {
		type: Schema.ObjectId, 
		ref: 'User'
	},
	members: [{
		type: Schema.ObjectId, 
		ref: 'User'
	}]
	name: {
		type: String, 
		default: '', 
		trim: true
	},
	description: {
		type: String, 
		default: '', 
		trim: true
	}, 
	{
		strict: false
	}
});

/**
* Validations
*/ 

ClassroomSchema.path('name').validate(function(name) {
	return name.length;
}, 'Name cannot be blank');


mongoose.model('Classroom', Classroom); 