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
function Activate( $rootScope, $location, $routeParams, ApiService, vcRecaptchaService, AuthenticationService, FlashService ) {
    var vm = this;
    vm.confirmSignUp = confirmSignUp;

    initController( );

    function initController( ) {
        if ( $routeParams.token ) {
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
                    vm.data = {
                        siteKey: '6Lc1bg4TAAAAACYCPRXQa6p2FfAG0RNpe3Z2ECBs'
                    }

                    if ( response.success ) {
                        vm.data = response.data;
                    } else {
                        //console.log( response );
                        FlashService.Error( response.message );
                        // 1120 - Already activated account
                        if ( response.data.errorKey == 1120 ) {
                            $location.path( '/signin' );
                        }
                        if ( response.data.errorKey == 'invalid_token' ) {
                            $location.path( '/signup' );
                        }
                        // TODO - If expired token, offer to send a new one
                        if ( response.data.errorKey == 'expired_token' ) {
                        }
                    }
                }
            );
        } else {
            $location.path( '/signup' );
        }
    }
    
    function confirmSignUp( ) {
        var response = vcRecaptchaService.getResponse( );
        if( response === '' ){ //if string is empty
            FlashService.Error( 'Please, resolve Captcha' );
        } else {
            //prepare payload for request
            //send g-captcah-reponse to our server
            vm.data.g_recaptcha_response = response;
    
            ApiService.post( 'confirm_signup', vm.data )
                .then( function( response ) {
                    if ( response.success ) {
                        AuthenticationService.setCredentials( response.data );
                        $location.path( '/profile' );
                    } else {
                        FlashService.Error( response.message );
                    }
                }
            );
        }
    }
}

} )( );