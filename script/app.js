const getLongitude = "/longitude";
const getLatitude = "Latitude";
const searchUserInput= document.getElementsById("searchUserInput");
const getLocationBtn = document.getElementsByClassName("getLocationBtn");
const darkModeToggleLink= document.getElementById("darkModeToggleLink");

getLocationBtn




 function apiCall(){

    fetch('https://api.openweathermap.org/data/2.5/forecast?q=stockton&appid=62042061ec88239bfcf89d1be981c431')
    .then(response => response.json())
    .then(json => console.log(json))
 }
apiCall();




 getCurrentPosition()