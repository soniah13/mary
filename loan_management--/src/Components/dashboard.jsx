import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          throw new Error('No access token found');
        }

        const response = await fetch('http://127.0.0.1:8000/dashboard/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const user = await response.json(); // Parse JSON response
        setUserData(user);
        setIsAdmin(user.is_admin || false); // Safely handle undefined `is_admin`
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  const renderUserData = () => (
    <div>
      <h2>Welcome, {userData.userName}</h2>
      {isAdmin && <p>You are an admin</p>}
      <p>Your Email: {userData.email}</p>
      <p>Status: {userData.is_active ? 'Active' : 'Inactive'}</p>
    </div>
  );

  const renderAdminFeatures = () => (
    <div>
      <h3>Admin Features</h3>
      {/* Add admin features here */}
    </div>
  );

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      {renderUserData()}
      {isAdmin && renderAdminFeatures()}
    </div>
  );
};

export default Dashboard;
