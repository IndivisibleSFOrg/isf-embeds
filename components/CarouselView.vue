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
          <a
            :href="action.link_url"
            target="_blank"
            rel="noopener noreferrer"
            :class="[
              'block overflow-hidden rounded-xl border-4 transition-all duration-300 hover:shadow-2xl mx-2',
              isToday(action.date.getDate())
                ? 'border-blue-600 shadow-xl'
                : isPast(action.date.getDate())
                  ? 'border-gray-300'
                  : 'border-red-500'
            ]"
          >
            <div class="relative">
              <img
                :src="action.image || defaultImage"
                :alt="action.headline"
                class="w-full h-80 object-cover"
              />
              <div
                :class="[
                  'absolute top-4 right-4 w-16 h-16 rounded-full flex items-center justify-center font-bold text-white text-xl shadow-lg',
                  isToday(action.date.getDate())
                    ? 'bg-blue-600'
                    : isPast(action.date.getDate())
                      ? 'bg-gray-400'
                      : 'bg-red-500'
                ]"
              >
                {{ `${action.date.getMonth() + 1}/${action.date.getDate()}` }}
              </div>
              <div
                v-if="isToday(action.date.getDate())"
                class="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-full font-semibold shadow-lg"
              >
                Today's Action
              </div>
            </div>
            <div class="p-6 bg-white card-content">
              <h3 class="text-xl font-semibold text-gray-900">
                {{ action.headline }}
              </h3>
              <p class="mt-2 text-sm text-gray-600">
                Click to learn more →
              </p>
            </div>
          </a>
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
import { getCurrentDay } from '~/composables/dateHelpers';
import { defaultImage } from '~/composables/constants';
import type { CountdownItem } from '~/composables/googleSheets';

interface Props {
  actions: CountdownItem[];
}

const props = defineProps<Props>();

const currentDay = ref<number>(0);
const swiperInstance = ref<any>(null);
const modules = [Navigation];

const isToday = (day: number) => day === currentDay.value;
const isPast = (day: number) => day < currentDay.value;

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
  currentDay.value = getCurrentDay();
  
  // Navigate to current day's slide
  if (swiperInstance.value && props.actions.length > 0) {
    const currentIndex = props.actions.findIndex((a) => a.date.getDate() === currentDay.value);
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
  color: #dc2626;
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
  
  /* Hide text on side cards on mobile */
  .carousel-container :deep(.swiper-slide) .card-content {
    max-height: 0;
    opacity: 0;
    padding-top: 0;
    padding-bottom: 0;
    overflow: hidden;
    transition: all 0.5s ease;
  }
  
  .carousel-container :deep(.swiper-slide-active) .card-content {
    max-height: 300px;
    opacity: 1;
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
  }
}
</style>
