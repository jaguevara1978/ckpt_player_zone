(function() {
    'use strict';

    angular
        .module('app.trivia')
        .run(appRun);

    /* @ngInject */
    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/trivia',
                config: {
                    templateUrl: 'trivia/trivia.html',
                    controller: 'Trivia',
                    controllerAs: 'vm',
                    title: 'trivia',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> trivia'
                    }
                }
            }
        ];
    }

})();