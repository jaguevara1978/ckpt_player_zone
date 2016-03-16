( function( ) {
    'use strict';

angular.module( 'app.layout' ).controller( 'Shell', Shell );

/*@ngInject*/
function Shell( ApiService, config ) {
    /*jshint validthis: true */
    var vm = this;

    vm.title = config.appTitle;

    initialize( );

    function initialize( ) {
        ApiService.get('contact_rewards').then(function(response) {
            if (response.success) {
                vm.data = response.data;
                //console.log( vm.data );
            } else {
                Notification.Error(response.message);
            }
        });
    }    
}

} ) ( );
