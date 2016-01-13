(function () {
'use strict';

/**
 * @ngdoc function
 * @name app.controller:PreSignIn
 * @description
 * # PreSignIn
 * Controller of the app
 */
angular.module('app.presignin').controller('PreSignIn', PreSignIn);

/*@ngInject*/

/*@ngInject*/
function PreSignIn($rootScope, $scope, $location, AuthenticationService, FlashService, UserService, $routeParams, $timeout) {
    var vm = this;

    vm.login = login;

    if ($routeParams.id && $routeParams.pwd) {
        vm.user = {
            id: $routeParams.id,
            pwd: $routeParams.pwd
        };
        login();
    }

    (function initController() {
        // reset login status
        AuthenticationService.ClearCredentials();
        $rootScope.matootLoggedIn = false;
    })();

    function login() {
        // simulate the busy event calls normally provided by the http interceptor provided with this module
/*		$scope.$broadcast('busy.begin');
		$timeout(function() {
			$scope.$broadcast('busy.end');
		}, 5000);
*/

        vm.dataLoading = true;
        UserService.login(vm.user)
            .then(function (response) {
                if (response.success) {
                    AuthenticationService.SetCredentials(response.data);
                    $rootScope.matootLoggedIn = true;
                    $location.path('/signin');
                    //FlashService.Success('Sign In successful', true);
                    //$location.path('/main');
                } else {
                    FlashService.Error(response.message);
                    vm.dataLoading = false;
                }
            }
        );
    };
}
})();