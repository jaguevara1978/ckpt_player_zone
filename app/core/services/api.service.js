(function () {
'use strict';

/**
 * @ngdoc service
 * @name app.CommonService
 * @description
 * # CommonService, must be used by all the controllers to establish connection to the API
 * Factory in the app.
 */
angular.module('app').factory( 'ApiService', ApiService );

    /*@ngInject*/
    function ApiService( $http, config ) {
        var service = {};

        service.get = get;
        service.post = post;
        service.put = put;
//         service.Delete = Delete;

        return service;

/**********************************/
        function get( entity, id ) {
            if ( typeof id === 'undefined') {
                id = '';
            } else {
                id = '/' + id;
            }
            return $http.get( config.apiUrl + entity + id).then( handleSuccess, handleErrorResponse );
        }

        function post( entity, data ) {
            return $http.post( config.apiUrl + entity, data ).then( handleSuccess, handleErrorResponse );
        }

        function put( entity, data ) {
            return $http.put( config.apiUrl + entity + '/0', data ).then( handleSuccess, handleErrorResponse );
        }

/**********************************/

        // Private functions
        function handleSuccess( data ) {
            data.success = true;
            return data;
        }

        function handleErrorResponse( data ) {
            return { success: false, message: data.data.msg, data: data.data };
        }

        function handleError( error ) {
            return function ( ) {
                return { success: false, message: error };
            };
        }
    }

})();