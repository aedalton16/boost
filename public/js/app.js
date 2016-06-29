var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'ngAria','ngRoute', 'ngResource', 'ngMaterial','ngCookies', 'ngSanitize','http-auth-interceptor', 'welcome','about', 'users', 'drawings', 'chats']); // HERE INSTANTIATE

// setup our routes
app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/welcome', {
                templateUrl: 'views/about/about.tpl.html'
            }).
            when('/draw', {
                templateUrl: 'views/welcome/welcome.tpl.html'
            }).
            when('/profile', {
                templateUrl: 'views/user/profile.tpl.html'
            }).
            when('/drawings/:drawingId', {
                templateUrl: 'views/drawings/drawing.tpl.html'
            }).
            when('/login', {
                templateUrl: 'views/user/login.tpl.html',
                controller: 'LoginCtrl'
            }).
            when('/signup', {
                templateUrl: 'views/user/signup.tpl.html',
                controller: 'SignupCtrl'
            }).
            when('/unsupported', {
                templateUrl: 'unsupported.html'
            }).
            otherwise({
                templateUrl: 'views/about/about.tpl.html'
            });
    }]);


app.controller('MainController', ['$scope', '$rootScope', '$log', '$location', function($scope, $rootScope, $log, $location){

    $scope.socket = io.connect(); // HI HELLO HERE DUPCON

    
    
    $rootScope.$on("$locationChangeStart", function(event, next, current){
        if(!isCanvasSupported()){
            $log.info("routing to unsupported");
            $location.url('/unsupported');
        }
    });

}]);
// app.controller('DemoCtrl', function() {
//        this.topDirections = ['left', 'up'];
//       this.bottomDirections = ['down', 'right'];
//       this.isOpen = false;
//       this.availableModes = ['md-fling', 'md-scale'];
//       this.selectedMode = 'md-fling';
//       this.availableDirections = ['up', 'down', 'left', 'right'];
//       this.selectedDirection = 'up';
//   });


app.directive('toggle', function(){
  return {
    restrict: 'A',
    link: function(scope, element, attrs){
      if (attrs.toggle=="tooltip"){
        $(element).tooltip();
      }
      if (attrs.toggle=="popover"){
        $(element).popover();
      }
    }
  };
})




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