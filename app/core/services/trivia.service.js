(function () {
'use strict';

/**
 * @ngdoc service
 * @name app.TriviaService
 * @description
 * # TriviaService
 * Factory in the app.
 */
angular.module('app').factory('TriviaService', TriviaService);

    /*@ngInject*/
    function TriviaService($http, config) {
        var service = {};

        service.getQuestion = getQuestion;
        service.validateAnswer = validateAnswer;
        service.getCoupons = getCoupons;

        return service;

        function getQuestion(id) {
            return $http.get(config.apiUrl + 'getQuestion/?id=' + id).then(handleSuccess, handleErrorResponse);
        }

        function validateAnswer(data) {
            return $http.post(config.apiUrl + 'validateAnswer', data).then(handleSuccess, handleErrorResponse);
        }
        
        function getCoupons(id) {
            return $http.get(config.apiUrl + 'getCoupons/?id=' + id).then(handleSuccess, handleErrorResponse);
        }

        // private functions
        function handleSuccess(data) {
            data.success = true;
            return data;
        }

        function handleErrorResponse(data) {
            try {
                return { success: false, message: data.data.msg };            
            } catch (error) {
                return handleError('Oops!, Something bad happened far away from here. Could you please give us a warning about it?');
            }
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }

})();