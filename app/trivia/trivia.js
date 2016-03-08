( function ( ) {
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
function Trivia( ApiService, FireworksService, $location, $rootScope, FlashService, $scope, $timeout, $interval, $sce ) {
    var vm = this;
    var pointsAux = 0;
    var validatingAnswer = false;
    var challengeBoxHidden = false;

    var progressBar = document.getElementById( "count_down_bar" );
    var countDownTween;
    var pointsBar = document.getElementById( "points_bar" );
    //var pointsDiv = document.getElementById( "point-ckpt" );
    var rewardsBar = document.getElementById( "rewards_bar" );
    var container = document.getElementById( "container-ckpt" );
    var tl;
    var buttonToggleTL;
    var buttonToggle = document.getElementById( "btn-toggle" );
    var triviaBox = document.getElementById( "trivia-box" );
    var triviaContainer = document.getElementById( "trivia-container" );
    var challengeText = document.getElementById( "challenge_text" );
    var triviaContainerHeight;
    var greyOut = document.getElementById( "grey-out" );
    var scoreBarCKPT = document.getElementById("score-bar-ckpt");
    var feedBackBox = document.getElementById( "feedback-box" );
    var rewardBox = document.getElementById( "reward-box" );
    var rectButtonToggle = buttonToggle.getBoundingClientRect( );
    var rectPointsBar = pointsBar.getBoundingClientRect( );
    var rectRewardsBar = rewardsBar.getBoundingClientRect( );
    var rectTriviaBox = triviaBox.getBoundingClientRect( );


    // console.log( rectButtonToggle.top, rectButtonToggle.right, rectButtonToggle.bottom, rectButtonToggle.left);
    // console.log( rectTriviaBox );
    vm.validateAnswer = validateAnswer;
    vm.getQuestion = getQuestion;
    vm.trustSrc = trustSrc;
    vm.goToRewards = goToRewards;
    vm.questionOptionClass = questionOptionClass;
    vm.toggleTrivia = toggleTrivia;

    //console.log( rectPointsBar );

    // Flying objects parameters
    var speed = 5,
	winWidth = window.innerWidth,
	winHeight = window.innerHeight,
	start = { yMin:winHeight + 50, yMax:winHeight + 50, xMin:winWidth/2, xMax:winWidth/2, scaleMin:0.25, scaleMax:0.5, opacityMin:0.4, opacityMax:0.5 },
	mid = { yMin:winHeight * 0.3, yMax:winHeight * 0.5, xMin:75, xMax:400, scaleMin:0.5, scaleMax:0.75, opacityMin:0.5, opacityMax:8 },
	end = { yMin:rectPointsBar.top, yMax:rectPointsBar.top, xMin:rectPointsBar.left, xMax:rectPointsBar.left, scaleMin:0.75, scaleMax:1, opacityMin:0.8, opacityMax:1 },
	colors = [ "#003ed9","#00e6d7","#fb8100","#ef0000","#e849e0","#c7e105","#1bd51b","#2044e0" ];
    // Flying objects parameters

    initialize( );
 
 /* COINS FLYING TO THE POINTS BAR */
    function getPosition( element ) {
        var xPosition = 0;
        var yPosition = 0;
      
        while(element) {
            xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
            yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
            element = element.offsetParent;
        }
        return { x: xPosition, y: yPosition };
    }

	function range( map, prop ) {
		var min = map[ prop + "Min" ],
			max = map[ prop + "Max" ];
		return min + ( max - min ) * Math.random( );
	}

	function spawn( particle ) {
		var wholeDuration = ( 10 / speed ) * ( 0.7 + Math.random( ) * 0.4 ),
			delay = wholeDuration * Math.random( ),
			partialDuration = ( wholeDuration + 1 ) * ( 0.3 + Math.random( ) * 0.4 );

		//set the starting values
		TweenLite.set( particle, { y:range( start, "y" ), x:range( start, "x" ), scale:range( start, "scale" ), opacity:range( start, "opacity" ), visibility:"hidden", color:colors[ Math.floor( Math.random( ) * colors.length ) ] } );

		//the y tween should be continuous and smooth the whole duration
		TweenLite.to( particle, wholeDuration, { delay:delay, y:range( end, "y" ), ease:Linear.easeNone } );

		//now tween the x independently so that it looks more randomized (rather than linking it with scale/opacity changes too)
		TweenLite.to(particle, partialDuration, {delay:delay, x:range(mid, "x"), ease:Power1.easeOut});
		TweenLite.to(particle, wholeDuration - partialDuration, {delay:partialDuration + delay, x:range(end, "x"), ease:Power1.easeIn});

		//now create some random scale and opacity changes
		partialDuration = wholeDuration * (0.5 + Math.random() * 0.3);
		TweenLite.to(particle, partialDuration, {delay:delay, scale:range(mid, "scale"), autoAlpha:range(mid, "opacity"), ease:Linear.easeNone});
		TweenLite.to(particle, wholeDuration - partialDuration, {delay:partialDuration + delay, scale:range(end, "scale"), autoAlpha:range(end, "opacity"), ease:Linear.easeNone, onComplete:function( ) { particle.remove( ); }, onCompleteParams:[particle]});
	}

    function animate( howMany ) {
        for ( var i = 0 ; i < howMany; i++ ){
            var element = document.createElement( 'div' );
            element.className += "flying-coin";
            container.appendChild( element );
    		spawn( element );
        }
    }
 /* COINS FLYING TO THE POINTS BAR */

    function initialize( ) {
        getQuestion( );

        greyOut.onclick = function( ) {
            toggleTrivia( );
        };
        
        FireworksService.initialize( greyOut );
    }

    function trustSrc( src ) {
        return $sce.trustAsResourceUrl( src );
    }

    function getQuestion( ) {
        vm.showReward = false;
        vm.feedback = false;

        TweenLite.to( triviaContainer, 0, { bottom: "-500px" } );
        // TweenLite.to( progressBar, 0.1, { opacity: 0 } );
        TweenLite.to( greyOut, 0.1, { opacity: 0 } );
        TweenLite.to( scoreBarCKPT, 0.1, { opacity: 0 } );

        ApiService.get( 'challenge', 0 )
            .then( function( response ) {
                if ( response.success ) {
                    try {
                        vm.data.correct_answer_id = null;
                        vm.data.player_answer_id = null;
                   } catch( error ) { }

                    vm.data = response.data;
                    
                    //TODO Send from Service
                    vm.data.validation_time = 2;
                    vm.data.feedback_time = 2;
                    //TODO Send from Service

                    if ( vm.data.player_stats.accumulated_points <= 0 )
                        pointsAux = 0;
                    if ( vm.data.player_stats.accumulated_points > pointsAux ) {
                        pointsAux = vm.data.player_stats.accumulated_points;
                        animatePoints( );
                    }

                    vm.data.actual_time = vm.data.display_time;
                    
                    // Show progress of delayt time before showing the question
                    TweenLite.from( { }, vm.data.delay, {
                            //yoyo:true,
                            //repeat:-1,
                            force3D:true,
                            onUpdateParams: [ "{self}" ],
                            onUpdate: function( timeline ) {
                                TweenLite.set( progressBar, {
                                    scaleX:timeline.progress( ),
                                    transformOrigin: "0%"
                                });	
                        	}
                        });

                    $timeout( function( ) {
                        TweenLite.to( triviaContainer, 1, { ease: Expo.easeOut, bottom: 0 } );
                        // TweenLite.to( progressBar, 0.1, { opacity: 1 } );
                        TweenLite.to( greyOut, 0.5, { opacity: 0.3 } );
                        TweenLite.to( scoreBarCKPT, 0.5, {opacity: 1 } );
                        TweenMax.staggerFrom( ".trivia-options", 2, { scale: 0.5, opacity: 0, delay: 0.5, ease: Elastic.easeOut, force3D: true }, 0.2);
                        TweenLite.from( challengeText, 0.5, { scale: 0.5, opacity: 0, delay: 0.5, ease: Elastic.easeOut, force3D: true } );
                        
                        // vm.data.display_time: after this number of seconds I will validate the 
                        // answer as -1, which means unaswered
                        vm.timeout_promise = $timeout( function( ) {
                            validateAnswer( -1 );
                        }, vm.data.display_time * 1000 )
                        
                        //// Count down
                        countDownTween = TweenLite.from( { }, vm.data.display_time, {
                            //yoyo:true,
                            //repeat:-1,
                            force3D:true,
                            onUpdateParams: [ "{self}" ],
                            onUpdate: function( timeline ) {
                                TweenLite.set( progressBar, {
                                    scaleX:timeline.progress( ),
                                    transformOrigin: "100%"
                                });	
                        	}
                        });
                        //// Count down

                        validatingAnswer = false
                    },  vm.data.delay * 1000 );//vm.data.delay * 1000
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
        if ( vm.data.correct_answer_id == value )  {
            text = "btn-trivia btn-correct";
        } else if ( vm.data.correct_answer_id != value && vm.data.player_answer_id == value ) {
            text = "btn-trivia btn-wrong";
        } else if ( vm.data.correct_answer_id != value ) {
            text = "btn-trivia";
        }
        return text;
    }

    function validateAnswer( option ) {
        if ( validatingAnswer ) {
            return;
        }
        validatingAnswer = true;
        //vm.aside.option = option;
        //$interval.cancel( vm.countdown_promise );
        $timeout.cancel( vm.timeout_promise );
        countDownTween.kill( );

        var data = {
            tr_id: option
        }

        var shakeTween = TweenLite.fromTo( triviaContainer, vm.data.validation_time, { scale: 1 }, 
            { scale: 1.1, ease:RoughEase.ease.config( { strength: 2, points: 30, template:Bounce.easeIn, randomize:false } ), clearProps: "x" } );

        ApiService.post( 'challenge_process', data )
            .then( function( response ) {
                if ( response.success ) {
                    vm.data = MergeRecursive( vm.data, response.data );
                    vm.data.earned_points = vm.data.player_stats.accumulated_points - pointsAux;
                    if ( vm.data.earned_points <= 0 ) pointsAux = 0;
/*
                    console.log( 'After Validation:' );
                    console.log(vm.data);
*/
                    vm.feedback = false;

                    // Wait for seconds before showing feedback and everything else
                    $timeout( function( ) {
                        //To show hide Feedback object
                        vm.feedback = true;
                        shakeTween.kill( );
                        TweenLite.from( feedBackBox, 1, { ease: Expo.easeOut, scale: 0 } );
                        if ( vm.data.correct == 0 ) {
                            badFeedBack( );
                        } else {
                            goodFeedBack( );
                        }
                        if ( challengeBoxHidden ) {
                            toggleTrivia( );
                        }

                        if ( vm.data.earned_points > 0 ) {
                            animatePoints( );
                            pointsAux = vm.data.player_stats.accumulated_points;
                        }

                        // If there is a reward then I will show the reward object
                        if ( vm.data.reward !== null ) {
                            $timeout( function( ) {
                                // After 2 seconds no more feedback and show reward
                                vm.feedback = false;
                                vm.showReward = true;
                                animateRewards( );
                            }, vm.data.feedback_time * 1000 );
                        } else { }
                    }, vm.data.validation_time * 1000 );
                    
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


    function animatePoints( ) {
        if ( vm.data.earned_points > 0 ) {
            var repeat = Math.floor( vm.data.earned_points / 100 );

            if ( vm.data.correct ) {
                FireworksService.shoot( repeat );
            }
    
            animate( repeat );
        }
        TweenLite.to( pointsBar, 3, { delay:2, value: vm.data.player_stats.accumulated_points } );
        var tlpb = new TimelineLite( { } );
        tlpb.to( pointsBar, 1.5, { delay:1, ease: Circ.easeOut, height: '200%' } )
            .to( pointsBar, 1, { ease: Elastic.easeOut.config( 2, 0.2 ), height: '100%' } );
    }
    
    // Returns a random number between min (inclusive) and max (exclusive)
    function getRandomArbitrary( min, max ) {
        return Math.random( ) * ( max - min ) + min;
    }

    function animateRewards( ) {
        TweenLite.from( rewardBox, 2, { scale: 0, ease: Elastic.easeOut.config( 1, 0.3 ) } );

        var element = document.createElement( 'div' );
        element.className += "flying-reward";
        container.appendChild( element );
        TweenLite.set( element, { x:rectButtonToggle.left, y:rectButtonToggle.bottom } );
        //create a semi-random tween 
        var bezTween = new TweenMax( element, 2, {
            delay: 2,
            bezier:{
                type:"soft", 
                values:[ { x:rectRewardsBar.left + getRandomArbitrary( 3, 4 ) * rectRewardsBar.width, y:40 }, { x:rectRewardsBar.left, y:20 } ],
                autoRotate:true
            },
            ease:Expo.easeOut
            , onComplete:function( ) { container.removeChild( element ); }
        } );

        //TweenLite.to( rewardsBar, 3, { delay:2, value: vm.data.player_stats.accumulated_rewards } );
        var tlpb = new TimelineLite( { } );
        tlpb.to( rewardsBar, 1, { delay: 2, ease: Circ.easeOut, height: '150%' } )
            .to( rewardsBar, 1, { ease: Elastic.easeOut.config( 2, 0.2 ), height: '100%' } );
            

    }

    function getObjectHeight( obj ) {
        var divHeight;
        if ( obj.offsetHeight ) {
            divHeight=obj.offsetHeight;
        } else if ( obj.style.pixelHeight ) {
            divHeight=obj.style.pixelHeight;
        }
        return divHeight;
    }

    function toggleTrivia( ) {
        if ( challengeBoxHidden ) {
            challengeBoxHidden = false;
            buttonToggleTL.kill( );
            TweenLite.to( buttonToggle, 0.3, { className:"btn btn-toggle chevron-down" } );
            TweenLite.to( triviaContainer, 1, { bottom: 0 } );
            TweenLite.to( greyOut, 1, { ease: Circ.easeOut, opacity: 0.5, display: 'block' } );
            TweenLite.to( scoreBarCKPT, 1, { opacity: 1, display: 'block' } );
        } else {          
            challengeBoxHidden = true;
            triviaContainerHeight = getObjectHeight( triviaContainer );
            TweenLite.to( buttonToggle, 0.2, { className:"btn btn-toggle-up chevron-up fa-2x" } );
            TweenLite.to( triviaContainer, 1, { ease: Elastic.easeOut.config( 1, 0.3 ), bottom: -triviaContainerHeight + getObjectHeight( buttonToggle ) - 1 } );
            TweenLite.to( greyOut, 1, { ease: Circ.easeOut, opacity: 0, display: 'none' } );
            TweenLite.to( scoreBarCKPT, 1, { opacity: 0, display: 'none' } );

            buttonToggleTL = new TimelineMax( { repeat: 50, repeatDelay: 0.5 } );
            buttonToggleTL.to( buttonToggle, 0.5, { ease: Elastic.easeOut.config( 1, 0.3 ), scale: 1.1 } )
                .to( buttonToggle, 0.5, { ease: Elastic.easeOut.config( 1, 0.3 ), scale: 1 } );
        }
    }
    
    
    // Some Animation when wrong or no answer
    function badFeedBack( ) {
    }

    // Some Animation when good answer
    function goodFeedBack( ) {
    }
}
})();