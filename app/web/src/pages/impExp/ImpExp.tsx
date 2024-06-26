import React, { useState } from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';

const AlumniImportExport: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<string>('CSV2014');

    const handleDownload = () => {
        const fileMap: { [key: string]: string } = {
            CSV2014: 'http://192.168.32.1:8082/FIL2014.csv',
            CSV2015: 'http://192.168.32.1:8082/FIL2015.csv'
        };

        const filePath = fileMap[selectedFile];
        if (filePath) {
            const link = document.createElement('a');
            link.href = filePath;
            const fileName = filePath.split('/').pop();
            if (fileName) {
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } else {
            console.error('Selected file is not available in the file map.');
        }
    };

    return (
        <>
            <Header />
            <div className="container text-center my-5">
                <h1 className="mb-4">Export</h1>
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label htmlFor="fileSelect">Select a file: </label>
                            <select 
                                id="fileSelect" 
                                className="form-control d-inline-block w-auto mx-2"
                                value={selectedFile} 
                                onChange={(e) => setSelectedFile(e.target.value)}                            >
                                <option value="CSV2014">CSV2014</option>
                                <option value="CSV2015">CSV2015</option>
                            </select>
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
