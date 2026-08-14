export type spotifyImage = {
  url: string;
  height?: number | null;
  width?: number | null;
};

export type externalUrls = {
  spotify?: string;
};

export type simplifiedArtist = {
  id?: string;
  name?: string;
  uri?: string;
  external_urls?: externalUrls;
};

export type SimplifiedAlbum = {
  id?: string;
  name?: string;
  images?: spotifyImage[];
  release_date?: string;
  uri?: string;
  artists?: simplifiedArtist[];
};

// --- User Profile ---
export type userType = {
  id?: string;
  display_name?: string;
  email?: string; // Returned only on the current user's private profile
  images?: spotifyImage[];
  pfp?: string; // Custom string shortcut for avatar URL if you map it in your backend
  uri?: string;
  followers?: {
    total?: number;
  };
  external_urls?: externalUrls;
  password?: string; // Spotify uses OAuth, so API responses never include passwords (keep for custom DBs)
};

// --- Track ---
export type trackType = {
  id?: string;
  name?: string;
  artists?: simplifiedArtist[];
  album?: SimplifiedAlbum;
  duration_ms?: number;
  explicit?: boolean;
  preview_url?: string | null; // 30-second audio preview URL (if available)
  popularity?: number; // Integer 0–100
  uri?: string;
  external_urls?: externalUrls;
};

// --- Playlist ---
export type playlistType = {
  id?: string;
  name?: string;
  description?: string | null;
  owner?: userType;
  images?: spotifyImage[];
  public?: boolean;
  collaborative?: boolean;
  tracks?: {
    total?: number;
    items?: Array<{
      added_at?: string;
      added_by?: userType;
      track?: trackType;
    }>;
  };
  uri?: string;
  external_urls?: externalUrls;
};