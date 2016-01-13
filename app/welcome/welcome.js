(function () {
'use strict';

/**
 * @ngdoc function
 * @name app.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the app
 */
angular.module('app.welcome').controller('Welcome', Welcome);

Welcome.$inject = ['UserService', '$rootScope'];
function Welcome(UserService, $rootScope) {
    var vm = this;

    vm.user = {};
    vm.allUsers = [];
    vm.deleteUser = deleteUser;

    initController();

    function initController() {
        loadCurrentUser();
    }

    function loadCurrentUser() {
        vm.user.name = $rootScope.globals.currentUser.name;
        /*UserService.GetByUsername($rootScope.globals.currentUser.username)
            .then(function (user) {
                console.log(user);
                vm.user = user;
            });
        */
    }

    function loadAllUsers() {
        UserService.GetAll()
            .then(function (users) {
                vm.allUsers = users;
            });
    }

    function deleteUser(id) {
        UserService.Delete(id)
        .then(function () {
            loadAllUsers();
        });
    }
}
})();