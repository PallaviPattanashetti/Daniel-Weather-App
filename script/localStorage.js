const saveToStorage = (city) => {

    let cityArray = getLocalStorage();

}

if (!cityArray.includes(city)) {
    cityArray.push(city);
}
localStorage.setItem('Names', JSON.stringify(cityArray));


const getLocalStorage = () => {

    let value = localStorage.getItem('city');

    if (value === null) {
        return [];
    }
    return JSON.parse(value);
}
