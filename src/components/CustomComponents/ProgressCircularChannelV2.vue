<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

const props = defineProps({
  channel: {
    type: String,
    required: true,
  },
  tooltipText: {
    type: String,
    required: false,
    default: 'Cargando...'
  },
  type: {
    type: String,
    default: 'bar', // 'bar' or 'circle'
  }
});

const progressValue = ref<number>(0);
const showSnackbar = ref<boolean>(false);

onMounted(() => {
  echoChannel();
});

const echoChannel = () => {
  window.Echo.channel(`${props.channel}`)
    .listen('ProgressCircular', (event: any) => {
      progressValue.value = event.progress;
      showSnackbar.value = true;

      if (event.progress === 100) {
        setTimeout(() => {
          progressValue.value = 0;
          showSnackbar.value = false;
        }, 1000);
      }
    });
};

const color = computed(() => {
  if (progressValue.value < 30) return 'error';
  if (progressValue.value < 70) return 'warning';
  return 'success';
});

const sizeText = computed(() => useAttrs().sizeText as string | undefined);
</script>

<template>
  <div>
    <!-- Circular Progress -->
    <div v-if="type === 'circle'" class="progress-circle">
      <VTooltip location="top" v-if="progressValue > 0">
        <template #activator="{ props }">
          <VProgressCircular
            :rotate="360"
            :size="60"
            :width="4"
            v-bind="{ ...props, ...$attrs }"
            :model-value="progressValue"
            :color="color"
            class="progress-animation"
          >
            {{ progressValue }}%
          </VProgressCircular>
        </template>
        <span>{{ props.tooltipText }}</span>
      </VTooltip>
    </div>

    <!-- Progress Bar with Snackbar -->
    <div v-else>
      <VSnackbar
        v-model="showSnackbar"
        :timeout="-1"
        location="top"
        class="progress-snackbar"
      >
        <VCard class="pa-4">
          <div class="d-flex align-center mb-2">
            <span class="text-subtitle-1 mr-2">{{ props.tooltipText }}</span>
            <span class="text-body-2">{{ progressValue }}%</span>
          </div>
          <VProgressLinear
            :model-value="progressValue"
            :color="color"
            height="8"
            rounded
            class="progress-animation"
          />
        </VCard>
      </VSnackbar>
    </div>
  </div>
</template>

<style scoped>
.progress-animation {
  transition: all 0.3s ease;
}

.progress-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  min-block-size: 80px;
}

.progress-snackbar {
  margin-block: 0;
  margin-inline: auto;
  max-inline-size: 400px;
}
</style>
