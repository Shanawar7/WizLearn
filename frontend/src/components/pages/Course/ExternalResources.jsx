import React, { useState } from 'react';
import { FaPlay, FaBook, FaGlobe } from 'react-icons/fa';

const ExternalResources = ({ resources }) => {
    const [activeTab, setActiveTab] = useState('videos');

    if (!resources) return null;

    return (
        <div className="external-resources mt-4">
            <div className="res-tabs d-flex gap-3 mb-4">
                <button
                    className={`res-tab-btn ${activeTab === 'videos' ? 'active' : ''}`}
                    onClick={() => setActiveTab('videos')}
                >
                    <FaPlay className="me-2" /> Videos
                </button>
                <button
                    className={`res-tab-btn ${activeTab === 'books' ? 'active' : ''}`}
                    onClick={() => setActiveTab('books')}
                >
                    <FaBook className="me-2" /> Books
                </button>
                <button
                    className={`res-tab-btn ${activeTab === 'wiki' ? 'active' : ''}`}
                    onClick={() => setActiveTab('wiki')}
                >
                    <FaGlobe className="me-2" /> Concepts
                </button>
            </div>

            <div className="res-content">
                {activeTab === 'videos' && (
                    <div className="res-grid row">
                        {resources.videos?.map(video => (
                            <div key={video.id} className="col-md-6 mb-3">
                                <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer" className="res-card-link">
                                    <div className="res-card shadow-sm p-3 h-100">
                                        <img src={video.thumbnail} alt={video.title} className="w-100 rounded mb-2" />
                                        <h6 className="text-navy">{video.title}</h6>
                                        <small className="text-muted">{video.description?.substring(0, 100)}...</small>
                                    </div>
                                </a>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'books' && (
                    <div className="res-list">
                        {resources.books?.map(book => (
                            <div key={book.id} className="res-book-card shadow-sm p-3 mb-3 d-flex gap-3 align-items-center">
                                {book.thumbnail && <img src={book.thumbnail} alt={book.title} style={{ width: '60px' }} />}
                                <div>
                                    <h6 className="mb-1">{book.title}</h6>
                                    <small className="d-block text-muted">{book.authors?.join(', ')}</small>
                                    <a href={book.link} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary mt-2">View Book</a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'wiki' && resources.wiki && (
                    <div className="res-wiki-card shadow-sm p-4">
                        <div className="d-flex gap-4 align-items-start">
                            {resources.wiki.thumbnail && <img src={resources.wiki.thumbnail} alt="Concept" className="rounded shadow-sm" style={{ maxWidth: '200px' }} />}
                            <div>
                                <h3>{resources.wiki.title}</h3>
                                <p className="text-secondary">{resources.wiki.extract}</p>
                                <a href={resources.wiki.content_urls} target="_blank" rel="noopener noreferrer" className="btn btn-navy">Read more on Wikipedia</a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExternalResources;
