document.addEventListener("DOMContentLoaded", () => {
    showTab('proyecto');
    setInterval(updateSensorData, 2000);
    setInterval(actualizarDatos, 3000);

    // Actualizar cada 5 segundos
    setInterval(actualizarGrafica, 5000);
});



function showTab(tabId) {
    document.querySelectorAll('.content').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');

    document.querySelectorAll("nav a").forEach(tab => {
        tab.classList.remove("active");
    });

    document.querySelector(`nav a[onclick="showTab('${tabId}')"]`).classList.add("active");
}

function updateSensorData() {
    const rows = document.querySelectorAll("#sensorTable tbody tr");
    rows.forEach(row => {
        const temp = (20 + Math.random() * 10).toFixed(1);
        const humidity = (40 + Math.random() * 20).toFixed(1);
        const ph = (5 + Math.random() * 2).toFixed(1);
        const co2 = (300 + Math.random() * 50).toFixed(1);

        row.children[1].textContent = `${temp} °C`;
        row.children[2].textContent = `${humidity} %`;
        row.children[3].textContent = `${co2} ppm`;

        row.children[4].textContent = predictIrrigation(temp, humidity);
    });
}

function predictIrrigation(temp, humidity,) {
    return (humidity < 50 && temp > 25) ? "Sí" : "No";
}

// Configuración del gráfico histórico
var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM'],
        datasets: [
            {
                label: 'Temperatura (°C)',
                data: [25, 27, 23, 24, 26],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 2,
                fill: true
            },
            {
                label: 'Humedad (%)',
                data: [60, 65, 55, 58, 63],
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderWidth: 2,
                fill: true
            },
            {
                label: 'pH',
                data: [6.5, 6.8, 6.3, 6.4, 6.7],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                fill: true
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Simulación de datos en tiempo real
function actualizarDatos() {
    document.getElementById("temp-value").innerText = (20 + Math.random() * 5).toFixed(1) + " °C";
    document.getElementById("humedad-value").innerText = (40 + Math.random() * 20).toFixed(1) + " %";
    document.getElementById("co2-value").innerText = (300 + Math.random() * 100).toFixed(1) + " ppm";

    let estado = Math.random() > 0.5 ? "🌱 Saludable" : "⚠️ Necesita atención";
    document.getElementById("estado-planta2").innerText = estado;

    agregarEvento("Datos actualizados.");
}

// Ajustar frecuencia de riego
function updateRiegoValue() {
    let valor = document.getElementById("riego-slider").value;
    document.getElementById("riego-value").innerText = valor;
}

// Activar riego manualmente
function activarRiego() {
    alert("💦 Riego activado!");
    agregarEvento("Riego activado manualmente.");
}

// Registrar eventos en el log
function agregarEvento(mensaje) {
    let log = document.getElementById("event-log");
    let nuevoEvento = document.createElement("li");
    nuevoEvento.innerText = new Date().toLocaleTimeString() + " - " + mensaje;
    log.prepend(nuevoEvento);
}

// Inicializar el gráfico
let ctx2 = document.getElementById("historicalChart").getContext("2d");
let historicalChart = new Chart(ctx2, {
    type: "line",
    data: {
        labels: ["10 min", "8 min", "6 min", "4 min", "2 min", "Ahora"],
        datasets: [{
            label: "Temperatura (°C)",
            data: [22, 21.5, 22.1, 21.8, 22.3, 22.5],
            borderColor: "red",
            borderWidth: 2,
            fill: false
        },
        {
            label: "Humedad (%)",
            data: [50, 52, 51, 50.5, 49, 48],
            borderColor: "blue",
            borderWidth: 2,
            fill: false
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: false
            }
        }
    }
});
document.addEventListener("DOMContentLoaded", () => {
    let tiempo = [];
    let predicciones = [];
    let temperaturaDatos = [];
    let humedadDatos = [];

    function generarDatosML() {
        let temperatura = (20 + Math.random() * 10).toFixed(1); // Entre 20 y 30°C
        let humedad = (40 + Math.random() * 30).toFixed(1); // Entre 40% y 70%
        let necesitaRiego = (humedad < 50 && temperatura > 25) ? 1 : 0;
        return { temperatura, humedad, necesitaRiego };
    }

    function actualizarGrafica() {
        let nuevoDato = generarDatosML();
        let timestamp = new Date().toLocaleTimeString();

        if (tiempo.length >= 10) {
            tiempo.shift();
            predicciones.shift();
            temperaturaDatos.shift();
            humedadDatos.shift();
        }

        tiempo.push(timestamp);
        predicciones.push(nuevoDato.necesitaRiego);
        temperaturaDatos.push(nuevoDato.temperatura);
        humedadDatos.push(nuevoDato.humedad);

        mlBehaviorChart.data.labels = tiempo;
        mlBehaviorChart.data.datasets[0].data = predicciones;
        mlBehaviorChart.data.datasets[1].data = temperaturaDatos;
        mlBehaviorChart.data.datasets[2].data = humedadDatos;
        mlBehaviorChart.update();
    }

    let ctxBehavior = document.getElementById("mlBehaviorChart").getContext("2d");
    let mlBehaviorChart = new Chart(ctxBehavior, {
        type: "line",
        data: {
            labels: tiempo,
            datasets: [
                {
                    label: "Predicción de Riego (1 = Sí, 0 = No)",
                    data: predicciones,
                    borderColor: "blue",
                    borderWidth: 2,
                    fill: false,
                    yAxisID: "y"
                },
                {
                    label: "Temperatura (°C)",
                    data: temperaturaDatos,
                    borderColor: "red",
                    borderWidth: 2,
                    fill: false,
                    yAxisID: "y1"
                },
                {
                    label: "Humedad (%)",
                    data: humedadDatos,
                    borderColor: "green",
                    borderWidth: 2,
                    fill: false,
                    yAxisID: "y1"
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    min: -0.2,
                    max: 1.2,
                    ticks: { stepSize: 1 }
                },
                y1: {
                    position: "right",
                    beginAtZero: true
                }
            }
        }
    });

    setInterval(actualizarGrafica, 5000);
});
