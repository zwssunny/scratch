
(function(ext) {

  // You will need to obtain an API key to query

  var AK = 'oE2PwN1MxS4KMRYdIGG4rnhOAle4pxnf';

  var cacheDuration = 1800000 //ms, 30 minutes

  var cachedTemps = {};


  function getWeatherData(weatherData, type) {
    var val = null;
    switch (type) {
    case 'index'://指数列表
      val = weatherData.index;
      break;
    case 'weather_data'://气候列表
      val = weatherData.weather_data;
      break;
    case 'currentCity'://查询城市
      val=weatherData.currentCity;
      break;
    case 'pm25'://pm2.5指数
      val=weatherData.pm25;
      break;
    }
    return(val);
  }


  function fetchWeatherData(Location, callback) {

    if (Location in cachedTemps &&
        Date.now() - cachedTemps[Location].time < cacheDuration) {
      //Weather data is cached
      callback(cachedTemps[Location].data);
      return;
    }


    // Make an AJAX call to the Open Weather Maps API

    $.ajax({
					url: 'http://api.map.baidu.com/telematics/v3/weather',
					data: {location: Location,  ak: AK},
					dataType: 'jsonp',
					success: function(weatherData) {
		      //Received the weather data. Cache and return the data.
					cachedTemps[Location] = {data: weatherData, time: Date.now()};
	        callback(weatherData);
	      }
    });
 }

  // Cleanup function when the extension is unloaded
  ext._shutdown = function() {};

  // Status reporting code
  // Use this to report missing hardware, plugin or unsupported browser
  ext._getStatus = function() {
    return {status: 2, msg: 'Ready'};
  };


  ext.getWeather = function(type, location, callback) {
    fetchWeatherData(location, function(data) {
      var val = getWeatherData(data, type);
      callback(val);
    });
  };

  // Block and block menu descriptions
  var descriptor = {
blocks:
    [
      ['R', '%m.reporterData in %s', 'getWeather', 'weather_data', '广州']
    ],
menus:
    {
		 reporterData: ['index', 'weather_data','currentCity','pm25']
    }
  };

  // Register the extension
  ScratchExtensions.register('Weather extension', descriptor, ext);
})({});
