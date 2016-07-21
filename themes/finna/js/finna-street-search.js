finna.StreetSearch = (function() {
    var ssbutton, outputBox, buttonArea, spinner, spinnerContainer, getPositionSuccess;
    
    var doStreetSearch = function() {
        ssInfo(VuFind.translate('street_search_checking_for_geolocation'), 'success');

        if (navigator.geolocation) {
            ssInfo(VuFind.translate('street_search_geolocation_available'), 'success');
            navigator.geolocation.getCurrentPosition(reverseGeocode, geoLocationError, { timeout: 10000, maximumAge: 10000 });
        } else {
            geoLocationError();
        }
    }
   
    var geoLocationError = function(error) {
        if (!getPositionSuccess) {
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
            ssInfo(VuFind.translate(errorString), 'warning');
        }
    }

    var reverseGeocode = function(position) {
        getPositionSuccess = true;
        ssbutton.hide();

        ssInfo(VuFind.translate('street_search_coordinates_found'), 'success');

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
                        ssInfo(VuFind.translate('street_search_no_streetname_found'), 'warning');
                    }
                } else {
                    ssInfo(VuFind.translate('street_search_reversegeocode_unavailable'), 'warning');
                }
            }
        }

        xhr.send();
    }
 
    var buildSearch = function(street, city) {
      
        ssInfo(VuFind.translate('street_search_searching_for') + ' ' + street + ' ' + city, 'success');

        searchterm = encodeURIComponent(street + ' ' + city);

        window.location.href = VuFind.path + '/Search/Results?lookfor=' +
                                 searchterm +
                                 '&type=AllFields&limit=100&view=grid' +
                                 '&filter[]=~format%3A"0%2FImage%2F"' +
                                 '&filter[]=~format%3A"0%2FPlace%2F"' +
                                 '&filter%5B%5D=online_boolean%3A%221%22';

    }

    var ssInfo = function(message, type) {
        spinnerContainer.removeClass('alert-success').removeClass('alert-warning');
        
        if (type) {
            spinnerContainer.addClass('alert-' + type);
            
            if (type === 'warning') {
                spinnerContainer.find('.fa-spinner').hide();
                ssbutton.show();
            }
        }
        spinnerContainer.find('.info').text(message);
        
    }


    var my = {
        init: function() {
            getPositionSuccess = false;
            
            ssbutton = $("#street-search-button");
            buttonArea = $("#ssButtonArea");
            spinnerContainer = $('<div/>').attr('id', 'spinner').addClass('alert alert-success').
                               append($('<span/>').addClass('fa fa-spinner fa-spin')).
                               append($('<span/>').addClass('info'));

            ssbutton.click(function() {
                buttonArea.append(spinnerContainer);
                doStreetSearch();
            });
        }
    };

    return my;
})(finna);

$(document).ready(function() {
    finna['StreetSearch'].init();
});