var url_string = window.location.href;
var url = new URL(url_string);
var adp = url.searchParams.get("adp");
var inibidor = url.searchParams.get("inibidor");
var substrato = url.searchParams.get("substrato");
var desacoplador = url.searchParams.get("desacoplador");

let label = '';
label += adp === "semadp" ? '0' : adp;
label += " nmol ADP";
label += inibidor === "semini" ? '' : ' + ' + inibidor;
label += desacoplador === "semdes" ? '' : ' + ' + desacoplador;

const ctx = document.getElementById('myChart');
const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul'];
let data = [];

let count = 0;

Chart.defaults.font.size = 18;

const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: new Array(100).fill(''),
        datasets: [{
            label: 'primeiro',
            data: data,
            fill: true,
            borderColor: "#712cf9",
            tension: 0.1
        }
            ,
            {
                label: 'Mitocôndria',
                backgroundColor: '#FFBD00'
            },
            {
                label: label,
                backgroundColor: '#FF0054'
            }
        ]
    },
    options: {
        elements: {
            point: {
                radius: alternateRadius,
                pointStyle: 'circle',
                backgroundColor: alternateColor
            }
        },
        aspectRatio: 1.5,
        plugins: {
            label: {
                display: false
            },
            legend: {
                labels: {
                    filter: (legendItem, chartData) => (legendItem.text !== 'primeiro'),
                }
            },
            tooltip: {
                enabled: false
            }
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    drawTicks: false
                },
                title: {
                    display: true,
                    text: 'Tempo',
                    font: {
                        size: 16
                    }
                }
            },
            y: {
                min: 0,
                max: 100,
                title: {
                    display: true,
                    text: '% de Oxigênio no meio',
                    font: {
                        size: 16
                    }
                }
            }
        }
    }
});

let estado = '';
// halt
{
    let a = inibidor === 'Rotenona' && substrato === 'Malato';
    let b = inibidor === 'Amital' && substrato === 'Malato';
    let c = inibidor === 'Antimicina' && desacoplador === 'semdes';
    let d = inibidor === 'Cianeto';
    estado = a || b || c || d ? 'halt' : '';
}
if (estado === '')// mantem
{
    let a = inibidor === 'semini' && adp === 'semadp' && desacoplador === 'semdes';
    estado = a ? 'mantem' : '';
}

// queda leve
// queda media
// queda grande
// queda brusca
if (estado === ''){
	let a = inibidor !== 'Oligomicina' && inibidor !== 'Cianeto';
    let b = desacoplador === 'Dinitrofenol';
    estado = a && b ? 'brusca' : '';
}



let loop = setInterval(() => {
    if (count < 13) {
        let a = Math.floor(Math.random() * 10);
        let num = a % 2 === 0 ? 1 : -1;
        data.push(95 + num * Math.floor(Math.random() * 2));
    } else if (count < 26) {
        let a = Math.floor(Math.random() * 10);
        let num = a % 2 === 0 ? 1 : -1;
        data.push(data[data.length - 1] + num * Math.floor(Math.random() * 1.2) - 0.5);
    } else {

        let a = Math.floor(Math.random() * 10);
        let num = a % 2 === 0 ? 1 : -1;

        switch (estado) {
            case "halt":
                data.push(data[25] + num * Math.floor(Math.random() * 1.5));
            case "mantem":
                data.push(data[data.length - 1] + num * Math.floor(Math.random() * 1.2) - 0.3);
                break;
            case "brusca":
				data.push(getQueda(count, 29, -3, -24) + num * Math.floor(Math.random() * 1.5));
                break;
        }


    }


    count++;
    chart.update();
    if (count >= 100) {
        clearInterval(loop);
    }
}, 50);


function getQueda(x, a, b, c){
	return ((1/Math.log(x + c)) * a) + b;
}

function alternateRadius(ctx) {
    if (ctx.dataIndex === 12 || ctx.dataIndex === 25) {
        return 10;
    } else {
        return 0;
    }
}

function alternateColor(ctx) {
    if (ctx.dataIndex === 12) {
        return '#FFBD00';
    } else {
        return '#FF0054';
    }
}