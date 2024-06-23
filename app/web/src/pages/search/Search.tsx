import React, {useState} from 'react';
import 'pages/search/Search.css';
import {AlumniData} from "payload/response/AlumniData";
import axiosConfig from "config/axiosConfig";
import {SearchResponse} from "payload/response/SearchResponse";
import {getAccessToken} from "utils/Token";
import Header from "components/Header";
import Footer from "components/Footer";

type SearchCriteria = {
    name: string;
    graduationYear: string;
    currentCompany: string;
    city: string;
};

function Search() {
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
        setSearchCriteria(prev => ({...prev, [id]: value}));
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

    return (
        <>
            <Header/>

            <main>
                <h2 className="title">Find Alumni</h2>
                <p className="under-title">Search for specific alumni based on various criteria</p>

                <section className="search-section">
                    <form onSubmit={handleSearch}>
                        <div className="form-row">
                            <div className="form-group col-md-3">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    placeholder="Enter name"
                                    value={searchCriteria.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group col-md-3">
                                <label htmlFor="graduationYear">Graduation Year</label>
                                <select
                                    id="graduationYear"
                                    className="form-control"
                                    value={searchCriteria.graduationYear}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Year</option>
                                    {Array.from({length: 7}, (_, i) => {
                                        const year = 2023 - i;
                                        return <option key={year} value={year}>{year}</option>;
                                    })}
                                </select>
                            </div>
                            <div className="form-group col-md-3">
                                <label htmlFor="currentCompany">Current Company</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="currentCompany"
                                    placeholder="Enter company name"
                                    value={searchCriteria.currentCompany}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group col-md-3">
                                <label htmlFor="city">City</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="city"
                                    placeholder="Enter city"
                                    value={searchCriteria.city}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="form-row justify-content-center">
                            <button type="reset" className="btn btn-custom btn-outline-secondary">Reset</button>
                            <button type="submit" className="btn btn-custom btn-primary">Search</button>
                        </div>
                    </form>
                </section>

                {isLoading && <p>Loading...</p>}
                {error && <p>{error}</p>}
                {!isLoading && !error && alumniData.length === 0 && <p>No alumni found</p>}

                <section className="profile-cards">
                    {alumniData.map(alumni => (
                        <div className="profile-card" key={alumni.id}>
                            <div className="profile-info">
                                <img
                                    src="https://static.wikia.nocookie.net/be-like-bro/images/6/6d/Anon-Man-1-.jpg/revision/latest?cb=20170605170350"
                                    alt="Profile Picture"/>
                                <div>
                                    <h5>{alumni.fullName}</h5>
                                    <p>{`Diplômé en 2024, ${alumni.currentCompany}, ${alumni.city}`}</p>
                                </div>
                            </div>
                            <div className="profile-actions">
                                <a href="#" className="btn btn-outline-primary">View Profile</a>
                            </div>
                        </div>
                    ))}
                </section>
            </main>

            <Footer/>
        </>
    );
}

export default Search;
