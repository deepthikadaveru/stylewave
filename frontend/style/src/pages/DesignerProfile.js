import React, { useState, useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';

const DesignerProfile = () => {
  const { id } = useParams();
  const [designer, setDesigner] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')); // or your auth check

  useEffect(() => {
    axios.get(`http://localhost:5000/api/designers/${id}`)
      .then(res => {
        setDesigner(res.data);
        const combinedReviews = [
          ...(res.data.reviews || []),
          ...(res.data.ratings || []).map(rating => ({
            user: rating.user,
            rating: rating.rating,
            comment: rating.comment,
            createdAt: rating.createdAt
          }))
        ];
        setReviews(combinedReviews);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id, refreshKey]);

  const handleReviewSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      await axios.post(
        `http://localhost:5000/api/designers/${id}/reviews`,
        { user: 'Guest', rating: newRating, comment: newComment.trim() }
      );
      setNewComment('');
      setNewRating(5);
      setRefreshKey(k => k + 1);
    } catch (err) {
      console.error(err);
      alert('Failed to submit review');
    }
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return; // ignore empty messages
  
    if (user) {
      navigate('/messages');
    } else {
      navigate('/login');
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '—';

  const filteredReviews = reviews.filter(r => r.rating >= ratingFilter);

  if (loading) return <div>Loading…</div>;
  if (!designer) return <div>Designer not found.</div>;

  return (
    <div style={{ display: 'flex', maxWidth: 1400, margin: 'auto', padding: 20 }}>
      {/* Main Profile Section */}
      <div style={{ width: '70%', paddingRight: 20 }}>
        {/* Hero Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 40 }}>
          <div style={{ width: '60%' }}>
            <img
              src={designer.profilePicture.startsWith('/images/')
                ? `http://localhost:5000${designer.profilePicture}`
                : `http://localhost:5000/images/designers/${designer.profilePicture}`}
              alt={designer.name}
              onError={e => {
                e.target.onerror = null;
                e.target.src = 'http://localhost:5000/images/default.jpeg';
              }}
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '10px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                objectFit: 'cover',
                maxWidth: '450px',
              }}
            />
          </div>
          <div style={{
            width: '60%',
            paddingLeft: 20,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            textAlign: 'left',
            fontSize: '1.1rem',
            lineHeight: '1.0',
          }}>
            <h2>{designer.name}</h2>
            <p><strong>Specialties:</strong> {designer.description}</p>
            <p><strong>Average Fare:</strong> ₹{designer.averageFare}</p>
            <p><strong>Rating:</strong> {avgRating} ⭐</p>
            <p><strong>Location:</strong> {designer.city}, {designer.address}</p>
            <p><strong>Working Hours:</strong> {designer.workingHours}</p>
            <div>
              {designer.instagram && <a href={designer.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>}
              {designer.facebook && <a href={designer.facebook} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 10 }}>Facebook</a>}
              {designer.website && <a href={designer.website} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 10 }}>Website</a>}
            </div>
          </div>
        </div>

        {/* Portfolio Section */}
        <section style={{ marginBottom: 40 }}>
          <h3>Portfolio</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 20,
          }}>
            {designer.images?.map((src, i) => (
              <div key={i} style={{
                position: 'relative',
                borderRadius: '15px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                overflow: 'hidden',
                transition: 'transform 0.3s ease',
              }}>
                <img
                  src={src.startsWith('/images/')
                    ? `http://localhost:5000${src}`
                    : `http://localhost:5000/images/designers/${src}`}
                  alt={`portfolio-${i}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '15px',
                    transition: 'transform 0.3s ease',
                  }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                />
                <div style={{
                  position: 'absolute',
                  bottom: 10,
                  left: 10,
                  color: '#fff',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  padding: '5px 10px',
                  borderRadius: 5,
                }}>
                  Portfolio Item {i + 1}
                </div>
              </div>
            ))} 
          </div>
        </section>

        {/* Review Section */}
        <section>
          <h3>Customer Reviews</h3>
          <div>
            <select
              value={ratingFilter}
              onChange={e => setRatingFilter(Number(e.target.value))}
              style={{
                padding: '8px 12px',
                borderRadius: 6,
                fontSize: 16,
              }}
            >
              <option value={0}>All Ratings</option>
              <option value={1}>1⭐</option>
              <option value={2}>2⭐</option>
              <option value={3}>3⭐</option>
              <option value={4}>4⭐</option>
              <option value={5}>5⭐</option>
            </select>
          </div>

          {filteredReviews.map((r, i) => (
            <div key={i} style={{
              background: '#fff',
              padding: 16,
              borderRadius: 10,
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              marginBottom: 20,
            }}>
              <p style={{ fontWeight: 'bold' }}>{r.user} - {r.rating}⭐</p>
              <p>{r.comment}</p>
              <p style={{ fontSize: '0.9em', color: '#666' }}>
                {new Date(r.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </section>

        {/* Review Form Section */}
        <section>
          <h4>Leave a Review</h4>
          <div style={{ marginBottom: 20 }}>
            <select
              value={newRating}
              onChange={e => setNewRating(Number(e.target.value))}
              style={{
                padding: '8px 12px',
                borderRadius: 6,
                fontSize: 16,
                marginBottom: 10,
              }}
            >
              {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n}⭐</option>)}
            </select>
          </div>
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Write your review..."
            style={{
              width: '100%',
              height: 120,
              padding: 12,
              fontSize: 16,
              borderRadius: 8,
              border: '1px solid #ddd',
              resize: 'none',
            }}
          />
          <button
            onClick={handleReviewSubmit}
            style={{
              padding: '10px 20px',
              fontSize: 16,
              backgroundColor: '#007BFF',
              color: '#fff',
              borderRadius: 5,
              marginTop: 10,
              cursor: 'pointer',
            }}
          >
            Submit Review
          </button>
        </section>
      </div>

      {/* Chat Section */}
      <div style={{
        width: '25%',
        position: 'sticky',
        top: 20,
        height: 'calc(100vh - 150px)',
        borderRadius: '10px',
        borderLeft: '1px solid #ddd',
        padding: '20px',
        overflowY: 'auto',
        background: '#f9f9f9',
      }}>
        <h3>Chat with Designer</h3>
        <div style={{ marginBottom: 20, height: 'calc(100% - 150px)', overflowY: 'auto' }}>
          {chatMessages.map((msg, i) => (
            <div key={i} style={{
              backgroundColor: msg.user === 'You' ? '#007BFF' : '#ddd',
              color: msg.user === 'You' ? '#fff' : '#000',
              padding: '10px',
              borderRadius: 10,
              marginBottom: 10,
              maxWidth: '80%',
              marginLeft: msg.user === 'You' ? 'auto' : '0',
              marginRight: msg.user === 'You' ? '0' : 'auto',
            }}>
              <strong>{msg.user}: </strong>{msg.message}
            </div>
          ))}
        </div>
        <textarea
          value={chatInput}
          onChange={e => setChatInput(e.target.value)}
          placeholder="Type your message..."
          style={{
            width: '100%',
            padding: 10,
            fontSize: 16,
            borderRadius: 8,
            border: '1px solid #ddd',
            resize: 'none',
          }}
        />
        <button
          onClick={handleChatSend}
          style={{
            padding: '10px 20px',
            fontSize: 16,
            backgroundColor: '#007BFF',
            color: '#fff',
            borderRadius: 5,
            marginTop: 10,
            cursor: 'pointer',
            width: '100%',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default DesignerProfile;
