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
      addLinkButton.textContent = "Hide Inputs";
    } else {
      linkTitleInput.style.display = "none";
      linkUrlInput.style.display = "none";
      addLinkButton.textContent = "Show Inputs";
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
    mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
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
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) {
      throw new Error(`Network is out of function ${response.status}`);
    }
    const data = await response.json();
    document.getElementById(
      "weather-Info"
    ).innerText = `Temperature: ${data.main.temp} °C, Weather: ${data.weather[0].description}`;

    localStorage.setItem("weather", JSON.stringify(data));
  } catch (error) {
    console.error("Error trying to fetch data", error);
    document.getElementById("weather-Info").innerText =
      "Could not fetch weather data.";
  }
}
document.querySelector("#find-me").addEventListener("click", geoFindMe);
//-----------------------------------------------------------------------------------------------------------------------------------------
const noteArea = document.getElementById("note-Area");

noteArea.value = localStorage.getItem("notes") || "";

noteArea.addEventListener("input", function () {
  localStorage.setItem("notes", noteArea.value);
});

//-----------------------------------------------------------------------------------------------------------------------------------------

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
