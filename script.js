function updateClock() {
  let t = new Date();
  document.getElementById("clock").innerText = t.toLocaleString();
}
setInterval(updateClock, 1e3),
  document.getElementById("title").addEventListener("blur", function () {
    localStorage.setItem("dashboardTitle", this.innerText);
  }),
  (document.getElementById("title").innerText =
    localStorage.getItem("dashboardTitle") || "My DashBoard;");
const linkList = document.getElementById("link-List"),
  linkTitleInput = document.getElementById("link-title"),
  linkUrlInput = document.getElementById("link-Url"),
  addLinkButton = document.getElementById("add-link");
function saveLinks() {
  let t = [];
  document.querySelectorAll("#link-List li").forEach((e) => {
    let n = e.querySelector("a");
    n && t.push({ title: n.innerText, url: n.href });
  }),
    localStorage.setItem("links", JSON.stringify(t));
}
function loadLinks() {
  let t = JSON.parse(localStorage.getItem("links")) || [];
  t.forEach((t) => {
    let e = document.createElement("li");
    (e.innerHTML = `<a href="${t.url}" target="_blank">${t.title}</a> <button class="remove-link">Remove</button>`),
      linkList.appendChild(e);
  });
}
addLinkButton.addEventListener("click", function () {
  let t = linkTitleInput.value,
    e = linkUrlInput.value;
  if (t && e) {
    let n = document.createElement("li");
    (n.innerHTML = `<a href="${e}" target="_blank">${t}</a> <button class="remove-link"> Remove</button>`),
      linkList.appendChild(n),
      saveLinks(),
      (linkTitleInput.value = ""),
      (linkUrlInput.value = "");
  }
}),
  linkList.addEventListener("click", function (t) {
    t.target.classList.contains("remove-link") &&
      (t.target.parentElement.remove(), saveLinks());
  }),
  loadLinks(),
  document.addEventListener("DOMContentLoaded", function () {
    let t = document.createElement("div");
    t.appendChild(linkTitleInput),
      t.appendChild(linkUrlInput),
      addLinkButton.addEventListener("click", function () {
        "none" === linkTitleInput.style.display ||
        "none" === linkUrlInput.style.display
          ? ((linkTitleInput.style.display = "block"),
            (linkUrlInput.style.display = "block"),
            (addLinkButton.textContent = "Click to Add"))
          : ((linkTitleInput.style.display = "none"),
            (linkUrlInput.style.display = "none"),
            (addLinkButton.textContent = "+ Add Link"));
      }),
      (linkTitleInput.style.display = "none"),
      (linkUrlInput.style.display = "none");
    let e = document.getElementById("favouriteOptions");
    e.appendChild(t);
  });

//Fetching geolocation for currentposition----------------------------------------------------------------------------------------------------------------------
function geoFindMe() {
  let t = document.querySelector("#status"),
    e = document.querySelector("#map-link");
  document.getElementById("weather-Info"),
    (e.href = ""),
    (e.textContent = ""),
    navigator.geolocation
      ? ((t.textContent = "Locating…"),
        navigator.geolocation.getCurrentPosition(
          function n(o) {
            let a = o.coords.latitude,
              r = o.coords.longitude;
            (t.textContent = ""),
              (e.href = `https://www.openstreetmap.org/#map=18/${a}${r}`),
              (e.textContent = `Latitude: ${a} \xb0, Longitude: ${r} \xb0`),
              localStorage.setItem("latitude", "latitude"),
              localStorage.setItem("longitude", "longitude"),
              fetchWeather(a, r);
          },
          function e() {
            t.textContent = "Unable to retrieve your location";
          }
        ))
      : (t.textContent = "Geolocation is not supported by your browser");
}
async function fetchWeather(t, e) {
  try {
    let n = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${t}&lon=${e}&appid=0759b575b399c7575cc70e35c9ce508c&units=metric`
    );
    if (!n.ok) throw Error(`Network is out of function ${n.status}`);
    let o = await n.json(),
      a = document.getElementById("weather-Info");
    a.innerHTML = "";
    let r = new Date();
    for (let i = 0; i < 3; i++) {
      let l = new Date(r);
      l.setDate(r.getDate() + i);
      let c = l.toISOString().slice(0, 10),
        d = o.list.filter((t) => t.dt_txt.startsWith(c));
      if (d.length > 0) {
        let s = d.reduce((t, e) => t + e.main.temp, 0) / d.length,
          h = d[0].weather[0].description,
          u = d[0].weather[0].icon,
          g = document.createElement("div");
        (g.className = "weather-item"),
          (g.innerHTML = `
        <h3>${l.toLocaleDateString()}</h3>
        <img src="http://openweathermap.org/img/wn/${u}@2x.png" alt="${h}" alt="${h}" />
        <p>${Math.round(s)} \xb0C</p>
        <p>${h}</p>
        `),
          a.appendChild(g);
      }
    }
  } catch (p) {
    console.error("Error trying to fetch data", p),
      (document.getElementById("weather-Info").innerText =
        "Could not fetch weather data.");
  }
}
document.addEventListener("DOMContentLoaded", function () {
  geoFindMe();
});
//-----------------------------------------------------------------------------------------------------------------------------------------
const noteArea = document.getElementById("note-Area");
(noteArea.value = localStorage.getItem("notes") || ""),
  noteArea.addEventListener("input", function () {
    localStorage.setItem("notes", noteArea.value);
  });

//-----------------------------------------------------------------------------------------------------------------------------------------
//MainCode to show teatcher for weather api. weather data si fetched from extern api but api key is shown in code.
document.getElementById("fetchStock").addEventListener("click", function () {
  let e = document.getElementById("symbol").value;
  fetch(
    `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${e}&interval=1min&apikey=W27I5PQZWEHYBN5R`
  )
    .then((e) => {
      if (!e.ok) throw Error("Network is out of function");
      return e.json();
    })
    .then((t) => {
      if (!t["Time Series (1min)"])
        throw Error("No data found for the provided symbol");
      let o = t["Time Series (1min)"],
        n = Object.keys(o)[0],
        r = o[n],
        i = `
    <h2>${e.toUpperCase()}</h2>
    <p>Time: ${n}</p>
    <p>Opening Price: ${r["1. open"]}</p>
    <p>Most increased Price: ${r["2. high"]}</p>
    <p>Most decreased Price: ${r["3. low"]}</p>
    <p>Closing Price: ${r["4. close"]}</p>
    <p>Volume: ${r["5. volume"]}</p>`;
      document.getElementById("stockInfo").innerHTML = i;
    })
    .catch((e) => {
      console.error("Nwtwork error has happened trying to fetch data", e),
        (document.getElementById("stockInfo").innerHTML =
          "A wrong has occures. Please control the stock-symbol or try again later");
    });
});
//-----------------------------------------------------------------------------------------------------------------
//Keep to show teatcher
//Code where user writes api key. i don´t know why weather data is not fetched from api even though api key is valid.
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
//Keep to show teatcher for G. Fetching weather from open API, no key is used.
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
