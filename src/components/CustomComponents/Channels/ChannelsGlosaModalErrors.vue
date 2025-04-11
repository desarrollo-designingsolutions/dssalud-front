<script setup lang="ts">
import ModalErrorsGlosas from "@/pages/InvoiceAudit/Components/ModalErrorsGlosas.vue";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
const authenticationStore = useAuthenticationStore();

//ModalErrorsGlosas
const refModalErrorsGlosas = ref()
const openModalErrorsGlosas = (data: any) => {
  refModalErrorsGlosas.value.openModal(data, authenticationStore.user.id)
}

const channels = reactive({
  glosaModalErrors: `glosaModalErrors.${authenticationStore.user.id}`,
})

// Función para iniciar y manejar el canal dinámicamente
const startEchoChannel = () => {
  const channelGlosaModalErrors = window.Echo.channel(channels.glosaModalErrors);
  channelGlosaModalErrors.listen('ModalError', (event: any) => {
    if (event.errors.length > 0) {
      openModalErrorsGlosas(event.errors);
    }
  });
};

onMounted(() => {
  startEchoChannel()
})


</script>

<template>
  <div>
    <ModalErrorsGlosas ref="refModalErrorsGlosas" />

  </div>
</template>
