angular.module('app')
.service('sharedProperties', function() {
    var stringValue = null;
    var objectValue = {
        data: 'test object value'
    };
    
    return {
        getString: function() {
            return stringValue;
        },
        setCurrentUser: function(value) {
            console.log('shared fired,  ' + value);
            stringValue = value;

        },
        getObject: function() {
            return objectValue;
        }
    };
    
});


    // .service('sharedProperties', function () {
    //     var property = $scope.user.email;

    //     return {
    //         getProperty: function () {
    //             return property;
    //         },
    //         setProperty: function(value) {
    //             property = value;
    //         }
    //     };
    // });