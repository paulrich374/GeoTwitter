var yourlat = 34.008054, yourlong = -118.426506;
var map, geocoder, marker, ey, my, mouseDown = false;
var markerlength=0;
var infoWindow =null;// new google.maps.InfoWindow();
var pushPin =[]; 
var o = {
    init: function(lat,lng){
        this.map.init(lat,lng);
        //initPopupBox();
        //this.twitter.show();
        //this.twitter.click();
        //this.scroll.init();
        //loadLatestTweet();

    },
    twitter: {
        get: function(){
            var arr = new Array;
            $('.get').find('input').each(function(i){
                var t = $(this), 
                    val = t.val();
                arr[i] = val;               
            });
            
            return arr;
        },
        show: function(){
            var users = o.twitter.get(), // retrieve all users which are stored in html
                arr = new Array;
            for (i in users){
                var user = users[i];
                //alert(user);
                $.getJSON('http://twitter.com/users/show/'+user+'.json?callback=?', function(data) {
                    var img = data.profile_image_url, 
                        screen_name = data.screen_name;
                        //alert(img);
                    geocoder.geocode({ address: data.location }, function(response, status){
                        if (status == google.maps.GeocoderStatus.OK) {
                            var x = response[0].geometry.location.lat(), 
                                y = response[0].geometry.location.lng();
                                //alert(x+"..."+y);
                            marker = new google.maps.Marker({
                                icon: img,
                                map: map,
                                title: screen_name,
                                position: new google.maps.LatLng(x, y)
                            });
                            arr.push('<div class="item">');
                            arr.push('<p class="img"><a href="#" class="open" rel="'+screen_name+'"><img src="'+img+'" alt="" /></a></p>');
                            arr.push('<div class="entry">');
                            arr.push('<a href="#" class="open title" rel="'+screen_name+'">'+data.name+'</a>');
                            arr.push('<p class="description">'+data.description+'</p>');
                            arr.push('<p class="url"><a href="'+data.url+'" target="_blank">'+data.url+'</a></p>');
                            arr.push('<p class="count">Followers: '+data.followers_count+', Following: '+data.friends_count+'</p>');
                            arr.push('</div>');
                            arr.push('</div>');
                            var html = arr.join('');
                            arr = [];
                            $('.twitter').find('.inside').append(html);
                            google.maps.event.addListener(marker, 'click', function(){
                                o.twitter.open(this.title);
                            }); 
                        }
                    });
                });
            }
        },
        click: function(){
            $('.twitter').find('.open').live('click', function(){
                var t = $(this), rel = t.attr('rel');
                o.twitter.open(rel);
            });
        },
        open: function(user){
            var posts = $('.posts'), arr = new Array;
            $.getJSON('http://twitter.com/status/user_timeline/'+user+'.json?count=5&callback=?', function(data) {
                $.each(data, function(i, post){
                    arr.push('<div class="post">');
                    arr.push(post.text);
                    arr.push('</div>');
                });
                var html = arr.join('');
                posts.html(html).fadeIn();
            });
        }
    },    
    map: {
        init: function(lat2,lng2){
            //var size = o.map.size();
            /*
            $('#map').css({ width: size.width, height: size.height });
            map = new google.maps.Map(document.getElementById('map'), o.map.data),
            geocoder = new google.maps.Geocoder();
            google.maps.event.addListener(map, 'dragstart', function(){
                $('.posts').hide();
            }); 
            */
   			// This is the minimum zoom level that we'll allow
   			var minZoomLevel = 12;
			
			//alert('Latitude : ' + yourlat+'Longitude : ' + yourlong);

			
   			map = new google.maps.Map(document.getElementById('map_canvas'), {
      			zoom: minZoomLevel,
      			center: new google.maps.LatLng(lat2, lng2),
      			mapTypeId: google.maps.MapTypeId.ROADMAP
   			});    
   			geocoder = new google.maps.Geocoder();
			google.maps.event.addListener(map, 'dragstart', function(){
				$('.posts').hide();
			});    
			/*-- Init Yoour Palce:Create Main maker and Photo markers  
			--
			-----------------*/ 			
			placeMarkerFirst(map.center);
			loadNearbyTweet(lat2, lng2);
			/*--ActionEvent :Click Map
			--
			-----------------*/
			google.maps.event.addListener(map, 'click', function(event) {
				/*-- :Create Main maker  
				--
				-----------------*/    			
    			placeMarker(event.latLng);
    			var myLatLng = event.latLng;
    			var lat = myLatLng.lat();
    			var lng = myLatLng.lng();
    			//alert(myLatLng);

				/*-- :Reset Center to curr pos 
				--
				-----------------*/
				window.setTimeout(function() {
				var center = myLatLng;//map.getCenter();map.getCenter().lat();map.getCenter().lng();
				//alert(center);
				google.maps.event.trigger(map, "resize");
				map.setCenter(center); 				
				}, 100);				
				
				/*-- :Create Photo markers 
				--
				-----------------*/
    			loadNearbyTweet(lat, lng);
    			
  			}); 
  			/* now inside your initialise function */
  			//infoWindow = new google.maps.InfoWindow({
  			//	content: "holding..."
  			//});
  			
        }
    },
    scroll: {
        mouse: function(e){
            var y = e.pageY; 
            return y;
        },
        check: function(y){
            var all = $('.twitter').height(),
                inside = $('.twitter').find('.inside').height();
            if (y < (all - inside)) {
                y = all - inside;
            } else if (y > 0) {
                y = 0;
            }
            return y;
        },
        update: function(e){
            var y = o.scroll.mouse(e),
                movey = y-my,
                top = ey+movey;
                check = o.scroll.check(top);
            $('.twitter').find('.inside').css({ top: check+'px' });
        },
        init: function(){
            $('.twitter').find('.inside').bind({
                mousedown: function(e){
                    e.preventDefault();
                    mouseDown = true;
                    var mouse = o.scroll.mouse(e);
                        my = mouse;
                    var element = $(this).position();
                        ey = element.top;
                    o.scroll.update(e);
                },
                mousemove: function(e){
                    if (mouseDown)
                        o.scroll.update(e);
                    return false;
                },
                mouseup: function(){
                    if (mouseDown)
                        mouseDown = false;
                    return false;
                },
                mouseleave: function(){
                    if (mouseDown)
                        mouseDown = false;
                    return false;
                }
            });
        }
    }
}
//$(function(){ o.init(); });

