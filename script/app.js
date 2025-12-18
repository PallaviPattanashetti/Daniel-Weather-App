import { APIKEY } from './environment.js';
import { saveToStorage, getLocalStorage, removeFromStorage, isFavorited } from './localStorage.js'


const searchUserInput = document.getElementById("searchUserInput");
const getLocationBtn = document.getElementById("getLocationBtn");

// ===API Call Function ====
function apiCall(city, lat = null, lon = null) {
   let url;
   if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKEY}&units=imperial`;
   } else if (city) {
      url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKEY}&units=imperial`;
   } else {
      return;
   }

   fetch(url)
      .then(response => {
         if (!response.ok) throw new Error("Location not found");
         return response.json();
      })
      .then(data => {
         console.log("Weather Data Received:", data);
         updateUI(data);
         searchUserInput.placeholder = "Search City";
      })
      .catch(err => {
         console.error("API Error:", err);
         searchUserInput.value = "";
         searchUserInput.placeholder = "City not found...";
      });
}

// ==Function ==
function updateUI(data) {

   //==current card
   const current = data.list[0];

document.getElementById("cityName").textContent = data.city.name;
   document.getElementById("currentTemp").textContent = `${Math.round(current.main.temp)}° F`;
   document.getElementById("currentHigh").textContent = `H: ${Math.round(current.main.temp_max)}°`;
   document.getElementById("currentLow").textContent = `L: ${Math.round(current.main.temp_min)}°`;

//  Current Day Name
   const today = new Date();
   document.getElementById("currentDay").textContent = today.toLocaleDateString('en-US', { weekday: 'long' });

   // Main Icon 
   const mainIconCode = current.weather[0].icon;
   const currentIconElem = document.getElementById("currentIcon");
   if (currentIconElem) {
      currentIconElem.src = `https://openweathermap.org/img/wn/${mainIconCode}@4x.png`;
   }

   // == 5-Day FC
   const dailyIndices = [0, 8, 16, 24, 32];
   dailyIndices.forEach((apiIndex, i) => {
      const dayData = data.list[apiIndex];
      const date = new Date(dayData.dt_txt);

      // == Day Name
      document.getElementById(`day-${i}`).textContent = date.toLocaleDateString('en-US', { weekday: 'short' });

      //=== High/Low
      document.getElementById(`high-${i}`).textContent = `H: ${Math.round(dayData.main.temp_max)}° F`;
      document.getElementById(`low-${i}`).textContent = `L: ${Math.round(dayData.main.temp_min)}° F`;

      // === Small Icons
      const iconCode = dayData.weather[0].icon;
      const iconElem = document.getElementById(`icon-${i}`);
      if (iconElem) {
         iconElem.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
      }
   });
}

// --- Geolocation Logic  ---

function handleGeolocation() {
   if (!navigator.geolocation) {
      searchUserInput.placeholder = "Geo not supported";
      apiCall("Stockton");
      return;
   }

   searchUserInput.placeholder = "Getting location...";

   navigator.geolocation.getCurrentPosition(
      (position) => {
         const latitude = position.coords.latitude;
         const longitude = position.coords.longitude;
         console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
         apiCall(null, latitude, longitude);
      },
      (error) => {
         let errorMsg = "";
         switch (error.code) {
            case error.PERMISSION_DENIED:
               errorMsg = "Permission denied.";
               break;
            case error.POSITION_UNAVAILABLE:
               errorMsg = "Location unavailable.";
               break;
            case error.TIMEOUT:
               errorMsg = "Request timed out.";
               break;
            default:
               errorMsg = "Unknown error.";
         }
         console.warn(errorMsg);
         searchUserInput.placeholder = errorMsg;
         apiCall("Stockton");
      }
   );
}

// --- Event Listeners ---

//===city

getLocationBtn.addEventListener("click", (event) => {
   event.preventDefault();
   const city = searchUserInput.value.trim();
   if (city.length > 1) {
      apiCall(city);
   } else {
      handleGeolocation();
   }
});

// 2. Auto-load 
window.addEventListener("load", handleGeolocation);

// 3. Dark Mode Toggle
const toggle = document.querySelector('.switch input');
if (window.location.pathname.includes('night.html')) {
   toggle.checked = true;
}
toggle.addEventListener('change', function () {
   setTimeout(() => {
      window.location.href = this.checked ? 'night.html' : 'index.html';
   }, 250);
});


//==fav==
function renderFavorites() {
   const favoritesList = document.getElementById('favoritesList');
   const favorites = getLocalStorage();


   favoritesList.innerHTML = '<h5 class="title-fav-list mb-3">Top 5 Favorites List</h5>';

   favorites.forEach(city => {
      const newCard = `
            <div class="card mb-3 shadow-sm mx-auto fav-item-card" 
         style="height: 71px; max-width: 364px; width: 100%; border-radius: 10px; overflow: hidden;">
        <div class="card-body d-flex justify-content-between align-items-center p-3">
            <p class="card-text city-name mb-0 fw-medium">${city}</p>
            <div class="d-flex align-items-center">
                <p id="fav-temp-${city}" class="card-temperature mb-0 me-3 fw-bold">--°F</p>
                <img id="fav-icon-${city}" src="/imges/sunAndRainy.png" class="fav-icon" style="height: 35px; width: auto;">
                
                <button class="btn btn-sm btn-outline-danger ms-2" 
                        style="border:none; font-size: 1.2rem;" 
                        onclick="removeFav('${city}')">
                    <i class="bi bi-x-circle-fill"></i>
                </button>
            </div>
        </div>
    </div>`;
      favoritesList.insertAdjacentHTML('beforeend', newCard);
   });
}


window.removeFav = (city) => {
   removeFromStorage(city);
   renderFavorites();


   const currentOnScreen = document.getElementById("cityName").textContent;
   if (currentOnScreen === city) {
      document.getElementById('favouriteStar').classList.remove('active');
   }
};

document.getElementById('favouriteStar').addEventListener('click', function () {
   const cityName = document.getElementById('cityName').textContent;
   const favorites = getLocalStorage();

   if (!isFavorited(cityName)) {

      if (favorites.length < 5) {
         saveToStorage(cityName);
         this.classList.add('active');
      } else {
         alert("Favorite list is full! Remove one to add another.");
      }
   } else {
      removeFromStorage(cityName);
      this.classList.remove('active');
   }

   renderFavorites();
});

const star = document.getElementById('favouriteStar');
star.classList.toggle('active', isFavorited(data.city.name));


window.addEventListener("load", () => {
   handleGeolocation();
   renderFavorites();
});