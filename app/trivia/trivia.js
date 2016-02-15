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
function Trivia( ApiService, CelebrationService, SorryService, $location, $rootScope, FlashService, $scope, $timeout, $interval, $sce ) {
    var vm = this;
    var pointsAux = 0;
    var validatingAnswer = false;
    var challengeBoxHidden = false;

    var progressBar = document.getElementById( "count_down_bar" );
    var countDownTween;
    var pointsBar = document.getElementById( "points_bar" );
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

    /* ********************* FIREWORKS *********************  */
    /**
     * Represents a single point, so the firework being fired up
     * into the air, or a point in the exploded firework
     */
    var Particle = function( pos, target, vel, marker, usePhysics ) {
        // properties for animation
        // and colouring
        this.GRAVITY  = 0.06;
        this.alpha    = 1;
        this.easing   = Math.random() * 0.02;
        this.fade     = Math.random() * 0.1;
        this.gridX    = marker % 120;
        this.gridY    = Math.floor(marker / 120) * 12;
        this.color    = marker;
        
        this.pos = {
            x: pos.x || 0,
            y: pos.y || 0
        };
        
        this.vel = {
            x: vel.x || 0,
            y: vel.y || 0
        };
        
        this.lastPos = {
            x: this.pos.x,
            y: this.pos.y
        };
        
        this.target = {
            y: target.y || 0
        };
        
        this.usePhysics = usePhysics || false;
    
    };

    /**
     * Functions that we'd rather like to be
     * available to all our particles, such
     * as updating and rendering
     */
    Particle.prototype = {
    
      update: function() {
    
        this.lastPos.x = this.pos.x;
        this.lastPos.y = this.pos.y;
    
        if(this.usePhysics) {
          this.vel.y += this.GRAVITY;
          this.pos.y += this.vel.y;
    
          // since this value will drop below
          // zero we'll occasionally see flicker,
          // ... just like in real life! Woo! xD
          this.alpha -= this.fade;
        } else {
    
          var distance = (this.target.y - this.pos.y);
    
          // ease the position
          this.pos.y += distance * (0.03 + this.easing);
    
          // cap to 1
          this.alpha = Math.min(distance * distance * 0.00005, 1);
        }
    
        this.pos.x += this.vel.x;
    
        return (this.alpha < 0.005);
      },
    
      render: function(context, fireworkCanvas) {
    
        var x = Math.round(this.pos.x),
            y = Math.round(this.pos.y),
            xVel = (x - this.lastPos.x) * -5,
            yVel = (y - this.lastPos.y) * -5;
    
        context.save();
        context.globalCompositeOperation = 'lighter';
        context.globalAlpha = Math.random() * this.alpha;
    
        // draw the line from where we were to where
        // we are now
        context.fillStyle = "rgba(255,255,255,0.3)";
        context.beginPath();
        context.moveTo(this.pos.x, this.pos.y);
        context.lineTo(this.pos.x + 1.5, this.pos.y);
        context.lineTo(this.pos.x + xVel, this.pos.y + yVel);
        context.lineTo(this.pos.x - 1.5, this.pos.y);
        context.closePath();
        context.fill();
    
        // draw in the images
        context.drawImage( fireworkCanvas,
          this.gridX, this.gridY, 12, 12,
          x - 6, y - 6, 12, 12);
        context.drawImage(Library.smallGlow, x - 3, y - 3);
    
        context.restore();
      }
    
    };

    /**
     * Stores references to the images that
     * we want to reference later on
     */
    var Library = {
      bigGlow: document.getElementById('big-glow'),
      smallGlow: document.getElementById('small-glow')
    };

    // console.log( rectButtonToggle.top, rectButtonToggle.right, rectButtonToggle.bottom, rectButtonToggle.left);
    // console.log( rectTriviaBox );
    vm.validateAnswer = validateAnswer;
    vm.getQuestion = getQuestion;
    vm.trustSrc = trustSrc;
    vm.goToRewards = goToRewards;
    vm.questionOptionClass = questionOptionClass;
    vm.toggleTrivia = toggleTrivia;

  // declare the variables we need
  var particles = [],
      mainCanvas = null,
      mainContext = null,
      fireworkCanvas = null,
      fireworkContext = null,
      viewportWidth = 0,
      viewportHeight = 0;
    /* ********************* FIREWORKS *********************  */

    initialize( );
    
    initializeFireworks( );

  /**
   * Create DOM elements and get your game on
   */
  function initializeFireworks( ) {

    // start by measuring the viewport
    onWindowResize( );

    // create a canvas for the fireworks
    mainCanvas = document.createElement( 'canvas' );
    mainContext = mainCanvas.getContext( '2d' );

    // and another one for, like, an off screen buffer
    // because that's rad n all
    fireworkCanvas = document.createElement('canvas');
    fireworkContext = fireworkCanvas.getContext( '2d' );

    // set up the colours for the fireworks
    createFireworkPalette( 12 );

    // set the dimensions on the canvas
    setMainCanvasDimensions( );

    // add the canvas in
    greyOut.appendChild( mainCanvas );
/*
    document.addEventListener( 'mouseup', createFirework, true );
    document.addEventListener( 'touchend', createFirework, true );
*/

    // and now we set off
    update( );
  }

    function initialize( ) {
        getQuestion( );

        greyOut.onclick = function( ) {
            toggleTrivia( );
        };
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
                    console.log( 'Get Question:' );
                    console.log(vm.data);
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
            { scale: 1.1, ease:RoughEase.ease.config( { strength: 2, points: 20, template:Bounce.easeIn, randomize:false } ), clearProps: "x" } );

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

    function getAnimation() {
        var element = document.createElement( 'div' );
        element.className += "coin";
        container.appendChild( element );
        TweenLite.set( element, { x:rectButtonToggle.left, y:rectButtonToggle.bottom } );
        //create a semi-random tween 
        var bezTween = new TweenMax( element, 2, {
            bezier:{
                type:"soft", 
                values:[ { x:rectPointsBar.left + getRandomArbitrary( -2, 2 ) * rectPointsBar.width, y:40 }, { x:rectPointsBar.left + getRandomArbitrary( 0, 1 ) * rectPointsBar.width, y:20 } ],
                autoRotate:true
            },
            ease:Expo.easeOut
            , onComplete:function( ) { container.removeChild( element ); }
        } );
 
        return bezTween;
    }

    function animatePoints( ) {
        if ( vm.data.earned_points > 0 ) {
            tl = new TimelineLite( { } );
            var repeat = Math.floor( vm.data.earned_points / 100 );
            
            for ( var i = 0 ; i < repeat; i++ ){
                createFirework( );
               //start animation every 0.17 seconds
                tl.add( getAnimation( ), i * 0.17 );
//                 new TimelineMax({onComplete: function() {console.log('complete');}});

            }
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
        element.className += "reward";
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


    /* ********************* FIREWORKS *********************  */
  /**
   * Pass through function to create a
   * new firework on touch / click
   */
  function createFirework() {
    createParticle( );
  }

  /**
   * Creates a block of colours for the
   * fireworks to use as their colouring
   */
  function createFireworkPalette( gridSize ) {

    var size = gridSize * 10;
    fireworkCanvas.width = size;
    fireworkCanvas.height = size;
    fireworkContext.globalCompositeOperation = 'source-over';

    // create 100 blocks which cycle through
    // the rainbow... HSL is teh r0xx0rz
    for( var c = 0; c < 100; c++ ) {

      var marker = ( c * gridSize );
      var gridX = marker % size;
      var gridY = Math.floor( marker / size ) * gridSize;

      fireworkContext.fillStyle = "hsl(" + Math.round( c * 3.6 ) + ",100%,60%)";
      fireworkContext.fillRect( gridX, gridY, gridSize, gridSize );
      fireworkContext.drawImage(
        Library.bigGlow,
        gridX,
        gridY);
    }
  }

  /**
   * Update the canvas based on the
   * detected viewport size
   */
  function setMainCanvasDimensions() {
    mainCanvas.width = viewportWidth;
    mainCanvas.height = viewportHeight;
  }

  /**
   * The main loop where everything happens
   */
  function update( ) {
    clearContext( );
    requestAnimFrame( update );
    drawFireworks( );
  }

  /**
   * Clears out the canvas with semi transparent
   * black. The bonus of this is the trails effect we get
   */
  function clearContext() {
    mainContext.fillStyle = "rgba(0,0,0,0.2)";
    mainContext.fillRect(0, 0, viewportWidth, viewportHeight);
  }

  /**
   * Passes over all particles particles
   * and draws them
   */
  function drawFireworks() {
    var a = particles.length;

    while(a--) {
      var firework = particles[a];

      // if the update comes back as true
      // then our firework should explode
      if( firework.update( ) ) {

        // kill off the firework, replace it
        // with the particles for the exploded version
        particles.splice(a, 1);

        // if the firework isn't using physics
        // then we know we can safely(!) explode it... yeah.
        if ( !firework.usePhysics ) {

          if ( Math.random( ) < 0.8 ) {
            FireworkExplosions.star( firework );
          } else {
            FireworkExplosions.circle( firework );
          }
        }
      }

      // pass the canvas context and the firework
      // colours to the
      firework.render( mainContext, fireworkCanvas );
    }
  }

  /**
   * Creates a new particle / firework
   */
  function createParticle(pos, target, vel, color, usePhysics) {
    pos = pos || {};
    target = target || {};
    vel = vel || {};

    particles.push(
      new Particle(
        // position
        {
          x: pos.x || viewportWidth * 0.5,
          y: pos.y || viewportHeight + 10
        },

        // target
        {
          y: target.y || 150 + Math.random() * 100
        },

        // velocity
        {
          x: vel.x || Math.random() * 3 - 1.5,
          y: vel.y || 0
        },

        color || Math.floor(Math.random() * 100) * 12,

        usePhysics)
    );
  }

  /**
   * Callback for window resizing -
   * sets the viewport dimensions
   */
  function onWindowResize() {
    viewportWidth = window.innerWidth;
    viewportHeight = window.innerHeight;
  }

/**
 * Stores a collection of functions that
 * we can use for the firework explosions. Always
 * takes a firework (Particle) as its parameter
 */
var FireworkExplosions = {

  /**
   * Explodes in a roughly circular fashion
   */
  circle: function(firework) {

    var count = 100;
    var angle = (Math.PI * 2) / count;
    while(count--) {

      var randomVelocity = 4 + Math.random() * 4;
      var particleAngle = count * angle;

      createParticle(
        firework.pos,
        null,
        {
          x: Math.cos(particleAngle) * randomVelocity,
          y: Math.sin(particleAngle) * randomVelocity
        },
        firework.color,
        true);
    }
  },

  /**
   * Explodes in a star shape
   */
  star: function( firework ) {

    // set up how many points the firework
    // should have as well as the velocity
    // of the exploded particles etc
    var points          = 6 + Math.round(Math.random() * 15);
    var jump            = 3 + Math.round(Math.random() * 7);
    var subdivisions    = 10;
    var radius          = 80;
    var randomVelocity  = -(Math.random() * 3 - 6);

    var start           = 0;
    var end             = 0;
    var circle          = Math.PI * 2;
    var adjustment      = Math.random() * circle;

    do {

      // work out the start, end
      // and change values
      start = end;
      end = (end + jump) % points;

      var sAngle = (start / points) * circle - adjustment;
      var eAngle = ((start + jump) / points) * circle - adjustment;

      var startPos = {
        x: firework.pos.x + Math.cos(sAngle) * radius,
        y: firework.pos.y + Math.sin(sAngle) * radius
      };

      var endPos = {
        x: firework.pos.x + Math.cos(eAngle) * radius,
        y: firework.pos.y + Math.sin(eAngle) * radius
      };

      var diffPos = {
        x: endPos.x - startPos.x,
        y: endPos.y - startPos.y,
        a: eAngle - sAngle
      };

      // now linearly interpolate across
      // the subdivisions to get to a final
      // set of particles
      for( var s = 0; s < subdivisions; s++ ) {

        var sub = s / subdivisions;
        var subAngle = sAngle + (sub * diffPos.a);

        createParticle(
          {
            x: startPos.x + (sub * diffPos.x),
            y: startPos.y + (sub * diffPos.y)
          },
          null,
          {
            x: Math.cos(subAngle) * randomVelocity,
            y: Math.sin(subAngle) * randomVelocity
          },
          firework.color,
          true);
      }

    // loop until we're back at the start
    } while(end !== 0);

  }
};
    /* ********************* FIREWORKS *********************  */

}
})();