function placeMarkerFirst(location) {
  var marker = new google.maps.Marker({
  	  icon: 'twitter_map_marker.png',
  	  zIndex:99999999,
      position: location,
      map: map
  });
}
function placeMarker(location) {
  var marker = new google.maps.Marker({
  	  icon: 'pin_tweet.png',
  	  zIndex:99999999,
      position: location,
      map: map
  });
}

$(document).on('pageshow', '#index',function(e,data){ 
			// JQuery Mobile 
            var header = $.mobile.activePage.find("div[data-role='header']:visible");
			var footer = $.mobile.activePage.find("div[data-role='footer']:visible");
			var content = $.mobile.activePage.find("div[data-role='content']:visible:visible");
			var viewport_height = $(window).height();
    		
			var content_height = viewport_height - header.outerHeight() - footer.outerHeight();
			if((content.outerHeight() - header.outerHeight() - footer.outerHeight()) <= viewport_height) {
				content_height -= (content.outerHeight() - content.height());
			} 
    		//$('#content').height(getRealContentHeight());
    		$('#content').height(content_height);
    		
        	// check for Geolocation support
        	
        	if (navigator.geolocation) {
            	navigator.geolocation.getCurrentPosition(success, error);
            	//alert(success);
        	} else {
        		o.init(yourlat, yourlong);
        	} 
        		
        		
        		
        	//InitCloseCard();	
			       	
    		
});









