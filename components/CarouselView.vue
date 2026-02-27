<template>
  <div class="w-full px-0 md:px-12 carousel-container">
    <ClientOnly>
      <Swiper
        :modules="modules"
        :slides-per-view="1"
        :space-between="10"
        :centered-slides="true"
        :loop="true"
        :navigation="true"
        :breakpoints="breakpoints"
        @swiper="onSwiper"
        class="mySwiper"
      >
        <SwiperSlide
          v-for="action in actions"
          :key="action.date.toISOString()"
        >
          <div class="mx-2">
            <ActionCard :action="action" />
          </div>
        </SwiperSlide>
      </Swiper>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import ActionCard from './ActionCard.vue';
import type { CountdownItem } from '~/composables/googleSheets';

interface Props {
  actions: CountdownItem[];
}

const props = defineProps<Props>();

const swiperInstance = ref<any>(null);
const modules = [Navigation];

const breakpoints = {
  320: {
    slidesPerView: 1,
    spaceBetween: 20,
  },
  768: {
    slidesPerView: 1,
    spaceBetween: 30,
  },
  1024: {
    slidesPerView: 3,
    spaceBetween: 40,
  },
};

const onSwiper = (swiper: any) => {
  swiperInstance.value = swiper;
};

onMounted(() => {
  if (swiperInstance.value && props.actions.length > 0) {
    const today = new Date();
    const currentIndex = props.actions.findIndex((a) =>
      a.date.getFullYear() === today.getFullYear() &&
      a.date.getMonth() === today.getMonth() &&
      a.date.getDate() === today.getDate()
    );
    if (currentIndex >= 0) {
      setTimeout(() => {
        swiperInstance.value?.slideTo(currentIndex);
      }, 100);
    }
  }
});
</script>

<style scoped>
.carousel-container :deep(.swiper-slide) {
  transition: all 0.3s ease;
  opacity: 0.5;
  transform: scale(0.85);
}

.carousel-container :deep(.swiper-slide-active) {
  opacity: 1;
  transform: scale(1);
  z-index: 10;
}

.carousel-container :deep(.swiper-button-next),
.carousel-container :deep(.swiper-button-prev) {
  color: var(--isf-red);
  width: 40px;
  height: 40px;
}

.carousel-container :deep(.swiper-button-next:after),
.carousel-container :deep(.swiper-button-prev:after) {
  font-size: 24px;
  font-weight: bold;
}

@media (max-width: 640px) {
  .carousel-container :deep(.swiper-slide) {
    transform: scale(0.75);
  }
  
  .carousel-container :deep(.swiper-slide-active) {
    transform: scale(1);
  }
  
  .carousel-container :deep(.swiper-button-next),
  .carousel-container :deep(.swiper-button-prev) {
    width: 30px;
    height: 30px;
  }
}
</style>
