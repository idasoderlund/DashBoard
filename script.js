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

async function fetchWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const apiKey = "0759b575b399c7575cc70e35c9ce508c";
      const response = await fetch(
        `https://api.brightsky.dev/weather?lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      document.getElementById(
        "weather-Info"
      ).innerText = `Temperature: ${data.main.temp} °C, Weather: ${data.weather[0].description}`;
    });
  } else {
    document.getElementById("weather-Info").innerText =
      "Geolocation is not available.";
  }
}

fetchWeather();

document.getElementById("note-Area").addEventListener("input", function () {
  localStorage.setItem("notes", this.value);
});

document.getElementById("note-Area").value =
  localStorage.getItem("notes") || "";

async function fetchNews() {
  const response = await fetch(
    "https://newsapi.org/v2/top-headlines?country=se&apiKey=284da0325c3f453fb27ab27b6ecafe4e"
  ); //lägg in api nyckel
  const data = await response.json();
  const newsContainer = document.getElementById("news");
  data.articles.forEach((article) => {
    const div = document.createElement("div");
    div.innerHTML = ` <a href="${article.url}" target="_blank">${article.title}</a>`;
    newsContainer.appendChild(div);
  });
}
fetchNews();
