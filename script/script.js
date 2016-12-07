var pricesUrlFileRo = '/content/content_ro.xml',
	pricesUrlFileEn = '/content/content_en.xml';

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
				i.removeChild(r)):f=n["inner"+t],f}
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

	//initialize positions
	$('#servicii article').each( function (index, value) {
		className = $(value).attr('class');
		position[className] = {top: $(value).offset().top, left: $(value).offset().left};
	});

	//move class active on header on scrolling the
	$(document).scroll( function (event) {
		onScroll();
	});

	//header ribbon, move active class
	$('header nav li').click(function (event) {
		$('header nav.mini ul').hide();
		$('header nav .menu-icon').removeClass('selected');
		event.currentTarget.firstElementChild.preventDefault();
		
		$('header nav li a').removeClass("active");
		$(this).find('a').addClass("active");

		var target = $(this).find('a').get(0).hash;
		$target = $(target);
		$('html, body').stop().animate({
			'scrollTop': $target.offset().top+2
		}, 500, 'swing', function () {
			window.location.hash = target;
			$(document).on("scroll", onScroll);
		
		})
	});

	$('header nav .menu-icon').click(function (event) {
		if ($(this).hasClass('selected')) {
			$(this).removeClass('selected');
			$('header nav ul').hide();
		}
		else {
			$(this).addClass('selected');
			$('header nav').addClass('mini');
			$('header nav ul').show();
		}
	});

	$('header nav.mini ul li').click(function (e) {
		$('header nav ul').hide();
		$(this).removeClass('selected');
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

 	onScroll = function (event) {
 		var scrollPosition = $(document).scrollTop();
 		$('nav a').each(function () {
 			var currentLink = $(this);
 			var refElement = $(currentLink.attr("href"));
 			if (refElement.position().top <= scrollPosition && refElement.position().top +refElement.height() > scrollPosition) {
 				$('nav ul li a').removeClass("active");
 				currentLink.addClass("active");	
 			} else {
 				currentLink.removeClass("active")
 			}
  		});
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

	$("#send_email").click(function(e){      
		e.preventDefault()
        to=$("#name").val();
        message=$("#message").val();
        from=$("#mail").val();
        $("#message1").text("Sending E-mail...Please wait");

		$.ajax({
		  method: "POST",
		  url: "/send",
		  data: { to: "John", from: "Boston", text: "hello" }
		})
		  .done(function( msg ) {
		    alert( "Data Saved: " + msg );
		  });
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

	if ($('body').attr('lang')== 'UK') {
		url = pricesUrlFileEn;
	} else {
		url = pricesUrlFileRo;
	}

	$.ajax({
		url: url,
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


	//sliders for pareri and galerie
	 $(document).ready(function() {
	    var slider = $("#pareri-texts").lightSlider({
	        item: 1,
	        slideMargin: 100,
	        slideMove: 1,
	        controls: true
		});
		var galerieslider = $("#galerie-slider").lightSlider({
			item: 1,
			slideMove: 1,
			loop: true,
			auto: true,
			speed: 1400
		});
		var topslider = $("#acasa-slider").lightSlider({
			item: 1,
			slideMove:1,
			auto: true,
	
			mode: 'slide',
			pager: false,
			controls: true,
			adaptiveHeight: false,
			speed: 1300,
			easing: 'cubic-bezier(0.25, 0, 0.25, 1)'
		});
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