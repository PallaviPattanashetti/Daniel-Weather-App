
import { APIKEY } from './environment.js';


const getLongitude = "/longitude";
const getLatitude = "Latitude";

const searchUserInput = document.getElementById("searchUserInput");
const getLocationBtn = document.getElementById("getLocationBtn");

const currentLocation = document.getElementById("currentLocation");








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


function apiCall(city) {

   fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKEY}`)
      .then(response => response.json())
      .then(json => console.log(json))
}
apiCall();

// search Button---

getLocationBtn.addEventListener("click", () => {
let city = document.getElementById("searchUserInput").value;
   apiCall(city);
});





























