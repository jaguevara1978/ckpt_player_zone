(function () {
    'use strict';

/**
 * @ngdoc function
 * @name app.controller:Trivia
 * @description
 * # Trivia
 * Controller of the app
 */
angular.module( 'app.trivia' ).controller( 'Trivia', Trivia );

/*@ngInject*/
function Trivia( ApiService, CelebrationService, SorryService, $location, $rootScope, FlashService, $scope, $timeout, $sce ) {
    var vm = this;
    vm.validateAnswer = validateAnswer;
    vm.getQuestion = getQuestion;
    vm.trustSrc = trustSrc;
    vm.goToRewards = goToRewards;

    getQuestion( );
/*
// Main
initHeader( );
addListeners( );
initAnimation( );
*/
    function trustSrc( src ) {
        return $sce.trustAsResourceUrl( src );
    }

    function getQuestion( ) {
        vm.feedback = false;
        ApiService.get( 'challenge', 0 )
            .then( function( response ) {
                if ( response.success ) {
                    vm.data = response.data;

                    console.log( 'Get Question:' );
                    console.log(vm.data);
                } else {
                    FlashService.Error( response.message );
                }
            }
        );
    }

    function validateAnswer( option ) {
        //vm.aside.option = option;
        var data = {
            tr_id: option
        }        
        ApiService.post( 'challenge_process', data )
            .then( function( response ) {
                if ( response.success ) {
                    vm.data = response.data;
                   
                    console.log( 'After Validation:' );
                    console.log(vm.data);

                    // To show hide Feedback object
                    vm.feedback = true;
                    $timeout(function() {
                        vm.feedback = false;
                    }, 2000);
                } else {
                    console.log(response);
                    FlashService.Error( response.message );
                }
            }
        );
    }
    
    function goToRewards() {
        $location.path( '/rewards' );
    }

/*    
    //Validate iFrame
    function isAvailable(url, callback, timeout) {
        if (!+(timeout)||+(timeout)<0) {
            timeout=5000;
        }
        var timer=setTimeout(function() {
            ifr.remove();
            callback(false,url);
        },timeout);
        var ifr=$('<iframe></iframe>');
        ifr.hide();
        $('body').append(ifr);
        ifr.bind('load',function() {
            if (timer) clearTimeout(timer);
            var result;
            try {
                var doc=ifr[0].contentDocument.location.href;
                result=true;
            } catch(ex) {
                result=false;
            }
            ifr.remove();
            callback(result,url);
        });
        ifr.attr('src',url);
    }
*/
}
})();