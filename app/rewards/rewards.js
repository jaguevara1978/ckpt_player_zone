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

    function Rewards( TriviaService, $rootScope, ApiService, Notification ) {
        var vm = this;
        
        var rewards_title = document.getElementById( 'rewards_title' );
        initController();

        function initController() {
            // Glowing Rewards Title
            TweenMax.to( rewards_title, 1,
                {
                    repeat: -1
                    ,yoyo: true
                    ,textShadow: '0 0 10px #FFF, 0 0 20px #FFF, 0 0 30px #FFF, 0 0 40px #FFFFFF, 0 0 70px #FFFFFF, 0 0 80px #FFFFFF, 0 0 100px #FFFFFF, 0 0 150px #FFFFFF'
                }
            );
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
                    // console.log( vm.data );
                } else {
                    Notification.Error(response.message);
                }
            });
        }
    }
})();