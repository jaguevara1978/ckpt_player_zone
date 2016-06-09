( function( ) {
    'use strict';

angular.module( 'app.layout' ).controller( 'Shell', Shell );

/*@ngInject*/
function Shell( $location, $scope, ApiService, config ) {
    var vm = this;

    vm.title = config.appTitle;
    vm.goPlay = goPlay;

    $scope.$on( "$routeChangeSuccess", function ( ) {
        initialize( );
    });

    function initialize( ) {
        ApiService.get('contact_rewards').then(function(response) {
            if (response.success) {
                vm.data = response.data;
                //console.log( vm.data );
            } else {
                Notification.error(response.message);
            }
        });
    }

    function goPlay( ) {
        $location.path( '/trivia' );
    }
}

} ) ( );
