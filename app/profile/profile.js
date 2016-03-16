( function ( ) {
'use strict';

/**
 * @ngdoc function
 * @name app.controller:Profile
 * @description
 * # LoginCtrl
 * Controller of the app
 */
angular.module( 'app.profile' ).controller( 'Profile', Profile );

/*@ngInject*/
function Profile( $rootScope, Notification, ApiService )  {
    var vm = this;
    vm.age = age;
    vm.update = update;
    vm.get = get;

//     vm.id = $rootScope.globals.currentUser.id,

    get( );

    function age( birthdate ) {
        var birthday = +new Date( birthdate );
        return ~~( ( Date.now( ) - birthday ) / ( 31557600000 ) );
    }

    function get( ) {
        ApiService.get( 'contact', '0' )
            .then( function ( response ) {
                if ( response.success ) {
                    vm.data = response.data;
                    console.log( vm.data );
                } else {
                    Notification.Error( response.message );
                    return { };
                }
            });
    }

    function update( ) {
        
    }

    function fullName( ) { 
        return this.data.firstName + ' ' + this.data.lastName; 
    }
}
})();