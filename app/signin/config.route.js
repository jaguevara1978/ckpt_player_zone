(function() {
    'use strict';

    angular
        .module('app.signin')
        .run(appRun);

    /* @ngInject */
    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/signin',
                config: {
                    templateUrl: 'signin/signin.html',
                    controller: 'SignIn',
                    controllerAs: 'vm',
                    title: 'signin',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> SignIn'
                    }
                }
            },
            {
                url: '/signin/:id/:pwd',
                config: {
                    templateUrl: 'signin/signin.html',
                    controller: 'SignIn',
                    controllerAs: 'vm',
                    title: 'signin',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> SignIn'
                    }
                }
            }
        ];
    }

})();