var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Post = mongoose.model('Post');


function isAuthenticated (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects

	//allow all get request methods
	if(req.method === "GET"){
		return next();
	}
	if (req.isAuthenticated()){
		return next();
	}

	// if the user is not authenticated then redirect him to the login page
	return res.redirect('/#login');
};


//router.use('/posts',isAuthenticated);
router.route('/posts')
	
	//create a new post in datebase
	.post(function(req,res){
		var newpost = new Post();
		newpost.text = req.body.text;
		newpost.created_by = req.body.created_by;
		newpost.save(function(err){
			if(err)
				return res.send(500,err);
			return res.json(newpost);
		});
	})

	//to get all the posts in the database
	.get(function(req,res){
		Post.find(function(err,posts){
			if(err)
				return res.send(500,err);
			return res.send(200,posts);
		});
	});	


router.route('/posts/:id')

	//create
	.put(function(req,res){
		Post.findById(res.params.id,function(err,post){
			if(err)
				res.send(500,err);
			post.text = req.body.text;
			post.created_by = req.body.created_by;
			post.save(function(err,post){
				if(err)
					return res.send(err);
				return res.json(post);
			});
		});	
	})

	//get specific post
	.get(function(req,res){
			Post.findById(req.params.id,function(err,post){
				if(err)
					return res.send(500,err);
				return res.json(post);
		});
	})

	//delete a specific post
	.delete(function(req,res){
		Post.remove({_id:req.params.id},function(err){
			if(err)
				return res.send(err);
			return res.json("deleted: " +req.params.id);
		});
	});
	

module.exports = router;