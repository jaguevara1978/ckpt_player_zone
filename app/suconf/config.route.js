(function() {
    'use strict';

    angular
        .module('app.suconf')
        .run(appRun);

    /* @ngInject */
    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/suconf',
                config: {
                    templateUrl: 'suconf/suconf.html',
                    controller: 'SUConf',
                    controllerAs: 'vm',
                    title: 'suconf',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> SignUp'
                    }
                }
            }
        ];
    }

})();