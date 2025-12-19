
import { APIKEY } from './environment.js';
import { saveToStorage, getLocalStorage, removeFromStorage, isFavorited } from './localStorage.js';

const searchUserInput = document.getElementById("searchUserInput");
const getLocationBtn = document.getElementById("getLocationBtn");

// === API Call ====
function apiCall(city, lat = null, lon = null) {
   let url;
   if (lat !== null && lon !== null) {
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
         updateUI(data);
         if (searchUserInput) {
            searchUserInput.placeholder = "Search City";
         }
      })
      .catch(err => {
         console.error("API Error:", err);
         if (searchUserInput) {
            searchUserInput.value = "";
            searchUserInput.placeholder = "City not found...";
         }
      });
}

// === Update UI Function ====
function updateUI(data) {
   if (!data || !data.city || !data.list || !data.list.length) return;

   const cityName = data.city.name;
   const country = data.city.country;
   const current = data.list[0];

   const cityNameEl = document.getElementById("cityName");
   if (cityNameEl) cityNameEl.textContent = `${cityName}, ${country}`;

   const tempEl = document.getElementById("currentTemp");
   if (tempEl) tempEl.textContent = `${Math.round(current.main.temp)}° F`;

   const highEl = document.getElementById("currentHigh");
   if (highEl) highEl.textContent = `H: ${Math.round(current.main.temp_max)}°`;

   const lowEl = document.getElementById("currentLow");
   if (lowEl) lowEl.textContent = `L: ${Math.round(current.main.temp_min)}°`;

   const today = new Date();
   const currentDayEl = document.getElementById("currentDay");
   if (currentDayEl) currentDayEl.textContent = today.toLocaleDateString('en-US', { weekday: 'long' });

   const mainIconCode = current.weather[0].icon;
   const currentIconElem = document.getElementById("currentIcon");
   if (currentIconElem) {
      currentIconElem.src = `https://openweathermap.org/img/wn/${mainIconCode}@4x.png`;
   }

   // star  city 
   const star = document.getElementById('favouriteStar');
   if (star) {
      star.classList.toggle('active', isFavorited(cityName));
      star.dataset.city = cityName; 
   }

   // 5-Day Forecast 
   const dailyIndices = [0, 8, 16, 24, 32];
   dailyIndices.forEach((apiIndex, i) => {
      const dayData = data.list[apiIndex];
      if (!dayData) return;

      const date = new Date(dayData.dt * 1000);

      const dayElem = document.getElementById(`day-${i}`);
      if (dayElem) {
         dayElem.textContent = date.toLocaleDateString('en-US', { weekday: 'short' });
      }

      const highElem = document.getElementById(`high-${i}`);
      const lowElem = document.getElementById(`low-${i}`);
      if (highElem) highElem.textContent = `H: ${Math.round(dayData.main.temp_max)}° F`;
      if (lowElem) lowElem.textContent = `L: ${Math.round(dayData.main.temp_min)}° F`;

      const iconElem = document.getElementById(`icon-${i}`);
      if (iconElem && dayData.weather && dayData.weather[0]) {
         iconElem.src = `https://openweathermap.org/img/wn/${dayData.weather[0].icon}@2x.png`;
         iconElem.alt = dayData.weather[0].description || '';
      }
   });
}

// === Favorites Weather  ====

function updateFavWeather(city) {
  
   const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKEY}&units=imperial`;
   
   fetch(url)
      .then(res => res.json())
      .then(data => {
         if (!data || !data.list || !data.list[0]) return;

         const safeId = city.replace(/\s+/g, '-');
         const forecastItem = data.list[0]; 
         
         const tempElem = document.getElementById(`fav-temp-${safeId}`);
         const iconElem = document.getElementById(`fav-icon-${safeId}`);
         
         if (tempElem) tempElem.textContent = `${Math.round(forecastItem.main.temp)}°F`;
         if (iconElem && forecastItem.weather && forecastItem.weather[0]) {
            iconElem.src = `https://openweathermap.org/img/wn/${forecastItem.weather[0].icon}@2x.png`;
            iconElem.alt = forecastItem.weather[0].description || '';
         }
      })
      .catch(err => console.error("Error fetching fav weather:", err));
}


