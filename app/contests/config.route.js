(function() {
    'use strict';

    angular
        .module('app.contests')
        .run(appRun);

    /* @ngInject */
    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/contests',
                config: {
                    templateUrl: 'contests/contests.html',
                    controller: 'Contests',
                    controllerAs: 'vm',
                    title: 'contests',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> contests'
                    }
                }
            }
        ];
    }

})();