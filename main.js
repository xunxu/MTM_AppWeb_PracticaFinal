/**
 * Created by Jesus on 10/11/2015.
 */

$( document ).ready(function() {

    var map = null;
    var pos = null;
    var infoWindow = null;

    function initialize() {


        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 51.508742, lng: -0.120850},
            disableDefaultUI:true,
            zoom: 9
        });

        infoWindow = new google.maps.InfoWindow({map: map});

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                showWeatherByPosition(pos);

                map.setCenter(pos);
            }, function() {
                handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }

        //---------------Search box functionality----------------------------

        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
            searchBox.setBounds(map.getBounds());
        });

        searchBox.addListener('places_changed', function() {
            var places = searchBox.getPlaces();

            if (places.length == 0) {
                return;
            }

            // For each place, get the icon, name and location.
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function(place) {

                pos = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                };

                showWeatherByPosition(pos);

                map.setCenter(pos);
            });
        });

        // Evento para situar siempre en el centro la ciudad buscada
        google.maps.event.addListener(map,'center_changed',function() {
            window.setTimeout(function() {
                map.setCenter(pos);
            },100);
        });
    }

    initialize();

    $('select').on('change', function() {
        var url = "http://maps.google.com/maps/api/geocode/json?address=" + this.value + "&sensor=false";
        $.getJSON(url, function(jsonResult){
            pos = {
                lat: jsonResult.results[0].geometry.location.lat,
                lng: jsonResult.results[0].geometry.location.lng
            };
            showWeatherByPosition(pos);

        });
        map.setCenter(pos);
        console.log(pos);
    });

    function showWeatherByPosition(pos) {
        var html = "";
        infoWindow.setPosition(pos);
        var urlDailyWeather = "http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + pos.lat + "&lon=" + pos.lng + "&lang=es&units=metric&appid=2a1170ac8eb31642f058879ddd1c6933";
        var tempMin = 0;
        var tempMax = 0;
        $.getJSON(urlDailyWeather, function(dailyWeather){
            tempMin = dailyWeather.list[0].temp.min;
            tempMax = dailyWeather.list[0].temp.max;
            var urlCurrentWeather = "http://api.openweathermap.org/data/2.5/weather?lat=" + pos.lat + "&lon=" + pos.lng + "&units=metric&lang=es&appid=2a1170ac8eb31642f058879ddd1c6933";
            $.getJSON(urlCurrentWeather, function(currentWeather){
                var urlIcon = "http://openweathermap.org/img/w/" + currentWeather.weather[0].icon + ".png";
                html = "<h3>" + currentWeather.name + ", " + currentWeather.sys.country + "</h3>" +
                    "<div class='col-xs-6'>" +
                    "<img src='" + urlIcon + "'>" +
                    "<div>" + currentWeather.weather[0].main + "</div>" +
                    "</div>" +
                    "<div class='col-xs-6'>" +
                    "<div>" + parseInt(currentWeather.main.temp) + "&#8451</div>" +
                    "<div>" + parseInt(tempMax) + "&#8451</div>" +
                    "<div>" + parseInt(tempMin) + "&#8451</div>" +
                    "</div>" +
                    "<div>" +
                    "<div>Humedad: " + currentWeather.main.humidity + "%</div>" +
                    "<div>Viento: " + parseInt(currentWeather.wind.speed) + "kph</div>" +
                    "</div>";
                infoWindow.setContent(html);
            });
        });
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
    }

});