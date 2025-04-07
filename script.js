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

const linkList = document.getElementById("link-List");

document.getElementById("add-link").addEventListener("click", function () {
  const title = document.getElementById("link-title").value;
  const url = document.getElementById("link-Url").value;

  if (title && url) {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${url}" target="_blank">${title}</a> <button class="reove-link"> Remove</button>`;
    linkList.appenchild(li);

    saveLink();
    document.getAnimations("link-title").value = "";
    document.getElementById("link-url").value = "";
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

//Väder api
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
  } catch (error) {
    console.error("Error trying to fetch data", error);
    document.getElementById("weather-Info").innerText =
      "Could not fetch weather data.";
  }
}
document.querySelector("#find-me").addEventListener("click", geoFindMe);

async function fetchNews() {
  const response = await fetch(""); //lägg in api nyckel
  const data = await response.json();
  const newsContainer = document.getElementById("news");
  data.articles.forEach((article) => {
    const div = document.createElement("div");
    div.innerHTML = ` <a href="${article.url}" target="_blank">${article.title}</a>`;
    newsContainer.appendChild(div);
  });
}
fetchNews();
