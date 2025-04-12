function updateClock() {
  const now = new Date();
  document.getElementById("clock").innerText = now.toLocaleString();
}
setInterval(updateClock, 1000);

document.getElementById("title").addEventListener("blur", function () {
  localStorage.setItem("dashboardTitle", this.innerText);
});
document.getElementById("title").innerText =
  localStorage.getItem("dashboardTitle") || "My DashBoard;";

//--Links--------------------------------------------------------------------------------------------------------------------------------------------------------------------
const linkList = document.getElementById("link-List");
const linkTitleInput = document.getElementById("link-title");
const linkUrlInput = document.getElementById("link-Url");
const addLinkButton = document.getElementById("add-link");

addLinkButton.addEventListener("click", function () {
  const title = linkTitleInput.value;
  const url = linkUrlInput.value;

  if (title && url) {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${url}" target="_blank">${title}</a> <button class="remove-link"> Remove</button>`;
    linkList.appendChild(li);

    saveLinks();
    linkTitleInput.value = "";
    linkUrlInput.value = "";
  }
});

function saveLinks() {
  const links = [];
  document.querySelectorAll("#link-List li").forEach((li) => {
    const a = li.querySelector("a");
    if (a) {
      links.push({ title: a.innerText, url: a.href });
    }
  });
  localStorage.setItem("links", JSON.stringify(links));
}

function loadLinks() {
  const links = JSON.parse(localStorage.getItem("links")) || [];
  links.forEach((link) => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${link.url}" target="_blank">${link.title}</a> <button class="remove-link">Remove</button>`;
    linkList.appendChild(li);
  });
}

linkList.addEventListener("click", function (e) {
  if (e.target.classList.contains("remove-link")) {
    e.target.parentElement.remove();
    saveLinks();
  }
});

loadLinks();

//toggle-element för add-links----------------------------------------------------------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", function () {
  const linkInputsContainer = document.createElement("div");
  linkInputsContainer.appendChild(linkTitleInput);
  linkInputsContainer.appendChild(linkUrlInput);

  addLinkButton.addEventListener("click", function () {
    if (
      linkTitleInput.style.display === "none" ||
      linkUrlInput.style.display === "none"
    ) {
      linkTitleInput.style.display = "block";
      linkUrlInput.style.display = "block";
      addLinkButton.textContent = "Click to Add";
    } else {
      linkTitleInput.style.display = "none";
      linkUrlInput.style.display = "none";
      addLinkButton.textContent = "+ Add Link";
    }
  });
  linkTitleInput.style.display = "none";
  linkUrlInput.style.display = "none";

  const favouriteOptions = document.getElementById("favouriteOptions");
  favouriteOptions.appendChild(linkInputsContainer);
});

