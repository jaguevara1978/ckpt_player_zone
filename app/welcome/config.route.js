(function() {
    'use strict';

    angular
        .module('app.welcome')
        .run(appRun);

    /* @ngInject */
    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/welcome',
                config: {
                    templateUrl: 'welcome/welcome.html',
                    controller: 'Welcome',
                    controllerAs: 'vm',
                    title: 'welcome',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> SignUp'
                    }
                }
            }
        ];
    }

})();