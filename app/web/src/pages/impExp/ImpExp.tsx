import React, { useState } from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getAccessToken } from 'utils/Token';
import './ImpExp.css'; 

const AlumniImportExport: React.FC = () => {
    const [selectedYear, setSelectedYear] = useState<number>(2014);
    const [fileName, setFileName] = useState<string | null>(null);

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
            const formData = new FormData();
            formData.append('file', file);

            fetch('http://192.168.32.1:8081/api/v1/alumni-fil/upload-csv', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getAccessToken()}`
                },
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    alert('File uploaded successfully!');
                } else {
                    throw new Error('File upload failed.');
                }
            })
            .catch(error => {
                console.error('There was a problem with the file upload:', error);
            });
        }
    };

    return (
        <>
            <Header />
            <div className="container text-center my-5">
                <div className="mb-5">
                    <h1 className="import-export-title" style={{ color: '#003366' }}>Export</h1>
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="yearSelect" style={{ color: '#003366' }}>Select a year: </label>
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
                            <div className="form-group d-flex align-items-center justify-content-center">
                                <input
                                    type="file"
                                    id="fileInput" 
                                    onChange={handleUpload}
                                    className="custom-file-input"
                                    accept=".csv"
                                />
                                <label 
                                    htmlFor="fileInput" 
                                    className="custom-btn ml-2" 
                                    style={{ color: 'white', fontWeight: 'normal' }}
                                >
                                    Importer
                                </label>
                                {fileName && <span className="ml-2">{fileName}</span>}
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
