import useApi from "@composables/useApi";
import { TMovieData } from "@/types/movies";
import { LOCALSTORAGE_MOVIES_FAVORITES } from "@/app.storages";

import { GET_MOVIES_GENRES, GET_MOVIES_POPULAR } from "./movies.api";
import { reactive, readonly, watchEffect } from "vue";

const favoritesInitialState = () => {
  const favoritesFromStorage = localStorage.getItem(
    LOCALSTORAGE_MOVIES_FAVORITES
  );
  return favoritesFromStorage ? JSON.parse(favoritesFromStorage) : [];
};

const state = reactive({
  favorites: favoritesInitialState(),
  moviesTrends: [],
  moviesGenres: [],
  error: "",
  loading: false,
  currentPage: 1,
  end: false,
});

const methods = {
  async getGenres(genre: number[], page: number = 1) {
    try {
      state.loading = true;
      const response = await useApi(GET_MOVIES_GENRES, {
        query: {
          with_genres: !genre.includes(0) ? genre.join("|") : null,
          page: page,
        },
      });

      if (response.isSuccess) {
        if (page <= state.currentPage)
          state.moviesGenres = response.data.results;
        else
          state.moviesGenres = state.moviesGenres.concat(response.data.results);
        if (response.data.total_pages === page) state.end = true;
        else state.end = false;

        state.currentPage = page;
      }
      state.loading = false;
    } catch (e) {
      console.error(e);
    }
  },

  async getTrends() {
    try {
      state.loading = true;
      const response = await useApi(GET_MOVIES_POPULAR);

      if (response.isSuccess) {
        state.moviesTrends = response.data.results.slice(0, 4);
      }
      state.loading = false;
    } catch (e) {
      console.error(e);
    }
  },

  addFavorite(movie: TMovieData) {
    state.favorites.push(movie);
  },

  removeFavorite(movie: TMovieData) {
    state.favorites = state.favorites.filter(
      (e: TMovieData) => e.id !== movie.id
    );
  },
};

watchEffect(() => {
  localStorage.setItem(
    LOCALSTORAGE_MOVIES_FAVORITES,
    JSON.stringify(state.favorites)
  );
});

export default function useMoviesStore() {
  return { state: readonly(state), methods };
}