function success(pos) {
  var crd = pos.coords;
  
/*
  console.log('Your current position is:');
  console.log('Latitude : ' + crd.latitude);
  console.log('Longitude: ' + crd.longitude);
  console.log('More or less ' + crd.accuracy + ' meters.');
*/
//alert('Latitude : ' + crd.latitude+'Longitude : ' + crd.longitude);
//yourlat = crd.latitude;
//yourlong = crd.longitude;
o.init(crd.latitude, crd.longitude);
};

function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
};




/*
//Twitter Parsers
String.prototype.parseURL = function() {
	return this.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function(url) {
		return url.link(url);
	});
};
String.prototype.parseUsername = function() {
	return this.replace(/[@]+[A-Za-z0-9-_]+/g, function(u) {
		var username = u.replace("@","")
		return u.link("http://twitter.com/"+username);
	});
};
String.prototype.parseHashtag = function() {
	return this.replace(/[#]+[A-Za-z0-9-_]+/g, function(t) {
		var tag = t.replace("#","%23")
		return t.link("http://search.twitter.com/search?q="+tag);
	});
};
function parseDate(str) {
    var v=str.split(' ');
    return new Date(Date.parse(v[1]+" "+v[2]+", "+v[5]+" "+v[3]+" UTC"));
} 

function loadLatestTweet(){
	var numTweets = 1;
    var _url = 'https://api.twitter.com/1.1/statuses/user_timeline/GeoSocialMobileApp.json?callback=?&count='+numTweets+'&include_rts=1';
    $.getJSON(_url,function(data){
    for(var i = 0; i< data.length; i++){
    	//alert("555");
            var tweet = data[i].text;
            var created = parseDate(data[i].created_at);
            var createdDate = created.getDate()+'-'+(created.getMonth()+1)+'-'+created.getFullYear()+' at '+created.getHours()+':'+created.getMinutes();
            tweet = tweet.parseURL().parseUsername().parseHashtag();
            tweet += '<div class="tweeter-info"><div class="uppercase bold"><a href="https://twitter.com/#!/CypressNorth" target="_blank" class="black">@CypressNorth</a></div><div class="right"><a href="https://twitter.com/#!/CypressNorth/status/'+data[i].id_str+'">'+createdDate+'</a></div></div>'
            $("#twitter-feed").append('<p>'+tweet+'</p>');
        }
    });
}
*/

