const saveToStorage = (city) => {

    let cityArray = getLocalStorage();

    

    
    if (!cityArray.includes(city)) {
        cityArray.push(city);
    }
    localStorage.setItem('city', JSON.stringify(cityArray));
}


const getLocalStorage = () => {

    let value = localStorage.getItem('city');

    if (value === null) {
        return [];
    }
    return JSON.parse(value);
}


const removeFromStorage = () => {
    let cityArray = getLocalStorage();
   
    let cityIndex = cityArray.indexOf(city);
  
    cityArray.splice(cityIndex, 1);

localStorage.setItem('city', JSON.stringify(cityArray));
}