import React, { useState, useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResellerProfile = () => {
  const { id } = useParams();
  const [reseller, setReseller] = useState(null);
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
    axios.get(`http://localhost:5000/api/resellers/${id}`)
      .then(res => {
        setReseller(res.data);
        const combined = [
          ...(res.data.reviews || []),
          ...(res.data.ratings || []).map(r => ({
            user: r.user,
            rating: r.rating,
            comment: r.comment,
            createdAt: r.createdAt
          }))
        ];
        setReviews(combined);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id, refreshKey]);

  const handleReviewSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      await axios.post(
        `http://localhost:5000/api/resellers/${id}/reviews`,
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

  if (loading) return <div>Loading…</div>;
  if (!reseller) return <div>Reseller not found.</div>;

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '—';

  const filtered = reviews.filter(r => r.rating >= ratingFilter);

  return (
    <div style={{ display: 'flex', maxWidth: 1400, margin: 'auto', padding: 20 }}>
      {/* Main Profile Section */}
      <div style={{ width: '70%', paddingRight: 20 }}>
        {/* Hero Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 40 }}>
          <div style={{ width: '60%' }}>
            <img
              src={reseller.profilePicture.startsWith('/images/')
                ? `http://localhost:5000${reseller.profilePicture}`
                : `http://localhost:5000/images/resellers/${reseller.profilePicture}`}
              alt={reseller.name}
              onError={e => { e.target.onerror = null; e.target.src = 'http://localhost:5000/images/default.jpeg'; }}
              style={{
                width: '100%', height: 'auto',
                borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                objectFit: 'cover', maxWidth: '450px'
              }}
            />
          </div>
          <div style={{
            width: '60%', paddingLeft: 20,
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            textAlign: 'left', fontSize: '1.1rem', lineHeight: '1.0'
          }}>
            <h2>{reseller.name}</h2>
            <p><strong>Description:</strong> {reseller.description}</p>
            <p><strong>Average Fare:</strong> ₹{reseller.averageFare}</p>
            <p><strong>Rating:</strong> {avgRating} ⭐</p>
            <p><strong>Location:</strong> {reseller.city}, {reseller.address}</p>
            <p><strong>Working Hours:</strong> {reseller.workingHours}</p>
            <div>
              {reseller.instagram && <a href={reseller.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>}
              {reseller.facebook && <a href={reseller.facebook} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 10 }}>Facebook</a>}
              {reseller.website && <a href={reseller.website} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 10 }}>Website</a>}
            </div>
          </div>
        </div>

        {/* Portfolio Section */}
        <section style={{ marginBottom: 40 }}>
          <h3>Portfolio</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 20
          }}>
            {(reseller.images || []).map((src, i) => (
              <div key={i} style={{
                position: 'relative',
                borderRadius: '15px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                overflow: 'hidden', transition: 'transform 0.3s ease'
              }}>
                <img
                  src={src.startsWith('/images/') ? `http://localhost:5000${src}` : `http://localhost:5000/images/resellers/${src}`}
                  alt={`portfolio-${i}`}
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover', borderRadius: '15px',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                />
                <div style={{
                  position: 'absolute', bottom: 10, left: 10,
                  color: '#fff', backgroundColor: 'rgba(0,0,0,0.6)',
                  padding: '5px 10px', borderRadius: 5
                }}>
                  Portfolio Item {i + 1}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section>
          <h3>Customer Reviews</h3>
          <div>
            <select
              value={ratingFilter}
              onChange={e => setRatingFilter(Number(e.target.value))}
              style={{ padding: '8px 12px', borderRadius: 6, fontSize: 16 }}
            >
              <option value={0}>All Ratings</option>
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}⭐</option>)}
            </select>
          </div>
          {filtered.map((r,i) => (
            <div key={i} style={{
              background: '#fff', padding: 16, borderRadius: 10,
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)', marginBottom: 20
            }}>
              <p style={{ fontWeight: 'bold' }}>{r.user} - {r.rating}⭐</p>
              <p>{r.comment}</p>
              <p style={{ fontSize: '0.9em', color: '#666' }}>{new Date(r.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </section>

        {/* Leave a Review */}
        <section>
          <h4>Leave a Review</h4>
          <div style={{ marginBottom: 20 }}>
            <select
              value={newRating}
              onChange={e => setNewRating(Number(e.target.value))}
              style={{ padding: '8px 12px', borderRadius: 6, fontSize: 16, marginBottom: 10 }}
            >
              {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}⭐</option>)}
            </select>
          </div>
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Write your review..."
            style={{
              width: '100%', height: 120, padding: 12,
              fontSize: 16, borderRadius: 8, border: '1px solid #ddd', resize: 'none'
            }}
          />
          <button
            onClick={handleReviewSubmit}
            style={{
              padding: '10px 20px', fontSize: 16,
              backgroundColor: '#007BFF', color: '#fff',
              borderRadius: 5, marginTop: 10, cursor: 'pointer'
            }}
          >
            Submit Review
          </button>
        </section>
      </div>

      {/* Chat Section */}
      <div style={{
        width: '25%', position: 'sticky', top: 20,
        height: 'calc(100vh - 150px)', padding: 20,
        background: '#f9f9f9', borderLeft: '1px solid #ddd',
        overflowY: 'auto', borderRadius: 10
      }}>
        <h3>Chat with Reseller</h3>
        <div style={{ marginBottom: 20, height: 'calc(100% - 150px)', overflowY: 'auto' }}>
          {chatMessages.map((msg,i) => (
            <div key={i} style={{
              backgroundColor: msg.user==='You'? '#007BFF':'#ddd',
              color: msg.user==='You'? '#fff':'#000',
              padding: 10, borderRadius: 10, marginBottom: 10,
              maxWidth: '80%', marginLeft: msg.user==='You'? 'auto': 0
            }}>
              <strong>{msg.user}:</strong> {msg.message}
            </div>
          ))}
        </div>
        <textarea
          value={chatInput}
          onChange={e => setChatInput(e.target.value)}
          placeholder="Type your message..."
          style={{
            width: '100%', padding: 10, fontSize: 16,
            borderRadius: 8, border: '1px solid #ddd', resize: 'none'
          }}
        />
        <button
          onClick={handleChatSend}
          style={{
            width: '100%', padding: '10px 20px', fontSize: 16,
            backgroundColor: '#007BFF', color: '#fff',
            borderRadius: 5, marginTop: 10, cursor: 'pointer'
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ResellerProfile;
