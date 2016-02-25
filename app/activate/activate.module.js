( function( ) {
    'use strict';

    angular
        .module( 'app.activate', [ 'noCAPTCHA' ] )
        .config( config );
        /*@ngInject*/
        function config( $routeProvider, $httpProvider, config, noCAPTCHAProvider ) {
            noCAPTCHAProvider.setSiteKey( '6Lc1bg4TAAAAACYCPRXQa6p2FfAG0RNpe3Z2ECBs' );
        }

} )( );