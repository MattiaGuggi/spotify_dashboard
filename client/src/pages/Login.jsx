import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Home from './Home'

const Login = ({ setToken }) => {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    // Parse token from URL fragment (after #)
    const hash = window.location.hash; // e.g. #access_token=xxx
    if (hash) {
      const params = new URLSearchParams(hash.substring(1)); // remove '#'
      const token = params.get('access_token');
      if (token) {
        setAccessToken(token);
        localStorage.setItem('spotify_access_token', token);
        // Clean the URL so token is not visible anymore
        window.history.replaceState({}, document.title, '/');
      }
    } else {
      // If no token in URL, check localStorage
      const savedToken = localStorage.getItem('spotify_access_token');
      if (savedToken) {
        setAccessToken(savedToken);
      }
    }
  }, []);

  const handleLogin = async () => {
    try {
      const res = await axios.get('http://localhost:5000/login');
      const { auth_url } = res.data;
      window.location.href = auth_url; // redirect to Spotify login
    } catch (error) {
      console.error('Login error', error);
    }
  };

  if (accessToken) {
    setToken(accessToken);
    return <Home />
  }

  return (
    <div>
      <h2>Login with Spotify</h2>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
