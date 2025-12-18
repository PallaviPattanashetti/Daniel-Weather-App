const getLocalStorage = () => {
    let value = localStorage.getItem('city');
    if (value === null) {
        return [];
    }
    return JSON.parse(value);
}

const saveToStorage = (city) => {
    let cityArray = getLocalStorage();


    if (!cityArray.includes(city)) {
        cityArray.push(city);
        localStorage.setItem('city', JSON.stringify(cityArray));
    }
}

const removeFromStorage = (city) => { 
    let cityArray = getLocalStorage();
   
    let cityIndex = cityArray.indexOf(city);
  
   
    if (cityIndex !== -1) {
        cityArray.splice(cityIndex, 1);
        localStorage.setItem('city', JSON.stringify(cityArray));
    }
}

const isFavorited = (city) => {
    const favorites = getLocalStorage();
    return favorites.includes(city);
}

export { saveToStorage, getLocalStorage, removeFromStorage, isFavorited }