const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

export const IMAGE_SIZES = {
  poster: {
    small: `${IMAGE_BASE_URL}/w185`,
    medium: `${IMAGE_BASE_URL}/w342`,
    large: `${IMAGE_BASE_URL}/w500`,
    original: `${IMAGE_BASE_URL}/original`,
  },
  backdrop: {
    small: `${IMAGE_BASE_URL}/w300`,
    medium: `${IMAGE_BASE_URL}/w780`,
    large: `${IMAGE_BASE_URL}/w1280`,
    original: `${IMAGE_BASE_URL}/original`,
  },
  profile: {
    small: `${IMAGE_BASE_URL}/w45`,
    medium: `${IMAGE_BASE_URL}/w185`,
    large: `${IMAGE_BASE_URL}/h632`,
    original: `${IMAGE_BASE_URL}/original`,
  },
};

const fetchOptions = {
  headers: {
    "Content-Type": "application/json",
  },
};

const buildUrl = (endpoint: string, queryParams?: Record<string, string | number | boolean>) => {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.append("api_key", API_KEY);

  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  return url.toString();
};

const fetchFromApi = async <T>(endpoint: string, queryParams?: Record<string, string | number | boolean>): Promise<T> => {
  const url = buildUrl(endpoint, queryParams);

  try {
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json() as T;
  } catch (error) {
    console.error("API fetch error:", error);
    throw error;
  }
};

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: Genre[];
  runtime?: number;
  tagline?: string;
  status?: string;
  revenue?: number;
  budget?: number;
  original_language: string;
  production_companies?: ProductionCompany[];
  production_countries?: ProductionCountries[];
  spoken_languages?: SpokenLanguages[]
}

export interface TVSeries {
  id: number;
  name: string;
  original_name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  vote_count: number;
  first_air_date?: string;
  last_air_date?: string;
  next_episode_to_air?: NextEpisode;
  number_of_seasons?: number;
  number_of_episodes?: number;
  created_by: Creators[];
  networks: Network[];
  genres?: Genre[];
  tagline?: string;
  status?: string;
  production_companies?: ProductionCompany[];
  production_countries?: ProductionCountries[];
  original_language?: string;
  spoken_languages?: SpokenLanguages[]
}

export interface MovieVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface NextEpisode {
  episode_number: number;
  air_date: string;
}

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface TVSeriesResponse {
  page: number;
  results: TVSeries[];
  total_pages: number;
  total_results: number;
}

export interface Creators {
  name: string;
  profile_path: string | null;
}

export interface Network {
  name: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface GenresResponse {
  genres: Genre[];
}

export interface Credit {
  id: number;
  cast: Cast[];
  crew: Crew[];
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface ProductionCountries {
  iso_3166_1: string,
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface SpokenLanguages {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export const api = {
  getTrending: (timeWindow: "day" | "week" = "day") =>
    fetchFromApi<MoviesResponse>(`/trending/movie/${timeWindow}`),

  getPopular: (page: number = 1, year?: number) =>
    fetchFromApi<MoviesResponse>("/movie/popular", { page, ...(year && { year }) }),

  getTopRated: (page: number = 1, year?: number) =>
    fetchFromApi<MoviesResponse>("/movie/top_rated", { page, ...(year && { year }) }),

  getUpcoming: (page: number = 1, year?: number) =>
    fetchFromApi<MoviesResponse>("/movie/upcoming", { page, ...(year && { year }) }),

  getAiringToday: (page: number = 1, year?: number) =>
    fetchFromApi<TVSeriesResponse>("/tv/airing_today", { page, ...(year && { first_air_date_year: year }) }),

  getOnTheAir: (page: number = 1, year?: number) =>
    fetchFromApi<TVSeriesResponse>("/tv/on_the_air", { page, ...(year && { first_air_date_year: year }) }),

  getTvPopular: (page: number = 1, year?: number) =>
    fetchFromApi<TVSeriesResponse>("/tv/popular", { page, ...(year && { first_air_date_year: year }) }),

  getTvTopRated: (page: number = 1, year?: number) =>
    fetchFromApi<TVSeriesResponse>("/tv/top_rated", { page, ...(year && { first_air_date_year: year }) }),

  getMovie: (id: number) =>
    fetchFromApi<Movie>(`/movie/${id}`),

  getTvSeries: (id: number) =>
    fetchFromApi<TVSeries>(`/tv/${id}`),

  getMovieCredits: (id: number) =>
    fetchFromApi<Credit>(`/movie/${id}/credits`),

  getTVSeriesCredits: (id: number) =>
    fetchFromApi<Credit>(`/tv/${id}/credits`),

  getSimilarMovies: (id: number, page: number = 1) =>
    fetchFromApi<MoviesResponse>(`/movie/${id}/similar`, { page }),

  getSimilarTVSeries: (id: number, page: number = 1) =>
    fetchFromApi<TVSeriesResponse>(`/tv/${id}/similar`, { page }),

  getMovieVideos: (id: number) =>
    fetchFromApi<{ results: MovieVideo[] }>(`/movie/${id}/videos`),

  getTVSeriesVideos: (id: number) =>
    fetchFromApi<{ results: MovieVideo[] }>(`/tv/${id}/videos`),

  searchMovies: (query: string, page: number = 1) =>
    fetchFromApi<MoviesResponse>(`/search/movie`, { query, page }),

  searchTVSeries: (query: string, page: number = 1) =>
    fetchFromApi<TVSeriesResponse>("/search/tv", { query, page }),

  getGenres: () =>
    fetchFromApi<GenresResponse>("/genre/movie/list"),

  getTVSeriesGenres: () =>
    fetchFromApi<GenresResponse>("/genre/tv/list"),

  getMoviesByGenre: (genreId: number, page: number = 1) =>
    fetchFromApi<MoviesResponse>("/discover/movie", { with_genres: genreId, page }),

  getTVSeriesByGenre: (genreId: number, page: number = 1) =>
    fetchFromApi<TVSeriesResponse>("/discover/tv", { with_genres: genreId, page }),
};
