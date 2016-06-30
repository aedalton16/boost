var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'ngAria','ngRoute', 'ngResource', 'ngMaterial','ngCookies', 'ngSanitize','http-auth-interceptor', 'welcome','about', 'users', 'drawings', 'chats']); // HERE INSTANTIATE

// setup our routes
app.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider ) {
     // ** MAKE SURE TO SWITCH OVER COMPREHENSIVELY 
   
  $stateProvider
        .state('welcome', {
            url:'/welcome', //change to about
            templateUrl: 'views/about/about.tpl.html',
            controller: 'WelcomeController'
        })
        .state('draw', {
            url: '/draw',
            templateUrl: 'views/welcome/welcome.tpl.html'
        })
        .state('drawing', {
            url: '/drawings/:drawingId',
            templateUrl: 'views/drawings/drawing.tpl.html'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'views/user/login.tpl.html',
            controller: 'LoginCtrl'
        })
        .state('about',{
            url: '/about',
            templateUrl: 'views/about/about.tpl.html',
            controller: 'SignupCtrl'
            // controller: 'SignupCtrl'
        })
        .state('signup',{
            url: '/signup',
            templateUrl: 'views/user/signup.tpl.html',
            // controller: 'SignupCtrl'
            controller: 'SignupCtrl'
        })
        .state('profile', { // like this??
            url: '/auth/users/:userId',
            templateUrl: 'views/user/profile.tpl.html'
        });
        $urlRouterProvider.otherwise('/welcome');
    }]);


app.run(function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
});

app.config(function ($mdThemingProvider) { // **
    var cornellRedMap = $mdThemingProvider.extendPalette('blue', {
        '500': '#ff4081',
        'contrastDefaultColor': 'light'
    });
    // Register the new color palette map with the name <code>cornellRed</code>
    $mdThemingProvider.definePalette('cornellRed', cornellRedMap);
    // Use that theme for the primary intentions
    $mdThemingProvider.theme('default')
      .primaryPalette('cornellRed');
});


app.controller('AppCtrl', ['$scope', '$rootScope', '$log', '$location', '$mdBottomSheet','$mdSidenav', '$mdDialog', 'sharedProperties',function($scope, $rootScope, $log, $location, $mdBottomSheet, $mdSidenav, $mdDialog, sharedProperties){
  
    $scope.socket = io.connect(); // HI HELLO HERE DUPCON

    $scope.stringValue = sharedProperties.getString();
    $rootScope.$on("$locationChangeStart", function(event, next, current){
        if(!isCanvasSupported()){
            $log.info("routing to unsupported");
            $location.url('/unsupported');
        }
    });


  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };
    $scope.menu = [
    {
      link : '',
      title: 'Dashboard',
      icon: 'dashboard'
    },
    {
      link : '/draw',
      title: 'Profile',
      icon: 'group'
    },
    {
      link : '',
      title: 'Messages',
      icon: 'message'
    }
  ];
  $scope.admin = [
    {
      link : '',
      title: 'Trash',
      icon: 'delete'
    },
    {
      link : 'showListBottomSheet($event)',
      title: 'Settings',
      icon: 'settings'
    }
  ];

  $scope.showListBottomSheet = function($event) {
    $scope.alert = '';
    $mdBottomSheet.show({
      template: '<md-bottom-sheet class="md-list md-has-header"> <md-subheader>Settings</md-subheader> <md-list> <md-item ng-repeat="item in items"><md-item-content md-ink-ripple flex class="inset"> <a flex aria-label="{{currentUser}}" ng-click="listItemClick($index)"> <span class="md-inline-list-icon-label">{{ item.name }}</span> </a></md-item-content> </md-item> </md-list></md-bottom-sheet>',
      controller: 'ListBottomSheetCtrl',
      targetEvent: $event
    }).then(function(clickedItem) {
      $scope.alert = clickedItem.name + ' clicked!';
    });
  };

// need in a partial and or a service  
  $scope.showAdd = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      template: '<md-dialog aria-label="Mango (Fruit)"> <md-content class="md-padding"><span flex></span> <h1 >Personalized (Launchpad!) Modal Coming Soon! {{$scope.currentUser}} !</h1></md-dialog>',
      
      targetEvent: ev,
    })
    .then(function(answer) {
      $scope.alert = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.alert = 'You cancelled the dialog.';
    });
  };
}]);

app.controller('ListBottomSheetCtrl', function($scope, $mdBottomSheet) {
  $scope.items = [
    { name: 'Share', icon: 'share' },
    { name: 'Upload', icon: 'upload' },
    { name: 'Copy', icon: 'copy' },
    { name: 'Print this page', icon: 'print' },
  ];
  
  $scope.listItemClick = function($index) {
    var clickedItem = $scope.items[$index];
    $mdBottomSheet.hide(clickedItem);
  };
});

function DialogController($scope, $mdDialog) {
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
};

