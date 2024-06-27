import React, {useEffect, useState} from 'react';
import {AlumniData} from 'payload/response/AlumniData';
import Header from 'components/Header';
import Footer from 'components/Footer';
import {Spin} from 'antd';
import {Form, useActionData} from "react-router-dom";

type SearchCriteria = {
    name: string;
    graduationYear: string;
    currentCompany: string;
    city: string;
};

type ErrorMessage = {
    message: string;
};

function Search(): React.ReactElement {
    const [isLoading, setIsLoading] = useState(false);
    const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
        name: '',
        graduationYear: '',
        currentCompany: '',
        city: ''
    });

    const data = useActionData() as AlumniData[] | ErrorMessage;

    useEffect(() => {
        setIsLoading(false);
    }, [data]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {id, value} = e.target;
        setSearchCriteria((prev) => ({...prev, [id]: value}));
    };

    const handleReset = () => {
        setSearchCriteria({
            name: '',
            graduationYear: '',
            currentCompany: '',
            city: ''
        });
    }

    const handleSearch = async () => {
        setIsLoading(true);
    }

    return (
        <>
            <Header/>
            <main className="container my-4">
                <h2 className="text-center text-custom-primary">Find Alumni</h2>
                <p className="text-center text-custom-secondary">
                    Search for specific alumni based on various criteria
                </p>

                <Form
                    className="text-center border p-4 rounded my-4"
                    action="/search"
                    method="post"
                    onSubmit={handleSearch}
                >
                    <div className="row mb-4">
                        <div className="form-group col-md-3">
                            <label htmlFor="name" className="form-label">Nom</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                placeholder="Entrez un nom"
                                value={searchCriteria.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group col-md-3">
                            <label htmlFor="graduationYear" className="form-label">Année De Diplomation</label>
                            <input
                                type="text"
                                className="form-control"
                                id="graduationYear"
                                name="graduationYear"
                                placeholder="Entrez une année"
                                value={searchCriteria.graduationYear}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group col-md-3">
                            <label htmlFor="currentCompany" className="form-label">Entreprise Actuelle</label>
                            <input
                                type="text"
                                className="form-control"
                                id="currentCompany"
                                name="currentCompany"
                                placeholder="Entrez une entreprise"
                                value={searchCriteria.currentCompany}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group col-md-3">
                            <label htmlFor="city" className="form-label">Ville</label>
                            <input
                                type="text"
                                className="form-control"
                                id="city"
                                name="city"
                                placeholder="Entrez une ville"
                                value={searchCriteria.city}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="row justify-content-center gap-3">
                        <button
                            type="reset"
                            className="btn btn-outline-secondary form-group col-md-2"
                            onClick={handleReset}
                        >
                            Reinitialiser
                        </button>
                        <button
                            type="submit"
                            className="custom-primary-color btn btn-primary btn-custom-primary form-group col-md-2"
                        >
                            Rechercher
                        </button>
                    </div>
                </Form>

                <section className="scrollable-container">
                    {isLoading ? (
                        <div className="d-flex justify-content-center my-4">
                            <Spin size="large"/>
                        </div>
                    ) : (!data || 'message' in data) ? (
                        <p className="text-center text-danger">{data?.message}</p>
                    ) : (
                        data.map((alumni) => (
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
                                            <h5 className="card-title">{alumni.full_name}</h5>
                                            <p className="card-text">{`Graduated in ${alumni.graduation_year}, ${alumni.current_company}, ${alumni.city}`}</p>
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