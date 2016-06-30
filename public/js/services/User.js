'use strict';

// angular.module('users')
//   .factory('User', function ($resource) {
//     return $resource(
//     	'/users/:id/', {
//     		userId: '@_id'
//     	},
//       {
//         'update': {
//           method:'PUT'
//         }
//       });
//   });

angular.module('users')
  .factory('User', function ($resource) {
    return $resource('/auth/users/:id/', {},
      {
        'update': {
          method:'PUT'
        }
      });
  });

