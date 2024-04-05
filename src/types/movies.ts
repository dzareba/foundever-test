export type TMovieData = {
  adult?: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

export type TCategoryItem = {
  name: string;
  value: number[];
};

export type MovieApiResponse = {
  isSuccess: boolean;
  data: {
    results: TMovieData[];
    total_pages: number;
  };
  status?: number;
  error?: string;
};

export type MovieCategory = {
  name: string;
  value: number[];
};
