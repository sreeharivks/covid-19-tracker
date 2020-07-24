import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import numeral from 'numeral';

const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: 'index',
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format('+0,0');
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: 'time',
                time: {
                    format: 'MM/DD/YY',
                    tooltipFormat: 'll',
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    callback: function (value, index, values) {
                        return numeral(value).format('0a');
                    },
                },
            },
        ],
    },
};

const buildChartData = (data = 0, casesType = 'cases') => {
    const chartData = [];
    let lastDataPoint;
    for (let date in data.cases) {
        if (lastDataPoint) {
            let newDataPoint = {
                x: date,
                y: data[casesType][date] - lastDataPoint,
            };
            chartData.push(newDataPoint);
        }
        lastDataPoint = data[casesType][date];
    }
    return chartData;
};

function LineGraph({ casesType = 'cases', country, ...props }) {
    const [data, setData] = useState();
    const [chartColor, setchartColor] = useState({
        backgroundColor: 'rgba(204, 16, 52, 0.5)',
        borderColor: '#CC1034',
    });
    useEffect(() => {
        const fetchData = async () => {
            await fetch(
                country === 'worldwide'
                    ? 'https://disease.sh/v3/covid-19/historical/all?lastdays=120'
                    : `https://disease.sh/v3/covid-19/historical/${country}?lastdays=120`
            )
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    let chartData =
                        country === 'worldwide'
                            ? buildChartData(data, casesType)
                            : buildChartData(data.timeline, casesType);
                    setData(chartData);
                });
        };
        fetchData();

        switch (casesType) {
            case 'cases':
                setchartColor({
                    backgroundColor: 'rgba(204, 16, 52, 0.5)',
                    borderColor: '#CC1034',
                });
                break;
            case 'recovered':
                setchartColor({
                    backgroundColor: 'rgba(125, 215, 29, 0.5)',
                    borderColor: '#7dd71d',
                });
                break;
            case 'deaths':
                setchartColor({
                    backgroundColor: 'rgba(251, 68, 67, 0.5)',
                    borderColor: '#fb4443',
                });
                break;
            default:
                setchartColor({
                    backgroundColor: 'rgba(204, 16, 52, 0.5)',
                    borderColor: '#CC1034',
                });
        }
    }, [casesType, country]);

    return (
        <div className={props.className}>
            {data?.length === 0 ? (
                <div>
                    <h4>Data is currently not available</h4>
                </div>
            ) : (
                <Line
                    data={{
                        datasets: [
                            {
                                backgroundColor: chartColor.backgroundColor,
                                borderColor: chartColor.borderColor,
                                data: data,
                            },
                        ],
                    }}
                    options={options}
                />
            )}

            {/* {data?.length > 0 && (
                <Line
                    data={{
                        datasets: [
                            {
                                backgroundColor: chartColor.backgroundColor,
                                borderColor: chartColor.borderColor,
                                data: data,
                            },
                        ],
                    }}
                    options={options}
                />
            )} */}
        </div>
    );
}

export default LineGraph;
