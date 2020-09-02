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
        tooltips?: any,
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
    },
    tooltipFormat:'h:mm a'
};

export const WEEK_TIMESCALE: TimeScale = {
    unit: 'day',
    displayFormats: {
        day: 'MMM D'
    },
    tooltipFormat: 'MMM D h:mm a'
};

export const MONTH_TIMESCALE: TimeScale = {
    unit: 'day',
    stepSize: 5,
    displayFormats: {
        day: 'MMM D'
    },
    tooltipFormat: 'MMM D h:mm a'
};

export const YEAR_TIMESCALE: TimeScale = {
    unit: 'month',
    displayFormats: {
        month: 'MMM YY'
    },
    tooltipFormat:'MMM YY'
};

export class VitalsConfig {
    vitalsConfigModel: VitalsMetadata[] = [
        {
            id: 'spo2',
            label: 'SPO2',
            chartOptions: {
                tooltips: {
                    mode: 'index',
                    intersect: true,
				},
                responsive: true,
                scales: {
                    yAxes: [{
                        gridLines: {
                            display: true                           
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "SPO2"                           
                        },
                        type: 'linear',
                        ticks: {
                            max: 100,
                            min: 60,
                            stepSize: 10
                        }
                    }],
                    xAxes: [{
                        display: true,
                        gridLines: {
                            display: true                            
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "Time"                           
                        },
                        type: 'time',
                        time: {
                            unit: 'hour',
                            displayFormats: {
                                hour: 'h:mm a'
                            },
                            tooltipFormat:'h:mm a'
                        }
                    }]
                }
            }
        },
        {
            id: 'temperature',
            label: 'Temperature',
            chartOptions: {
                tooltips: {
                    mode: 'index',
                    intersect: true,
				},
                responsive: true,
                scales: {
                    yAxes: [{
                        gridLines: {
                            display: true                            
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "Temperature °F"                            
                        },
                        type: 'linear',
                        ticks: {
                            max: 110,
                            min: 90,
                            stepSize: 5
                        }
                    }],
                    xAxes: [{
                        display: true,
                        gridLines: {
                            display: true                            
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "Time"
                        },
                        type: 'time',
                        time: {
                            unit: 'hour',
                            displayFormats: {
                                hour: 'h:mm a',
                                day: 'DDD M'
                            },
                            tooltipFormat:'h:mm a'
                        }
                    }]
                }
            }
        },
        {
            id: 'heartRate',
            label: 'Heart Rate',
            chartOptions: {
                tooltips: {
                    mode: 'index',
                    intersect: true,
				},
                responsive: true,
                scales: {
                    yAxes: [{
                        gridLines: {
                            display: true
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "Heart Rate"
                        },
                        type: 'linear',
                        ticks: {
                            max: 200,
                            min: 30,
                            stepSize: 50
                        }
                    }],
                    xAxes: [{
                        display: true,
                        gridLines: {
                            display: true
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "Time"
                        },
                        type: 'time',
                        time: {
                            unit: 'hour',
                            displayFormats: {
                                hour: 'h:mm a'
                            },
                            tooltipFormat:'h:mm a'
                        }
                    }]
                }
            }
        },
        {
            id: 'respiration',
            label: 'Breath Rate',
            chartOptions: {
                tooltips: {
                    mode: 'index',
                    intersect: true,
				},
                responsive: true,
                scales: {
                    yAxes: [{
                        gridLines: {
                            display: true
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "Breath Rate (rpm)"
                        },
                        type: 'linear',
                        ticks: {
                            max: 60,
                            min: 10,
                            stepSize: 10
                        }
                    }],
                    xAxes: [{
                        display: true,
                        gridLines: {
                            display: true
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "Time"
                        },
                        type: 'time',
                        time: {
                            unit: 'hour',
                            displayFormats: {
                                hour: 'h:mm a'
                            },
                            tooltipFormat:'h:mm a'
                        }
                    }]
                }
            }
        },                
        {
            id: 'bpSystolic|bpDiastolic',
            label: 'Systolic|Diastolic',
            chartOptions: {
                tooltips: {
                    mode: 'index',
                    intersect: true,
				},
                responsive: true,
                scales: {
                    yAxes: [{                        
                        gridLines: {
                            display: true                            
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "Systolic"                           
                        },
                        type: 'linear',
                        ticks: {
                            max: 250,
                            min: 60,
                            stepSize: 50
                        }
                    },
                    {
                        position: 'right',
                        gridLines: {
                            display: true                           
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "Diastolic"                           
                        },
                        type: 'linear',
                        ticks: {
                            max: 250,
                            min: 60,
                            stepSize: 50
                        }
                    }],
                    xAxes: [{
                        display: true,
                        gridLines: {
                            display: true                            
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "Time"                           
                        },
                        type: 'time',
                        time: {
                            unit: 'hour',
                            displayFormats: {
                                hour: 'h:mm a'
                            },
                            tooltipFormat:'h:mm a'
                        }
                    }]
                }
            }
        },
        {
            id: 'bloodSugar',
            label: 'Blood Sugar',
            chartOptions: {
                tooltips: {
                    mode: 'index',
                    intersect: true,
				},
                responsive: true,
                scales: {
                    yAxes: [{
                        gridLines: {
                            display: true                           
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "Blood Sugar (mg/dL)"
                        },
                        type: 'linear',
                        ticks: {
                            max: 400,
                            min: 50,
                            stepSize: 100
                        }
                    }],
                    xAxes: [{
                        display: true,
                        gridLines: {
                            display: true                            
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "Time"                           
                        },
                        type: 'time',
                        time: {
                            unit: 'hour',
                            displayFormats: {
                                hour: 'h:mm a'
                            },
                            tooltipFormat:'h:mm a'
                        }
                    }]
                }
            }
        }
    ];
}
