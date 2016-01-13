(function() {
    'use strict';

    angular
        .module('app.signup')
        .run(appRun);

    /* @ngInject */
    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/signup',
                config: {
                    templateUrl: 'signup/signup.html',
                    controller: 'SignUp',
                    controllerAs: 'vm',
                    title: 'signup',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> SignUp'
                    }
                }
            }
        ];
    }

})();