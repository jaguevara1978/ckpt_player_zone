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
function Trivia( ApiService, FireworksService, Utils, $location, $rootScope, Notification, $scope, $timeout, $interval, $sce ) {
    var vm = this;
    vm.toggleTrivia = toggleTrivia;

    vm.triviaStatus = 0; //0-Ready, 1-Go, 2-Minimized
    var pointsAux = 0;
    var validatingAnswer = false;
    var challengeBoxHidden = false;
    

//     $rootScope.showMainNavBar = false;

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
    var fa_button_toggle = document.getElementById( "fa_button_toggle" );
    var control_panel_menu = document.getElementById( 'control_panel_menu' );

/* ********* HourGlass ********** */
var xmlns="http://www.w3.org/2000/svg", 
    select = function( s ) {
        return document.querySelector( s );
    }, 
    selectAll = function( s ) {
        return document.querySelectorAll( s );
    }
    , hourGlassContainer = select( '.hourglass_container' ), hourglassSVG = select( '.hourglassSVG' )
    , topSand = select( '.topSand' ), bottomSand = select('.bottomSand'), drip = select('.drip'), allGrouped = select('.allGrouped'), leftShine = select('.leftShine'), rightShine = select('.rightShine'), topShadow = select('.topShadow'), botShadow = select('.botShadow'), circleDragger = select('.circleDragger'), allGrains = selectAll('.grainGroup use')
    , grainGroup = select('.grainGroup'), dragRotate = select( '.dragRotate' ), grainIsPaused = false;

//     var sandTime = 2;
var timeLeft = 0;
var playhead = 0;


//console.log( topSand );
//center the container cos it's pretty an' that
// TweenMax.set( container, { position: 'absolute', top: '50%', left: '50%', xPercent: -50, yPercent: -50 } );

TweenMax.set( botMask, { x:'-=1' } );
TweenMax.set( allGrouped, { svgOrigin: '306.5 275' } );
TweenMax.set( circleDragger, { transformOrigin:'50% 50%' } );
// TweenMax.set( drip, { drawSVG:'0% 0%' } );

// var grainTl = new TimelineMax( );
var hourGlassTl = new TimelineMax( { repeat:0, onComplete: pauseGrains } );
/* ********* HourGlass ********** */


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

    var isEnabledAnimations;

    initialize( );
    
    function animationsEnabled( ) {
        //console.log( 'Variable', isEnabledAnimations );
        if ( isEnabledAnimations == undefined || isEnabledAnimations == null ) {
            isEnabledAnimations = !Utils.isMobile.any( );
/*
            //isEnabledAnimations = false; // Just for testing
            if ( isEnabledAnimations ) console.log( 'Animated' );
            else console.log( 'NOT Animated' );
*/
        }
        return isEnabledAnimations;
    }
 
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
//         control_panel_menu.style.bottom = '100px';
        
        getQuestion( );

        greyOut.onclick = function( ) {
            toggleTrivia( );
        };

        if ( animationsEnabled( ) )
            FireworksService.initialize( greyOut );
    }

    function trustSrc( src ) {
        return $sce.trustAsResourceUrl( src );
    }

    function getQuestion( ) {
        vm.showReward = false;
        vm.feedback = false;

//         if ( animationsEnabled( ) ) {
            TweenLite.to( triviaContainer, 0, { bottom: "-500px" } );
            // TweenLite.to( progressBar, 0.1, { opacity: 0 } );
            TweenLite.to( greyOut, 0.1, { opacity: 0 } );
            TweenLite.to( scoreBarCKPT, 0.1, { opacity: 0 } );
//         }


        ApiService.get( 'challenge', 0 )
            .then( function( response ) {
                if ( response.success ) {
                    try {
                        vm.data.correct_answer_id = null;
                        vm.data.player_answer_id = null;
                   } catch( error ) { }

                    vm.data = response.data;
                    $rootScope.advertiserSite = vm.data.site;
                    
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
                    
                    // Show progress of delay time before showing the question
/*
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
*/

                    // This timeout will control the time before showing the question
//                     $timeout( function( ) {
                        TweenLite.to( triviaContainer, 1, { ease: Expo.easeOut, bottom: 0 } );
                        // TweenLite.to( progressBar, 0.1, { opacity: 1 } );
                        TweenLite.to( greyOut, 0.5, { opacity: 0.3 } );
                        TweenLite.to( scoreBarCKPT, 0.5, {opacity: 1 } );
                        TweenMax.staggerFrom( ".trivia-options", 2, { scale: 0.5, opacity: 0, delay: 0.5, ease: Elastic.easeOut, force3D: true }, 0.2);
                        TweenLite.from( challengeText, 0.5, { scale: 0.5, opacity: 0, delay: 0.5, ease: Elastic.easeOut, force3D: true } );

                    TweenLite.set( fa_button_toggle, { className:"fa fa-chevron-up fa-2x fa_button_toggle" } );
                    TweenLite.to( buttonToggle, 0.2, { className:"btn btn-toggle chevron-up btn_toggle_ready" } );
                    TweenLite.to( greyOut, 1, { ease: Circ.easeOut, opacity: 0, display: 'none' } );
                    TweenLite.to( progressBar, 0.5, { opacity: 0 } );

                    vm.triviaStatus = 0;

                        
/*
                        // vm.data.display_time: after this number of seconds I will validate the 
                        // answer as -1, which means unaswered
                        vm.timeout_promise = $timeout( function( ) {
                            validateAnswer( -1 );
                        }, vm.data.display_time * 1000 )
*/
                        
//                         hourGlass( vm.data.display_time );
//                         reset( );
                        
/*
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
*/

                        validatingAnswer = false
                        
                        // Navigation shouldn't disappear until everything is actually loaded.
                        // I do this to make it look more friendly just the first time the game loads, after taht
                        // THe navigation will be gone.
                        $rootScope.showMainNavBar = false;
//                     },  vm.data.delay * 1000 );//vm.data.delay * 1000
/*
                    console.log( 'Get Question:' );
                    console.log(vm.data);
*/
                } else {
                    Notification.error( response.message );
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

        // Pause HourGlass
        setDragger( );

        var data = {
            tr_id: option
        }

        if ( animationsEnabled( ) ) {
            var shakeTween = TweenLite.fromTo( triviaContainer, vm.data.validation_time, { scale: 1 }, 
                { scale: 1.1, ease:RoughEase.ease.config( { strength: 2, points: 30, template:Bounce.easeIn, randomize:false } ), clearProps: "x" } );
        }

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

                        if ( animationsEnabled( ) ) {
                            shakeTween.kill( );
                            TweenLite.from( feedBackBox, 1, { ease: Expo.easeOut, scale: 0 } );
                        }
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
                   Notification.error( response.message );
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
        if ( animationsEnabled( ) ) {
            if ( vm.data.earned_points > 0 ) {
                var repeat = Math.floor( vm.data.earned_points / 100 );
    
                if ( vm.data.correct ) {
                    FireworksService.shoot( repeat );
                }
        
                animate( repeat );
            }
        }

        TweenLite.to( pointsBar, 3, { delay:2, value: vm.data.player_stats.accumulated_points } );

        if ( animationsEnabled( ) ) {
            var tlpb = new TimelineLite( { } );
            tlpb.to( pointsBar, 1.5, { delay:1, ease: Circ.easeOut, height: '200%' } )
                .to( pointsBar, 1, { ease: Elastic.easeOut.config( 2, 0.2 ), height: '100%' } );
        }
    }
    
    // Returns a random number between min (inclusive) and max (exclusive)
    function getRandomArbitrary( min, max ) {
        return Math.random( ) * ( max - min ) + min;
    }

    function animateRewards( ) {
        if ( animationsEnabled( ) ) {
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
    }
    
    // Some Animation when wrong or no answer
    function badFeedBack( ) {
    }

    // Some Animation when good answer
    function goodFeedBack( ) {
    }

/* ********* HourGlass ********** */
function hourGlass( sandTime ) {
    hourGlassTl.to( drip, 1, { drawSVG:'100% 0%', ease:Expo.easeIn } )
        .addCallback( createGrains )
        .to( topSand, sandTime, { attr: { y: '+=189' }, ease:Linear.easeNone } )
        .to( bottomSand, sandTime, { attr: { cy:'-=165', rx:'+=200' }, transformOrigin:'50% 50%', ease:Linear.easeNone }, '-=' + sandTime )
        .fromTo( grainGroup, sandTime, { x: 307, y: 465 }, { y: 296, ease:Linear.easeNone }, '-=' + sandTime )
        .addCallback( pauseGrains )
        .to( drip, 1, { drawSVG: '100% 100%', ease:Linear.easeNone } )
        .addCallback( setDragger, '+=0' )
        .to( leftShine, 1, { alpha: 0.1, ease:Linear.easeNone } )
        .to( rightShine, 1, { alpha: 0.28, ease:Linear.easeNone }, '-=1' )
        .to( topShadow, 1, { alpha: 0, ease:Linear.easeNone }, '-=1' )
        .to( botShadow, 1, { alpha: 0.12, ease:Linear.easeNone }, '-=1')
        .to( bottomSand, 1, { attr: { cy:'-=40' }, ease:Linear.easeNone }, '-=1' );
}    
    
    function onPress( ) {
      playhead = hourGlassTl.time( );
    }
    
    function onDrag( ) {
        TweenMax.set( allGrouped, {
            rotation:circleDragger._gsTransform.rotation
        } );
        
        timeLeft = hourGlassTl.duration( ) - playhead;
        var percent = ( circleDragger._gsTransform.rotation/180)* timeLeft;
        
        hourGlassTl.time( playhead + percent );
    }
    
    function setDragger( ) {
        //   myDraggable[0].enable();
        hourGlassTl.pause( );
        
        if ( dragRotate !== null ) {
            TweenMax.to( dragRotate, 1, { alpha:0.8 } );
        }
      
    // pauseGrains();
    
    //if you want something to happen when the sand has finished do it here
    //doFinished();
    
    }
    
    function removeInfo( ) {
        if ( dragRotate !== null ) {
            TweenMax.to( dragRotate, 0.3, { alpha:0, onComplete:function( ) {
                    hourglassSVG.removeChild( dragRotate );
                    dragRotate = null;
                }
            } );
        }
    }
    
    function reset( ) {
        TweenMax.set( [ circleDragger, allGrouped ], {
        rotation:0
      } )
      //   myDraggable[0].disable();
      hourGlassTl.play( 0 );

      grainIsPaused = false;
      restartGrains( );
    }

    function doFinished( ) {
        alert( 'all done!' )
    }
    
    function createGrainAnim(el, id){
      if ( grainIsPaused ) {
        return;
      }
      var angle = randomBetween( -180, 0 );
      var vel = randomBetween( 10, 50 ); 
        
        TweenMax.set(el,  {
          x:0,
          y:0,
          attr:{
            x:0        
          }
    
        })
        el.grainId = id;
        //
        var t = TweenMax.to( el, randomBetween( 1, 3 ) / 10, {
    /*
            physics2D:{
              velocity:180, 
              angle:angle, 
              //acceleration:1000, 
              gravity:620, 
              accelerationAngle:0
            },
    */
          //repeat:-1
          onComplete:createGrainAnim,
          onCompleteParams:[el, el.grainId]
        })
        
        //grainTl.add(t, (i+1)/100)
        
      
    }
    
    function createGrains( ) {
        for( var i = 0; i < allGrains.length; i++ ) {
            createGrainAnim( allGrains[ i ], i );
        }
    }
    
    function randomBetween( min, max ) {
        return Math.floor( Math.random( ) * ( max - min + 1 ) + min );
    }
    
    function pauseGrains( ) {
        grainIsPaused = true;
        for( var i = 0; i < allGrains.length; i++ ) {
            TweenMax.set( allGrains[ i ], { alpha: 0, attr: { x: 0, y: 0 } } );
        }
    }
    
    function restartGrains( ) {
        for( var i = 0; i < allGrains.length; i++ ) {
            TweenMax.set( allGrains[ i ], { alpha: 1, x: 307, y: 465 } );
        }
    }
/* ********* END - HourGlass ********** */




    function getObjectHeight( obj ) {
        var divHeight;
        if ( obj.offsetHeight ) {
            divHeight=obj.offsetHeight;
        } else if ( obj.style.pixelHeight ) {
            divHeight=obj.style.pixelHeight;
        }
        return divHeight;
    }

    function startCountDown( ) {
        //// Count down
        vm.triviaStatus = 1;
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

        // vm.data.display_time: after this number of seconds I will validate the 
        // answer as -1, which means unaswered
        vm.timeout_promise = $timeout( function( ) {
            validateAnswer( -1 );
        }, vm.data.display_time * 1000 )

        hourGlass( vm.data.display_time );
        reset( );
    }


    function toggleTrivia( ) {
        console.log( 'clicked' );
        switch( vm.triviaStatus ) {
            case 0:
                // If we click the toggle button when status = 0
                // It means we want to answer the question, then 
                // We start the countdown and show the answer options
                startCountDown( );
                TweenLite.set( fa_button_toggle, { className:"fa fa-chevron-down fa-2x fa_button_toggle" } );
                TweenLite.to( buttonToggle, 0.3, { className:"btn btn-toggle chevron-down" } );
                TweenLite.to( greyOut, 1, { ease: Circ.easeOut, opacity: 0.5, display: 'block' } );
                TweenLite.to( progressBar, 0.1, { opacity: 1 } );

                break;
            case 1:
                // If we click the toggle button when status = 1
                // It means we want to minize the trivia box
                challengeBoxHidden = true;
                triviaContainerHeight = getObjectHeight( triviaContainer );
                TweenLite.set( fa_button_toggle, { className:"fa fa-chevron-up fa-2x fa_button_toggle_up" } );
                TweenLite.to( buttonToggle, 0, { className:"btn btn-toggle-up chevron-up fa-2x" } );
                TweenLite.to( triviaContainer, 1, { ease: Elastic.easeOut.config( 1, 0.3 ), bottom: -triviaContainerHeight + getObjectHeight( buttonToggle ) - 1 } );
                TweenLite.to( greyOut, 1, { ease: Circ.easeOut, opacity: 0, display: 'none' } );
//                 TweenLite.to( scoreBarCKPT, 1, { opacity: 0, display: 'none' } );
    
                buttonToggleTL = new TimelineMax( { repeat: 50, repeatDelay: 0.5 } );
                buttonToggleTL.to( buttonToggle, 0.5, { ease: Elastic.easeOut.config( 1, 0.3 ), scale: 1.1 } )
                    .to( buttonToggle, 0.5, { ease: Elastic.easeOut.config( 1, 0.3 ), scale: 1 } );

                vm.triviaStatus = 2;
                break;
            case 2:
                // If we click the toggle button when status = 2
                // It means we want to show the trivia box
                challengeBoxHidden = false;
                buttonToggleTL.kill( );
                TweenLite.set( fa_button_toggle, { className:"fa fa-chevron-down fa-2x fa_button_toggle" } );
                TweenLite.to( buttonToggle, 0.3, { className:"btn btn-toggle chevron-down" } );
                TweenLite.to( triviaContainer, 1, { bottom: 0 } );
                TweenLite.to( greyOut, 1, { ease: Circ.easeOut, opacity: 0.5, display: 'block' } );
//                 TweenLite.to( scoreBarCKPT, 1, { opacity: 1, display: 'block' } );
                vm.triviaStatus = 1;
                break;
            default:
                vm.triviaStatus = 0;
        }
/*
        if ( challengeBoxHidden ) {
            challengeBoxHidden = false;
            buttonToggleTL.kill( );
            TweenLite.set( fa_button_toggle, { className:"fa fa-chevron-down fa-2x fa_button_toggle" } );
            TweenLite.to( buttonToggle, 0.3, { className:"btn btn-toggle chevron-down" } );
            TweenLite.to( triviaContainer, 1, { bottom: 0 } );
            TweenLite.to( greyOut, 1, { ease: Circ.easeOut, opacity: 0.5, display: 'block' } );
            TweenLite.to( scoreBarCKPT, 1, { opacity: 1, display: 'block' } );
        } else {          
            challengeBoxHidden = true;
            triviaContainerHeight = getObjectHeight( triviaContainer );
            TweenLite.set( fa_button_toggle, { className:"fa fa-chevron-up fa-2x fa_button_toggle_up" } );
            TweenLite.to( buttonToggle, 0.2, { className:"btn btn-toggle-up chevron-up fa-2x" } );
            TweenLite.to( triviaContainer, 1, { ease: Elastic.easeOut.config( 1, 0.3 ), bottom: -triviaContainerHeight + getObjectHeight( buttonToggle ) - 1 } );
            TweenLite.to( greyOut, 1, { ease: Circ.easeOut, opacity: 0, display: 'none' } );
            TweenLite.to( scoreBarCKPT, 1, { opacity: 0, display: 'none' } );

            buttonToggleTL = new TimelineMax( { repeat: 50, repeatDelay: 0.5 } );
            buttonToggleTL.to( buttonToggle, 0.5, { ease: Elastic.easeOut.config( 1, 0.3 ), scale: 1.1 } )
                .to( buttonToggle, 0.5, { ease: Elastic.easeOut.config( 1, 0.3 ), scale: 1 } );
        }
*/
    }

}
})();