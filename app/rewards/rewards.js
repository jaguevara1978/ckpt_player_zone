(function () {
'use strict';

/**
 * @ngdoc function
 * @name app.controller:Rewards
 * @description
 * # Rewards
 * Controller of the Rewards view
 */
angular.module('app.rewards').controller('Rewards', Rewards);

/*@ngInject*/
function Rewards( TriviaService, $rootScope, ApiService, FlashService ) {
    var vm = this;

    initController();

    function initController( ) {
        ApiService.get( 'language' )
            .then( function( response ) {
                if (response.success) {
                    vm.data = response.data;
                } else {
                    FlashService.Error( response.message );
                }
            }
        );

/*
        TriviaService.getCoupons($rootScope.globals.currentUser.id)
            .then(function (response) {
                    if (response.success) {
                        vm.coupons = response.data; 
                    } else {
                        FlashService.Error(response.message);
                    }
                }
            );
*/
    }
}
})();