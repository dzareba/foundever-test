import { TMovieData } from "@/types/movies";
import useApi from "@composables/useApi";
import { reactive, readonly } from "vue";
import { GET_MOVIES_POPULAR } from "./movies.api";

const state = reactive({
  moviesTrends: [] as TMovieData[],
  error: "",
  loading: false,
});

const methods = {
  async getTrends() {
    state.loading = true;
    try {
      const response = await useApi(GET_MOVIES_POPULAR);

      if (response.isSuccess && response.data) {
        state.moviesTrends = response.data.results.slice(0, 4);
      } else {
        state.error = response.errors || "An unknown error occurred";
      }
    } catch (e) {
      console.error(e);
      state.error = "Failed to fetch trends";
    } finally {
      state.loading = false;
    }
  },
};

export default function useTrendsStore() {
  return { state: readonly(state), methods };
}
