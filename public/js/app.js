var app = angular.module('app', ['ngRoute', 'ngResource', 'welcome','about', 'drawings', 'chats']); // HERE INSTANTIATE

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
            when('/drawings/:drawingId', {
                templateUrl: 'views/drawings/drawing.tpl.html'
            }).
            when('/unsupported', {
                templateUrl: 'unsupported.html'
            }).
            otherwise({
                templateUrl: 'views/about/about.tpl.html'
            });
    }]);

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