(function() {
    'use strict';

    angular
        .module('app.module_name')
        .run(appRun);

    /* @ngInject */
    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/module_name',
                config: {
                    templateUrl: 'module_name/module_name.html',
                    controller: 'module_controller',
                    controllerAs: 'vm',
                    title: 'module_name',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> module_name'
                    }
                }
            }
        ];
    }

})();