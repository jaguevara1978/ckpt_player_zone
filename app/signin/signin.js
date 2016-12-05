( function ( ) {
'use strict';

/**
 * @ngdoc function
 * @name app.controller:SignIn
 * @description
 * # SignIn
 * Controller of the app
 */
angular.module( 'app.signin' ).controller( 'SignIn', SignIn );

/*@ngInject*/
function SignIn( $rootScope, $scope, $location, $timeout, AuthenticationService, ApiService, $routeParams, Notification ) {
    var vm = this;
    vm.loading = false;
    vm.login = login;
    vm.rotate = rotate;
    vm.signup = signup;

    vm.signin = true;

    var signInButton = document.getElementById( 'signin_submit' );
    var signUpButton = document.getElementById( 'signup_submit' );
    var shellContent = document.getElementById( 'shell_content' );
    var signInWrapper = document.getElementById( 'signin_wrapper' );
    var signUpWrapper = document.getElementById( 'signup_wrapper' );
    var signinBubbles = document.getElementById( 'signin_bubbles' );
    
    //LOADING
    var buttonText;

    // Unrestricted pages do not use navigation bar
    $rootScope.showMainNavBar = false;

    vm.forgotpwd = false;

    if ( $routeParams.id && $routeParams.pwd ) {
        vm.user = {
            id: $routeParams.id,
            pwd: $routeParams.pwd
        };
        login( );
    }

    initController( );

  //for more options visit https://developers.google.com/identity/sign-in/web/reference#gapisignin2renderwzxhzdk114idwzxhzdk115_wzxhzdk116optionswzxhzdk117
  $scope.options = {
    'onsuccess': function(response) {
      console.log(response);
    }
}
    
    function initController( ) {
        //console.log(vm.user);
        // reset login status
        AuthenticationService.ClearCredentials( );
 
/* THIS IS FOR HOVER BUTTONS BUT STILL SOME THINGS MISSING
        var submitButton = document.getElementById( "submit_button" );
        submitButton.addEventListener( "mouseover", function( event ) {
            TweenMax.fromTo( event.target, 0.7, {
                boxShadow: "0px 0px 0px 0px rgba( 0,255,0,0.3 )"
            }, {
                boxShadow: "0px 0px 20px 10px rgba( 0,255,0,0.7 )",
                repeat: -1,
                yoyo: true,
                ease: Linear.easeNone
            });
            TweenLite.to( event.target, 0.5, { backgroundColor:"black" } );
        } );
        submitButton.addEventListener( "mouseout", function( event ) {
            TweenLite.to( event.target, 0.5, { boxShadow: 0, background: '#FF3366' } );
        } );
*/
    };

    function login( ) {
        if ( !vm.loading ) {
            vm.loading = true;
            loadingAnimation( signInButton );
/*
            $timeout( function( ) {

            },  1000 );
*/

            ApiService.post( 'auth', vm.user )
                .then(function ( response ) {
                    stopLoading( signInButton );
                    vm.loading = false;

                    if ( response.success ) {
                        AuthenticationService.setCredentials( response.data );
                        if ( response.data.extra.player_setup == null || response.data.extra.player_setup == false ) {
                            $location.path( '/profile' );
                        } else {
                            $location.path( '/rewards' );
                        }
                        Notification.info( { message: 'Welcome to the Challenge', delay: 800 } );
                    } else {
                        Notification.error( { message: response.message, delay: 5000 } );
                    }
                    vm.loading = false;
                }
            );
        }
    }

    function signup( ) {
        vm.loading = true;
        loadingAnimation( signUpButton );
        ApiService.post( 'contact', vm.user )
            .then( function ( response ) {
                stopLoading( signUpButton );
                vm.loading = false;

                if ( response.success ) {
                    $rootScope.globals.name = vm.user.data.fname;
                    $rootScope.globals.email = vm.user.data.primary_email;

                    vm.user = null;

                    vm.loading = false;
                    vm.signin = true;

                    Notification.success( 'We have just sent you an e-mail confirmation. Please, take a look.', 20000 );
                } else {
                    vm.loading = false;
                    Notification.error( response.message, 20000 );
                }
            });
    }

    function rotate( ) {
        vm.signin = vm.signin ? false : true;
    }

    function loadingAnimation( parent ) {
        // Temporarily save parent text
        buttonText = parent.innerHTML;
        // Remove Text
        parent.innerHTML = '<i class="fa fa-refresh fa-spin"></i>';
        TweenLite.to( parent, .75, { className: '+=processing' } );
    }

    function stopLoading( parent ) {
        TweenLite.to( parent, 0.75, { className: '-=processing' } );
        $timeout( function( ) {
            parent.innerHTML = buttonText;
        },  750 );
    }

    function retrievePassword(  ) { }
}
})();