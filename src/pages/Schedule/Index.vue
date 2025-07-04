<script setup lang="ts">
import Schedule from "@/pages/Schedule/Components/Schedule.vue";

definePage({
  path: "Schedule/Index",
  name: "Schedule-Index",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "schedule.menu",
  },
});

</script>

<template>
  <div>
    <VCard class="mt-3">
      <VCardText>
        <Schedule />
      </VCardText>
    </VCard>
  </div>
</template>
