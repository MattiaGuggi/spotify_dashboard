# 🎵 Spotify Dashboard & Playlist Manager

A full-stack web application for visualizing Spotify listening habits and performing advanced playlist management, such as single and bulk track reordering. Built with a **React** frontend and a **Python Flask** backend powered by **Spotipy** and **BeautifulSoup**.

---

## 🌟 Key Features

* **🏠 Home Dashboard:** Clean overview and seamless navigation interface.
* **🎵 Top Tracks:** View your top-played tracks over medium-term listening periods.
* **👤 User Profile:** Display personalized account information and user metadata.
* **📜 Advanced Playlist Manager (Core Feature):**
  * Browse and select from all your saved Spotify playlists.
  * **Single Track Reordering:** Change the exact position/index of individual tracks in a playlist.
  * **Group Track Reordering:** Select and move entire blocks/groups of tracks simultaneously to new playlist positions.
* **🎤 Genius Lyrics:** Scrape and display cleaned track lyrics on-demand via Genius integration.
* **🔒 Secure OAuth Flow:** Fully aligned with Spotify's strict loopback URI security policies with automatic token refresh and stale cache cleanup.

---

## 📁 Project Architecture

```text
spotify_dashboard/
├── client/                 # React Frontend (Vite)
│   ├── src/                # Components, views, and styles
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite build configuration
│
└── server/                 # Python Flask Backend
    ├── main.py             # Flask application, OAuth manager & API endpoints
    ├── .env                # API keys and environment variables
    └── requirements.txt    # Python dependencies
```

---

## 🛠️ Tech Stack

### **Frontend (`/client`)**
* **React** (Vite)
* **JavaScript (ES6+)**
* **CSS3** / Styling components

### **Backend (`/server`)**
* **Python 3.13+**
* **Flask** & **Flask-CORS**
* **Spotipy** (Spotify Web API Wrapper)
* **BeautifulSoup4** & **Requests** (Genius Lyrics scraping)
* **python-dotenv**

---

## 🚀 Getting Started

### 1. Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* [Python](https://www.python.org/) (v3.10 or higher)
* A [Spotify Account](https://spotify.com)
* A [Spotify Developer Account](https://developer.spotify.com/dashboard)

---

### 2. Spotify Developer Setup

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) and create a new application.
2. Under **Edit Settings**, set the **Redirect URI** to:
   ```text
   http://127.0.0.1:5000/callback/
   ```
   > ⚠️ **Note:** Spotify prohibits `localhost` in redirect URIs. You **must** use explicit loopback IPv4 (`http://127.0.0.1:5000/callback/`).

3. Copy your **Client ID** and **Client Secret**.

---

### 3. Backend Setup (`/server`)

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Create and activate a Python virtual environment:
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the `/server` directory:
   ```env
   CLIENT_ID=your_spotify_client_id
   CLIENT_SECRET=your_spotify_client_secret
   REDIRECT_URI=http://127.0.0.1:5000/callback/
   GENIUS_CLIENT_ACCESS_TOKEN=your_genius_access_token
   ```

5. Start the Flask backend server:
   ```bash
   python main.py
   ```
   *The server will run on `http://127.0.0.1:5000`.*

---

### 4. Frontend Setup (`/client`)

1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The React app will run on `http://localhost:5173`.*

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/login` | Returns the Spotify OAuth authorization URL |
| `GET` | `/callback/` | Handles OAuth redirect code exchange and forwards access token to client |
| `GET` | `/user` | Fetches current user's Spotify profile |
| `GET` | `/top-tracks` | Fetches user's top 15 tracks (medium term) |
| `GET` | `/playlists` | Fetches up to 50 of the user's saved playlists |
| `GET` | `/playlists/<id>/tracks` | Retrieves all tracks for a given playlist (with pagination) |
| `POST` | `/playlists/<id>/moveTracks` | Reorders a single track in a playlist |
| `POST` | `/playlists/<id>/moveGroupTracks` | Reorders a block/group of tracks in a playlist |
| `GET` | `/lyrics` | Fetches track lyrics from Genius by `track` and `artist` query parameters |

---

## 🛡️ Error Handling & OAuth Expiration

* **Automatic Cache Management:** If a refresh token is revoked or expires, the backend automatically intercepts `SpotifyOauthError`, removes the stale `.cache` file, and returns a `401 Unauthorized` response to prompt user re-authentication cleanly.