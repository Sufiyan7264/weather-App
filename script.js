const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

// initial value


let oldTab = userTab;
const API_KEY = "43cc04dad28da7807524a5854cd8c22b";
oldTab.classList.add("current-tab");
getFromSessionStorage();

function swichTab(newTab) {
    if(newTab != oldTab){
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");
        if( !searchForm.classList.contains("active")) {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
         searchForm.classList.add("active");
        }
        else{
         searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getFromSessionStorage();
        }
    }
}
userTab.addEventListener("click", () => {
    swichTab(userTab);
});
searchTab.addEventListener("click", () => {
    swichTab(searchTab);
});

function getFromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        grantAccessContainer.classList.add("active");
    } 
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    try{
        const response =await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(error) {
        loadingScreen.classList.remove("active");
        const errorInfo = document.querySelector(".weather-error");
        errorInfo.classList.add("active");
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
    }
};


function renderWeatherInfo(data) {
    const cityName = document.querySelector("[data-cityName]");
    const countryFlag = document.querySelector("[data-countryIcon]");
    const weatherDesc = document.querySelector("[data-weatherDesc]")
    const weatherIcon = document.querySelector("[data-weatherIcon]")
    const temperature = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiNess = document.querySelector("[data-cloud]");
    
    cityName.textContent = `${data?.name}`;
    countryFlag.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    weatherDesc.textContent = data?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temperature.textContent = `${data?.main?.temp} °C`;
    windSpeed.textContent = `${data?.wind?.speed}m/s`;
    humidity.textContent = `${data?.main?.humidity}%`;
    cloudiNess.textContent = `${data?.clouds?.all}%`;
}

function getLocation () {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("GeoLocation is not supported in this device");
    }
};

function showPosition(position) {
    const userCoordinates = {
        lat : position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessBtn = document.querySelector("[data-grantAccess]");
grantAccessBtn.addEventListener('click', getLocation);

const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener('submit', (err)=> {
    err.preventDefault();
    let cityName = searchInput.value;
    if(cityName === "")
    {
        return;
    }
    else {
        fetchSearchWeatherInfo(cityName);
    }
});

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        
        const data =await response.json();
        if(!data?.sys){
            throw data;
        }
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
        
    }
    catch(error){
        // alert("Check Your Internet Connection!!");
        const apiError = document.querySelector(".weather-error");
        loadingScreen.classList.remove("active");
        apiError.classList.add("active");

    }
}