(function () {
'use strict';

/**
 * @ngdoc service
 * @name app.DataService
 * @description
 * # Generic Service to be called for any web service call within the app. This avoid using
 * # using each specific service and keep all the services under control. Also to allow 
 * # maintenability and keep isolation between services.
 * Factory in the app.
 */
angular.module('app').factory('DataService', DataService);

    /*@ngInject*/
    function DataService($http, config) {
        var service = {};

        service.get = get;
        service.post = post;
        service.put = put;
        service.delete = delete;

        return service;

        function get(id) {
            return $http.get(config.apiUrl + 'getMember/?id=' + id).then(handleSuccess, handleError('Error getting user by id'));
        }


/******************************/
        function GetAll() {
            return $http.get(config.apiUrl + 'getAll').then(handleSuccess, handleError('Error getting all users'));
        }

        function GetByUsername(username) {
            return $http.get('/api/users/' + username).then(handleSuccess, handleError('Error getting user by username'));
        }

        function getByEmail(email) {
            return $http.get('/api/users/' + email).then(handleSuccess, handleError('Error getting user by email'));
        }
/**********************************/
        function get(id) {
            return $http.get(config.apiUrl + 'getMember/?id=' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function create(user) {
            return $http.post(config.apiUrl + 'memberCreate', user).then(handleSuccess, handleErrorResponse);
        }

        function login(user) {
            return $http.post(config.apiUrl + 'memberSignIn', user).then(handleSuccess, handleErrorResponse);
        }

        function update(user) {
            return $http.post(config.apiUrl + 'memberUpdate/', user).then(handleSuccess, handleErrorResponse);
        }
        
        function expressEntry(user) {
            return $http.post(config.apiUrl + 'expressEntry', user).then(handleSuccess, handleErrorResponse);
        }
/**********************************/
    

        function Delete(id) {
            return $http.delete('/api/users/' + id).then(handleSuccess, handleError('Error deleting user'));
        }

        // private functions

        function handleSuccess(data) {
            data.success = true;
            return data;
        }

        function handleErrorResponse(data) {
            return { success: false, message: data.data.msg };
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }

})();