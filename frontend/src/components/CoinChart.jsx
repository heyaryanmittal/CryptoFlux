import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const CoinChart = ({ history }) => {
    if (!history) return <div className="text-center text-gray-500">No chart data available</div>;

    const data = {
        labels: history.map(item => {
            const date = new Date(item[0]);
            return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        }),
        datasets: [
            {
                label: 'Price (USD)',
                data: history.map(item => item[1]),
                borderColor: '#4ade80',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, 'rgba(74, 222, 128, 0.5)');
                    gradient.addColorStop(1, 'rgba(74, 222, 128, 0.0)');
                    return gradient;
                },
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1e293b',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                padding: 10,
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: (context) => `$${context.parsed.y.toLocaleString()}`
                }
            }
        },
        scales: {
            x: {
                display: false,
                grid: { display: false }
            },
            y: {
                display: true,
                position: 'right',
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: {
                    color: '#6b7280',
                    callback: (value) => '$' + value.toLocaleString()
                }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

    return (
        <div className="w-full h-[400px]">
            <Line data={data} options={options} />
        </div>
    );
};

export default CoinChart;
