(function() {
    'use strict';

    angular
        .module('app.rewards')
        .run(appRun);

    /* @ngInject */
    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/rewards',
                config: {
                    templateUrl: 'rewards/rewards.html',
                    controller: 'Rewards',
                    controllerAs: 'vm',
                    title: 'rewards',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> SignUp'
                    }
                }
            }
        ];
    }

})();