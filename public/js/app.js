'use strict';

var angular = require('angular');
var io = require('socket.io-client');

// All angular wiring goes here, so you can see exactly where each dependency is
// Follow the require() trails for the actual logic
// This way no one gets lost!

// Create modules
angular.module('boost.users', []);
angular.module('boost.welcome', []);
angular.module('boost.about', ['boost.users']);
angular.module('boost.chats', ['boost.welcome', 'boost.users']);
angular.module('boost.drawings', ['boost.welcome', 'boost.users']);

// Register services TODO: prefer inline array annotation here for DI, so you can see where wirings lead
angular.module('boost.users').factory('AuthService', require('./services/AuthService'));
angular.module('boost.users').service('sharedProperties', require('./services/currentUser'));
angular.module('boost.welcome').factory('socket', require('./services/sockets'));
angular.module('boost.chats').filter('interpolate', ['version', require('./services/chatFilter')]);
angular.module('boost.drawings').factory('Drawing', ['$resource', require('./services/Drawing')]);

// Register controllers
angular.module('boost.about').controller('AboutCtrl', ['$scope', 'sharedProperties', require('./controllers/AboutCtrl')]);
angular.module('boost.chats').controller('ChatCtrl', ['$scope', "socket", 'sharedProperties', require('./controllers/ChatCtrl')]);
angular.module('boost.drawings').controller('DrawingCtrl', [
  '$scope', 
  '$route', 
  '$routeParams', 
  'Drawing',
  'socket', 
  'sharedProperties',
  require('./controllers/DrawingCtrl')
]);
angular.module('boost.users').controller('LoginCtrl', require('./controllers/LoginCtrl'));
angular.module('boost.users').controller('SignupCtrl', require('./controllers/SignupCtrl'));
angular.module('boost.welcome').controller('WelcomeCtrl', ['$scope', '$location', 'Drawing', 'socket', require('./controllers/WelcomeCtrl')]);

var app = angular.module('boost', [
  require('angular-route'), 
  require('angular-resource'), 
  require('angular-cookies'), 
  require('angular-sanitize'),
  //require('angular-http-auth'), 
  //require('angular-ui-bootstrap'), 
  'boost.welcome',
  'boost.about', 
  'boost.users', 
  'boost.drawings', 
  'boost.chats'
]); 

// setup our routes
app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/welcome', {
    templateUrl: 'views/about/about.tpl.html'
  })
  .when('/draw', {
    templateUrl: 'views/welcome/welcome.tpl.html'
  })
  .when('/profile', {
    templateUrl: 'views/user/profile.tpl.html'
  })
  .when('/drawings/:drawingId', {
    templateUrl: 'views/drawings/drawing.tpl.html'
  })
  .when('/login', {
    templateUrl: 'views/user/login.tpl.html',
    controller: 'LoginCtrl'
  })
  .when('/signup', {
    templateUrl: 'views/user/signup.tpl.html',
    controller: 'SignupCtrl'
  })
  .when('/unsupported', {
    templateUrl: 'unsupported.html'
  })
  .otherwise({
    templateUrl: 'views/about/about.tpl.html'
  });
}]);


// app.run(function ($rootScope, $location, Auth) {

//     //watching the value of the currentUser variable.
//     $rootScope.$watch('currentUser', function(currentUser) {
//       // if no currentUser and on a page that requires authorization then try to update it
//       // will trigger 401s if user does not have a valid session
//       if (!currentUser) {
//         Auth.currentUser();
//       }
//     })
// });

// is this nec 
app.controller('MainController', [
  '$scope', 
  '$rootScope', 
  '$log', 
  '$location', 
  function($scope, $rootScope, $log, $location){

    $scope.socket = io.connect(); // HI HELLO HERE DUPCON

    $rootScope.$on("$locationChangeStart", function(event, next, current){
      if(!isCanvasSupported()){
        $log.info("routing to unsupported");
        $location.url('/unsupported');
      }
    });

  }
]);


// TODO: use angular log 
window.console = window.console || (function(){
  var c = {}; c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function(){};
  return c;
})();

// TODO: add mdrnizer
function isCanvasSupported(){
  var elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
}
