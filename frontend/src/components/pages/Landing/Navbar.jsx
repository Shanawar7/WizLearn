import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBrain, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark navbar-custom fixed-top">
            <div className="container">
                <Link className="navbar-brand navbar-brand-custom" to="/">
                    <FaBrain style={{ color: '#F0D459', fontSize: '2rem' }} />
                    WizLearn
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle navigation"
                >
                    {isOpen ? <FaTimes /> : <FaBars />}
                </button>
                <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
                    <ul className="navbar-nav ms-auto align-items-center">
                        <li className="nav-item">
                            <a className="nav-link" href="#features" onClick={() => setIsOpen(false)}>Features</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#how-it-works" onClick={() => setIsOpen(false)}>How It Works</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#about" onClick={() => setIsOpen(false)}>About</a>
                        </li>
                        <li className="nav-item d-lg-none">
                            <Link className="nav-link" to="/login" onClick={() => setIsOpen(false)}>Login</Link>
                        </li>
                        <li className="nav-item d-none d-lg-block">
                            <Link to="/login" className="btn btn-outline-custom ms-2">Login</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/signup" className="btn btn-primary-custom ms-lg-2 mt-2 mt-lg-0">Get Started</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
