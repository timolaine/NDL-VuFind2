finna.StreetSearch = (function() {
    var doStreetSearch = function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(buildSearch, geoLocationError);
        } else { 
            geoLocationError();
        }
    }
    
    var geoLocationError = function(error) {
        errorString = VuFind.translate('street_search_geolocation_unsupported');
        if (error) {
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorString = VuFind.translate('street_search_geolocation_inactive');
                    break;
            }
        }
        this.ssbutton.parent().append('<br />' + errorString);
    }

    var reverseGeocode = function(position) {
        var xhr = new XMLHttpRequest();
        
        xhr.open("GET", "https://api.digitransit.fi/geocoding/v1/reverse?point.lat=" +
                        position.coords.latitude +
                        "&point.lon=" +
                        position.coords.longitude +
                        "&size=1",
                false);
        xhr.send();

        obj = JSON.parse(xhr.responseText);
        
        return {
            street : obj.features[0].properties.street,
            city : obj.features[0].properties.locality
        }
    }
  
    var buildSearch = function(position) {
        address = reverseGeocode(position);
        
        street = address.street;
        city = address.city;
        
        searchterm = encodeURIComponent(street + ' ' + city);
        
        window.location.href = VuFind.path + '/Search/Results?lookfor=' +
                                 searchterm +
                                 '&type=AllFields&limit=100&view=grid' +
                                 '&filter[]=~format%3A"0%2FImage%2F"' +
                                 '&filter[]=~format%3A"0%2FPlace%2F"' +
                                 '&filter%5B%5D=online_boolean%3A%221%22';

    }

    var my = {
        init: function() {
            window.onload = function() {
                this.ssbutton = $("#street-search-button");

                this.ssbutton.click(function() { doStreetSearch() });
            }
        }
    };

    return my;
})(finna);

finna['StreetSearch'].init();