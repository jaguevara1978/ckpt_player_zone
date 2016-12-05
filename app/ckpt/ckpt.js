( function ( ) {
    'use strict';

/**
 * @ngdoc function
 * @name app.controller:Ckpt
 * @description
 * # Ckpt
 * Controller of the app
 */
angular.module( 'app.ckpt' ).controller( 'Ckpt', Ckpt );

/*@ngInject*/
function Ckpt( ApiService, FireworksService, Utils, $location, $rootScope, Notification, $scope, $timeout, $interval, $sce ) {
    var vm = this;
    vm.clickedMenu = clickedMenu;

    vm.triviaStatus = 0; //0-Ready, 1-Go, 2-Minimized
    vm.templateInclude = 'trivia/trivia.html';
    vm.option = 'profile';
    
    console.log( vm.option );
    
    var pointsAux = 0;
    var validatingAnswer = false;
    var challengeBoxHidden = false;
    var isEnabledAnimations;


    var container = document.getElementById( "container-ckpt" );
    var tl;
    var buttonToggleTL;
    var buttonToggle = document.getElementById( "btn-toggle" );
    var triviaBox = document.getElementById( "trivia-box" );
//     var control_panel_container = document.getElementById( "control_panel_container" );
    var challengeText = document.getElementById( "challenge_text" );
    var control_panel_containerHeight;
    var greyOut = document.getElementById( "grey-out" );


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
 

    function initialize( ) {
//         if ( animationsEnabled( ) )
//             FireworksService.initialize( greyOut );

//                         TweenLite.to( control_panel_container, 1, { ease: Expo.easeOut, bottom: 0 } );
                        // TweenLite.to( progressBar, 0.1, { opacity: 1 } );
                        TweenLite.to( greyOut, 0.5, { opacity: 0.3 } );
//                         TweenLite.to( scoreBarCKPT, 0.5, {opacity: 1 } );
/*
                        TweenMax.staggerFrom( ".trivia-options", 2, { scale: 0.5, opacity: 0, delay: 0.5, ease: Elastic.easeOut, force3D: true }, 0.2);
                        TweenLite.from( challengeText, 0.5, { scale: 0.5, opacity: 0, delay: 0.5, ease: Elastic.easeOut, force3D: true } );
*/

    }

    function trustSrc( src ) {
        return $sce.trustAsResourceUrl( src );
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
                control_panel_containerHeight = getObjectHeight( control_panel_container );
                TweenLite.set( fa_button_toggle, { className:"fa fa-chevron-up fa-2x fa_button_toggle_up" } );
                TweenLite.to( buttonToggle, 0, { className:"btn btn-toggle-up chevron-up fa-2x" } );
                TweenLite.to( control_panel_container, 1, { ease: Elastic.easeOut.config( 1, 0.3 ), bottom: -control_panel_containerHeight + getObjectHeight( buttonToggle ) - 1 } );
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
                TweenLite.to( control_panel_container, 1, { bottom: 0 } );
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
            TweenLite.to( control_panel_container, 1, { bottom: 0 } );
            TweenLite.to( greyOut, 1, { ease: Circ.easeOut, opacity: 0.5, display: 'block' } );
            TweenLite.to( scoreBarCKPT, 1, { opacity: 1, display: 'block' } );
        } else {          
            challengeBoxHidden = true;
            control_panel_containerHeight = getObjectHeight( control_panel_container );
            TweenLite.set( fa_button_toggle, { className:"fa fa-chevron-up fa-2x fa_button_toggle_up" } );
            TweenLite.to( buttonToggle, 0.2, { className:"btn btn-toggle-up chevron-up fa-2x" } );
            TweenLite.to( control_panel_container, 1, { ease: Elastic.easeOut.config( 1, 0.3 ), bottom: -control_panel_containerHeight + getObjectHeight( buttonToggle ) - 1 } );
            TweenLite.to( greyOut, 1, { ease: Circ.easeOut, opacity: 0, display: 'none' } );
            TweenLite.to( scoreBarCKPT, 1, { opacity: 0, display: 'none' } );

            buttonToggleTL = new TimelineMax( { repeat: 50, repeatDelay: 0.5 } );
            buttonToggleTL.to( buttonToggle, 0.5, { ease: Elastic.easeOut.config( 1, 0.3 ), scale: 1.1 } )
                .to( buttonToggle, 0.5, { ease: Elastic.easeOut.config( 1, 0.3 ), scale: 1 } );
        }
*/
    }
    
    
    var options = [
        {
            option: 'profile',
            template: 'profile/profile.html'
        },
        {
            option: 'trivia',
            template: 'trivia/trivia.html'
        }
    ];
    function clickedMenu( option ) {
        console.log( option );
        vm.option = option;
/*
        if ( option == 'profile' ) {
        console.log( option );
            vm.templateInclude = 'profile/profile.html';
        }
        if ( option == 'play' ) {
        console.log( option );
            vm.templateInclude = 'trivia/trivia.html';
        }
*/
    }
}
})();