import React, { useEffect, useRef, useState } from 'react';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import Header from 'components/Header';
import Footer from 'components/Footer';
import axiosConfig from 'config/axiosConfig';
import { getAccessToken } from 'utils/Token';
import './Stat.css'

Chart.register(...registerables);

const AlumniOverview: React.FC = () => {
    const [totalAlumni, setTotalAlumni] = useState<number | null>(null);
    const [totalFemaleAlumni, setTotalFemaleAlumni] = useState<number | null>(null);
    const [totalMaleAlumni, setTotalMaleAlumni] = useState<number | null>(null);
    const [totalAlumniFrance, setTotalAlumniFrance] = useState<number | null>(null);
    const [totalAlumniAngleterre, setTotalAlumniAngleterre] = useState<number | null>(null);
    const [totalAlumniEspagne, setTotalAlumniEspagne] = useState<number | null>(null);
    const [totalAlumniPortugal, setTotalAlumniPortugal] = useState<number | null>(null);
    const [totalAlumniCanada, setTotalAlumniCanada] = useState<number | null>(null);
    const [totalAlumniPaysBas, setTotalAlumniPaysBas] = useState<number | null>(null);
    const [totalAlumniSuisse, setTotalAlumniSuisse] = useState<number | null>(null);
    const [companyAlumniData, setCompanyAlumniData] = useState<{ company: string, count: number }[]>([]);
    const graduationChartRef = useRef<Chart<'bar', number[], string> | null>(null);
    const genderChartRef = useRef<Chart<'pie', number[], string> | null>(null);
    const employmentChartRef = useRef<Chart<'bar', number[], string> | null>(null);

    useEffect(() => {
        const fetchTotalAlumni = async () => {
            try {
                const response = await axiosConfig.get<number>('statistic/total-alumni', {
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${getAccessToken()}`
                    }
                });
                setTotalAlumni(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération du total des alumni:', error);
            }
        };

        const fetchTotalFemaleAlumni = async () => {
            try {
                const response = await axiosConfig.get<number>('statistic/total-female-alumni', {
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${getAccessToken()}`
                    }
                });
                setTotalFemaleAlumni(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération du total des alumni féminins:', error);
            }
        };

        const fetchTotalMaleAlumni = async () => {
            try {
                const response = await axiosConfig.get<number>('statistic/total-homme-alumni', {
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${getAccessToken()}`
                    }
                });
                setTotalMaleAlumni(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération du total des alumni masculins:', error);
            }
        };

        const fetchTotalAlumniFrance = async () => {
            try {
                const response = await axiosConfig.get<number>('statistic/total-alumni-france', {
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${getAccessToken()}`
                    }
                });
                setTotalAlumniFrance(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération du total des alumni en France:', error);
            }
        };
        const fetchTotalAlumniAngleterre = async () => {
            try {
                const response = await axiosConfig.get<number>('statistic/total-alumni-angleterre', {
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${getAccessToken()}`
                    }
                });
                setTotalAlumniAngleterre(response.data);
            } catch (error) {
                console.error('Error fetching total alumni in Angleterre:', error);
            }
        };

        const fetchTotalAlumniEspagne = async () => {
            try {
                const response = await axiosConfig.get<number>('statistic/total-alumni-espagne', {
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${getAccessToken()}`
                    }
                });
                setTotalAlumniEspagne(response.data);
            } catch (error) {
                console.error('Error fetching total alumni in Espagne:', error);
            }
        };

        const fetchTotalAlumniPortugal = async () => {
            try {
                const response = await axiosConfig.get<number>('statistic/total-alumni-portugal', {
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${getAccessToken()}`
                    }
                });
                setTotalAlumniPortugal(response.data);
            } catch (error) {
                console.error('Error fetching total alumni in Portugal:', error);
            }
        };

        const fetchTotalAlumniCanada = async () => {
            try {
                const response = await axiosConfig.get<number>('statistic/total-alumni-canada', {
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${getAccessToken()}`
                    }
                });
                setTotalAlumniCanada(response.data);
            } catch (error) {
                console.error('Error fetching total alumni in Portugal:', error);
            }
        };

        const fetchTotalAlumniPaysBas = async () => {
            try {
                const response = await axiosConfig.get<number>('statistic/total-alumni-paysbas', {
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${getAccessToken()}`
                    }
                });
                setTotalAlumniPaysBas(response.data);
            } catch (error) {
                console.error('Error fetching total alumni in Portugal:', error);
            }
        };

        const fetchTotalAlumniSuisse = async () => {
            try {
                const response = await axiosConfig.get<number>('statistic/total-alumni-suisse', {
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${getAccessToken()}`
                    }
                });
                setTotalAlumniSuisse(response.data);
            } catch (error) {
                console.error('Error fetching total alumni in Suisse:', error);
            }
        };

        const fetchCompaniesByAlumniCount = async () => {
            try {
                const response = await axiosConfig.get<[string, number][]>('statistic/companies-by-alumni-count', {
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${getAccessToken()}`
                    }
                });
                const data = response.data.map(item => ({
                    company: item[0],
                    count: item[1]
                }));
                console.log('Companies by Alumni Count:', data);
                setCompanyAlumniData(data);
            } catch (error) {
                console.error('Erreur lors de la récupération des données des entreprises par nombre d\'alumni:', error);
            }
        };

        fetchTotalAlumni();
        fetchTotalFemaleAlumni();
        fetchTotalMaleAlumni();
        fetchTotalAlumniFrance();
        fetchTotalAlumniAngleterre();
        fetchTotalAlumniEspagne();
        fetchTotalAlumniPortugal();
        fetchCompaniesByAlumniCount();
        fetchTotalAlumniSuisse();
        fetchTotalAlumniCanada();
        fetchTotalAlumniPaysBas();

        const graduationCtx = document.getElementById('graduationChart') as HTMLCanvasElement;
        const genderCtx = document.getElementById('genderChart') as HTMLCanvasElement;
        const employmentCtx = document.getElementById('employmentChart') as HTMLCanvasElement;

        if (graduationChartRef.current) {
            graduationChartRef.current.destroy();
        }
        graduationChartRef.current = new Chart(graduationCtx, {
            type: 'bar',
            data: {
                labels: companyAlumniData.map(item => item.company),
                datasets: [{
                    label: 'Nombre d\'Alumni',
                    data: companyAlumniData.map(item => item.count),
                    backgroundColor: 'rgba(0, 30, 66, 1)',
                    borderColor: 'rgba(0, 30, 66, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            callback: function(value) {
                                if (Number.isInteger(value)) {
                                    return value;
                                }
                                return null;
                            }
                        }
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
                labels: [`Hommes en %`, `Femmes en %`],
                datasets: [{
                    data: [totalMaleAlumni || 0, totalFemaleAlumni || 0],
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
        return () => {
            if (graduationChartRef.current) {
                graduationChartRef.current.destroy();
            }
            if (genderChartRef.current) {
                genderChartRef.current.destroy();
            }
        };
    }, [totalFemaleAlumni, totalMaleAlumni]);

    return (
        <>
            <Header />
            <div className="container mt-5">
                <div className="text-center">
                    <h1>Vue d'Ensemble des Alumnis</h1>
                    <p>Représentations visuelles et résumés pour analyser les tendances et les distributions.</p>
                    <h2>Indicateurs Clés</h2>
                </div>

                <div className="row text-center mt-4">
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Total Alumnis</h5>
                                <strong><p className="card-text">{totalAlumni !== null ? totalAlumni : 'Chargement...'}</p></strong>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Répartition Internationale Actuelle</h5>
                                <p className="card-text">
                                    <strong> Angleterre
                                        : {totalAlumniAngleterre !== null ? totalAlumniAngleterre : 'Chargement...'}</strong>
                                    <strong> Espagne
                                        : {totalAlumniEspagne !== null ? totalAlumniEspagne : 'Chargement...'}</strong><br></br>
                                    <strong> Portugal : {totalAlumniPortugal !== null ? totalAlumniPortugal : 'Chargement...'}</strong>
                                    <strong> Suisse
                                        : {totalAlumniSuisse !== null ? totalAlumniSuisse : 'Chargement...'}</strong><br></br>
                                        <strong> Canada
                                        : {totalAlumniCanada !== null ? totalAlumniCanada : 'Chargement...'}</strong>
                                        <strong> Pays-Bas
                                        : {totalAlumniPaysBas !== null ? totalAlumniPaysBas : 'Chargement...'}</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Total Alumnis en France</h5>
                                <strong><p className="card-text">{totalAlumniFrance !== null ? totalAlumniFrance : 'Chargement...'}</p></strong>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-5">
                    <h2>Visualisation des Données des Alumnis</h2>
                </div>

                <div className="row mt-4">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Ratio Hommes/Femmes</h5>
                                <div className="chart-container">
                                    <canvas id="genderChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Répartition des Entreprises avec le Plus d'Alumnis</h5>
                                <div className="chart-container full-width-chart">
                                    <canvas id="graduationChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="spacer mt-5"></div>
            </div>
            <Footer />
        </>
    );
};

export default AlumniOverview;