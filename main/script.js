// Global Variables
const APIkey = "dc24e539b170216cc175ae8a25b31b2b";
let history = [];
const cityInput = document.querySelector('#city-input');
const submitBtn = document.querySelector('#submit');
const currentDayHeader = document.querySelector("#currentDay");

// Get current date in header using dayjs
const now = new Date();
currentDayHeader.textContent = dayjs(now).format('dddd, MMMM DD, YYYY h:mm A');

// Event listener for search button
submitBtn.addEventListener('click', function(event) {
    event.preventDefault();
    const cityName = cityInput.value.trim();

    if (!cityName) {
        return;
    }

    getCityWeather(cityName);

    let searchedCities = JSON.parse(localStorage.getItem('searched-cities')) || [];

    if (!searchedCities.includes(cityName)) {
        searchedCities.push(cityName);
        localStorage.setItem('searched-cities', JSON.stringify(searchedCities));
        displayHistory(searchedCities);
    }
});

// Displays searched city as buttons from local storage
function displayHistory(searchedCities) {
    const historyDiv = document.querySelector('#history-div');
    historyDiv.innerHTML = "";

    searchedCities.forEach(city => {
        const button = document.createElement('button');
        button.textContent = city;

        button.addEventListener('click', () => {
            getCityWeather(city);
        });

        historyDiv.appendChild(button);
    });
}

// Ajax call for current weather info using Open Weather API
function getCityWeather(cityName) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${APIkey}&units=imperial`;

    $.ajax({
        url: url,
        type: 'GET'
    }).then(function (res) {
        console.log('AJAX Response \n-------------');
        console.log(res);

        const currentWeather = res.list[0];
        const fiveDayForecast = res.list.filter((weatherData, index) => index % 8 === 0);

        showCurrent(currentWeather, cityName);
        showFiveDay(fiveDayForecast);
    }).catch(function (err) {
        console.error(err);
        alert("An error occurred while retrieving weather data. Please try again later.");
    });
}

// Current weather card to display info using template literals
function showCurrent(data, cityName) {
    const currentWeatherDiv = document.querySelector('#showCurrent');
    currentWeatherDiv.innerHTML = `
    <div class="column">
        <div class="card">
            <div class="card-body">
                <h2><img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png"/>Current Weather for: ${cityName}</h2>
                <p>Temp: ${data.main.temp} °F</p>
                <p>Humidity: ${data.main.humidity} %</p>
                <p>Wind: ${data.wind.speed} MPH</p>
            </div>
        </div>
    </div>`;
}

function showFiveDay(data) {
    let cardFive = "";

    // loop through each day of 5-day forecast
    for (let i = 0; i < data.length; i++) {
        const currentDay = data[i];
        const cardHTML = `
            <div class="col-2">
                <div class="card">
                    <div class="card-body">
                        <h3 class="card-title">${dayjs(currentDay.dt_txt).format('ddd. MMM. DD, YYYY')}</h3>
                        <div class="card-text">
                            <img src="http://openweathermap.org/img/wn/${currentDay.weather[0].icon}.png" alt="${currentDay.weather[0].description}">
                            <p class="temp">Temp: ${currentDay.main.temp.toFixed(1)} °F</p>
                            <p>Humidity: ${currentDay.main.humidity}%</p>
                            <p>Wind: ${currentDay.wind.speed} MPH</p>
                        </div>
                    </div>
                </div>
            </div>`;
        cardFive += cardHTML;
    }

    const fiveDayContainer = document.querySelector("#fiveDay");
    fiveDayContainer.innerHTML = `<div class="row" style="display: flex;">${cardFive}</div>`;
};
