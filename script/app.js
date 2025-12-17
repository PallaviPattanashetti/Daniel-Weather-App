const getLongitude = "/longitude";
const getLatitude = "Latitude";
const searchUserInput = document.getElementById("searchUserInput");
const getLocationBtn = document.getElementById("getLocationBtn");

const favouriteStar = document.getElementById("favouriteStar");
const getCurrentLocation = document.getElementById("getCurrentLocation");
const cityName = document.getElementById("cityName");
const dayOfWeek = document.getElementById("dayOfWeek");
const tempRecord = document.getElementById("tempRecord");
const weatherIcon = document.getElementById("weatherIcon");




function apiCall() {

   fetch('https://api.openweathermap.org/data/2.5/forecast?q=stockton&appid=62042061ec88239bfcf89d1be981c431')
      .then(response => response.json())
      .then(json => console.log(json))
}
apiCall();



//Toggle - Button

const toggle = document.querySelector('.switch input');
if (window.location.pathname.includes('night.html')) {
   toggle.checked = true;
} else {
   toggle.checked = false;
}
toggle.addEventListener('change', function () {
   setTimeout(() => {
      if (this.checked) {
         window.location.href = 'night.html';
      } else {
         window.location.href = 'index.html';
      }
   }, 250);
});