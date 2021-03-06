var should = require("should");
var mongoose = require('mongoose');
var User = require("../models/user.js");
var db;

describe('User', function() {

	before(function(done) {
		db = mongoose.connect('mongodb://localhost/boost_1');
		done();
	    });

	after(function(done) {
		mongoose.connection.close();
		done();
	    });

	beforeEach(function(done) {
		var account = new User({
			username: '12345',
			password: 'testy'
		    });

		user.save(function(error) {
			if (error) console.log('error' + error.message);
			else console.log('no error');
			done();
		    });
	    });

	it('find a user by username', function(done) {
		User.findOne({ username: '12345' }, function(err, account) {
			user.username.should.eql('12345');
			console.log("   username: ", user.username);
			done();
		    });
	    });

	afterEach(function(done) {
		User.remove({}, function() {
			done();
		    });
	    });

    });