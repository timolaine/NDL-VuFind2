finna.StreetSearch = (function() {
    var doStreetSearch = function() {
        ssInfo(VuFind.translate('street_search_checking_for_geolocation'), true);

        if (navigator.geolocation) {
            ssInfo(VuFind.translate('street_search_geolocation_available'));
            navigator.geolocation.getCurrentPosition(reverseGeocode, geoLocationError, { timeout: 30000 });
        } else {
            geoLocationError();
        }
    }
   
    var geoLocationError = function(error) {
        errorString = 'street_search_other_error';
        if (error) {
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorString = 'street_search_geolocation_inactive';
                    break;
                case error.TIMEOUT:
                    errorString = 'street_search_timeout';
                    break;
                default:
                    // do nothing
                    break;
            }
        }
        ssInfo(VuFind.translate(errorString));
    }

    var reverseGeocode = function(position) {
        ssInfo(VuFind.translate('street_search_coordinates_found'));

        var xhr = new XMLHttpRequest();

        xhr.open("GET", "https://api.digitransit.fi/geocoding/v1/reverse?point.lat=" +
                        position.coords.latitude +
                        "&point.lon=" +
                        position.coords.longitude +
                        "&size=1",
                true);

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    obj = JSON.parse(xhr.responseText);

                    if(obj.features[0] && (street = obj.features[0].properties.street) &&
                       (city = obj.features[0].properties.locality)) {
                        buildSearch(street, city);
                    } else {
                        ssInfo(VuFind.translate('street_search_no_streetname_found'));
                    }
                } else {
                    ssInfo(VuFind.translate('street_search_reversegeocode_unavailable'));
                }
            }
        }

        xhr.send();
    }
 
    var buildSearch = function(street, city) {

        ssInfo(VuFind.translate('street_search_searching_for') + ' ' + street + ' ' + city);

        searchterm = encodeURIComponent(street + ' ' + city);

        window.location.href = VuFind.path + '/Search/Results?lookfor=' +
                                 searchterm +
                                 '&type=AllFields&limit=100&view=grid' +
                                 '&filter[]=~format%3A"0%2FImage%2F"' +
                                 '&filter[]=~format%3A"0%2FPlace%2F"' +
                                 '&filter%5B%5D=online_boolean%3A%221%22';

    }

    var ssInfo = function(message, clear) {
        if (typeof clear !== 'undefined') {
            my.outputBox.html('');
        }
        my.outputBox.append($('<li>').text(message));
    }


    var my = {
        init: function() {
            window.onload = function() {
                my.ssbutton = $("#street-search-button");
                my.outputBox = $("#street-search-output");

                my.ssbutton.click(function() { doStreetSearch() });
            }
        }
    };

    return my;
})(finna);

finna['StreetSearch'].init();