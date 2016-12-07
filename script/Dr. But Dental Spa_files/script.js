
(function(n){
	n.viewportSize={},
	n.viewportSize.getHeight=function(){
		return t("Height")},
		n.viewportSize.getWidth=function(){
			return t("Width")
		};
		var t=function(t){
			var f,
			o=t.toLowerCase(),
			e=n.document,
			i=e.documentElement,r,u;
			return n["inner"+t]===undefined?f=i["client"+t]:n["inner"+t]!=i["client"+t]?(r=e.createElement("body"),
				r.id="vpw-test-b",
				r.style.cssText="overflow:scroll",
				u=e.createElement("div"),
				u.id="vpw-test-d",
				u.style.cssText="position:absolute;top:-1000px",
				u.innerHTML="<style>@media("+o+":"+i["client"+t]+"px){body#vpw-test-b div#vpw-test-d{"+o+":7px!important}}<\/style>",
				r.appendChild(u),i.insertBefore(r,e.head),f=u["offset"+t]==7?i["client"+t]:n["inner"+t],
				i.removeChild(r)):f=n["inner"+t],f
		}
	})(this);


	$.fn.clickToggle = function(func1, func2) {
		var funcs = [func1, func2];
		this.data('toggleclicked', 0);
		this.click(function() {
			var data = $(this).data();
			var tc = data.toggleclicked;
			$.proxy(funcs[tc], this)();
			data.toggleclicked = (tc + 1) % 2;
		});
		return this;
	};

	jQuery( document ).ready(function( $ ) {
		var position = new Object(),
		$fburl = 'https://www.facebook.com/drbutdentalspa',
		$fbres = $('.result-likes'),
		$twurl = 'http://api.twittercounter.com/?apikey=66656821eb7a09522db9066eb5240601&twitter_id=247340748',
		$twres = $('.result-followers');

		// $('html').enscroll({
		// 	showOnHover: true,
		// 	verticalTrackClass: 'track3',
		// 	verticalHandleClass: 'handle3'
		// });


	//initialize positions
	$('#servicii article').each( function (index, value) {
		className = $(value).attr('class');
		position[className] = {top: $(value).offset().top, left: $(value).offset().left};
	});

	//swap an element with the first in list	
	swap = function (elem, posTop, posLeft) {
		tempTop = $('.first').offset().top;
		tempLeft = $('.first').offset().left;
		$('.first').offset({top: posTop, left: posLeft});
		$(elem).offset({top: tempTop,left:tempLeft});
	}

 	//move elements in a position
 	offsetElem = function (elem, posTop, posLeft) {
 		$(elem).offset({top: posTop, left:posLeft});
 	}

 	//facebook likes
 	function fetchLikeCount(url){
 		return $.Deferred(function(defer){
 			$.ajax({
 				dataType: 'jsonp',
 				url: 'https://api.facebook.com/method/fql.query?callback=callback',
 				data: {
 					query: 'SELECT like_count FROM link_stat WHERE url="' + url + '"',
 					format: 'JSON'
 				}
 			}).then(function(res){
 				try{
 					var count = res[0].like_count;
 					defer.resolve(count);
 				}catch(e){
 					reject();
 				}
 			}, reject);
 			function reject(){
 				defer.reject(';(');
 			};
 		}).promise();
 	}

 	

 	//count result likes.
 	fetchLikeCount($fburl).always(function(res){
 		$('.result-likes').text(res);
 	});


 	setInterval(function () {

 		$('.result-likes').prop('Counter',0).animate({
 			Counter: $('.result-likes').text()
 		}, {
 			duration: 1500,
 			easing: 'swing',
 			step: function (now) {
 				$(this).text(Math.ceil(now));
 			}
 		});  
 	}, 7000);  

	//expand servicii area
	$("#servicii article").click(function (event) {

		if ($(this).hasClass('selected')) {
			$('#servicii .servicii-details').fadeOut( "slow");
			$(this).removeClass('darken').removeClass('selected');
			$('#servicii .servicii-details div').getNiceScroll().remove();

		} else {
			$('#servicii article').removeClass('selected');
			$(".servicii-details > div").hide();
			$('#servicii .servicii-details').fadeIn( "slow");
			$('#servicii .servicii-details div').getNiceScroll().remove();

			$("#servicii article").removeClass('darken').removeClass('first')
			className = $(this).attr('class');
			$(".servicii-details div[data-content='" + className + "']").fadeIn("slow");

			$(this).addClass('darken').addClass('first').addClass('selected');
			$('#servicii .servicii-details div[data-content="' + className  + '"]').niceScroll({cursorcolor:"#fff"});
			// $(' #servicii .servicii-details div[data-content="' + className  + '"]').enscroll({
			// 	showOnHover: true,
			// 	verticalTrackClass: 'track3',
			// 	verticalHandleClass: 'handle3'
			// });
		}
	});

	//expand tarife area 
	//@TODO refactor services area and tarife area functionalities
	$("#tarife article").click(function (event) {

		if ($(this).hasClass('selected')) {
			$('#tarife .tarife-details').fadeOut( "slow");
			$(this).removeClass('darken').removeClass('selected');
			$('#tarife .tarife-details div').getNiceScroll().remove();

		} else {
			$('#tarife article').removeClass('selected');
			$(".tarife-details > div").hide();
			$('#tarife .tarife-details').fadeIn( "slow");

			$("#tarife article").removeClass('darken').removeClass('first')
			className = $(this).attr('class');
			$(".tarife-details div[data-content='" + className + "']").fadeIn("slow");
			$('#tarife .tarife-details div[data-content="' + className  + '"]').niceScroll({cursorcolor:"#fff"});

			$(this).addClass('darken').addClass('first').addClass('selected');
			//$('#tarife .tarife-details .embed').niceScroll({cursorcolor:"#fff"});

		}
	});


	//read prices from an external file
	function retrievePriceLists(result, contentTitle) {
		items = $(result).find(contentTitle);
		$.each( $(items).children(), function( key, value ) {
			sericeItem = '<div class="service">' + $(value).find('service').html() + '</div>';
			priceItem = '<div class="price">' + $(value).find('price').text() + '</div>';
			$('.tarife-details').find("[data-content='" + contentTitle + "']").find('.text-content ul').append('<li>'+ sericeItem + priceItem +'</li>');
		});
	}


	$.ajax({
		url: '/content/content.xml',
		type: "GET",
		dataType: "xml",
		success: function (result) {

			retrievePriceLists(result,'protetica');
			retrievePriceLists(result,'implantologie');
			retrievePriceLists(result, 'hialuronic');
			retrievePriceLists(result, 'chirurgie');
			retrievePriceLists(result, 'cosmetica');
			retrievePriceLists(result, 'ortodontie');
		}
	});





});



( function( $ ) {

	// Setup variables
	$window = $(window);
	$slide = $('#acasa.homeSlide .bcg');
	$body = $('body');
	
    //FadeIn all sections   
    $body.imagesLoaded( function() {
    	setTimeout(function() {

		      // Resize sections
		      adjustWindow();
		      
		      // Fade in sections
		      $body.removeClass('loading').addClass('loaded');

		  }, 80);
    });

    function adjustWindow(){

		// Init Skrollr
		var s = skrollr.init({
			render: function(data) {

		        //Debugging - Log the current scroll position.
		        //console.log(data.curTop);
		    }
		});
		
		// Get window size
		winH = $window.height();
		console.log(winH);
	    // Keep minimum height 550
	    if(winH <= 550) {
	    	winH = 550;
	    } 
	    
	    // Resize our slides
	    $slide = $('#acasa.homeSlide .bcg');
	    $slide.height(winH);

	    console.log($slide);
	    console.log($slide.height());
	    // Refresh Skrollr after resizing our sections
	    s.refresh($('.homeSlide'));
	    
	}

	

} )( jQuery );