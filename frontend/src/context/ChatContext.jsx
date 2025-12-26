import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, useAuth } from './AuthContext';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [activeChat, setActiveChat] = useState(null); // The user object we are chatting with
    const [chats, setChats] = useState([]); // List of recent chats/friends
    const [loading, setLoading] = useState(false);

    // Fetch details of the person we are chatting with
    const selectChat = (friend) => {
        setActiveChat(friend);
        fetchHistory(friend.id);
    };

    const fetchHistory = useCallback(async (friendId) => {
        if (!friendId) return;
        try {
            const response = await api.get(`/chat/history/${friendId}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Failed to fetch chat history', error);
        }
    }, []);

    const sendMessage = async (content) => {
        if (!activeChat || !content.trim()) return;
        try {
            // Optimistic update
            const tempMessage = {
                id: Date.now(),
                content,
                sender: user,
                receiver: activeChat,
                createdAt: new Date().toISOString(),
                temp: true
            };
            setMessages(prev => [...prev, tempMessage]);

            const response = await api.post('/chat/send', {
                receiverId: activeChat.id,
                content
            });

            // Replace temp message with real one
            setMessages(prev => prev.map(msg => msg.id === tempMessage.id ? response.data : msg));
            return true;
        } catch (error) {
            console.error('Failed to send message', error);
            return false;
        }
    };

    // Polling for new messages
    useEffect(() => {
        if (!activeChat) return;

        const interval = setInterval(() => {
            fetchHistory(activeChat.id);
        }, 3000); // Poll every 3 seconds

        return () => clearInterval(interval);
    }, [activeChat, fetchHistory]);

    return (
        <ChatContext.Provider value={{ messages, activeChat, selectChat, sendMessage, chats, setChats }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);
