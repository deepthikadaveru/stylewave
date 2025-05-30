import React, { useEffect, useState, useRef } from 'react';
import { nanoid } from 'nanoid';
import { io } from 'socket.io-client';
import axios from 'axios';

export default function Messages() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectUser, setSelectUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const socketRef = useRef(null);
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [recentChats, setRecentChats] = useState(() => {
    // load an array of user IDs from localStorage, or empty
    return JSON.parse(localStorage.getItem('recentChats') || '[]');
  });
  const [isTyping, setIsTyping] = useState(false);
const [typingUsers, setTypingUsers] = useState([]); // users typing in this chat
const [chatPage, setChatPage] = useState(0);
const PAGE_LIMIT = 20;

  

  // Load current user on mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/auth/me', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => setCurrentUser({
        ...res.data,
        id: res.data.id || res.data._id // normalize to 'id'
      }))
      .catch(console.error);
  }, []);

  // Fetch all user profiles on mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/all-users')
      .then(res => setUsers(res.data || []))
      .catch(console.error);
  }, []);

  const token = localStorage.getItem('token'); 


  // Initialize socket connection once currentUser is loaded
  useEffect(() => {
    if (!currentUser?.id) return;

    const socket = io('http://localhost:5000', {
      auth: { token },
      query: { userId: currentUser.id }
    });
    socketRef.current = socket;
  
    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      setSocketConnected(true);
      if (Array.isArray(recentChats)) {
        recentChats.forEach((chatPartnerId) => {
          if (chatPartnerId !== currentUser.id) {
            socket.emit('joinChat', { to: chatPartnerId });
          }
        });
      }
     
      
  });
  
    socket.on('disconnect', reason => {
      console.log('⛔ Socket disconnected:', reason);
      setSocketConnected(false);
    });
    socket.on('connect_error', err => {
      console.error('🔥 Socket connect_error:', err.message);
      alert(`Socket failed to connect: ${err.message}`);
    });
  
    socketRef.current.on('chatHistory', history => {
      console.log("📜 Chat History received:", history);
      setMessages(history); // now set messages only when data is received
    });
    
    socketRef.current.on('receiveMessage', msg => {
        // 1) guard against malformed payloads
        if (!msg || !msg.sender) return;
      
        // 2) merge into messages array
        setMessages(prev => {
          if (msg.tempId) {
           const idx = prev.findIndex(m => m.tempId === msg.tempId);
            if (idx !== -1) {
              const updated = [...prev];
              updated[idx] = { ...updated[idx], ...msg };
              return updated;
            }
        }
          if (prev.some(m => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      
        // 3) bump recentChats
        const senderId = msg.sender._id ?? msg.sender;       // populated object or raw ID
       if (!senderId) return;
        const otherId = senderId === currentUser.id ? msg.to : senderId;
        setRecentChats(prev => {
          const filtered = prev.filter(id => id !== otherId);
          const next = [otherId, ...filtered];
          localStorage.setItem('recentChats', JSON.stringify(next));
          return next;
        });
      });

    return () => {
      socketRef.current.disconnect();
      socketRef.current = null;
    };
  }, [currentUser,recentChats]);

  // Auto-focus input when chat opens
  useEffect(() => {
    if (socketRef.current && socketConnected && selectUser?._id) {
      socketRef.current.emit('joinChat', { to: selectUser._id });
    }
  }, [selectUser, socketConnected]);
  
  // Mark messages as read when user selects chat or when messages change (and chat is open)
useEffect(() => {
  if (!socketConnected || !selectUser || messages.length === 0) return;

  const unreadMsgIds = messages
    .filter(m => m.to === currentUser.id && !m.read)
    .map(m => m._id);

  if (unreadMsgIds.length > 0) {
    socketRef.current.emit('messageRead', {
      from: selectUser._id,
      to: currentUser.id,
      messageIds: unreadMsgIds,
    });
  }
}, [messages, selectUser, socketConnected, currentUser]);

// Listen for messageRead updates from server
useEffect(() => {
  if (!socketRef.current) return;

  const handleMessageRead = ({ messageIds, readerId }) => {
    setMessages(prev =>
      prev.map(m =>
        messageIds.includes(m._id)
          ? { ...m, read: true }
          : m
      )
    );
  };

  socketRef.current.on('messageRead', handleMessageRead);

  return () => {
    socketRef.current.off('messageRead', handleMessageRead);
  };
}, []);

// Emit typing and stopTyping events on input change and debounce
useEffect(() => {
  if (!socketConnected || !selectUser) return;

  if (input.trim() !== '') {
    socketRef.current.emit('typing', { to: selectUser._id });
    setIsTyping(true);

    const timeout = setTimeout(() => {
      socketRef.current.emit('stopTyping', { to: selectUser._id });
      setIsTyping(false);
    }, 1000);

    return () => clearTimeout(timeout);
  } else {
    socketRef.current.emit('stopTyping', { to: selectUser._id });
    setIsTyping(false);
  }
}, [input, selectUser, socketConnected]);

useEffect(() => {
  if (!socketRef.current) return;

  const onTyping = ({ from }) => {
    setTypingUsers(prev => [...new Set([...prev, from])]);
  };

  const onStopTyping = ({ from }) => {
    setTypingUsers(prev => prev.filter(id => id !== from));
  };

  socketRef.current.on('typing', onTyping);
  socketRef.current.on('stopTyping', onStopTyping);

  return () => {
    socketRef.current.off('typing', onTyping);
    socketRef.current.off('stopTyping', onStopTyping);
  };
}, []);



  // Scroll to bottom on new message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
 
  // Select a user to chat
  const handleSelectUser = (user) => {
    if (!socketConnected) return alert('Socket not connected yet!');
    
    setSelectUser(user);
    setMessages([]); // Clear current chat
    setChatPage(0);

    const room = [currentUser.id, user._id].sort().join('_'); // ✅ Consistent roomId
  
    // ✅ Join room for live updates
    socketRef.current.emit('joinChat', { room });
  
    // ✅ Fetch chat history for this room
    socketRef.current.emit('getChatHistory', { room });
    // Mark user as recently chatted
    setRecentChats(prev => {
      const filtered = prev.filter(id => id !== user._id);
      const next = [user._id, ...filtered];
      localStorage.setItem('recentChats', JSON.stringify(next));
      return next;
    });
  };
  
  

  // Send a message
  const sendMessage = () => {
    if (!socketRef.current || !socketConnected) {
      alert("Socket not connected");
      return;
    }    
    if (!input.trim() || !selectUser) return;
    const tempId = nanoid();
    const msg = {
      sender: { _id: currentUser.id }, // matches populated format
      to: selectUser._id,
      text: input,
      timestamp: new Date().toISOString(),
      tempId
    };
    
   // setMessages(prev => [...prev, msg]);
    socketRef.current.emit('sendMessage', msg);
    setInput('');
    console.log('Sending to:', selectUser._id);
    console.log('From:', currentUser.id);
// Clear input field  
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: '300px', borderRight: '1px solid #ccc', padding: '1rem', overflowY: 'auto' }}>
        <h2>Profiles</h2>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search users..."
          style={{ width: '90%', padding: '8px', marginBottom: '1rem', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        {users.filter(u => u.name.toLowerCase().includes(search.toLowerCase())).map(u => {
  const isOnline = u.isOnline;
  const lastSeen = u.lastSeen ? new Date(u.lastSeen).toLocaleString() : null;
  const getProfileImageSrc = (profilePicture) => {
    if (!profilePicture) {
      return 'http://localhost:5000/images/default.jpg';
    }
  
    if (profilePicture.startsWith('/')) {
      return `http://localhost:5000${profilePicture}`;
    }
  
    return `http://localhost:5000/images/tailors/${profilePicture}`; // primary guess
  };
  
         
  return (
    <div
      key={u._id}
      onClick={() => handleSelectUser(u)}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px',
        marginBottom: '6px',
        cursor: 'pointer',
        background: selectUser?._id === u._id ? '#eef' : '#f9f9f9',
        border: '1px solid #ddd',
        borderRadius: '4px'
      }}
    >
      <img
       src={getProfileImageSrc(u.profilePicture)}
      
        alt={u.name}
        onError={(e) => {
          // If fails in /tailors/, try designers → resellers → default
          const fileName = u.profilePicture;
          const fallbacks = [
            `http://localhost:5000/images/designers/${fileName}`,
            `http://localhost:5000/images/resellers/${fileName}`,
            `http://localhost:5000/images/default.jpg`,
          ];
      
          // Move to next fallback path
          let currentIndex = 0;
          e.target.onerror = () => {
            currentIndex++;
            if (currentIndex < fallbacks.length) {
              e.target.src = fallbacks[currentIndex];
            }
          };
      
          // Trigger first fallback
          e.target.src = fallbacks[currentIndex];
        }}
        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', marginRight: '10px', border: '1px solid #ccc' }}
      />
      <div style={{ flex: 1 }}>
        <strong>{u.name}</strong><br />
        <small style={{ color: isOnline ? 'green' : '#555' }}>
          {isOnline ? 'Online' : `Last seen: ${lastSeen || 'N/A'}`}
        </small>
      </div>
    </div>
  );
})}

      </div>

      {/* Chat Window */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
          <h3>{selectUser ? `Chat with ${selectUser.name}` : 'Select a user to chat'}</h3>
        </div>

        <div style={{ minHeight: '20px', fontStyle: 'italic', color: '#888', marginTop: '5px' }}>
    {typingUsers.includes(selectUser?._id) && `${selectUser?.name} is typing...`}
  </div>

        {/* Messages */}
        <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', background: '#fafafa' }}>
          {messages.map(m => {
            const key = m._id || m.tempId;
           
            const senderId = typeof m.sender === 'string' ? m.sender : m.sender?._id;
            const isMine = senderId === currentUser?.id;
            
             // ❗️✅ ADD THIS FILTER:
  const receiverId = typeof m.to === 'string' ? m.to : m.to?._id;
  const chattingWith = selectUser?._id;

  // 🔒 Only show messages between currentUser and selected user
  if (
    senderId !== currentUser?.id && senderId !== chattingWith &&
    receiverId !== currentUser?.id && receiverId !== chattingWith
  ) {
    return null;
  }


            return (
              <div key={key} style={{ textAlign: isMine ? 'right' : 'left', margin: '8px 0' }}>
                {!isMine && <div style={{ fontSize: '0.8rem', color: '#888' }}>{m.sender?.name || ''}</div>}
                <span style={{
                  display: 'inline-block',
                  padding: '10px 14px',
                  borderRadius: '18px',
                  background: isMine ? '#a0e0a9' : '#e0e0e0',
                  maxWidth: '70%',
                  fontSize: '1rem',
                  whiteSpace: 'pre-wrap'
                }}>
                  {m.text}
                </span>
              </div>
            );
            
          })}
          <div ref={endRef} />
        </div>

        {/* Input */}
        {selectUser && (
          <div style={{ display: 'flex', borderTop: '1px solid #ccc' }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message…"
              style={{ flex: 1, padding: '0.8rem', fontSize: '1rem', border: 'none' }}
            />
            <button
              onClick={sendMessage}
              style={{
                padding: '0 1.2rem',
                border: 'none',
                background: '#007bff',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
