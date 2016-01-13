(function () {
'use strict';

/**
 * @ngdoc function
 * @name app.controller:SignIn
 * @description
 * # SignIn
 * Controller of the app
 */
angular.module('app.signin').controller('SignIn', SignIn);

/*@ngInject*/
function SignIn( $rootScope, $scope, $location, AuthenticationService, FlashService, UserService, $routeParams, ApiService ) {
    var vm = this;

    vm.login = login;
    vm.validateVIPKey = validateVIPKey;
    vm.retrievePassword = retrievePassword;

    vm.forgotpwd = false;

    initController( );

    if ($routeParams.id && $routeParams.pwd) {
        vm.user = {
            id: $routeParams.id,
            pwd: $routeParams.pwd
        };
        login();
    }

    function initController() {
        // reset login status
        AuthenticationService.ClearCredentials();
    };

    function validateVIPKey() {
        UserService.expressEntry(vm.user)
            .then(function (response) {
                if (response.success) {
                    FlashService.Success('Way to go!, Now you can be a part of the family!. How Cool is that?', true);
                    $location.path('/signup');
                } else {
                    FlashService.Error(response.message);
                }
            }
        );
    }

    function login() {
        // simulate the busy event calls normally provided by the http interceptor provided with this module
/*		$scope.$broadcast('busy.begin');
		$timeout(function() {
			$scope.$broadcast('busy.end');
		}, 5000);
*/
        AuthenticationService.signIn( vm.user );
    }

    function retrievePassword(  ) {
        UserService.retrievePassword( vm.user )
            .then( function ( response ) {
                if ( response.success ) {
                    FlashService.Success( response.data.msg );
                    vm.forgotpwd = false;
                } else {
                    FlashService.Error( response.message );
                }
            }
        );
    }
}
})();