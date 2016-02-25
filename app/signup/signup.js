(function () {
    'use strict';

/**
 * @ngdoc function
 * @name app.controller:SignUp
 * @description
 * # SignUp
 * Controller of the app
 */
angular.module( 'app.signup' ).controller( 'SignUp', SignUp );

/*@ngInject*/
function SignUp( $location, $rootScope, ApiService, FlashService, $scope, AuthenticationService ) {
    var vm = this;
    vm.showPassword = false;
    vm.loading = false;

    // Unrestricted pages do not use navigation bar
    $rootScope.showMainNavBar = false;

    vm.user = null;

    //For testing purposes only
/*
    vm.user = {
        data: {
            fname: 'Alex',
            lname: 'Guevara',
            primary_email: 'aguevara@matoot.com',
        }, 
        extra: {
            password: 'pass'
        }
    };
*/
   //For testing purposes only



    vm.signup = signup;

    var data = {
        oauth: {
            access_token: 'access_token'
        }
    };
    AuthenticationService.setCredentials( data );

    function signup( ) {
        vm.loading = true;
        ApiService.post( 'contact', vm.user )
            .then( function ( response ) {
                $location.path( '/signup' );
                console.log( response );
                if ( response.success ) {
                    $rootScope.globals.name = vm.user.data.fname;
                    $rootScope.globals.email = vm.user.data.primary_email;

                    vm.user = null;

                    vm.loading = false;
                    FlashService.Success( 'We have just sent you an e-mail confirmation. Please, take a look.', 20000 );
                } else {
                    vm.loading = false;
                    FlashService.Error( response.message, 20000 );
                }
            });
    }
}
})();