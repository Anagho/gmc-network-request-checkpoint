// Get UI elements
const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");
const notFoundSection = document.querySelector(".not-found");
const searchCitySection = document.querySelector(".search-city");
const weatherInfoSection = document.querySelector(".weather-info");

const countryText = document.querySelector(".country-text");
const tempText = document.querySelector(".temp-text");
const conditionText = document.querySelector(".condition-text");
const humidityValueText = document.querySelector(".humidity-value-text");
const windValueText = document.querySelector(".wind-value-text");
const weatherSummaryImg = document.querySelector(".weather-summary-img");
const currentDateText = document.querySelector(".current-date-text");

const forecastItemsContainer = document.querySelector(
  ".forecast-items-container"
);

// API Key
const apiKey = "6b955e35bf07757cfdbe7a491475ae46";

searchBtn.addEventListener("click", () => {
  if (cityInput.value.trim() != "") {
    updateWeatherInfo();
    cityInput.value = "";
    cityInput.blur();
  }
});

cityInput.addEventListener("keydown", (event) => {
  if (event.key == "Enter" && cityInput.value.trim() != "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

async function getFetchData(endPoint, city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;

  const response = await fetch(apiUrl);

  return response.json();
}

// Get the weather image
function getWeatherIcon(id) {
  if (id <= 232) return "thunderstorm.svg";
  if (id <= 321) return "drizzle.svg";
  if (id <= 531) return "rain.svg";
  if (id <= 622) return "snow.svg";
  if (id <= 781) return "atmosphere.svg";
  if (id <= 800) return "clear.svg";
  else return "clouds.svg";
}

// Function to get current date
function getCurrentDate() {
  const currentDate = new Date();
  const options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
  };

  return currentDate.toLocaleDateString("en-US", options);
}

async function updateWeatherInfo(city) {
  const weatherData = await getFetchData("weather", city);

  // check for errors
  if (weatherData.cod != 200) {
    showDisplaysection(notFoundSection);
    return;
  }

  //   console.log(weatherData);

  const {
    name: country,
    main: { temp, humidity },
    weather: [{ id, main }],
    wind: { speed },
  } = weatherData;

  countryText.textContent = country;
  tempText.textContent = Math.round(temp) + " °C";
  conditionText.textContent = main;
  humidityValueText.textContent = humidity + "%";
  windValueText.textContent = speed + " M/s";

  currentDateText.textContent = getCurrentDate();
  console.log(getCurrentDate());

  weatherSummaryImg.src = `img/${getWeatherIcon(id)}`;

  //   update the forecast
  await updateForecastsInfo(city);
  showDisplaysection(weatherInfoSection);
}

// Function to get the weather forecast
async function updateForecastsInfo(city) {
  const foreCastsData = await getFetchData("forecast", city);

  const timeTaken = "12:00:00";
  const todayDate = new Date().toISOString().split("T")[0];

  forecastItemsContainer.innerHTML = "";
  foreCastsData.list.forEach((forecastWeather) => {
    if (
      forecastWeather.dt_txt.includes(timeTaken) &&
      !forecastWeather.dt_txt.includes(todayDate)
    ) {
      updateForecastsItems(forecastWeather);
    }
  });
  // console.log(foreCastsData);
  console.log(todayDate);
}

function updateForecastsItems(weatherData) {
  console.log(weatherData);
  const {
    dt_txt: date,
    weather: [{ id }],
    main: { temp },
  } = weatherData;

  const dateTaken = new Date(date);
  const dateOption = {
    day: '2-digit',
    month: 'short'
  }

  const dateResult = dateTaken.toLocaleDateString('en-US', dateOption);

  const forecastItem = `
         <div class="forecast-item">
            <h5 class="forecast-item-date regular-text">${dateResult}</h5>
            <img src="img/${getWeatherIcon(id)}" alt="" class="forecast-item-img" />
            <h5 class="forecast-item-item">${Math.round(temp)} °C</h5>
          </div>
    `;
    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem)
}

function showDisplaysection(section) {
  [weatherInfoSection, searchCitySection, notFoundSection].forEach(
    (section) => (section.style.display = "none")
  );

  section.style.display = "flex";
}
