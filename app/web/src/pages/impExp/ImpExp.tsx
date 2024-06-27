import React, {useState} from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';
import {getAccessToken} from 'utils/Token';

const AlumniImportExport: React.FC = () => {
    const [selectedYear, setSelectedYear] = useState<number>(2014);

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

    return (
        <>
            <Header />
            <div className="container text-center my-5">
                <h1 className="mb-4">Export</h1>
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label htmlFor="yearSelect">Select a year: </label>
                            <input 
                                type="number" 
                                id="yearSelect" 
                                className="form-control d-inline-block w-auto mx-2" 
                                value={selectedYear} 
                                onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))} 
                            />
                            <button 
                                onClick={handleDownload} 
                                className="btn btn-primary"
                            >
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AlumniImportExport;
