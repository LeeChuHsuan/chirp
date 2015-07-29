var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	username: String,
	password: String,
	created_at: {type:Date,default:Date.now}
});

var PostSchema = new mongoose.Schema({
	text: String,
	created_at: {type:Date,default:Date.now},
	created_by: String
});


mongoose.model('User',UserSchema);
mongoose.model('Post',PostSchema)