/* Load Tweets table  - For Loop*/
function loadNearbyTweet(lat, lng){

	
    var displaylimit = 20;
    var twitterprofile = lat+', '+lng;
	var screenname = "Geo Tweets";
    var showdirecttweets = false;
    var showretweets = true;
    var showtweetlinks = true;
    var showprofilepic = true;
	var showtweetactions = true;
	var showretweetindicator = true;
	




	/* Info Window - Static Map*/
	defaultMapString = 'http://maps.google.com/maps/api/staticmap?';
    //  wrap the lat and lng for larger than 180 degree
    var myLatlng = new google.maps.LatLng(lat, lng,false);
    centerString = '&center='+ myLatlng.toUrlValue();
    zoomString = '&zoom='+ map.getZoom();
    //markerString = '&markers=';
    markerString = '&markers=icon:http://www.weihungliu.com/GeoTwitter/pin_tweet.png'+'|'+myLatlng.toUrlValue() + '|';
    
	var winW = 600, winH = 400;
	if (document.body && document.body.offsetWidth) {
	 winW = document.body.offsetWidth;
	 winH = document.body.offsetHeight;
	}
	if (document.compatMode=='CSS1Compat' &&
	    document.documentElement &&
	    document.documentElement.offsetWidth ) {
	 winW = document.documentElement.offsetWidth;
	 winH = document.documentElement.offsetHeight;
	}
	if (window.innerWidth && window.innerHeight) {
	 winW = window.innerWidth;
	 winH = window.innerHeight;
	}    
    sizeString = 'size='+winW+'x'+winH/3;
    typeString = '&maptype=' + map.mapTypeId;






	
	
	/* Info Window - Header */
	var headerHTML = '';
	var loadingHTML = '';
	headerHTML += '<a href="https://twitter.com/" target="_blank"><img src="twitter-bird-light.png" width="34" style="float:left;padding:3px 12px 0px 6px" alt="twitter bird" /></a>';
	headerHTML += '<h1>'+screenname+' <span style="font-size:13px"><a href="https://twitter.com/'+twitterprofile+'" target="_blank">@'+twitterprofile+' within 1 mile'+'</a></span></h1>';
	loadingHTML += '<div id="loading-container"><img src="images/ajax-loader.gif" width="32" height="32" alt="tweet loader" /></div>';
	

    
    
	

	$('#twitter-feed').html(headerHTML + loadingHTML);	
	
	
	//var pushPin = [];
	
	
	//var markerShapeSmallFestival = {
   	//	coord: [23,3,42,10,44,22,38,41,25,52,10,44,3,31,5,15,11,5],
   	//	type: 'poly'
	//};	
	
	/* Info Window - Stream Tweets */
    $.getJSON('test.php?lat='+lat+'&lng='+lng, 
        function(feeds) {   
        	markerlength = feeds.statuses.length;
		    //alert(feeds.statuses.length);
		   	if (feeds.statuses.length==0) {
				alert("Sorry, no tweets around here.");
				return false;
			}
            var feedHTML = '';
            var displayCounter = 1; 
            var displayNullCounter = 0;      
              
              
            for (var i=0; i < feeds.statuses.length; i++) {
				var tweetscreenname = feeds.statuses[i].user.name;
				//alert("1111");
                var tweetusername = feeds.statuses[i].user.screen_name;
                //alert(tweetusername);
                var profileimage = feeds.statuses[i].user.profile_image_url_https;
                //alert(profileimage);
                var status = feeds.statuses[i].text; 
                //alert(status);
				var isaretweet = false;
				var isdirect = false;
				var tweetid = feeds.statuses[i].id_str;
				//alert(tweetid);
				if (!(feeds.statuses[i].coordinates)) {
					//return false;
					
					if (displayNullCounter==feeds.statuses.length-1) {
						alert("Sorry, no tweets around here.");
						return false;
					}
					displayNullCounter++;
					//alert(displayNullCounter+"of"+feeds.statuses.length);
					continue;
					
				}
			    var y = feeds.statuses[i].coordinates.coordinates[0]; 
                var x = feeds.statuses[i].coordinates.coordinates[1];
                //alert(feeds.statuses[i].coordinates.coordinates.length);
                //alert(x+","+y);				
				//var options2;

				
				
				
				
				
				
				//If the tweet has been retweeted, get the profile pic of the tweeter
				if(typeof feeds.statuses[i].retweeted_status != 'undefined'){
				   profileimage = feeds.statuses[i].retweeted_status.user.profile_image_url_https;
				   tweetscreenname = feeds.statuses[i].retweeted_status.user.name;
				   tweetusername = feeds.statuses[i].retweeted_status.user.screen_name;
				   tweetid = feeds.statuses[i].retweeted_status.id_str;
				   status = feeds.statuses[i].retweeted_status.text; 
				   isaretweet = true;
				   //alert("4444-1");
				 };
				 
				 
				 //Check to see if the tweet is a direct message
				 if (feeds.statuses[i].text.substr(0,1) == "@") {
					 isdirect = true;
					 //alert("4444-2");
				 }
				 
				//console.log(feeds[i]);
				 
				 //Generate twitter feed HTML based on selected options
				 //if (((showretweets == true) || ((isaretweet == false) && (showretweets == false))) && ((showdirecttweets == true) || ((showdirecttweets == false) && (isdirect == false)))) { 
					if ((feeds.statuses[i].text.length > 1) && (displayCounter <= displaylimit)) {             
						
						//alert("555");
						//alert(feeds.statuses[i].coordinates.coordinates);
						//alert(feeds.statuses[i].coordinates.coordinates[0]);
						//alert(feeds.statuses[i].coordinates.coordinates[1]);


/*
					//var photoURL = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_z.jpg';		
					htmlImageString = '<img src="' + profileimage + '">';				
					var contentString = '<div class="pop_up_image_box_text">' + tweetusername + '<br/>' + htmlImageString + '</div>';
					//Create a new info window using the Google Maps API
					infowindow[i] = new google.maps.InfoWindow({
						 //Adds the content, which includes the html to display the image from Flickr, to the info window.
  		 				 content: contentString
					});
					//Create a new marker position using the Google Maps API
					var myLatlngMarker = new google.maps.LatLng(x,y);								
					//Create a new marker using the Google Maps API and assign the marker to the map created below.
					pushPin[i] = new google.maps.Marker({
   					position: myLatlngMarker,
     				map: map,
					icon: profileimage,
					shape: markerShapeSmallFestival,
     				title:tweetusername
					});	
                    //Uses the Google Maps API to add an event listener that triggers the info window to open if the box marker is clicked.
					google.maps.event.addListener(pushPin[i], 'click', function() {
  					infowindow[i].open(map,pushPin[i]);
  					alert("8888");
					//Makes marker icon come to the front when clicked.
					this.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);	
					}); 			
*/					infoWindow =new google.maps.InfoWindow();
							
					
							
                   	pushPin[i] = new google.maps.Marker({
                    	            icon: profileimage,
                    	            lat:x,
                    	            lng:y,
                    	            map: map,
                    	            title: tweetusername,
                    	            position: new google.maps.LatLng(x, y)
                    });
	  					// title: "1 "+"CRAVEN的丹麥交換學生研究",               // Marker 預設事件是mouseover == tooltip(只是tooltip可以選樣式)	                    
                    //alert(profileimage);
                    var pushPins = pushPin[i];

                    
                    
                    
                    
                    
                    /*--ActionEvent :Click Marker
					--
					-----------------*/
                    //google.maps.event.addListener(pushPin, 'click', function(){
                    google.maps.event.addListener(pushPins, 'click', function(){
                    	                   
                    	//for (var i = 0; i < markerlength; i++) {
    						//infoWindow.close();
   						//}	            
 						
                    		//alert(this.lat+", "+this.lng);
                   		
                    		//alert(options2.position);	
                    		//alert("22"+pushPin.position);		            	
	            		        
                    	// http://api.flickr.com/services/rest/?api_key=8a96dfd6fac4c4eb23eee601af2b07a6&method=flickr.photos.search&lat=34.008054&lon=-118.426506&radius=1&radius_units=mi&format=json&nojsoncallback=1
	            		//for (var i=0; i < feeds.statuses.length; i++) {
	            		//}
		 					//feedHTML = '';
		 				/*	
							feedHTML += '<div class="twitter-article" id="tw'+i+'">'; 										                 
							feedHTML += '<div class="twitter-pic"><a href="https://twitter.com/'+this.title+'" target="_blank"><img src="'+this.icon+'"images/twitter-feed-icon.png" width="42" height="42" alt="twitter icon" /></a></div>';
							feedHTML += '<div class="twitter-text"><p><span class="tweetprofilelink"><strong><a href="https://twitter.com/'+this.title+'" target="_blank">'+this.title+'</a></strong> <a href="https://twitter.com/'+this.title+'" target="_blank">@'+this.title+'</a></span><span class="tweet-time"><a href="https://twitter.com/'+this.title+'/status/'+tweetid+'" target="_blank">'+relative_time(feeds.statuses[i].created_at)+'</a></span><br/>'+status+'</p>';
							if ((isaretweet == true) && (showretweetindicator == true)) {
								feedHTML += '<div id="retweet-indicator"></div>';
							}						
							if (showtweetactions == true) {
								feedHTML += '<div id="twitter-actions"><div class="intent" id="intent-reply"><a href="https://twitter.com/intent/tweet?in_reply_to='+tweetid+'" title="Reply"></a></div><div class="intent" id="intent-retweet"><a href="https://twitter.com/intent/retweet?tweet_id='+tweetid+'" title="Retweet"></a></div><div class="intent" id="intent-fave"><a href="https://twitter.com/intent/favorite?tweet_id='+tweetid+'" title="Favourite"></a></div></div>';
							}
							feedHTML += '</div>';
							feedHTML += '</div>';
						*/	
						//$("#images").html('');
						//$("#flickr").remove();	
						
						
						
						/* Open the card */
						InitOpenCard(pushPins);
						
						
						
						/* Refresh the card */
						$('div').remove('#flickr');
						//feedHTML += '<div id="flickr"><img width="16" height="16" src="flickr.png" alt="Flickr"><a>Nearby Flickr images</a><div id=images><img id="loading" width=48 height=48 src="ajax-loader.gif"></div></div>';
						var feedHTMLAdd = '<div id="flickr"><img width="16" height="16" src="flickr.png" alt="Flickr"><a>Nearby Flickr images</a><div id=images><img id="loading" width=48 height=48 src="ajax-loader.gif"></div></div>';
						//displayCounter++;	            	
          				var options2 ={
							time: 20080807,
	  						position: new google.maps.LatLng(this.lat, this.lng), // Marker
	  						rank: "checkered_flag_64",
	  						cover: this.icon, 	
	  						sidebarItem: this.title,         // Button	  	
	  						content:feedHTML+feedHTMLAdd
						}                      
                    	infoWindow.setOptions(options2); 	            	
	            			
	            			
                    	
						
	            		var htmlImageString;
	            		var contentString="";
	            		
        				/* Load Streams of Flickr Photo into card */
                    	$.getJSON("http://api.flickr.com/services/rest/?api_key=8a96dfd6fac4c4eb23eee601af2b07a6&method=flickr.photos.search&lat="+this.lat+"&lon="+this.lng+"&radius=1&radius_units=mi&per_page=10&format=json&jsoncallback=?", function(data){
  								$.each(data.photos.photo, function(i,item){
    							//$("<img/>").attr("src", item.media.m).appendTo("#images").wrap("<a href='" + item.link + "'></a>");
    							var photoURL = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_z.jpg';
    							//alert(i+", "+photoURL);
    							//htmlImageString = '<img src="' + photoURL + '">';
    							$("<img/>").attr({"src":photoURL,"width":"48","height":"48","class":"frpopup","id":"fr"+i}).prependTo("#images");				
								//contentString = '<div class="pop_up_image_box_text">' + item.title + '<br/>' + htmlImageString + '</div>';
    							//alert(htmlImageString);
    							if (i == data.photos.photo.length -1 ) {
    								$("#images").find('#loading').css('display', 'none');	
    							}
  								});
  						});			            
                    	            
										  
                   	    /* Open marker's infowindow */
                   		//infoWindow.open(map, this);
                   		
                    	     
                    });       
                      	 
 	              							

   	              							
						mapString = defaultMapString + centerString +  zoomString + typeString  + '&' + markerString + '&size=600x200'+'&sensor=false';
                    							
						headerHTML = '<img src="'+mapString+'" style="float:left;padding:3px 12px 0px 6px" alt="" />'+headerHTML;                  							

						
						
						
						if (showtweetlinks == true) {
							status = addlinks(status);
						}
						 
						if (displayCounter == 1) {
							feedHTML += headerHTML;
						}
									 
						feedHTML += '<div class="twitter-article" id="tw'+displayCounter+'">'; 										                 
						feedHTML += '<div class="twitter-pic"><a href="https://twitter.com/'+tweetusername+'" target="_blank"><img src="'+profileimage+'"images/twitter-feed-icon.png" width="42" height="42" alt="twitter icon" /></a></div>';
						feedHTML += '<div class="twitter-text"><p><span class="tweetprofilelink"><strong><a href="https://twitter.com/'+tweetusername+'" target="_blank">'+tweetscreenname+'</a></strong> <a href="https://twitter.com/'+tweetusername+'" target="_blank">@'+tweetusername+'</a></span><span class="tweet-time"><a href="https://twitter.com/'+tweetusername+'/status/'+tweetid+'" target="_blank">'+relative_time(feeds.statuses[i].created_at)+'</a></span><br/>'+status+'</p>';
						
						if ((isaretweet == true) && (showretweetindicator == true)) {
							feedHTML += '<div id="retweet-indicator"></div>';
						}						
						if (showtweetactions == true) {
							feedHTML += '<div id="twitter-actions"><div class="intent" id="intent-reply"><a href="https://twitter.com/intent/tweet?in_reply_to='+tweetid+'" title="Reply"></a></div><div class="intent" id="intent-retweet"><a href="https://twitter.com/intent/retweet?tweet_id='+tweetid+'" title="Retweet"></a></div><div class="intent" id="intent-fave"><a href="https://twitter.com/intent/favorite?tweet_id='+tweetid+'" title="Favourite"></a></div></div>';
						}
						
						feedHTML += '</div>';
						feedHTML += '</div>';
						displayCounter++;
					} else {
						alert("Sorry, no tweets around here.");	
						return false;
					}   
				 //}
            }
             
            $('#twitter-feed').html(feedHTML);
			//alert("9999");
			//Add twitter action animation and rollovers
			if (showtweetactions == true) {				
				$('.twitter-article').hover(function(){
					$(this).find('#twitter-actions').css({'display':'block', 'opacity':0, 'margin-top':-20});
					$(this).find('#twitter-actions').animate({'opacity':1, 'margin-top':0},200);
				}, function() {
					$(this).find('#twitter-actions').animate({'opacity':0, 'margin-top':-20},120, function(){
						$(this).css('display', 'none');
					});
				});			
			
				//Add new window for action clicks
			
				$('#twitter-actions a').click(function(){
					var url = $(this).attr('href');
				  window.open(url, 'tweet action window', 'width=580,height=500');
				  //alert("4444");
				  return false;
				});
			}
			
			
		
			
			
			
			
			
    }).error(function(jqXHR, textStatus, errorThrown) {
		var error = "";
			 if (jqXHR.status === 0) {
               error = 'Connection problem. Check file path and www vs non-www in getJSON request';
            } else if (jqXHR.status == 404) {
                error = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                error = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                error = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                error = 'Time out error.';
            } else if (exception === 'abort') {
                error = 'Ajax request aborted.';
            } else {
                error = 'Uncaught Error.\n' + jqXHR.responseText;
            }	
       		alert("error: " + error);
    });	
    
    
    
    
    
    
    
    
	google.maps.event.addListener(map, "click", function(){
	  	//infoWindow.close();
	  	// ib.close();
   		//Close an photos for the smaller events that may be open.
   		//for (var i = 0; i < markerlength; i++) {
    	infoWindow.close();
   		//}	  
	});      

}




