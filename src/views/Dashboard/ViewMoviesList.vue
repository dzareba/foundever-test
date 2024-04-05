<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
// import { useInfiniteScroll } from "@vueuse/core";
import { CategoriesTabs, MovieCard } from "@/app.organizer";
import { MovieCategory, TCategoryItem, TMovieData } from "@/types/movies";
import { ROUTE_DASHBOARD_MOVIES_LIST } from "@/app.routes";
import useFavoriteMoviesStore from "@/stores/favoriteMovies";
import { useRouter, useRoute } from "vue-router";
import useGenresStore from "@/stores/genres";

const genres = useGenresStore();

export default defineComponent({
  components: {
    CategoriesTabs,
    MovieCard,
  },
  setup() {
    let currentTab = ref({} as TCategoryItem);
    const isLoadingNextPage = ref(false);
    const categories: MovieCategory[] = reactive([
      {
        name: "All",
        value: [28, 16, 12, 35, 99],
      },
      {
        name: "Action",
        value: [28],
      },
      {
        name: "Animation",
        value: [16],
      },
      {
        name: "Adventure",
        value: [12],
      },
      {
        name: "Comedy",
        value: [35],
      },
      {
        name: "Documentary",
        value: [99],
      },
    ]);
    const router = useRouter();
    const route = useRoute();

    const favoriteMoviesStore = computed(() => useFavoriteMoviesStore());
    const currentPage = computed(() => genres.state.currentPage);
    const moviesGenres = computed(
      () => genres.state.moviesGenres as TMovieData[]
    );
    const end = computed(() => genres.state.end);

    const getGenres = (genre: number[], page: number = 1) =>
      genres.methods.getGenres(genre, page);

    const getCategory = (name: string) =>
      categories.find((e: MovieCategory) => e.name === name);

    const onChangeTab = (tab: TCategoryItem): void => {
      currentTab.value = tab;
    };

    const handleScroll = async (event: Event) => {
      const target = event.target as HTMLElement;
      if (
        target.scrollTop + target.clientHeight >=
        target.scrollHeight - 400 * currentPage.value
      ) {
        if (!end.value && !isLoadingNextPage.value) {
          isLoadingNextPage.value = true;
          const category = currentTab.value || null;
          if (category) await getGenres(category.value, currentPage.value + 1);
          isLoadingNextPage.value = false;
        }
      }
    };

    onMounted(() => {
      const queryGenre = route.query.genre || null;
      if (queryGenre) {
        let categoryQuery = getCategory(queryGenre as string);
        if (categoryQuery) currentTab.value = categoryQuery;
      } else {
        currentTab.value = categories[0];
      }
    });

    watch(currentTab, (newVal, oldVal) => {
      if (newVal && newVal.value) {
        router.push({
          name: ROUTE_DASHBOARD_MOVIES_LIST.name,
          query: { genre: newVal.name },
        });
        currentTab.value = newVal;

        getGenres(newVal.value, currentPage.value);
      }
    });

    return {
      currentTab,
      isLoadingNextPage,
      categories,
      favoriteMoviesStore,
      currentPage,
      moviesGenres,
      end,
      getGenres,
      getCategory,
      onChangeTab,
      handleScroll,
    };
  },
});
</script>

<template>
  <div class="db-movies-list flex-1 flex flex-col p-1 pt-16">
    <CategoriesTabs
      :items="categories"
      @onChange="onChangeTab"
      :value="currentTab"
      class="a-04 fadeInDown"
    />
    <div
      class="a-07 fadeInUp h-10 overflow-y-scroll flex-auto"
      @scroll="handleScroll"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <MovieCard
          v-for="(genre, index) in moviesGenres"
          :key="'m-' + index"
          :data="genre"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss"></style>
