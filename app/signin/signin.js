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
    vm.loading = false;
//     var loadingAnimation = document.getElementById( "loading-animation" );

    vm.login = login;
/*
    vm.validateVIPKey = validateVIPKey;
    vm.retrievePassword = retrievePassword;
*/

    vm.forgotpwd = false;

    initController( );

    if ($routeParams.id && $routeParams.pwd) {
        vm.user = {
            id: $routeParams.id,
            pwd: $routeParams.pwd
        };
        login( );
    }

    function initController() {
        // reset login status
        AuthenticationService.ClearCredentials();
    };

    function validateVIPKey( ) {
/*
        UserService.expressEntry( vm.user )
            .then(function ( response ) {
                if ( response.success ) {
                    FlashService.Success('Way to go!, Now you can be a part of the family!. How Cool is that?', true);
                    $location.path( '/signup' );
                } else {
                    FlashService.Error( response.message );
                }
            }
        );
*/
    }

    function login( ) {
        if ( !vm.loading ) {
            vm.loading = true;
            ApiService.post( 'auth', vm.user )
                .then(function ( response ) {
                    if ( response.success ) {
                        AuthenticationService.setCredentials( response.data );
                        $location.path( '/rewards' );
                    } else {
                        FlashService.Error( response.message );
                    }
                    vm.loading = false;
                }
            );
        }
    }

    function retrievePassword(  ) { }
}
})();