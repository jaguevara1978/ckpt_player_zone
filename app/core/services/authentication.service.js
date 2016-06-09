(function () {
'use strict';

/**
 * @ngdoc service
 * @name app.AuthenticationService
 * @description
 * # AuthenticationService
 * Factory in the app.
 */
angular.module('app').factory( 'AuthenticationService', AuthenticationService );

    /* @ngInject */
    function AuthenticationService( $http, $cookies, $rootScope, $timeout, $location, config, ApiService, Notification ) {
        var service = { };

        service.signIn = signIn;
        service.setCredentials = setCredentials;
        service.ClearCredentials = ClearCredentials;

        return service;

        function signIn( credentials ) {
            ApiService.post( 'auth', credentials )
                .then(function ( response ) {
                    if ( response.success ) {
                        setCredentials( response.data );
                        $location.path( '/rewards' );
                    } else {
                        Notification.error( response.message );
                    }
                }
            );
        }

        function setCredentials( data ) {
            try {
                data.oauth.access_token = Base64.encode( data.oauth.access_token );
    
                //$rootScope.loggedIn = true;
                $rootScope.globals = {
                    currentUser: {
                        oauth: data.oauth,
                        user: data.user,
                    }
                };
    
                //$http.defaults.headers.common[ 'Authorization' ] = 'Basic ' + authdata; // jshint ignore:line
    
                // This will set the expiration to 30 days
                $cookies.putObject( config.cookie.name, $rootScope.globals, 
                    { 
                        'expires': moment( ).add( config.cookie.daysExpires, 'days' ).calendar( ) , 
                        'secure': config.cookie.secure
                    }
                );
                
            } catch ( error ) {
                console.log( error );
                Notification.error( error );
            }
        }

        function ClearCredentials() {
            $rootScope.loggedIn = false;
            $rootScope.globals = { };
            $cookies.remove( config.cookie.name );
            //$http.defaults.headers.common.Authorization = 'Basic ';
        }
    }

} )( );