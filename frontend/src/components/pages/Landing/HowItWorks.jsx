import React from 'react';

const HowItWorks = () => {
    const steps = [
        {
            number: "01",
            title: "Create Your Account",
            description: "Sign up for free and access your personalized learning dashboard in seconds."
        },
        {
            number: "02",
            title: "Add Your Courses",
            description: "Click the + button to create courses and upload your study materials, notes, and resources."
        },
        {
            number: "03",
            title: "Let AI Assist You",
            description: "Generate quizzes, create study roadmaps, and get instant help understanding complex topics."
        },
        {
            number: "04",
            title: "Collaborate & Excel",
            description: "Share courses with friends, chat, and achieve your academic goals together."
        }
    ];

    return (
        <section id="how-it-works" className="how-it-works-section">
            <div className="container">
                <h2 className="section-title">How WizLearn Works</h2>
                <p className="section-subtitle">
                    Get started in four simple steps and revolutionize your learning experience
                </p>

                <div className="row g-4">
                    {steps.map((step, index) => (
                        <div key={index} className="col-md-6 col-lg-3">
                            <div>
                                <div className="step-number">{step.number}</div>
                                <h3 className="step-title">{step.title}</h3>
                                <p className="step-description">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
