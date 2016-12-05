( function( ) {
    'use strict';

angular.module( 'app.layout' ).controller( 'Shell', Shell );

/*@ngInject*/
function Shell( $location, $scope, $rootScope, $sce, ApiService, config, Notification ) {
    var vm = this;

    vm.title = config.appTitle;
    vm.goPlay = goPlay;
    vm.trustSrc = trustSrc;

    $scope.$on( "$routeChangeSuccess", function ( ) {
        initialize( );
    });

    function initialize( ) {
/*
        ApiService.get('contact_rewards').then(function(response) {
            if (response.success) {
                vm.data = response.data;
                try {
                    if ( $rootScope.globals.currentUser.extra.player_setup == false ) {
                        Notification.warning( 'You need to set-up your profile before going to the game.' );
                    }
                } catch ( e ) {
                    
                }
                //console.log( vm.data );
            } else {
                Notification.error(response.message);
            }
        });
*/
    }

    function goPlay( ) {
        $location.path( '/trivia' );
    }

    function trustSrc( src ) {
        console.log( src );
        return $sce.trustAsResourceUrl( src );
    }

}

} ) ( );
