/* global toastr:false, moment:false */
( function( ) {
    'use strict';

    angular
        .module( 'app.core' )
        .constant( 'moment', moment )
        .constant( 'debugMode', true )
        .constant( 'config', {
            appName: 'app',
            appVersion: 0.1,
//             apiUrl: 'http://api.matoot.com/',
            //apiUrl: 'https://api.checkpointchallenge.com/',
            apiUrl: 'http://localhost/matoot/api/api_cloned/public/',
            expiredTokenErrorKey: 'expired_token',
            cookie: {
                name: 'CKPTMembers',
                daysExpires: 30,
                secure: false,
                //domain: ''
            }
        } )
        .constant( 'LOCALES', {
            'locales': {
                'es': 'Espaniol',
                'en': 'English',
                'fr': 'Français'
            },
            'preferredLocale': 'en'
        } );
} ) ( );
