import "./style/card-today-graph.css";
import Chart from "chart.js/auto";
interface GrapghData {
  datetime: string;
  temp: number;
}
class CardGrapgh {
  constructor() {}
  initChart(data: GrapghData[]) {
    let tempTime: string[] = data.map((item) => {
      if (item.datetime[0] === "0") {
        return item.datetime.substring(1, 2);
      }
      return item.datetime.substring(0, 2);
    });

    let tempArray: number[] = data.map((item): number => item.temp);
    tempArray = tempArray.map((temp: number) => {
      return Number((((temp - 32) * 5) / 9).toFixed(1));
    });

    const canvas = document.getElementById("myChart") as HTMLCanvasElement | null;
    if (!canvas) {
      throw new Error("No canvas found");
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("No context found");
    }
    // lineární gradient shora dolů
    // const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    // gradient.addColorStop(0, "rgba(0, 255, 21, 0.5)"); // nahoře barva
    // gradient.addColorStop(1, "rgba(32, 32, 32, 0)"); // dole průhledná
    // const ctx = document.getElementById("myChart") as HTMLCanvasElement | null;
    if (ctx) {
      new Chart(ctx, {
        type: "line",
        data: {
          labels: tempTime,
          datasets: [
            {
              label: "Temp",
              backgroundColor: (context) => {
                const chart = context.chart;
                const { ctx, chartArea, scales } = chart;
                if (!chartArea) return "transparent";

                const { top, bottom } = chartArea;
                const yScale = scales.y;
                const zeroY = yScale.getPixelForValue(0);

                // vytvoření gradientu shora dolů
                const gradient = ctx.createLinearGradient(0, top, 0, bottom);

                // všechny hodnoty záporné
                if (zeroY <= top) {
                  gradient.addColorStop(0, "rgba(16, 179, 255, 0.05)"); // nahoře barva
                  gradient.addColorStop(1, "rgba(16, 179, 255, 0.65)"); // dole průhledná
                  return gradient;
                }
                // všechny hodnoty kladné
                if (zeroY >= bottom) {
                  gradient.addColorStop(0, "rgba(82, 250, 67, 0.65)"); // dole průhledná
                  gradient.addColorStop(1, "rgba(82, 250, 67, 0.03)"); // nahoře barva
                  return gradient;
                }

                // mix: zeleně nad nulou, červeně pod nulou
                const ratio = (zeroY - top) / (bottom - top);
                const eps = 0.0001;
                gradient.addColorStop(0, "rgba(82, 250, 67, 0.65)");
                gradient.addColorStop(Math.max(0, ratio - eps), "rgba(82, 250, 67, 0.03)");
                gradient.addColorStop(Math.min(1, ratio + eps), "rgba(16, 179, 255, 0.05)");
                gradient.addColorStop(1, "rgba(16, 179, 255, 0.65)");
                return gradient;
              },
              borderColor: "rgba(110, 110, 110, 0.85)",
              data: tempArray,
              borderWidth: 1,
              pointRadius: 0,
              pointHoverRadius: 1,
              tension: 0.4, // 0 = ostré, 1 = hodně zaoblené
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // umožní roztáhnout na výšku rodiče
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Today hours",
                align: "center", // zarovnání k ose
              },
              ticks: {
                // mirror: true,
                align: "center",
                padding: 2,
                maxRotation: 0,
                minRotation: 0,
              },
              grid: { display: false, drawTicks: false },
              border: { display: false },
            },
            y: {
              title: {
                display: true,
                text: "Temperature °C",
                align: "center", // zarovnání k ose
              },
              ticks: {
                // mirror: true, // zrcadlení na pravou stranu
                align: "center", // zarovnání ticků (start, center, end)
                padding: 2, // záporná hodnota posune čísla dovnitř grafu

                font: { size: 12 },
              },
              border: { display: false },
              grid: { display: false, drawTicks: false },

              beginAtZero: true,
            },
          },
        },
      });
    }
  }
  cardBody() {
    return `
    <div class="card-containter-graph">
        <div class="card-graph-content">
            <canvas id="myChart"></canvas>
        </div>
    </div>`;
  }
}
const cardGraph = new CardGrapgh();
export { cardGraph };
