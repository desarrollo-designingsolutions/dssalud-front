<script setup lang="ts">

interface CountData {
  icon: string;
  color: string;
  title: string;
  value: string | number;
  isHover: boolean;
  progress: string | number,
  // to: any;
}

const countData = ref<CountData[]>([
  {
    "icon": 'tabler-user-shield',
    "color": 'primary',
    "title": 'Cantidad de Prestadores',
    "value": 10,
    "isHover": false,
    "progress": '10',
    // "to": { name: "User-List" },
  },
  {
    "icon": 'tabler-password-user',
    "color": 'info',
    "title": 'Facturas Pendientes',
    "value": 30,
    "isHover": false,
    "progress": '90',
    // "to": { name: "Project-List" },
  },
  {
    "icon": 'tabler-checklist',
    "color": 'primary',
    "title": 'Facturas Finalizadas',
    "value": 80,
    "isHover": false,
    "progress": '0',
    // "to": { name: "Task-List" },
  },
  {
    "icon": 'tabler-users',
    "color": 'success',
    "title": 'Total Facturas',
    "value": 110,
    "isHover": false,
    "progress": '90',
    // "to": { name: "Client-List" },
  },
  {
    "icon": 'tabler-users',
    "color": 'warning',
    "title": 'Porcentaje de Avance',
    "value": 40,
    "isHover": false,
    "progress": '40',
    // "to": { name: "Client-List" },
  },
]);

const loading = ref<boolean>(false)

onMounted(async () => {
  // loading.value = true;
  // const { data, response } = await useApi(`/talentHumanCount`).get();
  // loading.value = false;

  // if (response.value?.ok && data.value) {
  //   countData.value[0].value = data.value.data.absenteeismPercentage+' %'
  //   countData.value[0].progress = data.value.data.absenteeismPercentage

  //   countData.value[1].value = data.value.data.actives_count
  //   countData.value[1].progress = data.value.data.actives_percentage

  //   countData.value[2].value = data.value.data.disabled_employees_count
  //   countData.value[2].progress = data.value.data.disabled_employees_percentage
  // }
});




</script>

<template>
  <div class="my-4">
    <VRow no-gutters class="d-flex justify-space-between" style="gap: 16px;">
      <VCol v-for="report in countData" :key="report.title" style="flex: 1; min-inline-size: 0;">
        <VSkeletonLoader v-if="loading" type="image, list-item-two-line" :loading="loading">
        </VSkeletonLoader>
        <VCard v-else
          :style="report.isHover ? `border-block-end-color: rgb(var(--v-theme-${report.color}))` : `border-block-end-color: rgba(var(--v-theme-${report.color}),0.38)`"
          @mouseenter="report.isHover = true" @mouseleave="report.isHover = false">
          <VCardText>
            <div class="d-flex align-center">
              <VAvatar rounded size="26" :color="report.color" variant="tonal" class="me-2">
                <VIcon size="18" :icon="report.icon" />
              </VAvatar>
              <h6 class="text-base font-weight-medium">
                {{ report.title }}
              </h6>
            </div>
            <h4 class="text-h4 my-3">
              {{ report.value }}
            </h4>
            <VProgressLinear :model-value="report.progress" :color="report.color" height="4" rounded rounded-bar />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
