(function() {
    'use strict';

    angular
        .module('app.profile')
        .run(appRun);

    /* @ngInject */
    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/profile',
                config: {
                    templateUrl: 'profile/profile.html',
                    controller: 'Profile',
                    controllerAs: 'vm',
                    title: 'profile',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> '
                    }
                }
            }
        ];
    }

})();