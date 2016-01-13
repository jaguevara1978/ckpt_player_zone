(function() {
    'use strict';

    angular
        .module('app.tradings')
        .run(appRun);

    /* @ngInject */
    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/tradings',
                config: {
                    templateUrl: 'tradings/tradings.html',
                    controller: 'Tradings',
                    controllerAs: 'vm',
                    title: 'tradings',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> tradings'
                    }
                }
            }
        ];
    }

})();