import React from 'react';
import { FaBrain } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer id="about" className="footer">
            <div className="container">
                <div className="row g-4">
                    <div className="col-md-6 col-lg-3">
                        <div className="footer-brand">
                            <FaBrain style={{ color: '#F0D459', fontSize: '2rem' }} />
                            WizLearn
                        </div>
                        <p className="footer-description">
                            AI-powered learning platform designed to help students excel in their studies.
                        </p>
                    </div>

                    <div className="col-md-6 col-lg-3">
                        <h4 className="footer-title">Product</h4>
                        <ul className="footer-links">
                            <li><a href="#features">Features</a></li>
                            <li><a href="#">Pricing</a></li>
                            <li><a href="#">FAQ</a></li>
                        </ul>
                    </div>

                    <div className="col-md-6 col-lg-3">
                        <h4 className="footer-title">Company</h4>
                        <ul className="footer-links">
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Contact</a></li>
                            <li><a href="#">Blog</a></li>
                        </ul>
                    </div>

                    <div className="col-md-6 col-lg-3">
                        <h4 className="footer-title">Legal</h4>
                        <ul className="footer-links">
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2024 WizLearn. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
