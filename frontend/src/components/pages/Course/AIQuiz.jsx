import React, { useState } from 'react';
import { FaQuestionCircle, FaCheck, FaTimes, FaUndo } from 'react-icons/fa';

const AIQuiz = ({ quiz, onGenerate, title }) => {
    const [currentStep, setCurrentStep] = useState(0); // 0: start, 1: quiz, 2: result
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);

    if (!quiz || !Array.isArray(quiz)) return (
        <div className="text-center p-5 quiz-empty shadow-sm rounded bg-white">
            <FaQuestionCircle size={60} className="text-navy bg-opacity-10 mb-3" />
            <h3 className="text-navy">{title || 'No quiz available'}</h3>
            <p className="text-muted">Generate a mock test using Gemini AI to practice your knowledge!</p>
            <button className="btn btn-navy px-4 py-2" onClick={onGenerate}>
                Generate Quiz
            </button>
        </div>
    );

    const handleAnswer = (idx) => {
        const isCorrect = idx === quiz[currentQuestion].correctAnswer;
        if (isCorrect) setScore(s => s + 1);

        setUserAnswers([...userAnswers, { question: currentQuestion, answer: idx, correct: isCorrect }]);

        if (currentQuestion < quiz.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            setCurrentStep(2);
        }
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setScore(0);
        setUserAnswers([]);
        setCurrentStep(1);
    };

    return (
        <div className="ai-quiz-container py-4">
            {currentStep === 0 && (
                <div className="quiz-intro text-center p-5 shadow-sm rounded bg-white">
                    <h2 className="text-navy mb-3">{title || 'Mock Test'}</h2>
                    <p className="mb-4">Test your understanding with AI-generated multiple choice questions.</p>
                    <button className="btn btn-navy btn-lg" onClick={() => setCurrentStep(1)}>Start Quiz</button>
                </div>
            )}

            {currentStep === 1 && (
                <div className="quiz-box shadow rounded bg-white p-4">
                    <div className="quiz-header d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                        <span className="text-navy fw-bold">Question {currentQuestion + 1} of {quiz.length}</span>
                        <div className="progress flex-grow-1 mx-4" style={{ height: '8px' }}>
                            <div className="progress-bar bg-warning" style={{ width: `${((currentQuestion + 1) / quiz.length) * 100}%` }}></div>
                        </div>
                    </div>

                    <h4 className="mb-4">{quiz[currentQuestion].question}</h4>

                    <div className="quiz-options d-grid gap-3">
                        {quiz[currentQuestion].options.map((opt, idx) => (
                            <button
                                key={idx}
                                className="btn btn-outline-secondary quiz-opt-btn text-start p-3"
                                onClick={() => handleAnswer(idx)}
                            >
                                <span className="opt-label me-3">{String.fromCharCode(65 + idx)}</span>
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {currentStep === 2 && (
                <div className="quiz-results shadow rounded bg-white p-5 text-center">
                    <div className="result-circle mx-auto mb-4" style={{ width: '150px', height: '150px', border: '10px solid var(--navy)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <h1 className="mb-0 text-navy">{Math.round((score / quiz.length) * 100)}%</h1>
                    </div>
                    <h2 className="text-navy">Quiz Completed!</h2>
                    <p className="text-muted h5 mb-5">You scored {score} out of {quiz.length}</p>

                    <div className="row g-4 mb-5">
                        <div className="col-md-6">
                            <button className="btn btn-navy w-100 p-3 d-flex align-items-center justify-content-center" onClick={resetQuiz}>
                                <FaUndo className="me-2" /> Try Again
                            </button>
                        </div>
                        <div className="col-md-6">
                            <button className="btn btn-outline-navy w-100 p-3" onClick={() => setCurrentStep(0)}>Go Back</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIQuiz;
