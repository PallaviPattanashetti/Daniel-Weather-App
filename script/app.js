const getLongitude = "/longitude";
const getLatitude = "Latitude";

 function getCurrentPosition(){

    fetch('https://api.openweathermap.org/data/2.5/forecast?q=stockton&appid=62042061ec88239bfcf89d1be981c431')
    .then(response => response.json())
    .then(json => console.log(json))
 }

 getCurrentPosition()