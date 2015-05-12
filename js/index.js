(function () {

	var API_WEATHER_KEY = '80114c7878f599621184a687fc500a12';

	var API_WEATHER_URL = 'http://api.openweathermap.org/data/2.5/weather?APPID=' + API_WEATHER_KEY + '&';

	var IMG_WEATHER = 'http://openweathermap.org/img/w/';

	var API_WORLDTIME_KEY = 'd6a4075ceb419113c64885d9086d5';

	var API_WORLDTIME = 'https://api.worldweatheronline.com/free/v2/tz.ashx?format=json&key=' + API_WORLDTIME_KEY + '&q=';

	var today = new Date();

	var timeNow = today.toLocaleTimeString();

	var $body = $('body');

	var $loader = $('.loader');

	var $nombreNuevaCiudad = $('[data-input="cityAdd"]');

	var $buttonAdd = $('[data-button="add"]');

	var $buttonLoad = $('[data-saved-cities]');

	var cities = [];

	var cityWeather = {};

	cityWeather.zone;

	cityWeather.icon;

	cityWeather.temp;

	cityWeather.temp_max;

	cityWeather.temp_min;

	cityWeather.main;

	$buttonAdd.on('click', addNewCity);

	$nombreNuevaCiudad.on('keyup', function (e){

		if (e.which == 13){

			addNewCity(e);

		}

	});

	$buttonLoad.on('click', loadSavedCities);

	if (navigator.geolocation) {

		navigator.geolocation.getCurrentPosition(getCoords, errorFound);

	} else {
		alert('Por favor, actualiza tu navegador.');
	}

	function errorFound (error) {

		alert('Un error ocurrió: ' + error.code);

	}

	function getCoords (position) {

		var lat = position.coords.latitude;
		var lon = position.coords.longitude;

		$.getJSON(API_WEATHER_URL + 'lat=' + lat + '&lon=' + lon, getCurrentWeather);

	}

	function getCurrentWeather (data) {

		cityWeather.zone = data.name;

		cityWeather.icon = IMG_WEATHER + data.weather[0].icon + '.png';

		cityWeather.temp = data.main.temp - 272.15; //Convertirlo en grados centigrados.

		cityWeather.temp_max = data.main.temp_max - 272.15;

		cityWeather.temp_min = data.main.temp_min - 272.15;

		cityWeather.main = data.weather[0].main;

		// Render

		renderTemplate(cityWeather);
	}

	function activateTemplate (id) {

		var t = document.querySelector(id);

		return document.importNode(t.content, true);

	}

	function renderTemplate (cityWeather, localTime) {

		var clone = activateTemplate('#template--city');

		var timeToShow;

		if (localTime) {

			timeToShow = localTime;

		} else {

			timeToShow = timeNow;

		}

		clone.querySelector("[data-time]").innerHTML = timeToShow;

		clone.querySelector('[data-city]').innerHTML = cityWeather.zone;

		clone.querySelector('[data-icon]').src = cityWeather.icon;

		clone.querySelector('[data-temp="max"]').innerHTML = cityWeather.temp_max.toFixed(0);

		clone.querySelector('[data-temp="min"]').innerHTML = cityWeather.temp_min.toFixed(0);

		clone.querySelector('[data-temp="current"]').innerHTML = cityWeather.temp.toFixed(0);

		$loader.hide();

		$body.append(clone);

	}

	function addNewCity (e){

		e.preventDefault();

		$.getJSON(API_WEATHER_URL + 'q=' + $nombreNuevaCiudad.val(), getWeatherNewCity);

	}

	function getWeatherNewCity (data){

		$.getJSON(API_WORLDTIME + $nombreNuevaCiudad.val(), function(time){

			$nombreNuevaCiudad.val("");

			cityWeather = {};

			cityWeather.zone = data.name;

			cityWeather.icon = IMG_WEATHER + data.weather[0].icon + '.png';

			cityWeather.temp = data.main.temp - 272.15; //Convertirlo en grados centigrados.

			cityWeather.temp_max = data.main.temp_max - 272.15;

			cityWeather.temp_min = data.main.temp_min - 272.15;

			cityWeather.main = data.weather[0].main;

			// Render
			
			renderTemplate(cityWeather, time.data.time_zone[0].localtime.split(' ')[1]);

			cities.push(cityWeather);

			localStorage.setItem('cities', JSON.stringify(cities));

		});

	}

	function loadSavedCities (e) {

		e.preventDefault();

		function renderCities(cities) {

			cities.forEach(function (city) {

				renderTemplate(city);

			});

		}

		var cities = JSON.parse(localStorage.getItem('cities'));

		renderCities(cities);
	}

})();