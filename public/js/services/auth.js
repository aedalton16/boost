angular.module('welcome').factory('Auth', function Auth($location, $rootScope, Session, User, $cookieStore) {
    $rootScope.currentUser = $cookieStore.get('user') || null;
    $cookieStore.remove('user');

    return {


		currentUser: function() {
			Session.get(function(user) {
				$rootScope.currentUser = user;
			});
		}

    }
})