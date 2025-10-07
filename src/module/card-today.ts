import { icons } from "./icon.js";
import "./style/card-today-style.css";

type IconKey = keyof typeof icons;

interface CardTodayData {
  actualTemp: number;
  icon: IconKey;
  city: string;
  restAddress: string;
  date: string;
  day: string;
}

const cardTodayData = {
  actualTemp: 0,
  icon: "" as IconKey,
  city: "",
  restAddress: "",
  date: "",
  day: "",
};

class CardToday {
  constructor() {}

  setWeatherBackground(actualTemp: number) {
    let bgvalue: string = "";
    const root = document.documentElement;
    if (actualTemp < -15) {
      bgvalue = getComputedStyle(root).getPropertyValue("--freeze");
    } else if (actualTemp >= -15 && actualTemp < -5) {
      bgvalue = getComputedStyle(root).getPropertyValue("--colder");
    } else if (actualTemp >= -5 && actualTemp < 5) {
      bgvalue = getComputedStyle(root).getPropertyValue("--cold");
    } else if (actualTemp >= 5 && actualTemp < 16) {
      bgvalue = getComputedStyle(root).getPropertyValue("--warmer");
    } else if (actualTemp >= 16 && actualTemp < 25) {
      bgvalue = getComputedStyle(root).getPropertyValue("--warm");
    } else if (actualTemp > 25) {
      bgvalue = getComputedStyle(root).getPropertyValue("--hot");
    }
    root.style.setProperty("--bg-today", bgvalue);
    console.log(bgvalue);
  }

  cardBody(cardData: CardTodayData) {
    this.setWeatherBackground(cardData.actualTemp);
    console.log(cardData);
    return `
    <div class="card-container-today">
        <div class="card-actual-content">
            <div class="card-temp-container">
                <p class="card-actual-date">${cardData.day} ${cardData.date}</p>
                <p class="card-actual-temp">${cardData.actualTemp}°C</p>
                <p class="card-actual-city">${cardData.city}</p>
                <p class="card-actual-restAddress">${cardData.restAddress}</p>
            </div>
            <div class="card-actual-icon">
                <img src="${icons[cardData.icon]}" class="logo" />
            </div>
        </div>
    </div>`;
  }
}
const cardToday = new CardToday();
export { cardToday, cardTodayData };
export type { IconKey };
