angular.module('app').controller('SidenavCtrl', ['$scope', '$rootScope', '$log', '$location', '$mdBottomSheet','$mdSidenav', '$mdDialog', 'sharedProperties', 'socket',
  function($scope, $rootScope, $log, $location, $mdBottomSheet, $mdSidenav, $mdDialog, sharedProperties, socket){
  
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
      link : '#/auth/users/:userId',
      title: 'Dashboard',
      icon: 'dashboard'
    },
    {
      link : '#/draw',
      title: 'Classrooms',
      icon: 'group'
    },
    { //fill
      link : '',
      title: 'Messages',
      icon: 'message'
    }
  ];
  $scope.admin = [
    {
      link : '',
      title: 'Reports',
      icon: 'delete'
    },
    {
      link : 'showListBottomSheet($event)',
      title: 'Settings',
      icon: 'settings'
    }
  ];
  $scope.kit = [
    {
      mode: 'default',
      icon: 'fa fa-hand-pointer-o',
      tooltip: ''
    },
    {
      mode: 'free',
      icon: 'fa fa-glide-g',
      tooltip: ''
    },
    {
		mode: 'fill',
		icon: 'fa fa-hand-pointer-o',
		tooltip: ''
    },
    {
    	mode: 'text',
		icon: 'fa fa-text-width',
		tooltip: ''
    },
    {
    	mode: 'default',
		icon: 'fa fa-hand-pointer-o',
		tooltip: ''
    }
  ];

  	// this.topDirections = ['left', 'up'];
   //    this.bottomDirections = ['down', 'right'];
   //    this.isOpen = false;
   //    this.availableModes = ['md-fling', 'md-scale'];
   //    this.selectedMode = 'md-fling';
   //    this.availableDirections = ['up', 'down', 'left', 'right'];
   //    this.selectedDirection = 'up';

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

$scope.socketEmit = function(message){ //scope.socket
  socket.emit('remote:change', message);
  // console.log('socket emit fired');
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
