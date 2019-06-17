var $ = require('jquery');

module.exports = function(){

    var reqwest = require('reqwest');
    var parseXML = require('./lib/parseXML.js');
    
    var PHOTO_URL_BASE = "http://cms.podgeevents.com/api/getphoto/key/qu4dz669p1bls3t5zec4alps3yevuwoazo04jvq/dir/150/photo/"
    
    var htmlTemplate = require('./attendeeTemplate.html');
    var format = require('string-template');
    
    var attendees = document.querySelector('.attendees');
    
    reqwest({
    	url: 'http://cms.podgeevents.com/api2/get-members/key/qu4dz669p1bls3t5zec4alps3yevuwoazo04jvq',
    	crossOrigin: true,
    	success: function(response){
    		
    		var membersObj = parseXML(response).result;
    		var membersArr = [];
    		
    		for(var key in membersObj) membersArr.push( membersObj[key] );
    		
    		var html = membersArr.map(function(member){
    			
    			var clean = {};
    			
    			for(var key in member) {
    				
    				if( '#cdata-section' in member[key] ) {
    					clean[key] = member[key]['#cdata-section'];
    				} else {
    					clean[key] = member[key];
    				}
    				
    			}
    			
    			if(clean.Photo) clean.Photo = PHOTO_URL_BASE + clean.Photo;
    			
    			return clean;
    			
    		}).reduce(function(html, member){
    			
    			return html + format( htmlTemplate, member );
    			
    		}, '');
    		
    		
    		document.getElementById('attendee-list').innerHTML = html;
    		
    		$('.attendees li').each(function(){
    		    
    			var url = this.getAttribute('data-img');
    			
    			var img = new Image();
    			
    			img.src = url;
    			
    			function on(){
    			        
				    document.body.style.backgroundImage = 'url(' + url + ')';
				    document.body.classList.add( 'attendees-on' );

    			}
    			
    			this.addEventListener('mouseenter', on);
    			this.addEventListener('touchstart', on);
    		
    			
    		});
    		
    		document.body.addEventListener('hideSection', function(){
    		    
                document.body.style.backgroundImage = '';
    		    document.body.classList.remove( 'attendees-on' );

    		})

    	}
    })

}