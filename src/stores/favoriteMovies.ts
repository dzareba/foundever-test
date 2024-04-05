import { TMovieData } from "@/types/movies";
import { LOCALSTORAGE_MOVIES_FAVORITES } from "@/app.storages";

import { reactive, readonly, watchEffect } from "vue";

const favoritesInitialState = () => {
  const favoritesFromStorage = localStorage.getItem(
    LOCALSTORAGE_MOVIES_FAVORITES
  );
  return favoritesFromStorage ? JSON.parse(favoritesFromStorage) : [];
};

const state = reactive({
  favorites: favoritesInitialState(),
});

const methods = {
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

export default function useFavoriteMoviesStore() {
  return { state: readonly(state), methods };
}
