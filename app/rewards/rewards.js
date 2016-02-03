(function() {
    'use strict';
    /**
     * @ngdoc function
     * @name app.controller:Rewards
     * @description
     * # Rewards
     * Controller of the Rewards view
     */
    angular.module('app.rewards').controller('Rewards', Rewards); /*@ngInject*/

    function Rewards(TriviaService, $rootScope, ApiService, FlashService) {
        var vm = this;
        initController();

        function initController() {
            // ******* i18n Stuff *******
            // ApiService.get( 'language' )
            //     .then( function( response ) {
            //         if (response.success) {
            //             vm.data = response.data;
            //         } else {
            //             FlashService.Error( response.message );
            //         }
            //     }
            // );
            // ******* i18n Stuff *******
            getRewards();
        }

        function getRewards() {
            ApiService.get('contact_rewards').then(function(response) {
                if (response.success) {
                    vm.data = response.data;
                } else {
                    FlashService.Error(response.message);
                }
            });
        }
    }
})();