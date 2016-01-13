(function () {
'use strict';

/**
 * @ngdoc function
 * @name app.controller:module_controller
 * @description
 * # module_controller
 * Controller of the module_name view
 */
angular.module('app.module_name').controller('module_controller', module_controller);

/*@ngInject*/
function module_controller($rootScope) {
    var vm = this;

    initController();

    function initController() {
    }
}

})();