const API_key = "7d567b6deecf671e5f539df785e47c59"

const searchInput = document.getElementById("searchInput");
const searchButton= document.getElementById("searchButton");
const city =        document.getElementById("city");
const temperature = document.getElementById("temperature");
const humidity =    document.getElementById("humidity");
const wind =        document.getElementById("wind");
const icon =        document.getElementById("icon");
const cityWether =  document.getElementById("cityWeather");
const noCityFound = document.getElementById("noCityFound");

searchButton.addEventListener("click", updateWeatherData);
searchInput.addEventListener("keydown",(event)=> event.key === "Enter" && updateWeatherData());

async function updateWeatherData() {
    try{
        if(!searchInput.value.trim()){
            alert("Ingresa una ciudad por favor!");
            return;
        }
        const weatherData = await getWeatherData(searchInput.value);
        noCityFound.classList.add("hidden");
        cityWether.classList.remove("hidden");
        city.textContent = weatherData.city;
        temperature.textContent = weatherData.temperature + "⁰C"; 
        humidity.textContent = weatherData.humidity + "%";
        wind.textContent = weatherData.wind + "km/h";
        icon.src = weatherData.icon;
    } catch(error){
        if(error?.code === "404"){
            cityWether.classList.add("hidden");
            noCityFound.classList.remove("hidden");
            console.error(error.message);
        } else {
            alert("Error desconosido : " + error);
        }
    }
}

function getIconUrl(icon){
    return `./img/icons/${icon.toLowerCase()}.png`
}

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_key}`;
    const apiResponse = await fetch(apiUrl);
    const apiResponseBody = await apiResponse.json();

    if (apiResponseBody.cod == "404"){
        throw { code: "404", message: "Ciudad no encontrada"}
    }
    
    return{
        city: apiResponseBody.name,
        temperature: Math.round(apiResponseBody?.main.temp),
        humidity:apiResponseBody.main.humidity,
        wind: Math.round(apiResponseBody.wind.speed),
        icon: getIconUrl(apiResponseBody.weather[0].main),
    };
}