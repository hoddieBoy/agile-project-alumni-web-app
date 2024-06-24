import React, {useState} from 'react';
import {AlumniData} from 'payload/response/AlumniData';
import axiosConfig from 'config/axiosConfig';
import {SearchResponse} from 'payload/response/SearchResponse';
import {getAccessToken} from 'utils/Token';
import Header from 'components/Header';
import Footer from 'components/Footer';
import {Spin} from 'antd';

type SearchCriteria = {
    name: string;
    graduationYear: string;
    currentCompany: string;
    city: string;
};

function Search(): React.ReactElement {
    const [alumniData, setAlumniData] = useState<AlumniData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
        name: '',
        graduationYear: '',
        currentCompany: '',
        city: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {id, value} = e.target;
        setSearchCriteria((prev) => ({...prev, [id]: value}));
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const query = Object.entries(searchCriteria)
            .filter(([_, value]) => value)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&');

        try {
            const response = await axiosConfig.get<SearchResponse>(`/search?${query}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAccessToken()}`
                }
            });
            setAlumniData(response.data?.results || []);
        } catch (error) {
            setError('Failed to fetch data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setSearchCriteria({
            name: '',
            graduationYear: '',
            currentCompany: '',
            city: ''
        });
    }

    return (
        <>
            <Header/>
            <main className="container my-4">
                <h2 className="text-center text-custom-primary">Find Alumni</h2>
                <p className="text-center text-custom-secondary">Search for specific alumni based on various
                    criteria</p>

                <form onSubmit={handleSearch} className="text-center border p-4 rounded my-4">
                    <div className="row mb-4">
                        <div className="form-group col-md-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                placeholder="Enter name"
                                value={searchCriteria.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group col-md-3">
                            <label htmlFor="graduationYear" className="form-label">Graduation Year</label>
                            <select
                                name="graduationYear"
                                className="form-control"
                                value={searchCriteria.graduationYear}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Year</option>
                                {Array.from({length: 10}, (_, i) => {
                                    const year = new Date().getFullYear() - i;
                                    return <option key={year} value={year}>{year}</option>;
                                })}
                            </select>
                        </div>
                        <div className="form-group col-md-3">
                            <label htmlFor="currentCompany" className="form-label">Current Company</label>
                            <input
                                type="text"
                                className="form-control"
                                name="currentCompany"
                                placeholder="Enter company name"
                                value={searchCriteria.currentCompany}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group col-md-3">
                            <label htmlFor="city" className="form-label">City</label>
                            <input
                                type="text"
                                className="form-control"
                                name="city"
                                placeholder="Enter city"
                                value={searchCriteria.city}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="row justify-content-center gap-3">
                        <button type="reset" className="btn btn-outline-secondary form-group col-md-2">Reset</button>
                        <button type="submit"
                                className="custom-primary-color btn btn-primary btn-custom-primary form-group col-md-2">Search
                        </button>
                    </div>
                </form>

                <section className="scrollable-container">
                    {isLoading ? (
                        <div className="d-flex justify-content-center my-4">
                            <Spin size="large"/>
                        </div>
                    ) : error ? (
                        <p className="text-danger text-center">{error}</p>
                    ) : alumniData.length === 0 ? (
                        <p className="text-center">No Alumni found based on your search criteria.</p>
                    ) : (
                        alumniData.map((alumni) => (
                            <div className="card mb-3" key={alumni.id}>
                                <div className="card-body d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <img
                                            src="https://static.wikia.nocookie.net/be-like-bro/images/6/6d/Anon-Man-1-.jpg/revision/latest?cb=20170605170350"
                                            alt="Profile"
                                            className="rounded-circle me-3"
                                            style={{height: '100px', width: '100px', objectFit: 'cover'}}
                                        />
                                        <div>
                                            <h5 className="card-title">{alumni.fullName}</h5>
                                            <p className="card-text">{`Graduated in 2024, ${alumni.currentCompany}, ${alumni.city}`}</p>
                                        </div>
                                    </div>
                                    <a href="#" className="btn btn-outline-primary">View Profile</a>
                                </div>
                            </div>
                        ))
                    )}
                </section>
            </main>
            <Footer/>
        </>
    );
}

export default Search;