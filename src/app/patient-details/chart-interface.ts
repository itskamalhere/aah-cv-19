import { ChartDataSets, ChartScales, TimeScale } from 'chart.js';
import { Label, Color } from 'ng2-charts';

export interface ChartConfig {
    id: string,
    chartData: ChartDataSets[];
    chartLabels: Label[];
    chartType: string;
    chartOptions?: any;
    chartColors: Color[];
    showLegend: boolean;
}
export interface VitalsMetadata {
    id: string;
    label: string;
    chartOptions: {
        responsive: true,
        scales?: ChartScales,
        title?: {
            display: true,
            text: 'Temperature Monitoring Chart'
        }
    };

}

export const DAY_TIMESCALE: TimeScale = {
    unit: 'hour',
    displayFormats: {
        hour: 'h:mm a'
    }
};

export const WEEK_TIMESCALE: TimeScale = {
    unit: 'day',
    displayFormats: {
        day: 'MMM D'
    }
};

export const MONTH_TIMESCALE: TimeScale = {
    unit: 'day',
    stepSize: 5,
    displayFormats: {
        day: 'MMM D'
    }
};

export const YEAR_TIMESCALE: TimeScale = {
    unit: 'month',
    displayFormats: {
        month: 'MMM YY'
    }
};

export class VitalsConfig {
    vitalsConfigModel: VitalsMetadata[] = [
        {
            id: 'temperature',
            label: 'Temperature',
            chartOptions: {
                responsive: true,
                scales: {
                    yAxes: [{
                        gridLines: {
                            display: true,
                            color: "black"
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "Temperature",
                            fontColor: "red"
                        },
                        type: 'linear',
                        ticks: {
                            max: 110,
                            min: 90,
                            stepSize: 4
                        }
                    }],
                    xAxes: [{
                        display: true,
                        gridLines: {
                            display: true,
                            color: "black"
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "Time",
                            fontColor: "red"
                        },
                        type: 'time',
                        time: {
                            unit: 'hour',
                            displayFormats: {
                                hour: 'h:mm a',
                                day: 'DDD M'
                            }
                        }
                    }]
                }
            }
        },
        {
            id: 'bpSystolic|bpDiastolic',
            label: 'Systolic|Diastolic',
            chartOptions: {
                responsive: true,
                scales: {
                    yAxes: [{
                        // id: "bpSystolic",
                        gridLines: {
                            display: true,
                            color: "black"
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "Systolic",
                            fontColor: "red"
                        },
                        type: 'linear',
                        ticks: {
                            max: 200,
                            min: 10,
                            stepSize: 40
                        }
                    },
                    {
                        // id: "bpDiastolic",
                        position: 'right',
                        gridLines: {
                            display: true,
                            color: "black"
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "Diastolic",
                            fontColor: "red"
                        },
                        type: 'linear',
                        ticks: {
                            max: 200,
                            min: 10,
                            stepSize: 40
                        }
                    }],
                    xAxes: [{
                        display: true,
                        gridLines: {
                            display: true,
                            color: "black"
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "Time",
                            fontColor: "red"
                        },
                        type: 'time',
                        time: {
                            unit: 'hour',
                            displayFormats: {
                                hour: 'h:mm a'
                            }
                        }
                    }]
                }
            }
        },
        {
            id: 'spo2',
            label: 'SPO2',
            chartOptions: {
                responsive: true,
                scales: {
                    yAxes: [{
                        gridLines: {
                            display: true,
                            color: "black"
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "SPO2",
                            fontColor: "red"
                        },
                        type: 'linear',
                        ticks: {
                            max: 120,
                            min: 0,
                            stepSize: 20
                        }
                    }],
                    xAxes: [{
                        display: true,
                        gridLines: {
                            display: true,
                            color: "black"
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "Time",
                            fontColor: "red"
                        },
                        type: 'time',
                        time: {
                            unit: 'hour',
                            displayFormats: {
                                hour: 'h:mm a'
                            }
                        }
                    }]
                }
            }
        }
    ];
}
