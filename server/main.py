from flask import Flask, request, jsonify, redirect
import spotipy
from spotipy.oauth2 import SpotifyOAuth, SpotifyOauthError
from spotipy.exceptions import SpotifyException
from flask_cors import CORS
from dotenv import load_dotenv
import os
import random
import requests
import re
from bs4 import BeautifulSoup

load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

CLIENT_ID = os.getenv('CLIENT_ID')
CLIENT_SECRET = os.getenv('CLIENT_SECRET')
REDIRECT_URI = os.getenv('REDIRECT_URI')
SCOPE = "user-top-read playlist-read-private playlist-modify-private playlist-modify-public"
GENIUS_API_KEY = os.getenv('GENIUS_API_KEY')
GENIUS_CLIENT_ACCESS_TOKEN = os.getenv('GENIUS_CLIENT_ACCESS_TOKEN')

auth_manager = SpotifyOAuth(
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    redirect_uri=REDIRECT_URI,
    scope=SCOPE,
    cache_path=".cache"
)

@app.errorhandler(SpotifyOauthError)
def handle_spotify_oauth_error(e):
    """
    Catches token revocation or expiration across all endpoints.
    Deletes the invalid .cache file and returns a 401 to prompt frontend login.
    """
    if os.path.exists(".cache"):
        try:
            os.remove(".cache")
            print("[INFO] Invalid .cache file deleted successfully.")
        except OSError as err:
            print(f"[WARNING] Could not delete .cache file: {err}")

    return jsonify({
        'error': 'invalid_grant',
        'message': 'Spotify session expired or revoked. Please log in again.'
    }), 401

@app.route('/login')
def login():
    auth_url = auth_manager.get_authorize_url()
    return jsonify({'auth_url': auth_url})

@app.route('/callback/')
def callback():
    code = request.args.get('code')
    if not code:
        return jsonify({'error': 'Missing code parameter'}), 400
    
    token_info = auth_manager.get_access_token(code)
    access_token = token_info['access_token']
    return redirect(f"http://localhost:5173/#access_token={access_token}")

@app.route('/user', methods=['GET'])
def user():
    sp = spotipy.Spotify(auth_manager=auth_manager)
    me = sp.me()
    return jsonify(me)

@app.route('/top-tracks', methods=['GET'])
def top_tracks():
    sp = spotipy.Spotify(auth_manager=auth_manager)
    results = sp.current_user_top_tracks(limit=15, time_range='medium_term')
    return jsonify(results)

@app.route('/recommendations', methods=['GET'])
def recommendations():
    sp = spotipy.Spotify(auth_manager=auth_manager)
    
    try:
        top_tracks_data = sp.current_user_top_tracks(limit=5, time_range='medium_term')['items']
        seed_tracks = [track['id'] for track in top_tracks_data if track and 'id' in track]

        top_artists_data = sp.current_user_top_artists(limit=5, time_range='medium_term')['items']
        seed_artists = [artist['id'] for artist in top_artists_data if artist and 'id' in artist]

        available_genres_res = sp.recommendation_genre_seeds()
        available_genres = available_genres_res.get('genres', [])
        seed_genres = [random.choice(available_genres)] if available_genres else []

        if not seed_tracks and not seed_artists and not seed_genres:
            return jsonify({'error': 'No valid seed data found'}), 400

        recs = sp.recommendations(
            seed_tracks=seed_tracks[:2], 
            seed_genres=seed_genres[:1], 
            seed_artists=seed_artists[:2], 
            limit=10
        )['tracks']
        return jsonify(recs)
        
    except SpotifyException as e:
        print(f"Spotify API Error: {e}")
        return jsonify({'error': 'Failed to get recommendations', 'details': str(e)}), 500

@app.route('/playlists', methods=['GET'])
def playlists():
    sp = spotipy.Spotify(auth_manager=auth_manager)
    playlists = sp.current_user_playlists(limit=50)['items']
    return jsonify(playlists)

@app.route('/playlists/<playlist_id>/tracks', methods=['GET'])
def playlist_tracks(playlist_id):
    sp = spotipy.Spotify(auth_manager=auth_manager)
    tracks = []
    offset = 0

    while True:
        response = sp.playlist_items(
            playlist_id,
            offset=offset,
            fields='items(track(id, name, album)),next',
            additional_types=['track']
        )
        tracks.extend(response['items'])
        if response['next'] is None:
            break
        offset += len(response['items'])

    return jsonify(tracks)

@app.route('/playlists/<playlist_id>/moveTracks', methods=['POST'])
def move_tracks(playlist_id):
    data = request.json or {}
    origin = data.get('origin')
    destination = data.get('destination')
    sp = spotipy.Spotify(auth_manager=auth_manager)

    try:
        sp.playlist_reorder_items(playlist_id, range_start=origin, insert_before=destination)
        return jsonify({'message': 'Tracks moved successfully!'})
    except SpotifyException as e:
        return jsonify({'error': 'Failed to move tracks!', 'details': str(e)}), 500

@app.route('/playlists/<playlist_id>/moveGroupTracks', methods=['POST'])
def move_group_tracks(playlist_id):
    data = request.json or {}
    first_new_position = data.get('first_new_position')
    first_old_position = data.get('first_old_position')
    group_tracks = data.get('group_tracks', [])
    sp = spotipy.Spotify(auth_manager=auth_manager)

    try:
        sp.playlist_reorder_items(
            playlist_id,
            range_start=first_old_position,
            range_length=len(group_tracks),
            insert_before=first_new_position
        )
        return jsonify({'message': 'Track moved successfully'})
    except SpotifyException as e:
        print(e)
        return jsonify({'error': 'Failed to move group tracks', 'details': str(e)}), 500

@app.route("/lyrics", methods=["GET"])
def display_lyrics():
    track = request.args.get("track")
    artist = request.args.get("artist")

    if not track or not artist:
        return jsonify({"error": "Missing track or artist"}), 400
    
    query = f"{track} {artist}"

    res = requests.get(
        "https://api.genius.com/search",
        params={"q": query},
        headers={"Authorization": f"Bearer {GENIUS_CLIENT_ACCESS_TOKEN}"}
    ).json()

    hits = res.get("response", {}).get("hits", [])

    if not hits:
        return jsonify({"error": "Song not found on Genius"}), 404

    data = hits[0]["result"]

    song = {
        "id": data["id"],
        "title": data["title"],
        "url": data["url"],
        "artist": data["primary_artist"]["name"]
    }

    page = requests.get(song["url"])
    soup = BeautifulSoup(page.text, "html.parser")

    lyrics_divs = soup.select("div[data-lyrics-container='true']")
    raw_lyrics = "\n".join(div.get_text(separator="\n") for div in lyrics_divs).strip()

    cleaned = re.sub(r"\[.*?\]", "", raw_lyrics)
    cleaned = re.sub(r"\n{2,}", "\n\n", cleaned).splitlines()[3:]
    lyrics = "\n".join(cleaned).strip()

    return jsonify(lyrics)

if __name__ == '__main__':
    app.run(debug=True)
