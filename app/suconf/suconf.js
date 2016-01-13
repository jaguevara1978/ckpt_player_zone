(function () {
    'use strict';

/**
 * @ngdoc function
 * @name app.controller:SUConf
 * @description
 * # SUConf
 * Controller of the app
 */
angular.module('app.suconf').controller('SUConf', SignUpConfirmCtroller);

/*@ngInject*/
function SignUpConfirmCtroller(UserService, $location, $rootScope, FlashService, $scope) {
    var vm = this;

    vm.name = $rootScope.globals.name;    
    vm.email = $rootScope.globals.email;    
    
    // Unrestricted pages do not use navigation bar
    $rootScope.showMainNavBar = false;

}
})();