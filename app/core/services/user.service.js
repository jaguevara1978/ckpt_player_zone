(function () {
'use strict';

/**
 * @ngdoc service
 * @name app.UserService
 * @description
 * # UserService
 * Factory in the app.
 */
angular.module('app').factory( 'UserService', UserService );

    /*@ngInject*/
    function UserService( $http, $cookies, config ) {
        var service = {},
            currentUser = null;

        return service;

        service.setCurrentUser = setCurrentUser;
        service.getCurrentUser = getCurrentUser;

        function setCurrentUser( user ) {
            currentUser = user;
            store.set( 'user', user );
            return currentUser;
        };
    
        function getCurrentUser( ) {
            if ( !currentUser ) {
                console.log( $cookies.get( config.cookieName ).currentUser );
                currentUser = $cookies.get( config.cookieName ).currentUser || { };
            }
            return currentUser;
        };
    }

})();