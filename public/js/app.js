var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'ngRoute', 'ngResource', 'ngCookies', 'ngSanitize','http-auth-interceptor', 'welcome','about', 'users', 'drawings', 'chats']); // HERE INSTANTIATE

// setup our routes
app.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/draw');
        $stateProvider.
        state('welcome', {
            url: '/welcome', 
            templateUrl: 'views/about/about.tpl.html'
        })
        .state('draw', {
            url: '/draw',
            templateUrl: 'views/welcome/welcome.tpl.html'
        })
        .state('state3', {
            url: '/profile',
            templateUrl: 'views/user/profile.tpl.html'
        }).
        state('state4', {
            url: '/drawings/:drawingId',
                templateUrl: 'views/drawings/drawing.tpl.html'
            }
        );
   
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
app.controller('MainController', ['$scope', '$rootScope', '$log', '$location', function($scope, $rootScope, $log, $location){

    $scope.socket = io.connect(); // HI HELLO HERE DUPCON

    
    
    $rootScope.$on("$locationChangeStart", function(event, next, current){
        if(!isCanvasSupported()){
            $log.info("routing to unsupported");
            $location.url('/unsupported');
        }
    });

}]);
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