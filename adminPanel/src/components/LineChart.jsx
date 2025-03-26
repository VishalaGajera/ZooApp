import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, Filler);

const LineChart = ({ data }) => {
    const [chartData, setChartData] = useState(null);
    const currency=import.meta.env.VITE_CURRENCY;
    console.log(currency)

    useEffect(() => {
        if (data) {
            const calculateCostData = () => {
                const adoptionData = data || [];
                const currentDate = new Date();
                const currentMonth = currentDate.getMonth(); // Current month (0 = Jan, 1 = Feb, ..., 11 = Dec)
                const currentYear = currentDate.getFullYear();

                // Generate months from the current month backwards for the last 12 months
                const months = [];
                for (let i = 0; i < 12; i++) {
                    const date = new Date(currentYear, currentMonth - i);
                    months.unshift(date.toLocaleString('default', { month: 'short' }));
                }

                // Initialize an array to hold the total adoption cost for each month
                const monthlyCosts = new Array(12).fill(0);

                // Process each adoption entry and calculate the cost for each month
                adoptionData.map((adoption) => {
                    const adoptionDate = new Date(adoption.createdAt);
                    const adoptionYear = adoptionDate.getFullYear();
                    const adoptionMonth = adoptionDate.getMonth();

                    // Only include data for the last 12 months (current and previous 11)
                    if (
                        (adoptionYear === currentYear && adoptionMonth >= currentMonth - 11 && adoptionMonth <= currentMonth) ||
                        (adoptionYear === currentYear - 1 && adoptionMonth > currentMonth)
                    ) {
                        // Adjust month index: If the month is before the current month in the year, calculate correctly
                        let monthIndex = adoptionMonth - currentMonth;
                        if (monthIndex < 0) monthIndex += 12; // This ensures proper handling when crossing the year boundary
                        console.log(adoption.cost)
                        // Add the adoption cost to the corresponding month index
                        monthlyCosts[monthIndex] += adoption.cost;
                    }

                });
                console.log(monthlyCosts.reverse())
                // Set the chart data with calculated monthly costs
                setChartData({
                    labels: months, // Labels: last 12 months (e.g., 'Mar', 'Feb', ...)
                    datasets: [
                        {
                            label: 'Adoption Cost ($)',
                            data: monthlyCosts, // Data: sum of adoption costs for each month
                            fill: true,
                            backgroundColor: 'rgba(35, 119, 252, 0.2)',
                            borderColor: 'rgb(35, 119, 252)',
                            borderWidth: 4,
                            tension: 0.6,
                            pointBackgroundColor: 'rgb(35, 119, 252)',
                            pointRadius: 0,
                            pointHoverRadius: 6,
                            pointHoverBorderColor: 'white',
                            pointHoverBorderWidth: 3,
                        },
                    ],
                });
            };

            calculateCostData();
        }
    }, [data]);

    const options = {
        responsive: true,
        animation: true,
        maintainAspectRatio: true,
        plugins: {
            title: {
                display: false,
            },
            legend: {
                display: false,
            },
            tooltip: {
                intersect: false,
                enabled: true,
                callbacks: {
                    title: function (tooltipItem) {
                        const xValue = tooltipItem[0].label;
                        return `${xValue}`;
                    },
                    label: function (tooltipItem) {
                        const label = tooltipItem.dataset.label || '';
                        const value = tooltipItem.raw;
                        return ` ${currency}.${value.toFixed(2)}`;
                    },
                },
                backgroundColor: 'white',
                titleColor: 'black',
                bodyColor: 'black',
                borderColor: 'rgb(35, 119, 252)',
                borderWidth: 1,
                padding: 10,
            },
        },
        scales: {
            x: {
                display: true,
                grid: {
                    display: false,
                },
                ticks: {
                    display: true,
                },
            },
            y: {
                display: true,
                grid: {
                    display: true,
                    drawBorder: false,
                },
                ticks: {
                    display: false,
                },
            },
        },
    };

    return (
        <div>
            {chartData ? (
                <Line data={chartData} options={options} height={'120%'} style={{ maxWidth: '100%' }} />
            ) : (
                <div>Loading chart data...</div>
            )}
        </div>
    );
};

export default LineChart;
