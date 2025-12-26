import React, { useState, useEffect } from 'react';
import { FaSearch, FaPaperPlane, FaUserCircle, FaArrowLeft, FaUserPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useChat } from '../../../context/ChatContext';
import { api, useAuth } from '../../../context/AuthContext';

const ChatPage = () => {
    const { user } = useAuth();
    const { messages, activeChat, selectChat, sendMessage, chats, setChats } = useChat();
    const [newMessage, setNewMessage] = useState('');
    const [showManage, setShowManage] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [recommendations, setRecommendations] = useState([]);

    // Fetch friends list and recommendations on mount
    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await api.get('/friends');
                setChats(response.data);
            } catch (error) {
                console.error('Failed to fetch friends', error);
            }
        };
        const fetchRecommendations = async () => {
            try {
                const response = await api.get('/friends/recommendations');
                setRecommendations(response.data);
            } catch (error) {
                console.error('Failed to fetch recommendations', error);
            }
        };
        fetchFriends();
        fetchRecommendations();
    }, [setChats]);

    const sendFriendRequest = async (friendId) => {
        try {
            await api.post('/friends/request', { friendId });
            alert('Friend request sent!');
            setRecommendations(recommendations.filter(r => r.friendId !== friendId));
        } catch (error) {
            alert('Failed to send request');
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const success = await sendMessage(newMessage);
        if (success) {
            setNewMessage('');
        }
    };

    const searchUsers = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;
        try {
            // Assuming we have a user search endpoint, or we can use friends/requests if not
            // For now, let's just search existing friends in the UI or add a friend functionality
            // If this search is for NEW friends:
            const response = await api.post('/friends/request', { friendId: searchTerm }); // This is a hack, usually we search by name/email
            alert('Friend request sent (if user exists)!');
            setSearchTerm('');
        } catch (error) {
            console.error(error);
            alert('Failed to send request');
        }
    }

    const removeFriend = async (friendId) => {
        if (!window.confirm('Are you sure you want to remove this friend?')) return;
        try {
            await api.delete(`/friends/${friendId}`);
            setChats(chats.filter(c => c.id !== friendId));
            if (activeChat?.id === friendId) selectChat(null);
            alert('Friend removed successfully');
        } catch (error) {
            console.error('Failed to remove friend', error);
            alert('Failed to remove friend');
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-sidebar">
                <div className="sidebar-header">
                    <div className="d-flex align-items-center mb-2">
                        <Link to="/dashboard" className="btn btn-sm btn-light me-2"><FaArrowLeft /></Link>
                        <h5 className="mb-0">Chats</h5>
                    </div>
                    <form onSubmit={searchUsers} className="input-group">
                        <span className="input-group-text bg-white"><FaSearch /></span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Friend ID to Add..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary"><FaUserPlus /></button>
                    </form>
                </div>

                <ul className="friend-list">
                    {chats.map(friend => (
                        <li
                            key={friend.id}
                            className={`friend-item ${activeChat && activeChat.id === friend.id ? 'active' : ''}`}
                            onClick={() => selectChat(friend)}
                        >
                            <FaUserCircle className="me-2" size={30} />
                            <div className="friend-info">
                                <div className="friend-name">{friend.name}</div>
                                {/* <small className="friend-last">{friend.email}</small> */}
                            </div>
                            {/* <span className={`status-dot ${friend.online ? 'online' : 'offline'}`}></span> */}
                        </li>
                    ))}
                    {chats.length === 0 && <li className="p-3 text-center text-muted">No friends yet. Add someone!</li>}
                </ul>

                <div className="sidebar-footer">
                    <button
                        className="btn btn-warning w-100 mb-2"
                        onClick={() => setShowManage(!showManage)}
                    >
                        {showManage ? 'Hide' : 'Manage'} Friends
                    </button>

                    {recommendations.length > 0 && !showManage && (
                        <div className="recommendations-panel mt-3">
                            <h6 className="px-3 text-muted small text-uppercase fw-bold">People You May Know</h6>
                            <ul className="friend-list list-unstyled">
                                {recommendations.map(peer => (
                                    <li key={peer.id} className="friend-item py-2 px-3">
                                        <FaUserCircle className="me-2 text-secondary" size={25} />
                                        <div className="friend-info overflow-hidden">
                                            <div className="friend-name small text-truncate">{peer.name}</div>
                                        </div>
                                        <button
                                            className="btn btn-sm btn-outline-warning p-1"
                                            onClick={() => sendFriendRequest(peer.friendId)}
                                            title="Add peer"
                                        >
                                            <FaUserPlus />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {showManage && (
                        <div className="manage-panel mt-2 p-2 shadow-sm border border-warning rounded">
                            <h6 className="text-center mb-2 fw-bold text-dark">My Friends</h6>
                            {chats.map(friend => (
                                <div
                                    key={friend.id}
                                    className="d-flex align-items-center justify-content-between mb-2 p-2 border bg-white rounded"
                                >
                                    <div className="d-flex align-items-center text-truncate pe-2">
                                        <FaUserCircle size={25} className="me-2 flex-shrink-0" />
                                        <span className="text-truncate small fw-medium">{friend.name}</span>
                                    </div>
                                    <button
                                        className="btn btn-sm btn-outline-danger py-0 px-2"
                                        onClick={() => removeFriend(friend.id)}
                                        title="Remove friend"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="chat-main">
                {activeChat ? (
                    <>
                        <div className="chat-header">
                            <FaUserCircle size={32} className="me-2" />
                            <div>
                                <h6 className="mb-0">{activeChat.name}</h6>
                                <small className="text-muted">{activeChat.email}</small>
                            </div>
                        </div>

                        <div className="chat-messages">
                            {messages.map(msg => (
                                <div
                                    key={msg.id}
                                    className={`message ${msg.senderId === user.id || msg.sender?.id === user.id ? 'sent' : 'received'}`}
                                >
                                    {msg.content}
                                </div>
                            ))}
                        </div>

                        <form className="chat-input" onSubmit={handleSendMessage}>
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button type="submit"><FaPaperPlane /></button>
                        </form>
                    </>
                ) : (
                    <div className="no-friend-selected">
                        <h4 className="text-center mt-5">Select a friend to start chatting</h4>
                        <p className="text-center text-muted">Or add a new friend using their ID</p>
                    </div>
                )}
            </div>

            <style>{`
        :root {
          --primary: #1D2A50;
          --secondary: #F0D459;
          --background: #F7FAFC;
          --chat-bg: #E2E8F0;
        }
        
        .chat-container {
          display: flex;
          height: 100vh;
          font-family: 'Inter', sans-serif;
          background-color: var(--background);
        }
        .chat-sidebar {
          width: 320px;
          background: white;
          border-right: 1px solid #E2E8F0;
          display: flex;
          flex-direction: column;
          box-shadow: 2px 0 5px rgba(0,0,0,0.02);
          z-index: 10;
        }
        .sidebar-header {
            padding: 1.5rem;
            background: #1D2A50;
            color: white;
        }
        .sidebar-header h5 {
            color: white;
            font-weight: 600;
        }
        .friend-list {
          flex-grow: 1;
          overflow-y: auto;
          list-style: none;
          padding: 1rem 0;
          margin: 0;
        }
        .friend-item {
          display: flex;
          align-items: center;
          padding: 1rem 1.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border-left: 4px solid transparent;
        }
        .friend-item:hover {
          background: #F7FAFC;
        }
        .friend-item.active {
          background: #F0F4FF;
          border-left-color: #F0D459;
        }
        .friend-item.active .friend-name {
            color: #1D2A50; 
        }
        .friend-info { flex-grow: 1; margin-left: 12px; }
        .friend-name { font-weight: 600; color: #2D3748; }
        .friend-last { font-size: 0.85rem; color: #718096; display: block; margin-top: 2px;}
        .sidebar-footer { padding: 1rem; border-top: 1px solid #E2E8F0; background: #F7FAFC;}
        .chat-main { flex-grow: 1; display: flex; flex-direction: column; background: #EDF2F7; }
        .chat-header { 
            padding: 1rem 2rem; 
            border-bottom: 1px solid #E2E8F0; 
            display: flex; 
            align-items: center; 
            background: white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .chat-messages {
          flex-grow: 1;
          padding: 2rem;
          overflow-y: auto;
          background-image: radial-gradient(#E2E8F0 1px, transparent 1px);
          background-size: 20px 20px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .message {
          max-width: 65%;
          padding: 0.75rem 1.25rem;
          border-radius: 1rem;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
          line-height: 1.5;
          position: relative;
        }
        .message.sent {
          align-self: flex-end;
          background: #1D2A50;
          color: white;
          border-bottom-right-radius: 4px;
        }
        .message.received {
            align-self: flex-start;
          background: white;
          color: #2D3748;
          border-bottom-left-radius: 4px;
        }
        .chat-input {
          display: flex;
          padding: 1.5rem;
          background: white;
          border-top: 1px solid #E2E8F0;
        }
        .chat-input input {
          flex-grow: 1;
          padding: 1rem 1.5rem;
          border-radius: 3rem;
          border: 2px solid #E2E8F0;
          margin-right: 1rem;
          outline: none;
          background: #F7FAFC;
          transition: border-color 0.2s;
        }
        .chat-input input:focus {
            border-color: #F0D459;
            background: white;
        }
        .chat-input button {
          border: none;
          background: #F0D459;
          color: #1D2A50;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 6px rgba(240, 212, 89, 0.3);
        }
        .chat-input button:hover { 
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(240, 212, 89, 0.4);
        }
        .manage-panel {
          background: white;
          border: 1px solid #F0D459;
          border-radius: 0.5rem;
          max-height: 220px;
          overflow-y: auto;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }
        @media(max-width: 768px) {
          .chat-sidebar { width: 80px; }
          .friend-info, .sidebar-header h5, .input-group, .sidebar-footer button { display: none; }
          .sidebar-header { justify-content: center; padding: 1rem;}
          .friend-item { justify-content: center; padding: 1rem; }
        }
      `}</style>
        </div>
    );
};

export default ChatPage;
