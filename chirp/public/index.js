var app = angular.module("chirp",['ngRoute' , 'ngResource']).run(function($rootScope,$http){
	$rootScope.authenticated = false;
	$rootScope.current_user = '';
	$rootScope.signout = function(){
		$http.post('/auth/signout');
		$rootScope.current_user = '';
		$rootScope.authenticated = false;
	};
});

app.factory('postService',function($resource){
	return $resource('/api/posts/:id');	
});


app.controller('mainController', (function($scope,$rootScope,postService){
	$scope.posts = postService.query();
	$scope.new_post = {created_by:'',text:'',created_at:''};
	$scope.post = function(){
		//console.log*('post text: '+$scope.new_post.text);
		$scope.new_post.created_at = Date.now();
	 	$scope.new_post.created_by = $rootScope.current_user;
	 	postService.save($scope.new_post,function(){
	 		$scope.new_post={created_by:'',text:'',created_at:''};
	 		$scope.posts = postService.query();
	 	});
	};
}));

app.config(function($routeProvider){
	$routeProvider
		.when('/',{
			templateUrl: 'main.html',
			controller : 'mainController'
		})

		.when('/login',{
			templateUrl: 'login.html',
			controller : 'authController'
		})

		.when('/signup',{
			templateUrl:'register.html',
			controller:'authController'
		})
});

app.controller('authController',function($scope,$rootScope,$http,$location){
	$scope.user = {username: '',password: ''};
	$scope.error_message = '';
	$scope.login = function(){
		$http.post('/auth/login',$scope.user).success(function(data){
			if(data.state == "success"){
				$rootScope.authenticated = true;
				$rootScope.current_user = data.user.username;
				$location.path('/');
			}
			else{
				$scope.error_message = data.message;
			}
		});
	};
	$scope.register = function(){
		$http.post('/auth/signup',$scope.user).success(function(data){
			if(data.state == "success"){
				$rootScope.authenticated = true;
				$rootScope.current_user = data.user.username;
				$location.path('/');
			}
			else{
				$scope.error_message = data.message;
			}
		});
	};


})

