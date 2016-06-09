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

    function Rewards( TriviaService, $rootScope, $timeout, ApiService, Notification ) {
        var vm = this;
        vm.couponOptions = couponOptions;
        vm.clickedItem = clickedItem;
        vm.closePreview = closePreview;
        vm.detailView = 0; // 0-QRCode, 1-BarCode

        vm.openItem = null;
        var winsize;
        var $window = $( window );
        var rewards_title = document.getElementById( 'rewards_title' );
		var preview = null;
		var li = null;
		var anchor = null;
		var $li, $preview, $anchor;
        var oldLi, oldPreview, oldAnchor;
		var noTransition = false;
        var $body = $( 'html, body' );


        var previewHeight, itemHeight, oldPreviewHeight, oldIemHeight;
        var // extra amount of pixels to scroll the window
    		scrollExtra = 0,
    		// extra margin when expanded (between preview overlay and the next items)
    		marginExpanded = 10,
    		// default settings
    		settings = {
    			minHeight : 500,
    			speed : 500,
    			easing : 'ease',
    			defaultItemHeight: 200
    		};

        /** Window Resize Event */
        var $event = $.event,
        $special,
        resizeTimeout;
        
        $special = $event.special.debouncedresize = {
        	setup: function() {
        		$( this ).on( "resize", $special.handler );
        	},
        	teardown: function() {
        		$( this ).off( "resize", $special.handler );
        	},
        	handler: function( event, execAsap ) {
        		// Save the context
        		var context = this,
        			args = arguments,
        			dispatch = function() {
        				// set correct event type
        				event.type = "debouncedresize";
        				$event.dispatch.apply( context, args );
        			};
        
        		if ( resizeTimeout ) {
        			clearTimeout( resizeTimeout );
        		}
        
        		execAsap ?
        			dispatch() :
        			resizeTimeout = setTimeout( dispatch, $special.threshold );
        	},
        	threshold: 250
        };
        
        // ======================= imagesLoaded Plugin ===============================
        // https://github.com/desandro/imagesloaded
        
        // $('#my-container').imagesLoaded(myFunction)
        // execute a callback when all images have loaded.
        // needed because .load() doesn't work on cached images
        
        // callback function gets image collection as argument
        //  this is the container
        
        // original: MIT license. Paul Irish. 2010.
        // contributors: Oren Solomianik, David DeSandro, Yiannis Chatzikonstantinou
        
        // blank image data-uri bypasses webkit log warning (thx doug jones)
        var BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
        
        $.fn.imagesLoaded = function( callback ) {
        	var $this = this,
        		deferred = $.isFunction($.Deferred) ? $.Deferred() : 0,
        		hasNotify = $.isFunction(deferred.notify),
        		$images = $this.find('img').add( $this.filter('img') ),
        		loaded = [],
        		proper = [],
        		broken = [];
        
        	// Register deferred callbacks
        	if ($.isPlainObject(callback)) {
        		$.each(callback, function (key, value) {
        			if (key === 'callback') {
        				callback = value;
        			} else if (deferred) {
        				deferred[key](value);
        			}
        		});
        	}
        
        	function doneLoading() {
        		var $proper = $(proper),
        			$broken = $(broken);
        
        		if ( deferred ) {
        			if ( broken.length ) {
        				deferred.reject( $images, $proper, $broken );
        			} else {
        				deferred.resolve( $images );
        			}
        		}
        
        		if ( $.isFunction( callback ) ) {
        			callback.call( $this, $images, $proper, $broken );
        		}
        	}
        
        	function imgLoaded( img, isBroken ) {
        		// don't proceed if BLANK image, or image is already loaded
        		if ( img.src === BLANK || $.inArray( img, loaded ) !== -1 ) {
        			return;
        		}
        
        		// store element in loaded images array
        		loaded.push( img );
        
        		// keep track of broken and properly loaded images
        		if ( isBroken ) {
        			broken.push( img );
        		} else {
        			proper.push( img );
        		}
        
        		// cache image and its state for future calls
        		$.data( img, 'imagesLoaded', { isBroken: isBroken, src: img.src } );
        
        		// trigger deferred progress method if present
        		if ( hasNotify ) {
        			deferred.notifyWith( $(img), [ isBroken, $images, $(proper), $(broken) ] );
        		}
        
        		// call doneLoading and clean listeners if all images are loaded
        		if ( $images.length === loaded.length ){
        			setTimeout( doneLoading );
        			$images.unbind( '.imagesLoaded' );
        		}
        	}
        
        	// if no images, trigger immediately
        	if ( !$images.length ) {
        		doneLoading();
        	} else {
        		$images.bind( 'load.imagesLoaded error.imagesLoaded', function( event ){
        			// trigger imgLoaded
        			imgLoaded( event.target, event.type === 'error' );
        		}).each( function( i, el ) {
        			var src = el.src;
        
        			// find out if this image has been already checked for status
        			// if it was, and src has not changed, call imgLoaded on it
        			var cached = $.data( el, 'imagesLoaded' );
        			if ( cached && cached.src === src ) {
        				imgLoaded( el, cached.isBroken );
        				return;
        			}
        
        			// if complete is true and browser supports natural sizes, try
        			// to check for image status manually
        			if ( el.complete && el.naturalWidth !== undefined ) {
        				imgLoaded( el, el.naturalWidth === 0 || el.naturalHeight === 0 );
        				return;
        			}
        
        			// cached images don't fire load sometimes, so we reset src, but only when
        			// dealing with IE, or image is complete (loaded) and failed manual check
        			// webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
        			if ( el.readyState || el.complete ) {
        				el.src = BLANK;
        				el.src = src;
        			}
        		});
        	}
        
        	return deferred ? deferred.promise( $this ) : $this;
        };
        
        var Grid = (function() {
            // list of items
        	var $grid = $( '#og-grid' );
    
        	function init( config ) {
                // list of items
            	$grid = $( '#og-grid' );
        		// the items
        		//$items = $grid.children( 'li' );
        
        		// preload all images
        		$grid.imagesLoaded( function() {
        			// initialize some events
        			initEvents();
        		} );
        	}
        
        	function initEvents() {
        		// on window resize get the window큦 size again
        		// reset some values..
        		$window.on( 'debouncedresize', function() {
      				closePreview( );
        		} );
        	}

        	return { 
        		init : init
        	};
        })();

        initController();

        function initController( ) {
            // Glowing Rewards Title
/*
            TweenMax.to( rewards_title, 1,
                {
                    repeat: -1
                    ,yoyo: true
                    ,textShadow: '0 0 10px #FFF, 0 0 20px #FFF, 0 0 30px #FFF, 0 0 40px #FFFFFF, 0 0 70px #FFFFFF, 0 0 80px #FFFFFF, 0 0 100px #FFFFFF, 0 0 150px #FFFFFF'
                }
            );
*/

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

                    // I use timeout to guarantee that the initialization
                    // Happens only after the Angular's digest process
                    $timeout(function(){
                        Grid.init();
                    },0,false);
                } else {
                    Notification.error(response.message);
                }
            });
        }

    	function getWinSize( ) {
    		winsize = { width : $window.width(), height : $window.height() };
    	}


        function calcHeight( $item ) {
			previewHeight = winsize.height - $item.height( ) - marginExpanded;
            itemHeight = winsize.height;

			if ( previewHeight < settings.minHeight ) {
				previewHeight = settings.minHeight;
				itemHeight = settings.minHeight + $item.height( ) + marginExpanded;
//                 console.log( 'previewHeight < settings.minHeight', 'previewHeight', previewHeight, 'itemHeight', itemHeight );
			}
		}

        function couponOptions( data ) {
//             console.log( 'print', data );
            if ( data == null || data == undefined ) {
                return;
            }
            vm.detailView = data;
        }


        function openPreview( item ) {
            var code = item.coupon_code;

            // Case 1 - No previous preview object open.
            // Action: Just open a new preview
            $li = $( '#li_' + code );
            $preview = $( '#preview_' + code )
            $anchor =  $( '#anchor_' + code )
            vm.openItem = code;

            calcHeight( $li );

            if ( noTransition ) {
                $li.addClass( 'noTransition' );
                $preview.addClass( 'noTransition' );

                $li.css( 'height', itemHeight );
                $preview.css( 'height', previewHeight );

                $li.addClass( 'og-expanded' );
                $anchor.addClass( 'clicked' );

                console.log( 'noTransition', $li, 'itemHeight', itemHeight );
            } else {
                $li.css( 'height', itemHeight );
                $preview.css( 'height', previewHeight );

                $timeout( function( ) {
                    $li.addClass( 'og-expanded' );
                    $anchor.addClass( 'clicked' );
                }, settings.speed, false );

//                 console.log( 'WITH_Transition', $li, 'itemHeight', itemHeight );
            }
        }

        function scroll( ) {
            if ( $li == null ) return;

			var position = $li.offset( ).top,
				previewOffsetT = $preview.offset( ).top - scrollExtra,
				scrollVal;

			// Scroll page
			// case 1 : Expanded Item fits in window큦 height
//             console.log( 'previewHeight + itemHeight + marginExpanded', previewHeight + itemHeight + marginExpanded, 'winsize.height', winsize.height );
            if ( itemHeight <= winsize.height ) {
                scrollVal = position;
//             console.log( '1', 'position', position, 'scrollVal', scrollVal );
            } else if ( previewHeight < winsize.height ) {
			// case 2 : preview height does not fit in window큦 height and preview height is smaller than window큦 height
                scrollVal = previewOffsetT - ( winsize.height - previewHeight );
            console.log( '2', 'position', position, 'scrollVal', scrollVal );
            } else {
			// case 3 : preview height does not fit in window큦 height and preview height is bigger than window큦 height
			    // In case there is not old values yet
			    if ( oldLi != null ) {
    			    // Validate if the old item is on an upper row in which
    			    // case I will have old item's height in accoutnt
    			    // for the scrolling value.
                    if ( oldLi.offset( ).top < $li.offset( ).top ) {
                        scrollVal = previewOffsetT - oldPreviewHeight;
                    } else {
                        // If the old item is on a lower row then the scrolling
                        // value is calculated with the usual PreviewOffSetT
                        scrollVal = previewOffsetT;
                    }
			    } else {
                    scrollVal = previewOffsetT;
                }

            console.log( 'case 3 : preview height does not fit in window큦 height and preview height is bigger than window큦 height'
                , 'scrollVal', scrollVal );
            }

			$body.animate( { scrollTop : scrollVal }, settings.speed );
        }

        function closePreview( li, preview, anchor ) {
            // If these values are undefined then this function
            // is being called from the close preview span tag
            // In which case it requires transitions and an item reset
            if ( li == undefined || preview == undefined ) {
                if ( $li != null ) {
                    $li.removeClass( 'noTransition' );
                    $preview.removeClass( 'noTransition' );
                }
                noTransition = false;

                li = $li;
                preview = $preview;
                anchor = $anchor;

                resetItem( );

                oldLi = null;
                oldPreview = null;
                oldAnchor = null;
            }

            preview.css( 'height', 0 );
            li.css( 'height', settings.defaultItemHeight );

            // Sometimes we require no transitions when closing preview
            // Please checl the clickedItem function for the documentation
            // about different cases
            if ( noTransition ) {
    			li.removeClass( 'og-expanded' );
    			anchor.removeClass( 'clicked' );
            } else {
                var vli = li, vanchor = anchor;
                $timeout( function( ) {
        			vli.removeClass( 'og-expanded' );
        			vanchor.removeClass( 'clicked' );
                }, settings.speed, false );
            }
        }

        function resetItem( ) {
            oldLi = $li;
            oldPreview = $preview;
            oldAnchor = $anchor;

            $li = null;
            $preview = null;
            $anchor = null;
            
            oldPreviewHeight = previewHeight;
            itemHeight = oldIemHeight;
        }

        function clickedItem( item ) {
            getWinSize( );

            var code = item.coupon_code;
            
            noTransition = false;

            // Case 2 - There is a preview object open
            if ( $preview != null) {
//console.log( 'Case 2 - There is a preview object open' );
                // Remove no transition class just in case
                $li.removeClass( 'noTransition' );
                $preview.removeClass( 'noTransition' );

                // Case 2.1 - Clicked on the same open item
                // Action: Close the preview and return
                if ( vm.openItem == code ) {
//console.log( 'Case 2.1 - Clicked on the same open item' );
           			vm.openItem = null;
                    closePreview( $li, $preview, $anchor );
                    resetItem( );
                    return;
                } else {
                    // Case 2.2 - Clicked on a different item but already open
//                     console.log( '$li.offset( ).top', $li.offset( ).top );

                    var $newli = $( '#li_' + code );
                    // Case 2.2.1 - ANother coupon in the Same Row
                    // Action: Just open the new one but avoid openning animations
                    if ( $li.offset( ).top == $newli.offset( ).top ) {
//console.log( 'Case 2.2.1 - ANother coupon in the Same Row' );
                        // All methods should know that, for now, no transitions
                        noTransition = true;

                        resetItem( );

                        // First remove transitions on the current item
                        oldLi.addClass( 'noTransition' );
                        oldPreview.addClass( 'noTransition' );
                        oldAnchor.addClass( 'noTransition' );

                        // Remove transitions on the clicked item
/*
                        $li = $( '#li_' + code );
                        $preview = $( '#preview_' + code )
                        $li.addClass( 'noTransition' );
                        $preview.addClass( 'noTransition' );
*/
/*
                        // Open new preview before closing the existing one
                        openPreview( item );
                        scroll( );
                        // Close existing preview
                        closePreview( oldLi, oldPreview, oldAnchor );
*/
                    } else {
//console.log( 'Case 2.2.2 - Another coupon in a different Row' );
                        // Case 2.2.2 - Another coupon in a different Row
                        // Action: Close the existing coupon and open the new one but with ANIMATIONS
                        resetItem( );


/*
                        // Open new preview before closing the existing one
                        openPreview( item );
                        scroll( );
                        // Close existing preview
                        closePreview( oldLi, oldPreview, oldAnchor );
*/
                    }

                    // Open new preview before closing the existing one
                    openPreview( item );
                    scroll( );
                    // Close existing preview
                    closePreview( oldLi, oldPreview, oldAnchor );
 
                }
            } else {
// console.log( 'Case 1 - Nothing open' );
                openPreview( item );
                scroll( );
            }
        }
    }
})();