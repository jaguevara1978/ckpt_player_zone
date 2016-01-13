(function() {
    'use strict';

    angular
        .module('app.presignin')
        .run(appRun);

    /* @ngInject */
    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/presignin',
                config: {
                    templateUrl: 'presignin/presignin.html',
                    controller: 'PreSignIn',
                    controllerAs: 'vm',
                    title: 'presignin',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> presignin'
                    }
                }
            }
        ];
    }

})();