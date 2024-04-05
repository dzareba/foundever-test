import { MovieApiResponse, TMovieData } from "@/types/movies";
import { reactive, readonly } from "vue";
import { GET_MOVIES_GENRES } from "./movies.api";
import useApi from "@composables/useApi";

const state = reactive({
  moviesGenres: [] as TMovieData[],
  error: "",
  loading: false,
  currentPage: 1,
  end: false,
});

const methods = {
  async getGenres(genre: number[], page: number = 1) {
    state.loading = true;
    try {
      const response = await useApi(GET_MOVIES_GENRES, {
        query: {
          with_genres: !genre.includes(0) ? genre.join("|") : null,
          page: page,
        },
      });

      if (response.isSuccess && response.data) {
        state.moviesGenres =
          page <= state.currentPage
            ? response.data.results
            : state.moviesGenres.concat(response.data.results);
        state.end = response.data.total_pages === page;
        state.currentPage = page;
      } else {
        state.error = response.errors || "An unknown error occurred";
      }
    } catch (e) {
      console.error(e);
      state.error = "Failed to fetch genres";
    } finally {
      state.loading = false;
    }
  },
};

export default function useGenresStore() {
  return { state: readonly(state), methods };
}