// ===  Favorites List  ===
function renderFavorites() {
   const favoritesList = document.getElementById('favoritesList');
   if (!favoritesList) return;

   const favorites = getLocalStorage();

   favoritesList.innerHTML = '<h5 class="title-fav-list mb-3">Top 5 Favorites List</h5>';

   if (!favorites || favorites.length === 0) {
      favoritesList.insertAdjacentHTML(
         'beforeend',
         '<p class="text-muted text-center"></p>'
      );
      return;
   }

   favorites.forEach(city => {
      const safeId = city.replace(/\s+/g, '-');
      const safeCity = city.replace(/'/g, "\\'"); // 

      const newCard = `
         <div class="card mb-3 shadow-sm mx-auto fav-item-card" 
              style="height: 71px; max-width: 364px; width: 100%; border-radius: 10px; overflow: hidden;">
            <div class="card-body d-flex justify-content-between align-items-center p-3">
               <p class="card-text city-name mb-0 fw-medium" 
                  style="cursor:pointer" 
                  onclick="window.apiCallFromFav('${safeCity}')">
                  ${city}
               </p>
               <div class="d-flex align-items-center">
                  <p id="fav-temp-${safeId}" class="card-temperature mb-0 me-3 fw-bold">--°F</p>
                  <img id="fav-icon-${safeId}" src="https://openweathermap.org/img/wn/01d@2x.png" class="fav-icon" style="height: 35px; width: auto;">
                  <button class="btn btn-sm btn-outline-danger ms-2" 
                          style="border:none; font-size: 1.2rem;" 
                          onclick="window.removeFav('${safeCity}')">
                      <i class="bi bi-x-circle-fill"></i>
                  </button>
               </div>
            </div>
         </div>`;
      favoritesList.insertAdjacentHTML('beforeend', newCard);
      updateFavWeather(city);
   });
}

// --- Geolocation  ---
function handleGeolocation() {
   if (!navigator.geolocation) {
      apiCall("Stockton");
      return;
   }

   if (searchUserInput) {
      searchUserInput.placeholder = "Getting location...";
   }

   navigator.geolocation.getCurrentPosition(
      (position) => {
         const lat = position.coords.latitude;
         const lon = position.coords.longitude;
         const geoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${APIKEY}`;

         fetch(geoUrl)
            .then(res => res.json())
            .then(geoData => {
               const cityNameEl = document.getElementById("cityName");
               if (cityNameEl && Array.isArray(geoData) && geoData.length > 0) {
                  const loc = geoData[0];
                  const state = loc.state ? `${loc.state}, ` : "";
                  cityNameEl.textContent = `${loc.name}, ${state}${loc.country}`;
               }
               apiCall(null, lat, lon);
            })
            .catch(() => apiCall(null, lat, lon));
      },
      () => apiCall("Stockton")
   );
}


window.apiCallFromFav = (city) => apiCall(city);

window.removeFav = (city) => {
   removeFromStorage(city);
   renderFavorites();
   
   
   const cityNameEl = document.getElementById("cityName");
   const star = document.getElementById('favouriteStar');
   if (cityNameEl && star) {
      const currentCity = cityNameEl.textContent.split(',')[0].trim();
      if (currentCity === city) {
         star.classList.remove('active');
         star.dataset.city = '';
      }
   }
};

// --- Event Listeners ---
if (getLocationBtn) {
   getLocationBtn.addEventListener("click", (event) => {
      event.preventDefault();
      const city = (searchUserInput?.value || "").trim();
      if (city.length > 1) apiCall(city);
      else handleGeolocation();
   });
}


const starBtn = document.getElementById('favouriteStar');
if (starBtn) {
   starBtn.addEventListener('click', function () {
       const cityNameEl = document.getElementById('cityName');
      const displayCity = cityNameEl?.textContent?.trim() || '';

      if (!displayCity) {
         alert("Load a city first!");
         return;
      }

      const cityName = displayCity.split(',')[0].trim();
      
      if (!cityName) return;

      const favorites = getLocalStorage();

      if (!isFavorited(cityName)) {
         if (favorites.length < 5) {
            saveToStorage(cityName);
            this.classList.add('active');
            renderFavorites();
         } else {
            alert("Favorite list is full! (Max 5)");
         }
      } else {
         removeFromStorage(cityName);
         this.classList.remove('active');
         renderFavorites();
      }
   
      localStorage.setItem('weatherFavorites', JSON.stringify(getLocalStorage()));
   });
}


window.addEventListener("load", () => {
   handleGeolocation();
   renderFavorites();
});

// Dark Mode Toggle
const toggle = document.querySelector('.switch input');
if (toggle) {
   if (window.location.pathname.includes('night.html')) {
      toggle.checked = true;
   }
   toggle.addEventListener('change', function () {
      setTimeout(() => {
         window.location.href = this.checked ? 'night.html' : 'index.html';
      }, 250);
   });
}