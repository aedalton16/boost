angular.module('app').controller('SidenavCtrl', ['$scope', '$state','$rootScope', '$log', '$location', '$mdBottomSheet','$mdSidenav', '$mdDialog', 'socket',
  function($scope, $state, $rootScope, $log, $location, 
  	$mdBottomSheet, $mdSidenav, $mdDialog, $timeout, socket){
  
    $scope.socket = io.connect(); // HI HELLO HERE DUPCON
    // $scope.currentUser = '';
    
    $rootScope.$on("$locationChangeStart", function(event, next, current){
        if(!isCanvasSupported()){
            $log.info("routing to unsupported");
            $location.url('/unsupported');
        }
    });

    // *** mm dependency
    $scope.socket.on('user:login', function(message){
        $scope.currentUser = message.currentUser || $rootScope.currentUser; 
        console.log('user heard');
    });
    // $scope.state = $state;
    // console.log($state.includes('draw'));
    // console.log($scope.state);
     var self = this;

     $scope.topDirections = ['left', 'up'];
      $scope.bottomDirections = ['down', 'right'];

      $scope.isOpen = false;

      $scope.availableModes = ['md-fling', 'md-scale'];
      $scope.selectedMode = 'md-fling';

      $scope.availableDirections = ['up', 'down', 'left', 'right'];
      $scope.selectedDirection = 'up';
   
	$scope.toggleSidenav = function(menuId) {
		$mdSidenav(menuId).toggle();
	};

  
  // need to be moved / reduced 


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
      link : '#/chat',
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
      tooltip: 'default selector'
    },
    {
      mode: 'free',
      icon: 'glyphicon glyphicon-pencil',
      tooltip: 'free draw'
    },
    {
		mode: 'fill',
		icon: 'glyphicon glyphicon-tint',
		tooltip: 'fill shape'
    },
    {
    	mode: 'text',
		icon: 'fa fa-text-width',
		tooltip: 'insert text'
    }
  ];
  $scope.layer = [
    {
      mode: 'sendToBack',
      icon: 'fa fa-chevron-left',
      tooltip: 'object to back'
    },
    {
      mode: 'sendBackwards',
      icon: 'fa fa-chevron-left',
      tooltip: 'send object backwards'
    },
    {
    	mode: 'sendForwards',
    	icon: 'fa fa-chevron-right',
    	tooltip: 'send object forwards'
    },
    {// diff icons
    	mode: 'bringToFront',
    	icon: 'fa fa-chevron-right',
    	tooltip: 'object to front'
    }
  ];
  // better way to store!?
    $scope.shapes = [
    {
      mode: 'line',
      icon: 'fa fa-minus',
      tooltip: 'line tool'
    },
    {
      mode: 'circle',
      icon: 'fa fa-circle-o',
      tooltip: 'circle tool'
    },
    {
    	mode: 'triangle',
    	icon: 'fa fa-star-o',
    	tooltip: 'triangle tool'
    },
    {// diff icons
    	mode: 'rectangle',
    	icon: 'fa fa-square-o',
    	tooltip: 'rectangle tool'
    }
  ];


  $scope.adjust = [
    {
      mode: '1',
      icon: 'glyphicon glyphicon-plus',
      tooltip: 'increase width'
    },
    {
      mode: '-1',
      icon: 'glyphicon glyphicon-minus',
      tooltip: 'decrease width'
    }
  ];
// where can we put these
	$scope.clrs = [
		{
		  mode: 'red',
		  icon: 'fa fa-star',
		  tooltip: 'red',

		},
		{
		  mode: '#ff3399',
		  icon: 'fa fa-star',
		  tooltip: 'pink'
		},
		{
		  mode: '#ff9933',
		  icon: 'fa fa-star',
		  tooltip: 'orange'
		},
		{
		  mode: '#ffff00',
		  icon: 'fa fa-star',
		  tooltip: 'yellow'
		},
			{
		  mode: '#00ffff',
		  icon: 'fa fa-star',
		  tooltip: 'cyan'
		},
		{
		  mode: '#9900cc',
		  icon: 'fa fa-star',
		  tooltip: 'purple'
		},
			{
		  mode: 'black',
		  icon: 'fa fa-star',
		  tooltip: 'black'
		},
		{
		  mode: 'white',
		  icon: 'fa fa-star',
		  tooltip: 'white'
		},
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

$scope.remoteChangeMode = function(message){ //scope.socket
  $scope.socket.emit('remote:change', message);
  console.log('socket emit fired');
};

$scope.remoteLayer= function(message){ //scope.socket
  $scope.socket.emit('remote:layer', message);
  console.log('socket emit fired');
};
// accomp in one? maybe send json {message: --, command: --} **TODO
$scope.remoteAdjust= function(message){ //scope.socket
  $scope.socket.emit('remote:adjust', message);
  // console.log('socket emit fired');
};

$scope.remoteChangeColor= function(message){ //scope.socket
  $scope.socket.emit('remote:adjust', message);
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
