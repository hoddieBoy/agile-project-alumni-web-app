import React, {useState} from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';
import {getAccessToken} from 'utils/Token';
import './ImpExp.css';

const AlumniImportExport: React.FC = () => {
    const [selectedYear, setSelectedYear] = useState<number>(2014);
    const [fileName, setFileName] = useState<string | null>(null);
    const [sqlQuery, setSqlQuery] = useState<string | null>(null);

    const handleDownload = () => {
        fetch(`http://192.168.32.1:8081/api/v1/alumni-fil/generate-csv?year=${selectedYear}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAccessToken()}`
            },
        })
            .then(response => {
                if (response.ok) {
                    return response.blob();
                } else {
                    throw new Error('Network response was not ok.');
                }
            })
            .then(blob => {
                const link = document.createElement('a');
                const url = window.URL.createObjectURL(blob);
                link.href = url;
                link.setAttribute('download', `alumni_${selectedYear}.csv`);
                document.body.appendChild(link);
                link.click();
                link.parentNode?.removeChild(link);
                window.URL.revokeObjectURL(url);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    };

    const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                setSqlQuery(content);
            };
            reader.readAsText(file);
        }
    };

    const handleExecuteQuery = () => {
        if (sqlQuery) {
            const encodedQuery = encodeURIComponent(sqlQuery);
            const url = `http://localhost:8080/?pgsql=postgres&username=admin&sql=${encodedQuery}`;

            console.log('Executing query with URL:', url);

            fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getAccessToken()}`
                }
            })
                .then(response => {
                    console.log('Fetch response:', response);
                    if (response.ok) {
                        alert('Query executed successfully!');
                    } else {
                        throw new Error('Query execution failed.');
                    }
                })
                .catch(error => {
                    console.error('There was a problem with the query execution:', error);
                });

            const executeButton = document.querySelector('input[type="submit"][value="Exécuter"]') as HTMLInputElement;
            console.log('Execute button:', executeButton);
            if (executeButton) {
                executeButton.click();
                console.log('Clicked execute button');
            } else {
                console.error('Execute button not found');
            }
        } else {
            alert('No SQL query to execute.');
        }
    };

    return (
        <>
            <Header />
            <div className="alumni-import-export container text-center my-5">
                <div className="mb-5">
                    <h1 className="import-export-title" style={{ color: '#003366' }}>Export</h1>
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="yearSelect" style={{ color: '#003366' }}>Promotion de l'année: </label>
                                <input
                                    type="number"
                                    id="yearSelect"
                                    className="form-control d-inline-block w-auto mx-2"
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                                />
                                <button
                                    onClick={handleDownload}
                                    className="custom-btn mr-2"
                                >
                                    Exporter
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h1 className="import-export-title" style={{ color: '#003366' }}>Import</h1>
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="form-group">
                                <div className="form-group-row">
                                    <input
                                        type="file"
                                        id="fileInput"
                                        onChange={handleUpload}
                                        className="custom-file-input"
                                        accept=".sql"
                                    />
                                </div>
                                <label htmlFor="fileInput" style={{ color: '#003366' }}>Importer un fichier:</label>
                                <label
                                    htmlFor="fileInput"
                                    className="custom-file-label"
                                >
                                    Importer
                                </label>
                                {fileName && <div className="file-name">{fileName}</div>}
                                <button
                                    onClick={handleExecuteQuery}
                                    className="custom-btn custom-btn-validate mt-3"
                                >
                                    Valider
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AlumniImportExport;