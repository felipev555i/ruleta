const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");

// Números de la ruleta en orden correcto
const rouletteNumbers = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
  24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

// Colores correctos para la ruleta
const pieColors = [
  "#008000", // Verde para el 0
  "#000000", "#FF0000", "#000000", "#FF0000", "#000000", "#FF0000", "#000000", "#FF0000", "#000000",
  "#FF0000", "#000000", "#FF0000", "#000000", "#FF0000", "#000000", "#FF0000", "#000000", "#FF0000", "#000000",
  "#FF0000", "#000000", "#FF0000", "#000000", "#FF0000", "#000000", "#FF0000", "#000000", "#FF0000", "#000000",
  "#FF0000", "#000000", "#FF0000", "#000000", "#FF0000", "#000000", "#FF0000"
];

// Object that stores values of minimum and maximum angle for a value
const rotationValues = rouletteNumbers.map((num, index) => {
  const angle = 360 / rouletteNumbers.length;
  return {
    minDegree: index * angle,
    maxDegree: (index + 1) * angle - 0.0001,
    value: num,
    color: pieColors[index]
  };
});

// Tamaño de cada pieza
const data = Array(rouletteNumbers.length).fill(1); // Todos los segmentos tienen el mismo tamaño

// Crear gráfico
let myChart = new Chart(wheel, {
  // Plugin para mostrar texto en el gráfico de pastel
  plugins: [ChartDataLabels],
  // Tipo de gráfico Pie
  type: "pie",
  data: {
    // Etiquetas (valores que se mostrarán en el gráfico)
    labels: rouletteNumbers,
    // Configuración para dataset/pie
    datasets: [
      {
        backgroundColor: pieColors,
        data: data,
      },
    ],
  },
  options: {
    // Gráfico responsivo
    responsive: true,
    animation: { duration: 0 },
    plugins: {
      // Ocultar tooltip y leyenda
      tooltip: false,
      legend: {
        display: false,
      },
      // Mostrar etiquetas dentro del gráfico de pastel
      datalabels: {
        color: "#ffffff",
        formatter: (_, context) => context.chart.data.labels[context.dataIndex],
        font: { size: 16 },
      },
    },
  },
});

// Función para dibujar la bolita blanca
function drawWhiteBall(chart, angleValue) {
  const ctx = chart.ctx;
  const index = rotationValues.findIndex(
    (i) => angleValue >= i.minDegree && angleValue <= i.maxDegree
  );
  if (index !== -1) {
    const meta = chart.getDatasetMeta(0);
    const { startAngle, endAngle } = meta.data[index];
    const midAngle = startAngle + (endAngle - startAngle) / 2;
    const radius = chart.outerRadius * 0.8;
    const x = chart.chartArea.width / 2 + radius * Math.cos(midAngle - Math.PI / 2);
    const y = chart.chartArea.height / 2 + radius * Math.sin(midAngle - Math.PI / 2);
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI);
    ctx.fill();
  }
}

// Función para obtener el nombre del color
const getColorName = (color) => {
  if (color === "#000000") return "Negro";
  if (color === "#FF0000") return "Rojo";
  if (color === "#008000") return "Verde";
  return "Desconocido";
};

// Mostrar valor basado en el ángulo aleatorio
const valueGenerator = (angleValue) => {
  for (let i of rotationValues) {
    // Si el angleValue está entre min y max, entonces mostrarlo
    if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
      const colorName = getColorName(i.color);
      finalValue.innerHTML = `<p>Número Ganador: ${i.value}</p><p>Color: ${colorName}</p>`;
      spinBtn.disabled = false;
      break;
    }
  }
  drawWhiteBall(myChart, angleValue);
};

let count = 0;

let resultValue = 101;

spinBtn.addEventListener("click", () => {
  spinBtn.disabled = true;
  finalValue.innerHTML = `<p>No va mas</p>`;
  let randomDegree = Math.floor(Math.random() * 360);
  let rotationInterval = window.setInterval(() => {
    myChart.options.rotation = myChart.options.rotation + resultValue;
    myChart.update();
    if (myChart.options.rotation >= 360) {
      count += 1;
      resultValue -= 5;
      myChart.options.rotation = 0;
    } else if (count > 15 && myChart.options.rotation >= randomDegree && myChart.options.rotation < randomDegree + 5) {
      valueGenerator(randomDegree % 360);
      clearInterval(rotationInterval);
      count = 0;
      resultValue = 101;
    }
  }, 10);
});
