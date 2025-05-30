import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import Slider from '@mui/material/Slider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

// Custom DivIcon Marker
const customIcon = new L.DivIcon({
  className: 'custom-div-icon',
  html: '<div style="background-color:rgb(244, 72, 72); width: 10px; height: 10px; border-radius: 50%; border: 2px solid white;"></div>',
  iconSize: [3, 3],
  iconAnchor: [10, 20],
});

const Resellers = () => {
  const [resellers, setResellers] = useState([]);
  const [filteredResellers, setFilteredResellers] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [workingHoursFilter, setWorkingHoursFilter] = useState('');
  const [fareFilter, setFareFilter] = useState([0, 5000]);
  const [ratingFilter, setRatingFilter] = useState([0, 5]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/resellers')
      .then((response) => {
        setResellers(response.data);
        setFilteredResellers(response.data);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setError('Failed to load resellers.');
      })
      .finally(() => setLoading(false));
  }, []);

  const getAvailabilityStatus = () => {
    const now = new Date();
    const currentHour = now.getHours();
    return currentHour >= 10 && currentHour < 20
      ? 'Available Now'
      : 'Not Available Now';
  };

  useEffect(() => {
    const noFilters =
    !nameFilter &&
    !cityFilter &&
    !brandFilter &&
    !serviceFilter &&
    !workingHoursFilter &&
    fareFilter[0] === 0 &&
    fareFilter[1] === 5000 &&
    ratingFilter[0] === 0 &&
    ratingFilter[1] === 5;

  if (noFilters) {
    setFilteredResellers(resellers);
    return;
  }
    const filtered = resellers.filter((r) => {
      const nameMatch = nameFilter
        ? r.name?.toLowerCase().includes(nameFilter.toLowerCase())
        : true;
      const cityMatch = cityFilter
        ? r.city?.toLowerCase().includes(cityFilter.toLowerCase())
        : true;
      const brandMatch = brandFilter
        ? r.brand?.toLowerCase().includes(brandFilter.toLowerCase())
        : true;
      const serviceMatch = serviceFilter
        ? r.services?.some((s) =>
            s.toLowerCase().includes(serviceFilter.toLowerCase())
          )
        : true;
      const hoursMatch = workingHoursFilter
        ? getAvailabilityStatus() === workingHoursFilter
        : true;
      const fareMatch =
        r.averageFare >= fareFilter[0] && r.averageFare <= fareFilter[1];
      const ratingMatch = r.ratings?.some(
        (rt) =>
          rt.rating >= ratingFilter[0] && rt.rating <= ratingFilter[1]
      );
      return (
        nameMatch &&
        cityMatch &&
        brandMatch &&
        serviceMatch &&
        hoursMatch &&
        fareMatch &&
        ratingMatch
      );
    });
    setFilteredResellers(filtered);
  }, [
    nameFilter,
    cityFilter,
    brandFilter,
    serviceFilter,
    workingHoursFilter,
    fareFilter,
    ratingFilter,
    resellers,
  ]);

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={{ marginBottom: '15px' }}>Filter Resellers</h2>
        <input
          type="text"
          placeholder="Search by Name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Search by City"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Search by Brand"
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          style={styles.input}
        />
        <FormControl fullWidth style={{ marginBottom: '20px' }}>
          <InputLabel>Service Type</InputLabel>
          <Select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            label="Service Type"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Rentals">Rentals</MenuItem>
            <MenuItem value="Bridal wear">Bridal wear</MenuItem>
            <MenuItem value="Designer blouses">Blouses</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth style={{ marginBottom: '20px' }}>
          <InputLabel>Working Hours</InputLabel>
          <Select
            value={workingHoursFilter}
            onChange={(e) => setWorkingHoursFilter(e.target.value)}
            label="Working Hours"
          >
            <MenuItem value="">Any Time</MenuItem>
            <MenuItem value="Available Now">Available Now</MenuItem>
            <MenuItem value="Not Available Now">Not Available Now</MenuItem>
          </Select>
        </FormControl>
        <h4>Average Fare</h4>
        <Slider
          value={fareFilter}
          onChange={(e, newValue) => setFareFilter(newValue)}
          valueLabelDisplay="auto"
          valueLabelFormatter={(v) => `₹${v}`}
          min={0}
          max={5000}
          style={{ marginBottom: '20px' }}
        />
        <h4>Rating</h4>
        <Slider
          value={ratingFilter}
          onChange={(e, newValue) => setRatingFilter(newValue)}
          valueLabelDisplay="auto"
          valueLabelFormatter={(v) => `${v}★`}
          min={0}
          max={5}
          step={0.1}
          style={{ marginBottom: '20px' }}
        />
        {loading && <p>Loading resellers...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      <div style={styles.map}>
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {filteredResellers.map(
            (reseller) =>
              reseller.lat &&
              reseller.lng && (
                <Marker
                  key={reseller._id}
                  position={[reseller.lat, reseller.lng]}
                  icon={customIcon}
                >
                  <Popup>
                    <div style={{ maxWidth: '200px' }}>
                      <h3 style={{ margin: '5px 0' }}>{reseller.name}</h3>
                      <p style={{ margin: 0 }}>{reseller.city}</p>
                      <p style={{ margin: 0, wordWrap: 'break-word' }}>
                        {reseller.address}
                      </p>
                      <p style={{ margin: '5px 0' }}>
                        <a href={`tel:${reseller.phone}`}>📞 Call</a>
                      </p>
                      <p style={{ color: 'green', fontWeight: 'bold' }}>
                        {getAvailabilityStatus()}
                      </p>
                      <Link
                        to={`/reseller/${reseller._id}`}
                        style={styles.link}
                      >
                        View Profile
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              )
          )}
        </MapContainer>
      </div>

      <div style={styles.dataPart}>
        <ul style={styles.list}>
          {filteredResellers.map((reseller) => (
            <li key={reseller._id} style={styles.listItem}>
              <div style={styles.profileImageContainer}>
                <img
                  src={
                    reseller.profilePicture.startsWith('/images/')
                      ? `http://localhost:5000${reseller.profilePicture}`
                      : `http://localhost:5000/images/resellers/${reseller.profilePicture}`
                  }
                  alt={reseller.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'http://localhost:5000/images/default.jpeg';
                  }}
                  style={styles.profileImage}
                />
              </div>
              <div style={styles.resellerInfo}>
                <strong>{reseller.name}</strong>
                <br />
                <small>{reseller.city}</small>
                <br />
                <Link
                  to={`/reseller/${reseller._id}`}
                  style={styles.link}
                >
                  View Profile
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Inline Styles
const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    fontFamily: 'sans-serif',
    flexDirection: 'row',
  },
  sidebar: {
    width: '25%',
    minWidth: '280px',
    padding: '20px',
    backgroundColor: '#f2f2f2',
    overflowY: 'auto',
  },
  input: {
    width: '90%',
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  map: {
    width: '45%',
    height: '100%',
  },
  dataPart: {
    width: '25%',
    height: '100%',
    overflowY: 'auto',
    padding: '20px',
    backgroundColor: '#ffffff',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
    padding: '10px',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    backgroundColor: '#f9f9f9',
  },
  profileImageContainer: {
    marginRight: '15px',
  },
  profileImage: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  resellerInfo: {
    flex: 1,
  },
  link: {
    color: '#1976d2',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

export default Resellers;
