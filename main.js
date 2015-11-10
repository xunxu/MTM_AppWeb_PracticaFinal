/**
 * Created by Jesus on 10/11/2015.
 */

$( document ).ready(function() {

    var map = null;

    function initialize() {

        var map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 51.508742, lng: -0.120850},
            disableDefaultUI:true,
            zoom: 9
        });

        var infoWindow = new google.maps.InfoWindow({map: map});

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                infoWindow.setPosition(pos);
                var urlDailyWeather = "http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + pos.lat + "&lon=" + pos.lng + "&lang=es&units=metric&appid=2a1170ac8eb31642f058879ddd1c6933";
                var tempMin = 0;
                var tempMax = 0;
                $.getJSON(urlDailyWeather, function(dailyWeather){
                    tempMin = dailyWeather.list[0].temp.min;
                    tempMax = dailyWeather.list[0].temp.max;
                });
                var urlCurrentWeather = "http://api.openweathermap.org/data/2.5/weather?lat=" + pos.lat + "&lon=" + pos.lng + "&lang=es&units=metric&appid=2a1170ac8eb31642f058879ddd1c6933";
                $.getJSON(urlCurrentWeather, function(currentWeather){
                    var urlIcon = "http://openweathermap.org/img/w/" + currentWeather.weather[0].icon + ".png";
                    var htmlWeather = "<h3>" + currentWeather.name + ", " + currentWeather.sys.country + "</h3>" +
                        "<div>" +
                        "<img src='" + urlIcon + "'>" +
                        "<p>" + currentWeather.weather[0].main + "</p>" +
                        "<p>" + parseInt(currentWeather.main.temp) + "&#8451</p>" +
                        "<p>" + parseInt(tempMax) + "&#8451</p>" +
                        "<p>" + parseInt(tempMin) + "&#8451</p>" +
                        "<p>Humedad: " + currentWeather.main.humidity + "%</p>" +
                        "<p>Viento: " + parseInt(currentWeather.wind.speed) + "kph</p>" +
                        "</div>";
                    infoWindow.setContent(htmlWeather);
                });
                //Mostramos el centro un poco mas abajo para que la globa se situe en el centro del mapa
                pos.lat = pos.lat + 0.25;
                map.setCenter(pos);
            }, function() {
                handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }

    }

    initialize();


    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
    }


});