app.directive('userAvatar', function() {
  return {
    replace: true,
    template: '<svg class="user-avatar" viewBox="0 0 128 128" height="64" width="64" pointer-events="none" display="block" > <path fill="#FF8A80" d="M0 0h128v128H0z"/> <path fill="#FFE0B2" d="M36.3 94.8c6.4 7.3 16.2 12.1 27.3 12.4 10.7-.3 20.3-4.7 26.7-11.6l.2.1c-17-13.3-12.9-23.4-8.5-28.6 1.3-1.2 2.8-2.5 4.4-3.9l13.1-11c1.5-1.2 2.6-3 2.9-5.1.6-4.4-2.5-8.4-6.9-9.1-1.5-.2-3 0-4.3.6-.3-1.3-.4-2.7-1.6-3.5-1.4-.9-2.8-1.7-4.2-2.5-7.1-3.9-14.9-6.6-23-7.9-5.4-.9-11-1.2-16.1.7-3.3 1.2-6.1 3.2-8.7 5.6-1.3 1.2-2.5 2.4-3.7 3.7l-1.8 1.9c-.3.3-.5.6-.8.8-.1.1-.2 0-.4.2.1.2.1.5.1.6-1-.3-2.1-.4-3.2-.2-4.4.6-7.5 4.7-6.9 9.1.3 2.1 1.3 3.8 2.8 5.1l11 9.3c1.8 1.5 3.3 3.8 4.6 5.7 1.5 2.3 2.8 4.9 3.5 7.6 1.7 6.8-.8 13.4-5.4 18.4-.5.6-1.1 1-1.4 1.7-.2.6-.4 1.3-.6 2-.4 1.5-.5 3.1-.3 4.6.4 3.1 1.8 6.1 4.1 8.2 3.3 3 8 4 12.4 4.5 5.2.6 10.5.7 15.7.2 4.5-.4 9.1-1.2 13-3.4 5.6-3.1 9.6-8.9 10.5-15.2M76.4 46c.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6-.9 0-1.6-.7-1.6-1.6-.1-.9.7-1.6 1.6-1.6zm-25.7 0c.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6-.9 0-1.6-.7-1.6-1.6-.1-.9.7-1.6 1.6-1.6z"/> <path fill="#E0F7FA" d="M105.3 106.1c-.9-1.3-1.3-1.9-1.3-1.9l-.2-.3c-.6-.9-1.2-1.7-1.9-2.4-3.2-3.5-7.3-5.4-11.4-5.7 0 0 .1 0 .1.1l-.2-.1c-6.4 6.9-16 11.3-26.7 11.6-11.2-.3-21.1-5.1-27.5-12.6-.1.2-.2.4-.2.5-3.1.9-6 2.7-8.4 5.4l-.2.2s-.5.6-1.5 1.7c-.9 1.1-2.2 2.6-3.7 4.5-3.1 3.9-7.2 9.5-11.7 16.6-.9 1.4-1.7 2.8-2.6 4.3h109.6c-3.4-7.1-6.5-12.8-8.9-16.9-1.5-2.2-2.6-3.8-3.3-5z"/> <circle fill="#444" cx="76.3" cy="47.5" r="2"/> <circle fill="#444" cx="50.7" cy="47.6" r="2"/> <path fill="#444" d="M48.1 27.4c4.5 5.9 15.5 12.1 42.4 8.4-2.2-6.9-6.8-12.6-12.6-16.4C95.1 20.9 92 10 92 10c-1.4 5.5-11.1 4.4-11.1 4.4H62.1c-1.7-.1-3.4 0-5.2.3-12.8 1.8-22.6 11.1-25.7 22.9 10.6-1.9 15.3-7.6 16.9-10.2z"/> </svg>'
  };
});


app.config(function($mdThemingProvider) {
  var customBlueMap =       $mdThemingProvider.extendPalette('light-blue', {
    'contrastDefaultColor': 'light',
    'contrastDarkColors': ['50'],
    '50': 'ffffff'
  });
  $mdThemingProvider.definePalette('customBlue', customBlueMap);
  $mdThemingProvider.theme('default')
    .primaryPalette('customBlue', {
      'default': '500',
      'hue-1': '50'
    })
    .accentPalette('pink');
  $mdThemingProvider.theme('input', 'default')
        .primaryPalette('grey')
});


app.directive('resize', function ($window) {
    return function (scope, element) {
        var w = angular.element($window);
        scope.getWindowDimensions = function () {
            return { 'h': w.height(), 'w': w.width() };
        };
        scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
            scope.windowHeight = newValue.h;
            scope.windowWidth = newValue.w;

            scope.style = function () {
                return { 
                    'height': (newValue.h - 100) + 'px',
                    'width': (newValue.w - 100) + 'px' 
                };
            };

        }, true);

        w.bind('resize', function () {
            scope.$apply();
        });
    }
})


// app.controller('DemoCtrl', function() {
//        this.topDirections = ['left', 'up'];
//       this.bottomDirections = ['down', 'right'];
//       this.isOpen = false;
//       this.availableModes = ['md-fling', 'md-scale'];
//       this.selectedMode = 'md-fling';
//       this.availableDirections = ['up', 'down', 'left', 'right'];
//       this.selectedDirection = 'up';
//   });


// app.directive('toggle', function(){
//   return {
//     restrict: 'A',
//     link: function(scope, element, attrs){
//       if (attrs.toggle=="tooltip"){
//         $(element).tooltip();
//       }
//       if (attrs.toggle=="popover"){
//         $(element).popover();
//       }
//     }
//   };
// })




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