import "./style/card-forecast-style.css";
import { icons } from "./icon.ts";
type IconKey = keyof typeof icons;

interface ForecastData {
  tempmax: number;
  tempmin: number;
  icon: IconKey;
  datetime: string;
}
function FtoC(fahrenheit: number) {
  return Number((((fahrenheit - 32) * 5) / 9).toFixed(1));
}
class CardForecast {
  constructor() {}
  cardBody(forecastData: ForecastData) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const day = new Date(forecastData.datetime).getDay();
    const date = new Date(forecastData.datetime).toLocaleDateString("us-US").replace(/\//g, "-");
    return `<div class="card-container">
            <div class="card-content">
              <div class="card-header">
                <p class="day">${date}</p>
                <h3 class="day">${days[day]}</h3>
              </div>
              <div class="card-icon">
                  <img src="${icons[forecastData.icon]}" class="logo" alt="logo" />
              </div>
              <div class="card-temp-forecast">
                <div class="temp-lowest">
                  <p>Min</p>
                  <h4 class="tempLowest">${FtoC(forecastData.tempmin)}°C</h4>
                </div>
                <div class="temp-highest">
                  <p>Max</p>
                  <h4 class="tempHighest">${FtoC(forecastData.tempmax)}°C</h4>
                </div>
              </div>
            </div>
          </div>`;
  }
}
const cardForecast = new CardForecast();
export { cardForecast, FtoC };
