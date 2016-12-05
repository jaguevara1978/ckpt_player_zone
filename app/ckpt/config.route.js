(function() {
    'use strict';

    angular
        .module('app.ckpt')
        .run(appRun);

    /* @ngInject */
    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/ckpt',
                config: {
                    templateUrl: 'ckpt/ckpt.html',
                    controller: 'Ckpt',
                    controllerAs: 'vm',
                    title: 'ckpt',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> trivia'
                    }
                }
            }
        ];
    }

})();