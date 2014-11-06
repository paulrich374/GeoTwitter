(function($) {
// plugin definition
$.fn.flickrWithin = function(options) {
    var defaults = {
        loading: 'Loading',
        error_geo: 'Geolocation not supported',
        error_pos: 'Failed in getting current position',
        error_flickr: 'There was a problem connecting to Flickr',
        error_nopic: 'No pictures found in your area',
		caption: 'figcaption',
        api_key: ''
    },
    
    // extend default options with those provided
        opts = $.extend(defaults, options),
    
    // system variables
        _type = 'json',
        flickr_api_url = 'http://api.flickr.com/services/rest/?jsoncallback=?',
        flickr_img_url = 'http://farm{farm}.static.flickr.com/{server}/{id}_{secret}_z.jpg',
        flickr_title = '',
        flickr_api = {  // flickr.com/services/api/flickr.photos.search.html
            method: 'flickr.photos.search',
            api_key: opts.api_key,
            content_type: 1,
            media: 'photos',
            lat: 0,
            lon: 0,
            radius: 3,
            radius_units: 'mi',
            per_page: 1,
            page: '',
            format: _type,
            nojsoncallback: 1
        };
    
    // implementation code goes here
    return this.each(function() {
    	
    	//alert("7777");
        var $this = $(this),
			$caption = $this.find(opts.caption);
		
		$caption.html(opts.loading);
        
        // Geolocation success
        function success(position) {
            var pos = position.coords;
            flickr_api.lat = pos.latitude;
            flickr_api.lon = pos.longitude;
            $.get(flickr_api_url, flickr_api, function(data) {
			    if (data.photos.photo.length == 0) {
			        $caption.html(opts.error_nopic);
			    }
			    else {
			        var pic = data.photos.photo[0];
                    flickr_title = pic.title,
                    flickr_img_url = flickr_img_url.replace(/({)([\w\-]+)(})/gi, function(str, p1, p2) {return pic[p2];}); // replace each {key} with its value
                    $this.prepend('<img src="' + flickr_img_url + '">');
				    $caption.html(flickr_title);
			    }
            }, _type)
            .error(function() {
                error(opts.error_flickr);
            });
        }
        
        // error
        function error(msg) {
            $caption.html(typeof msg == 'string' ? msg : opts.error_pos);
        }
        
        // check for Geolocation support
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        }
        else {
            error(opts.error_geo);
        }
    });
};
// end plugin definition
})(jQuery);


$(document).ready(function() {
    $('.flickr').flickrWithin({api_key: '8a96dfd6fac4c4eb23eee601af2b07a6'});
    //alert("555");
});