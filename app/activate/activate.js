( function ( ) {
'use strict';

/**
 * @ngdoc function
 * @name app.controller:Activate
 * @description
 * # Activate
 * Controller of the activate view
 */
angular.module( 'app.activate' ).controller( 'Activate', Activate );

/*@ngInject*/
function Activate( $rootScope, $location, $routeParams, ApiService, AuthenticationService, Notification ) {
    var vm = this;
    vm.confirmSignUp = confirmSignUp;
    vm.loading = false;

    initController( );

    function initController( ) {
        if ( $routeParams.token ) {
            vm.loading = true;

            var token = Base64.encode( $routeParams.token );
    
            // I put the token here so it will be sent on the request's header
            $rootScope.globals = {
                currentUser: {
                    oauth: { access_token : token }
                }
            };

            // Unrestricted pages do not use navigation bar
            $rootScope.showMainNavBar = false;

            ApiService.get( 'auth', 'activate' )
                .then( function( response ) {
                    // Just for testing, REMOVE
/*
                    vm.data = {
                        siteKey: '6Lc1bg4TAAAAACYCPRXQa6p2FfAG0RNpe3Z2ECBs'
                    }
*/
                    if ( response.success ) {
                        vm.data = response.data;
                    } else {
                        Notification.error( response.message, 10000 );
                        // 1120 - Already activated account
                        if ( response.data.errorKey == 1120 ) {
                            $location.path( '/signin' );
                        }
                        if ( response.data.errorKey == 'invalid_token' ) {
                            $location.path( '/signup' );
                        }
                        // TODO - If expired token, offer to send a new one
                        if ( response.data.errorKey == 'expired_token' ) {
                            $location.path( '/signin' );
                        }
                    }

                    vm.loading = false;
                }
            );
        } else {
            $location.path( '/signup' );
        }
    }
    
    function confirmSignUp( ) {
        // console.log(vm.captcha_response);
        if( vm.captcha_response === '' || !vm.captcha_response ){ //if string is empty
            Notification.error( 'Please, resolve Captcha' );
        } else {
            vm.loading = true;
            //prepare payload for request
            //send g-captcah-reponse to our server
            vm.data.g_recaptcha_response = vm.captcha_response;
    
            ApiService.post( 'confirm_signup', vm.data )
                .then( function( response ) {
                    if ( response.success ) {
                        response.data.extra = {
                            player_setup: false
                        }
                        AuthenticationService.setCredentials( response.data );
                        $location.path( '/profile' );
                    } else {
                        Notification.Error( response.message );
                    }

                    vm.loading = false;
                }
            );
        }
    }
}

} )( );