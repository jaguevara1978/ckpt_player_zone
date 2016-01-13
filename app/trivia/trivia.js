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
        console.log( 'entro' );
        ApiService.get( 'challenge', 0 )
            .then( function( response ) {
                if ( response.success ) {
                    vm.data = response.data;
                    vm.aside = response.data;
                    CelebrationService.stopAnimation();
                    vm.feedback = false;
                    
                    console.log(vm.data);
                    $timeout(function() {
                        vm.question = true;
                    }, 600);
                } else {
                    FlashService.Error( response.message );
                }
            }
        );
/*
        TriviaService.getQuestion( $rootScope.globals.currentUser.id )
            .then(function (response) {
                    if (response.success) {
                        vm.aside = response.data;
                            CelebrationService.stopAnimation();
                        vm.feedback = false;
                        $timeout(function() {
                            vm.question = true;
                        }, 600);
                    } else {
                        FlashService.Error(response.message);
                    }
                }
            );
*/
}

    function validateAnswer(option) {
/*
		$scope.$broadcast('busy.begin');
		$timeout(function() {
			$scope.$broadcast('busy.end');
		}, 5000);
*/      vm.aside.option = option;
        TriviaService.validateAnswer(vm.aside)
            .then(function (response) {
                    if (response.success) {
                        vm.aside = response.data;
                        if (vm.aside.correct) {
                            // Celebration
                            CelebrationService.initHeader();
                            CelebrationService.initAnimation();
                        } else {
                            // Sorry about that
                            SorryService.initHeader();
                            //SorryService.initAnimation();
                        }
                        
                        vm.question = false;
                        $timeout(function() {
                            vm.feedback = true;
                		}, 600);
                    } else {
                        FlashService.Error(response.message);
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