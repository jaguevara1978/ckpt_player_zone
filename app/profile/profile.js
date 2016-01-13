(function () {
'use strict';

/**
 * @ngdoc function
 * @name app.controller:Profile
 * @description
 * # LoginCtrl
 * Controller of the app
 */
angular.module('app.profile').controller('Profile', Profile);


Profile.$inject = ['$rootScope', '$scope', '$location', 'FlashService', 'UserService', '$timeout'];

function Profile($rootScope, $scope, $location, FlashService, ApiService, $timeout) {
    var vm = this;
    vm.age = age;

    function age(birthdate) {
      var birthday = +new Date(birthdate);
      return ~~((Date.now() - birthday) / (31557600000));
    }

    angular.extend(this, {
        id:  $rootScope.globals.currentUser.id,
        data: {},
        fullName: function() { 
            return this.data.firstName + ' ' + this.data.lastName; 
        }
    });
    
    angular.extend(this, {
        get: function() {
            ApiService.get( 'language' )
                .then(function (response) {
                    if (response.success) {
                        $scope.data = response.data;
                    } else {
                        FlashService.Error(response.message);
                        return {};
                    }
                });
        },
        update: function() {
            /*UserService.update($scope.data)
                .then(function (response) {
                    if (response.success) {
                        FlashService.Success('My profile was successfully updated');
                    } else {
                        FlashService.Error(response.message);
                    }
                });
                */
        }   
    });

    this.get();
}
})();