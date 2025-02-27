<script setup lang="ts">
import ModalUploadFileJson from "@/pages/Filing/New/Components/ModalUploadFileJson.vue";
import ModalUploadFileZip from "@/pages/Filing/New/Components/ModalUploadFileZip.vue";

definePage({
  name: "Filing-New-Index",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "filing.new.index",
  },
});

//ModalUploadFileZip
const refModalUploadFileZip = ref()
const openModalUploadFileZip = () => {
  refModalUploadFileZip.value.openModal()
}


//ModalUploadFileJson
const refModalUploadFileJson = ref()

const openModalUploadFileJson = () => {
  refModalUploadFileJson.value.openModal()
}
</script>

<template>
  <div>

    <VCard>
      <VCardTitle class="d-flex justify-center">
        <h2>
          Nueva Radicación
        </h2>
      </VCardTitle>

      <VCardText class="d-flex justify-space-around">
        <VBtn size="x-large" @click="openModalUploadFileZip()">Radicación antigua</VBtn>
        <VBtn size="x-large" @click="openModalUploadFileJson()">Radicación 2275</VBtn>
      </VCardText>
    </VCard>

    <ModalUploadFileZip ref="refModalUploadFileZip" />

    <ModalUploadFileJson ref="refModalUploadFileJson" />


  </div>
</template>
