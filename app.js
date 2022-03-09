const apiKey = "7e4c159adcafaa0166cc8a76abb06ec8";
//Weather app.js

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');


const PORT = process.env.PORT || 3000;

app.get('/', (req, res) =>{
    var weekday = ['Sunday', 'Monday', 'Tuesday','Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var today = new Date();
    var date = today.getDay();
    var time = today.getHours() + ":" + today.getMinutes() ;
    var dateTime = weekday[date] +' '+time;

    res.render('index', {
        place : "Lucknow",
        windSpeed : 7.24 , 
        temp : 30.2, 
        image : "weather",
        info : "clear sky",
        day : dateTime,
        sunrise : "6:35 AM",
        sunset : "6:42 PM",
        pressure : "1017",
        humidity : "80",
        visibility : "9",
        minimum : "32.23",
        maximum : "34.73"
    });
});
app.post('/', (req, res) =>{
      var weekday = ['Sunday', 'Monday', 'Tuesday','Wednesday', 'Thursday', 'Friday', 'Saturday'];
      var today = new Date();
      var date = today.getDay();
      var time = today.getHours() + ":" + today.getMinutes() ;
      var dateTime = weekday[date] +' '+time;

      const city = req.body.cityName;
      const unit = "metric";
      const url = "https://api.openweathermap.org/data/2.5/weather?q="+city +"&units=" + unit + "&appid="+apiKey;
    //   api.openweathermap.org/data/2.5/forecast?q=london&appid= "7e4c159adcafaa0166cc8a76abb06ec8"
      https.get(url , function (response) {
          response.on('data', function (data) {
              const WeatherData = JSON.parse(data);
            //   console.log(WeatherData);
              if(WeatherData.cod == 404 ){
                  res.redirect('/');
              }else{
                const temperature = WeatherData.main.temp ;
                const location = WeatherData.name;
                const speed = WeatherData.wind.speed ;
                const description = WeatherData.weather[0].description;
                const icon = WeatherData.weather[0].icon;
                let iconURl =  "weather";
                const rise =  new Date(WeatherData.sys.sunrise).toLocaleTimeString("en-US");
                const set =  new Date(WeatherData.sys.sunset).toLocaleTimeString("en-US");
                const pres = WeatherData.main.pressure;
                const humid = WeatherData.main.humidity;
                const visib = WeatherData.visibility / 1000;
                const min = WeatherData.main.temp_min;
                const max = WeatherData.main.temp_max;
                // console.log(icon);
                if(icon === "01d" || icon === "01n" || icon === "02d" || icon === "02n"){
                    iconURl = "sun";
                }
                if(icon === "03d" || icon === "03n" || icon === "04d" || icon === "04n"){
                    iconURl = "clouds";
                }
                if( icon === "11d" || icon === "11n"){
                    iconURl = "thunderstrom";
                }
                if( icon === "13d" || icon === "13n"){
                    iconURl = "snow";
                }
                if( icon === "50d" || icon === "50n"){
                    iconURl = "wind";
                }
                res.render('index', {
                    place : location,
                    windSpeed : speed, 
                    temp : temperature,
                    image : iconURl,
                    info : description,
                    day : dateTime,
                    sunrise : rise,
                    sunset : set,
                    pressure : pres,
                    humidity : humid,
                    visibility : visib,
                    minimum : min,
                    maximum : max
                });
              }
          })
      })
})


app.listen(process.env.PORT || 3000,()=>{
    console.log(`Example app listening at http://localhost:3000`)
  })