/*
* Additonal functions
*/
//Function -- Action Event :Click marker
for (var j = 0; j < markerlength; j++) {
	var marker = pushPin[j];
	google.maps.event.addListener(marker, 'click', function () {
	// where I have added .html to the marker object.
	infowindow.setContent(this.html);
	infowindow.open(map, this);
	});
}
// Function -- Action Event :Open Card Panel
function InitOpenCard(pushPins){
			// append a new button in header
 			$('.block').append(' <a onclick="InitCloseCard()" data-corners="false"data-role="button" data-theme="a" class="ui-btn-right"> Close</a>').trigger( "create" );


	
	
        	// resize map and reset center
        	$("#map_canvas").animate({// height can be determined by requirement
        	    height: "30%"
        	}, 230);		
	
			window.setTimeout(function() {
				//var center = pushPins.;//new google.maps.LatLng(this.lat, this.lng);// Clicked marker lat, lng
				//alert(center);
				google.maps.event.trigger(map, "resize");
				/* Get Cliked marker position */
				map.setCenter(pushPins.getPosition()); 				
			}, 175);// 100ms for the animated effect	
			
			// Turn on map card
			window.setTimeout(function() {
        	popPin();
        	}, 50);// 100ms for the animated effect	
	
}
// Function -- Action Event :Close Card Panel move bottom
function InitCloseCard(){
	// remove header right button
	$(".ui-btn-right").remove();
	$('.block').append('<a href="login.html" data-corners="false"data-role="button" data-theme="a" class="ui-btn-right"> log in</a>').trigger( "create" );

    // RESIZE Map and RESET Center 
    $("#map_canvas").animate({// height can be determined by requirement
        height: "100%"
    }, 230);		
    
	window.setTimeout(function() {
		var center = map.getCenter();;//pushPins.;//new google.maps.LatLng(this.lat, this.lng);// Clicked marker lat, lng
		//alert(center);
		google.maps.event.trigger(map, "resize");
		/* Get Cliked marker position */
		map.setCenter(center); 				
	}, 145);// 100ms for the animated effect	
	// Turn off map card	
	unPopPin();

}
// Function --  :move up card 
function popPin() {
	$('.map_cardJS').show();
	$('.map_cardJS').stop().animate( { top: '30%' }, 100 );
}		
// Function --  :move down card 
function unPopPin() {
	$('.map_cardJS').stop().animate( { top: '251%' }, 105 );
	$('.map_cardJS').hide();
}
//Function modified from Stack Overflow
function addlinks(data) {
        //Add link to all http:// links within tweets
         data = data.replace(/((https?|s?ftp|ssh)\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!])/g, function(url) {
            return '<a href="'+url+'" >'+url+'</a>';
        });  
        //Add link to @usernames used within tweets
        data = data.replace(/\B@([_a-z0-9]+)/ig, function(reply) {
            return '<a href="http://twitter.com/'+reply.substring(1)+'" style="font-weight:lighter;" target="_blank">'+reply.charAt(0)+reply.substring(1)+'</a>';
        });
		//Add link to #hastags used within tweets
        data = data.replace(/\B#([_a-z0-9]+)/ig, function(reply) {
            return '<a href="https://twitter.com/search?q='+reply.substring(1)+'" style="font-weight:lighter;" target="_blank">'+reply.charAt(0)+reply.substring(1)+'</a>';
        });
        return data;
}
// Function:calculate the relative time   
function relative_time(time_value) {
      var values = time_value.split(" ");
      time_value = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
      var parsed_date = Date.parse(time_value);
      var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
      var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
	  var shortdate = time_value.substr(4,2) + " " + time_value.substr(0,3);
      delta = delta + (relative_to.getTimezoneOffset() * 60);
     
      if (delta < 60) {
        return '1m';
      } else if(delta < 120) {
        return '1m';
      } else if(delta < (60*60)) {
        return (parseInt(delta / 60)).toString() + 'm';
      } else if(delta < (120*60)) {
        return '1h';
      } else if(delta < (24*60*60)) {
        return (parseInt(delta / 3600)).toString() + 'h';
      } else if(delta < (48*60*60)) {
        //return '1 day';
		return shortdate;
      } else {
        return shortdate;
      }
}


	function InitPopup (){
	//$('.ui-btn-right').live('click',function(){
		//alert("55");
		$('.popup').show();
	//});
	}