( function( ) {
    'use strict';

    angular
        .module( 'app.activate' )
        .run( appRun );

    /* @ngInject */
    function appRun( routehelper ) {
        routehelper.configureRoutes( getRoutes( ) );
    }

    function getRoutes( ) {
        return [
            {
                url: '/activate/:token',
                config: {
                    templateUrl: 'activate/activate.html',
                    controller: 'Activate',
                    controllerAs: 'vm',
                    title: 'activate',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> activate'
                    }
                }
            }
        ];
    }

} )( );