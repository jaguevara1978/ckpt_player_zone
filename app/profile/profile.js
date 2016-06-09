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
function Profile( $rootScope, Notification, ApiService, $scope )  {
    var vm = this;

    vm.age = age;
    vm.update = update;
    vm.toggleCategory = toggleCategory;

    // 0 - OK Saved, 1 - Edited SavePending, 2 - Saving, -1 - Errors to fix
    vm.savingStatus = 0;
    vm.countCategoriesSelected = 0;

    initialize( );

    function initialize( ) {
/*
        vm.profile = {
            data: null
        };
*/

        get( );
    }

    function get( ) {
        ApiService.get( 'contact', '0' )
            .then( function ( response ) {
                if ( response.success ) {
                    vm.profile = response.data;

                    //console.log( vm.profile );

                    var birthdate = moment( vm.profile.data.birthdate );
                    vm.profile.birth = {
                        day: birthdate.get( 'date' ),
                        month: birthdate.get( 'month' ) + 1,
                        year: birthdate.get( 'year' )
                    };
                    
/*
                    vm.profile.form_extra.selected_categories = [ ];
                    for( var i = 0; i < vm.profile.form_extra.select_category.length; i++ ) { 
                        var category = vm.profile.form_extra.select_category[ i ];
                        if ( category.checked )
                            vm.profile.form_extra.selected_categories.push( category.challenge_category_seqid );
                    }
*/

                    countCategoriesSelected( );

//             console.log( vm.profile.data );
        $scope.$watchCollection( angular.bind( vm, function ( ) {
            return vm.profile.data;
        } ), function ( newValue, oldValue ) {
              if ( newValue !== oldValue) {
                console.log( newValue );
                vm.savingStatus = 1;
              }
        } );    

                } else {
                    Notification.error( response.message );
                    vm.savingStatus = -1;
                    return { };
                }
            });
    }

    function update( ) {
        var payload = {
            data: vm.profile.data
        };

        vm.savingStatus = 2;

        ApiService.put( 'contact', vm.profile )
            .then( function ( response ) {
                if ( response.success ) {
                    vm.data = response.data;

                    //console.log( payload );

                    var birthdate = moment( vm.data.birthdate );
                    vm.data.birth = {
                        day: birthdate.get( 'date' ),
                        month: birthdate.get( 'month' ) + 1,
                        year: birthdate.get( 'year' )
                    };
                    Notification.success( 'Your profile has been successfully updated' );
                    vm.savingStatus = 0;
                } else {
                    Notification.error( response.message );
                    vm.savingStatus = -1;

                    return { };
                }
            });
    }

    function age( ) {
        try {
            var birthdate = moment( { year: vm.profile.birth.year, month: vm.profile.birth.month, day: vm.profile.birth.day, hour :0, minute:0, second:0, millisecond:0} );
            return 'Age: ' + moment( ).diff( birthdate, 'years' );
        } catch( $e ) {
            return '';
        }
    }

    function fullName( ) { 
        return this.data.firstName + ' ' + this.data.lastName; 
    }

    function countCategoriesSelected( ) {
        vm.countCategoriesSelected = 0;
        try {
            for ( var i=0; i < vm.profile.form_extra.select_category.length; i++ ) {
                var cat = vm.profile.form_extra.select_category[ i ];
                if ( cat.checked ) vm.countCategoriesSelected++;
            }
        } catch( e ) {
            
        }
    }

    function toggleCategory( object ) {
        object.checked = !object.checked;
        countCategoriesSelected( );
    }
}
})();