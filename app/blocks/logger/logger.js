(function() {
    'use strict';

    angular
        .module('blocks.logger')
        .factory('logger', logger);

    /* @ngInject */
    function logger($log, debugMode) {
        var service = {
            showToasts: true,

            error   : error,
            info    : info,
            success : success,
            warning : warning,

            // straight to console; bypass toastr
            log     : $log.log
        };

        if (debugMode) {
/*            toastr.options = {
              "closeButton": false,
              "debug": false,
              "newestOnTop": false,
              "progressBar": false,
              "positionClass": "toast-bottom-right",
              "preventDuplicates": false,
              "onclick": null,
              "showDuration": "300",
              "hideDuration": "1000",
              "timeOut": "5000",
              "extendedTimeOut": "1000",
              "showEasing": "swing",
              "hideEasing": "linear",
              "showMethod": "fadeIn",
              "hideMethod": "fadeOut"
            }
*/
        }

        return service;
        /////////////////////

        function error(message, data, title) {
            if (debugMode) {
                //toaster.error(message, title);
                $log.error('Error: ' + message, data);
            }
        }

        function info(message, data, title) {
            if (debugMode) {
                //toaster.info(message, title);
                $log.info('Info: ' + message, data);
            }
        }

        function success(message, data, title) {
            if (debugMode) {
                //toaster.success(message, title);
                $log.info('Success: ' + message, data);
            }
        }

        function warning(message, data, title) {
            if (debugMode) {
                //toaster.warning(message, title);
                $log.warn('Warning: ' + message, data);
            }
        }
    }
}());
