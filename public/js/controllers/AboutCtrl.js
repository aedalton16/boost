'use strict';

var AboutCtrl = function($scope, sharedProperties){
	$scope.stringValue = sharedProperties.getString();
};

module.exports = AboutCtrl;

