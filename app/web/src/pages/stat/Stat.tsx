import React, { useEffect, useRef } from 'react';
import { Chart, registerables, ChartConfiguration } from 'chart.js';
import Header from 'components/Header';

Chart.register(...registerables);

const AlumniOverview: React.FC = () => {
    const graduationChartRef = useRef<Chart<'bar', number[], string> | null>(null);
    const genderChartRef = useRef<Chart<'pie', number[], string> | null>(null);
    const employmentChartRef = useRef<Chart<'bar', number[], string> | null>(null);

    useEffect(() => {
        const graduationCtx = document.getElementById('graduationChart') as HTMLCanvasElement;
        const genderCtx = document.getElementById('genderChart') as HTMLCanvasElement;
        const employmentCtx = document.getElementById('employmentChart') as HTMLCanvasElement;

        if (graduationChartRef.current) {
            graduationChartRef.current.destroy();
        }
        graduationChartRef.current = new Chart(graduationCtx, {
            type: 'bar',
            data: {
                labels: ['2016', '2017', '2018', '2019', '2020', '2021'],
                datasets: [{
                    label: 'Number of Alumni',
                    data: [50, 75, 100, 80, 60, 85],
                    backgroundColor: 'rgba(0, 30, 66, 1)',
                    borderColor: 'rgba(0, 30, 66, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        } as ChartConfiguration<'bar', number[], string>);

        if (genderChartRef.current) {
            genderChartRef.current.destroy();
        }
        genderChartRef.current = new Chart(genderCtx, {
            type: 'pie',
            data: {
                labels: ['Males', 'Females'],
                datasets: [{
                    data: [55, 45],
                    backgroundColor: ['rgba(0, 30, 66, 1)', 'rgba(128, 128, 128, 0.5)'],
                    borderColor: ['rgba(0, 30, 66, 1)', 'rgba(128, 128, 128, 1)'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        } as ChartConfiguration<'pie', number[], string>);

        if (employmentChartRef.current) {
            employmentChartRef.current.destroy();
        }
        employmentChartRef.current = new Chart(employmentCtx, {
            type: 'bar',
            data: {
                labels: ['Tech', 'Finance', 'Healthcare', 'Education', 'Other'],
                datasets: [{
                    label: 'Number of Alumni',
                    data: [120, 80, 60, 90, 50],
                    backgroundColor: 'rgba(0, 30, 66, 1)',
                    borderColor: 'rgba(0, 30, 66, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        } as ChartConfiguration<'bar', number[], string>);

        return () => {
            if (graduationChartRef.current) {
                graduationChartRef.current.destroy();
            }
            if (genderChartRef.current) {
                genderChartRef.current.destroy();
            }
            if (employmentChartRef.current) {
                employmentChartRef.current.destroy();
            }
        };
    }, []);

    return (
        <div>
            <Header/>
            <div className="container mt-5">
                <div className="text-center">
                    <h1>Alumni Data Overview</h1>
                    <p>Visual representations and summaries to analyze trends and distributions</p>
                    <h2>Key Metrics</h2>
                </div>

                <div className="row text-center mt-4">
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Total Alumni</h5>
                                <p className="card-text">500</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Geographical Distribution</h5>
                                <p className="card-text">USA - 250, Europe - 150, Asia - 100</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Gender Ratio</h5>
                                <p className="card-text">Males: 55%, Females: 45%</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-5">
                    <h2>Alumni Data Visualization</h2>
                </div>

                <div className="row mt-4">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Graduation Year Distribution</h5>
                                <div className="chart-container">
                                    <canvas id="graduationChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Gender Ratio</h5>
                                <div className="chart-container">
                                    <canvas id="genderChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-4 justify-content-center">
                    <div className="col-md-10 wide-card">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Employment Distribution</h5>
                                <div className="chart-container full-width-chart">
                                    <canvas id="employmentChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="text-center mt-5">
                <p>Copyright © 2022 FIL Program. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default AlumniOverview;
