(function () {
'use strict';

/**
 * @ngdoc service
 * @name app.APIInterceptorService
 * @description
 * # APIInterceptorService
 * Factory in the app.
 */
angular.module( 'app' ).factory( 'HttpInterceptorService', HttpInterceptorService );

    // intercept for oauth tokens
    /* @ngInject */
    function HttpInterceptorService( $q, $rootScope, $injector, $location, $cookies, config ) {
            return {
               // Pre-Request
                'request': function( request ) {
                    if ( request.url.indexOf( config.apiUrl ) >= 0 ) {
                        try {
                            var access_token = Base64.decode( $rootScope.globals.currentUser.oauth.access_token );
                            request.headers[ 'Authorization' ] = 'Bearer ' + access_token; // jshint ignore:line
                        } catch( error ) {
                            $location.path( '/signin' );
                        }
                        //console.log( 'Request_API_After: ' );
                        //console.log( request );
                    }
                    return request;
                },

                // Response Error Interceptor
                'responseError': function( rejection ) {
                    try {
                        // error - was it 401 or something else?
                        if ( rejection.status === 401 && rejection.data.errorKey === config.expiredTokenErrorKey ) {
                            console.log( 'API_ResponseError: ***' );
                            console.log( rejection );
                            var deferred = $q.defer( ); // defer until we can re-request a new token 

                            // Get a new token... ( cannot inject $http directly as will cause a circular ref )
                            $injector.get( "$http" ).get( config.apiUrl + 'auth/' + rejection.data.errorKey )
                                .then( function( response ) {
                                    if ( response.data ) {

                            console.log( 'New Token: ***' );
                            console.log( response.data.oauth );

                                        response.data.oauth.access_token = Base64.encode( response.data.oauth.access_token );

                                        $rootScope.globals = {
                                            currentUser: {
                                                oauth: response.data.oauth
                                            }
                                        };

                                        // This will set the expiration to 30 days
                                        $cookies.putObject( config.cookie.name, $rootScope.globals, 
                                            { 
                                                'expires': moment( ).add( config.cookie.daysExpires, 'days' ).calendar( ) , 
                                                'secure': config.cookie.secure
                                            }
                                        );
                  
                                        // Now we have a new oauth token - set at $rootScope
                                        // let's retry the original request - transformRequest in .run() below will add the new OAuth token
                                        $injector.get( "$http" )( rejection.config )
                                            .then( function( response ) {

                                                //console.log( 'Successful: ***' );
                                                //console.log( response );

                                                // we have a successful response - resolve it using deferred
                                                deferred.resolve( response );

                                            }, function( response ) {

                                                //console.log( 'Problemful: ***' );
                                                //console.log( response );

                                                deferred.reject(); // something went wrong
                                            } );
                                    } else {
                                        deferred.reject( ); // No response from Auth Service didn't give us data
                                    }
                                }, function( response ) {
                                    //console.log( 'Problemful 2: ***' );
                                    //console.log( response );

                                    deferred.reject( ); // token retry failed, redirect so user can login again

                                    $location.path( '/signin' );

                                    return;
                                } );

                            return deferred.promise; // return the deferred promise
                        }
                    } catch ( error ) {
                        $location.path( '/signin' );
                    }

                    return $q.reject( rejection );
                }
            };
    }
} )();