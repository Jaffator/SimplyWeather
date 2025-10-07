import "./main.css";
import { cardToday, cardTodayData } from "./module/card-today";
import type { IconKey } from "./module/card-today";
import { cardGraph } from "./module/card-today-graph";
import { cardForecast, FtoC } from "./module/card-forecast";

const htmlElements = {
  cardToday: document.querySelector<HTMLDivElement>(".card-today"),
  cardGraph: document.querySelector<HTMLDivElement>(".card-today-graph"),
  cardForecast: document.querySelector<HTMLDivElement>(".track"),
  nextBtn: document.querySelector<HTMLButtonElement>("#nextBtn"),
  prevBtn: document.querySelector<HTMLButtonElement>("#prevBtn"),
  inputCity: document.querySelector<HTMLInputElement>("#city-input"),
  searchBtn: document.querySelector<HTMLButtonElement>("#search-btn"),
  cards: document.querySelector<HTMLDivElement>(".cards"),
  dotsContainer: document.querySelector<HTMLDivElement>(".pointers"),
};

interface apiWeatherData {
  resolvedAddress: string;
  days: any[];
  currentConditions: {
    temp: number;
    icon: IconKey;
  };
}

let cardWidth = 92;
let visibleCards = 3;
let limitCarusel = 0;
let currentIndex = 0;

htmlElements.searchBtn?.addEventListener("click", () => {
  const city: string = htmlElements.inputCity?.value ?? "";
  getData(city);
});

htmlElements.nextBtn?.addEventListener("click", () => {
  if (currentIndex >= 0 && currentIndex < limitCarusel) {
    currentIndex++;
    updateDots();
    htmlElements.cardForecast!.style.transform = `translateX(-${cardWidth * visibleCards * currentIndex}px)`;
  }
});

htmlElements.prevBtn?.addEventListener("click", () => {
  if (currentIndex >= 1) {
    currentIndex--;
    updateDots();
    htmlElements.cardForecast!.style.transform = `translateX(-${cardWidth * visibleCards * currentIndex}px)`;
  }
});

const mediaQuery = window.matchMedia("(max-width: 760px)") as MediaQueryList;
mediaQuery.addEventListener("change", handleChangeScreen);

function createDots(num: number) {
  htmlElements.dotsContainer?.querySelectorAll(".dot").forEach((dot) => dot.remove());
  for (let i = 0; i < num; i++) {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (i == 0) dot.classList.add("active");
    htmlElements.dotsContainer?.appendChild(dot);
  }
}

function handleChangeScreen(e: MediaQueryListEvent | MediaQueryList) {
  // Both MediaQueryListEvent and MediaQueryList have .matches
  if (e.matches) {
    createDots(4);
    console.log("smaller screen");
    cardWidth = 112;
    visibleCards = 3;
    limitCarusel = 3;
  } else {
    createDots(2);
    console.log("big screen");
    cardWidth = 127;
    visibleCards = 5;
    limitCarusel = 1;
  }
}

function showMessage(message: string, duration = 2000) {
  // vytvoř div
  const msg = document.createElement("div");
  msg.textContent = message;

  // styluj
  msg.style.position = "fixed";
  msg.style.bottom = "30px";
  msg.style.left = "50%";
  msg.style.transform = "translateX(-50%)";
  msg.style.background = "rgba(46, 46, 46, 0.8)";
  msg.style.color = "white";
  msg.style.padding = "10px 20px";
  msg.style.borderRadius = "10px";
  msg.style.fontSize = "14px";
  msg.style.zIndex = "1000";
  msg.style.transition = "opacity 0.5s";

  document.body.appendChild(msg);

  // po určité době fade-out a odstranění
  setTimeout(() => {
    msg.style.opacity = "0";
    setTimeout(() => msg.remove(), 500); // počkej na fade-out animaci
  }, duration);
}

async function getData(city: string) {
  let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/
              ${city}?iconSet=icons1&key=J3XRTZU3H6PENPF7VYM8XLHT6`;
  let data: apiWeatherData | undefined;

  try {
    showMessage("Loading forecast...");
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP chyba: ${response.status} ${response.statusText}`);
    }
    data = await response.json();

    if (htmlElements.cards && data) {
      htmlElements.cards.style.display = "flex";
      setTodayCard(data);
      setForecastCard(data);
      htmlElements.cardGraph!.innerHTML = cardGraph.cardBody();
      cardGraph.initChart(data.days[0].hours);
      handleChangeScreen(mediaQuery);
    }
  } catch (error) {
    showMessage("City doesn't exist...");
    htmlElements.cards!.style.display = "none";
    console.error("Chyba při načítání dat počasí:", error);
  }
}

function updateDots() {
  const navDots = document.querySelectorAll(".dot");
  navDots.forEach((dot, i) => {
    dot.classList.toggle("active", i === currentIndex);
  });
}

function capitalizeCityFirstLetter(city: string) {
  if (!city) return city;
  const firstLetter = city[0];
  if (firstLetter === firstLetter.toUpperCase()) {
    return city;
  } else {
    return firstLetter.toUpperCase() + city.slice(1);
  }
}

function getCityandRestAddress(resolveAddress: string): { city: string; restAddress: string } {
  let city = "";
  let restAddress = "";

  if (resolveAddress.search(",") === -1) {
    const city = capitalizeCityFirstLetter(resolveAddress);
    return { city, restAddress };
  } else {
    city = resolveAddress.slice(0, resolveAddress.search(","));
    restAddress = resolveAddress.slice(resolveAddress.search(",") + 1);
  }

  return { city, restAddress };
}

function setForecastCard(data: apiWeatherData) {
  for (const [i, val] of data.days.entries()) {
    if (i === 11) break;
    if (i === 0) continue;
    htmlElements.cardForecast!.innerHTML += cardForecast.cardBody(val);
  }
}

function setTodayCard(data: apiWeatherData) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayDate = new Date(data.days[0].datetime);
  const day = days[todayDate.getDay()];
  cardTodayData.date = todayDate.toLocaleDateString("us-US").replace(/\//g, "-");
  cardTodayData.day = day;
  cardTodayData.city = getCityandRestAddress(data.resolvedAddress).city;
  cardTodayData.restAddress = getCityandRestAddress(data.resolvedAddress).restAddress;
  cardTodayData.actualTemp = FtoC(data.currentConditions.temp);
  cardTodayData.icon = data.currentConditions.icon;
  htmlElements.cardToday!.innerHTML = cardToday.cardBody(cardTodayData);
}
