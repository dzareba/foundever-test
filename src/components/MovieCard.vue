<script setup lang="ts">
import { onMounted, computed } from "vue";
import { TMovieData } from "@/types/movies";
import useFavoriteMoviesStore from "@/stores/favoriteMovies";

const favoriteMovies = useFavoriteMoviesStore();

const emit = defineEmits<{
  (e: "onHover", pictureURL: string): void;
}>();

const props = defineProps<{
  data: TMovieData;
}>();

const isFavorite = computed(() => {
  return !!favoriteMovies.state.favorites.find(
    (e: TMovieData) => e.id === props.data.id
  );
});

const getFavoriteIcon = computed(() => {
  return new URL(
    `../assets/img/icon-heart${isFavorite.value ? "-full" : ""}.png`,
    import.meta.url
  ).toString();
});

const getLinkImage = (picturePath: string, originalSize: boolean = false) => {
  return `https://image.tmdb.org/t/p/${
    originalSize ? "original" : "w500"
  }${picturePath}`;
};

const toggleFavorite = () => {
  if (isFavorite.value) favoriteMovies.methods.removeFavorite(props.data);
  else favoriteMovies.methods.addFavorite(props.data);
};

onMounted(() => {
  emit("onHover", getLinkImage(props.data.poster_path, true));
});
</script>

<template>
  <div
    class="card-movie h-48 w-200 p-2 mr-2 mb-2 bg-cover flex flex-col justify-between shadow-xl"
    @mouseover="emit('onHover', getLinkImage(props.data.poster_path, true))"
  >
    <div
      class="background z-10"
      :style="{
        backgroundImage: 'url(' + getLinkImage(props.data.backdrop_path) + ')',
      }"
    ></div>
    <div class="top flex justify-end z-20">
      <img
        class="cursor-pointer"
        :src="getFavoriteIcon"
        @click="toggleFavorite"
      />
    </div>
    <div class="bottom z-20">
      <span
        class="title inline-block p-1 bg-white dark:bg-black text-black dark:text-white border-2 border-transparent font-bold rounded"
      >
        {{ props.data.original_title }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card-movie {
  overflow: hidden;
  position: relative;

  .background {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: absolute;
    z-index: 10;
    transition: all 0.4s;
    background-size: cover;
  }

  &:hover {
    .background {
      transform: scale(1.1);
    }

    .bottom {
      .title {
        border-color: grey;
      }
    }
  }

  .bottom {
    .title {
      transition: all 0.3s;
    }
  }
}
</style>
