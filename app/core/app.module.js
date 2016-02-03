(function () {
    'use strict';

    /**
     * @ngdoc overview
     * @name app
     * @description
     * # app
     *
     * Main module of the application.
     */
    angular.module('app', [
        /*
         * Order is not important. Angular makes a
         * pass to register all of the modules listed
         * and then when app.dashboard tries to use app.data,
         * it's components are available.
         */

        ,'ngAnimate'
        ,'ngFx'
        ,'ngCookies'
        ,'ngResource'
        ,'ngRoute'
        ,'ngSanitize'
        ,'ngTouch'
        ,'ngBusy'
        /*,'mgcrea.ngStrap.helpers.dimensions'
        ,'mgcrea.ngStrap.tooltip'
        ,'mgcrea.ngStrap.popover'*/
        ,'mgcrea.ngStrap.alert'
        ,'mgcrea.ngStrap.aside'
        ,'mgcrea.ngStrap.modal'
        ,'mgcrea.ngStrap.popover'
        ,'ngPasswordStrength'
        ,'toaster'
        // ,'pascalprecht.translate' // Bower: angular-translate-handler-log, angular-translate-loader-static-files, angular-translate-storage-cookie, angular-translate-storage-local depends on angular-translate
        // ,'tmh.dynamicLocale' // angular-dynamic-locale

        /*
         * Everybody has access to these.
         * We could place these under every feature area,
         * but this is easier to maintain.
         */
        ,'app.core'
        ,'app.widgets'

        /*
         * Feature areas
         */
        ,'app.activate'
        ,'app.layout'
        ,'app.signin'
        ,'app.signup'
        ,'app.welcome'
        ,'app.rewards'
        ,'app.suconf'
        ,'app.profile'
        ,'app.trivia'
        ,'app.contests'
        ,'app.tradings'
      ])
    .config( config )
    .run( run );

    /*@ngInject*/
        // ******** i18n Stuff - it is working but better use it later, Not Yet **********
//     function config( $routeProvider, $httpProvider, $translateProvider, tmhDynamicLocaleProvider, config ) {
    function config( $routeProvider, $httpProvider, config ) {
        $routeProvider
          .otherwise( {
            redirectTo: '/signin'
          } );
          
        $httpProvider.interceptors.push( 'HttpInterceptorService' );

        // Adding asynchronous loading for the translations
/*
        // ******** i18n Stuff - it is working but better use it later, Not Yet **********

        $translateProvider.useMissingTranslationHandlerLog( );
        $translateProvider.useStaticFilesLoader( {
            prefix: 'content/resources/locale-',// path to translations files
            suffix: '.json'// suffix, currently- extension of the translations
        } );
        $translateProvider.registerAvailableLanguageKeys( [ 'en', 'fr', 'es' ], {
           'en_*': 'en',
           'fr_*': 'fr',
           'es_*': 'es'
        } );
        $translateProvider.determinePreferredLanguage( );
        
        // If the language does not exist, then I put English by default
        $translateProvider.fallbackLanguage( 'en' );
        
        // $translateProvider.preferredLanguage( 'en_US' );// is applied on first load
        $translateProvider.useLocalStorage( );// saves selected language to localStorage

        // Enable escaping of HTML - Security
        $translateProvider.useSanitizeValueStrategy( 'escapeParameters' );
*/

        // Direction of where to load the $locale settings files for angular-dynamic-locale
//         tmhDynamicLocaleProvider.localeLocationPattern( 'bower_components/angular-i18n/angular-locale_{{locale}}.js' );

    }

    /*@ngInject*/
//     function run( $rootScope, $location, $cookies, $http, config, $injector, $translate, $window ) {
    function run( $rootScope, $location, $cookies, $http, config, $injector, $window ) {
        
/*
        // ******** i18n Stuff - it is working but better use it later, Not Yet **********
        // Set Browser language by default      
        var lang = $window.navigator.language || $window.navigator.userLanguage; 
        // Apply the browsers language
        $translate.use( lang );
        //console.log( lang );
        $rootScope.changeLanguage = function( ) {
            // if the browser detects a language such as fr_BE 
            // it will try to fall back to fr and then once again en
            if( /[a-z]{2}_[A-Z]{2}/.test( $translate.use( ) ) ) {
                $translate.fallbackLanguage( $translate.use( ).split( '_' )[ 0 ]);
            }
        }
        // Set Browser language by default      
*/

        //When url is /activate
        if ( $location.path( ) == '/activate' ) {
            $cookies.remove( config.cookie.name );
        }
        // keep user logged in after page refresh
        $rootScope.globals = $cookies.getObject( config.cookie.name ) || {};

        // Uncomment this only for Test Authentication purposes,
        // this is to add an already expired token
        //$rootScope.globals.currentUser.oauth.access_token = Base64.encode( 'ec06ee6b6ec6506707ef7b255c91fe957a64a9bc' );

        $rootScope.$on( '$locationChangeStart', function ( event, next, current ) {
            try {
                // redirect to login page if not logged in and trying to access a restricted page
                var restrictedPage = $.inArray( $location.path( ), [ '/signin', '/signup', '/suconf' ] ) === -1;
                // Other thatn the paths listed in the previous array, are restricted pages.
                if ( restrictedPage ) {
                    //When url is /activate
                    restrictedPage = $location.path( ).indexOf( '/activate' ) < 0;
                }

                if ( !$rootScope.loggedIn ) {    
                    try {
                        if ( $rootScope.globals.currentUser.user ) {
                            $rootScope.loggedIn = true;
                        }
                    } catch ( error ) {
                        $rootScope.loggedIn = false;
                    }
                }

                // console.log( 'entro' );
                if ( restrictedPage && !$rootScope.loggedIn ) {
                    $location.path( '/signin' );
                }

                $rootScope.showMainNavBar = $location.path( ) !== "/trivia";
            } catch( error ) {
                // console.log( 'error' );
                $location.path( '/signin' );
            }
        });
    }

/*
    (function () {
        var root = $(document.getElementsByTagName('body'));
        var watchers = [];

        var f = function (element) {
            if (element.data().hasOwnProperty('$scope')) {
                angular.forEach(element.data().$scope.$$watchers, function (watcher) {
                    watchers.push(watcher);
                });
            }

            angular.forEach(element.children(), function (childElement) {
                f($(childElement));
            });
        };

        f(root);

        console.log("How many watchers?: " + watchers.length);
    })();
*/
})();