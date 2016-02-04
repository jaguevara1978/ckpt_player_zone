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
function Trivia( ApiService, CelebrationService, SorryService, $location, $rootScope, FlashService, $scope, $timeout, $interval, $sce ) {
    var vm = this;
    vm.validateAnswer = validateAnswer;
    vm.getQuestion = getQuestion;
    vm.trustSrc = trustSrc;
    vm.goToRewards = goToRewards;
    vm.questionOptionClass = questionOptionClass;

    getQuestion();

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
        vm.showReward = false;
        vm.feedback = false;

        TweenMax.to(triviaContainer, 0.1, {bottom: "-500px",});
        TweenMax.to(greyOut, 0.1, {opacity: "0",});
        TweenMax.to(scoreBarCKPT, 0.1, {opacity: "0",});

        ApiService.get( 'challenge', 0 )
            .then( function( response ) {
                if ( response.success ) {
                    try {
                        vm.data.correct_answer_id = null;
                        vm.data.player_answer_id = null;
                        // countDownClass();
                   } catch( error ) { }
                    vm.data = response.data;

                    TweenMax.to(triviaContainer, 0.5, {bottom: "0",delay: 2});
                    TweenMax.to(greyOut, 0.5, {opacity: "0.5",delay: 2});
                    TweenMax.to(scoreBarCKPT, 0.5, {opacity: "1",delay: 2});

                    vm.data.actual_time = vm.data.display_time;
                    
                    $timeout( function() {
                    vm.countdown_promise = $interval( function( ) {
                         vm.data.actual_time--;
                         if ( vm.data.actual_time == 0 ) {
                            $interval.cancel( vm.countdown_promise );
                         }
                    }, 1000 );
                }, 2000 );

                    vm.timeout_promise = $timeout( function() {
                        validateAnswer(-1);
                    }, vm.data.display_time * 1000)




/*
                    console.log( 'Get Question:' );
                    console.log(vm.data);
*/

                } else {
                    FlashService.Error( response.message );
                }
            }
        );


    }

    function questionOptionClass( value ) {
        var text = '';
        if ( vm.data.correct_answer_id == value)  {
            text = "btn-trivia btn-correct";
        } else if (vm.data.correct_answer_id != value && vm.data.player_answer_id == value) {
            text = "btn-trivia btn-wrong";
        } else if (vm.data.correct_answer_id != value ) {
            text = "btn-trivia";
        }
        return text;
    }

    function validateAnswer( option ) {
        //vm.aside.option = option;
        $interval.cancel( vm.countdown_promise );
        $timeout.cancel( vm.timeout_promise );
        var data = {
            tr_id: option
        }
        ApiService.post( 'challenge_process', data )
            .then( function( response ) {
                if ( response.success ) {
                    vm.data = MergeRecursive( vm.data, response.data );
/*
                    console.log( 'After Validation:' );
                    console.log(vm.data);
*/
                    vm.feedback = false;

                    $timeout( function( ) {
                        //To show hide Feedback object
                        vm.feedback = true;

                        // If there is a reward then I will show the reward object
                        if (vm.data.reward !== null) {
                            $timeout(function() {
                                // After 2 seconds no more feedback and show reward
                                vm.feedback = false;
                                vm.showReward = true;
                            }, 2000);
                        } else {}

                    }, 2000);
                } else {
                   FlashService.Error( response.message );
                }
            }
        );
    }

    /*
    * Recursively merge properties of two objects
    */
    function MergeRecursive(obj1, obj2) {

      for (var p in obj2) {
        try {
          // Property in destination object set; update its value.
          if ( obj2[p].constructor==Object ) {
            obj1[p] = MergeRecursive(obj1[p], obj2[p]);

          } else {
            obj1[p] = obj2[p];

          }

        } catch(e) {
          // Property in destination object not set; create it and set its value.
          obj1[p] = obj2[p];

        }
      }
      return obj1;
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