//Väder api----------------------------------------------------------------------------------------------------------------------
function geoFindMe() {
  const status = document.querySelector("#status");
  const mapLink = document.querySelector("#map-link");
  const weatherInfo = document.getElementById("weather-Info");

  mapLink.href = "";
  mapLink.textContent = "";

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    status.textContent = "";
    mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}${longitude}`;
    mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;

    localStorage.setItem("latitude", "latitude");
    localStorage.setItem("longitude", "longitude");

    fetchWeather(latitude, longitude);
  }
  function error() {
    status.textContent = "Unable to retrieve your location";
  }
  if (!navigator.geolocation) {
    status.textContent = "Geolocation is not supported by your browser";
  } else {
    status.textContent = "Locating…";
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

async function fetchWeather(lat, lon) {
  const apiKey = "0759b575b399c7575cc70e35c9ce508c";
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) {
      throw new Error(`Network is out of function ${response.status}`);
    }
    const data = await response.json();

    const weatherInfo = document.getElementById("weather-Info");
    weatherInfo.innerHTML = "";

    const today = new Date();
    /*const forecastDays = [0, 1, 2];*/

    for (let i = 0; i < 3; i++) {
      const forecastDate = new Date(today);
      forecastDate.setDate(today.getDate() + i);
      const forecastDateStr = forecastDate.toISOString().slice(0, 10);

      const dailyForecast = data.list.filter((forecast) =>
        forecast.dt_txt.startsWith(forecastDateStr)
      );

      if (dailyForecast.length > 0) {
        const avgTemp =
          dailyForecast.reduce((sum, forecast) => sum + forecast.main.temp, 0) /
          dailyForecast.length;
        const weatherDescription = dailyForecast[0].weather[0].description;
        const icon = dailyForecast[0].weather[0].icon;

        const weatherItem = document.createElement("div");
        weatherItem.className = "weather-item";
        weatherItem.innerHTML = `
        <h3>${forecastDate.toLocaleDateString()}</h3>
        <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="${weatherDescription}" alt="${weatherDescription}" />
        <p>${Math.round(avgTemp)} °C</p>
        <p>${weatherDescription}</p>
        `;
        weatherInfo.appendChild(weatherItem);
      }
    }
  } catch (error) {
    console.error("Error trying to fetch data", error);
    document.getElementById("weather-Info").innerText =
      "Could not fetch weather data.";
  }
}
document.addEventListener("DOMContentLoaded", function () {
  geoFindMe();
});
//-----------------------------------------------------------------------------------------------------------------------------------------
const noteArea = document.getElementById("note-Area");

noteArea.value = localStorage.getItem("notes") || "";

noteArea.addEventListener("input", function () {
  localStorage.setItem("notes", noteArea.value);
});

//-----------------------------------------------------------------------------------------------------------------------------------------
//MainCode to show teatcher for weather api
document.getElementById("fetchStock").addEventListener("click", function () {
  const symbol = document.getElementById("symbol").value;
  const apiKey = "W27I5PQZWEHYBN5R";
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=${apiKey}`;

  fetch(
    `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=${apiKey}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network is out of function");
      }
      return response.json();
    })
    .then((data) => {
      if (!data["Time Series (1min)"]) {
        throw new Error("No data found for the provided symbol");
      }

      const timeSeries = data["Time Series (1min)"];
      const latestTime = Object.keys(timeSeries)[0];
      const latestData = timeSeries[latestTime];

      const stockInfo = `
    <h2>${symbol.toUpperCase()}</h2>
    <p>Time: ${latestTime}</p>
    <p>Opening Price: ${latestData["1. open"]}</p>
    <p>Most increased Price: ${latestData["2. high"]}</p>
    <p>Most decreased Price: ${latestData["3. low"]}</p>
    <p>Closing Price: ${latestData["4. close"]}</p>
    <p>Volume: ${latestData["5. volume"]}</p>`;
      document.getElementById("stockInfo").innerHTML = stockInfo;
    })
    .catch((error) => {
      console.error("Nwtwork error has happened trying to fetch data", error);
      document.getElementById("stockInfo").innerHTML =
        "A wrong has occures. Please control the stock-symbol or try again later";
    });
});

//-----------------------------------------------------------------------------------------------------------------
//Ha kvar för att visa läraren
//Kod för att få användare att mata in egen api nyckel. Vet inte varför väder api inte hämtas trots giltig api nyckel
/*document.getElementById("save-api-key").addEventListener("click", () => {
  const apiKey = document.getElementById("api-key-input").value;
  if (apiKey) {
    localStorage.setItem("apiKey", apiKey);
    alert("API-Key is now saved!");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          fetchWeather(latitude, longitude);
        },
        function (error) {
          alert("Unable to retrieve your location. Please try again.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
});

async function fetchWeather(latitude, longitude) {
  const apiKey = getApiKey();
  if (!apiKey) {
    alert("Please write an API-Key first.");
    return;
  }

  try {
    const response = await fetch(
      "https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric"
    );
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response", errorData);

      throw new Error(`Network error: ${response.status}`);
    }
    const data = await response.json();

    console.log(data);

    const today = new Date();
    const threeDaysWeather = data.list
      .filter((item) => {
        const date = new Date(item.dt * 1000);
        return (
          date.getDate() >= today.getDate() &&
          date.getDate() <= today.getDate() + 2 &&
          date.getMonth() === today.getMonth()
        );
      })
      .slice(0, 3);

    const weatherHtml = threeDaysWeather
      .map((item) => {
        const date = new Date(item.dt * 1000);
        const icon = item.weather[0].icon;
        const temp = item.main.temp;
        const description = item.weather[0].description;
        return `
      <div class="weather-day">
      <h3>${date.toLocaleDateString()}</h3>
      <img src="http://openweathermap.org/img/wn/${icon}.png" alt="${description}" />
      <p>Temperature: ${temp}°C</p>
      <p>Weather: ${description}</p>
      </div>
      `;
      })
      .join("");

    document.getElementById("weather-Info").innerHTML = weatherHtml;
  } catch (error) {
    console.error("Error when trying to fetch weather data.", error);
    document.getElementById("weather-Info").innerText =
      "Could not fetch the weather data.";
  }
}*/
//---------------------------------------------------------------------------------------------------------------------------
//Ha kvar för att visa läraren som alternativ kod för G
// Hämta väder api utan nyckel med open api
/*
document.addEventListener("DOMContentLoaded", function () {
  const weatherInfo = document.getElementById("weather-Info");
  const findMeButton = document.getElementById("find-me");
  const statusDiv = document.getElementById("status");
  const mapLink = document.getElementById("map-link");

  findMeButton.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else
      statusDiv.textContent = "eolocation is not supported by this browser.";
  });
});

function showPosition(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  getWeatherData(latitude, longitude);
  mapLink.href = `https://www.google.com/maps/@${latitude},${longitude},15z`;
  mapLink.textContent = "View on Google Maps";
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      statusDiv.textContent = "Geolocation request is denied";
      break;

    case error.POSITION_UNAVAILABLE:
      statusDiv.textContent = "The information about location is unavailable";
      break;

    case error.TIMEOUT:
      statusDiv.textContent =
        "The time for requesing user location has passed out";
      break;

    case error.UNKNOWN_ERROR:
      statusDiv.textContent = "It has occured an unknown error";
      break;
  }
}
async function getWeatherData(latitude, longitude) {
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation_sum,weathercode&timezone=auto`;
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation_sum,weathercode&timezone=auto`
    );
    const data = await response.json();

    if (data.hourly) {
      displayWeather(data.hourly);
    } else {
      weatherInfo.textContent = "Weather data is not available to show";
    }
  } catch (error) {
    console.error("Error when trying to fetch the data", error);
    weatherInfo.textContent = "Error when fetching data.";
  }
}

function displayWeather(hourlyData) {
  weatherInfo.innerHTML = "";
  const { temperature_2m, precipitation_sum, weathercode } = hourlyData;

  for (let i = 0; i < temperature_2m.length; i++) {
    const Temperature = temperature_2m[i];
    const precipitation = precipitation_sum[i];
    const weatherCondition = getWeatherCondition(weathercode[i]);

    const weatherItem = document.createElement("div");
    weatherItem.classList.add(weather - item);
    weatherItem.innerHTML = `
    <p>Temperature: ${Temperature}°C</p>
    <p>Precipitation: ${precipitation}</p>
    <p>Condition: ${weatherCondition}</p>
    `;
    weatherInfo.appendChild("weatherItem");
  }
}

function getWeatherCondition(code) {
  const conditions = {
    0: "Clear sky",
    1: "Mainly Clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Fog",
    61: "Drizzle",
    63: "Rain",
    80: "Rain showers",
    95: "Thunderstorms",
    99: "Thunderstorms with hail",
  };
  return conditions[code] || "unknown condition";
}*/
