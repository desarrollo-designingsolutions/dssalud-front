<script setup lang="ts">
import ModalUploadXlsx from '@/pages/ModalUploadXlsx.vue';
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";

const authenticationStore = useAuthenticationStore();
const globalLoading = useGlobalLoading();
//ModalUploadXlsx
const refModalUploadXlsx = ref()
const openModalUploadXlsx = () => {
  refModalUploadXlsx.value.openModal()
}

const form = ref({
  logo: null as string | null | File,
})


const logo = ref(useFileUpload())
logo.value.allowedExtensions = ["xlsx"];
watch(logo.value, (newVal, oldVal) => {
  if (newVal.imageFile) form.value.logo = newVal.imageFile
})

const changeFile = (event: Event, logo: any) => {
  // Definir un tipo para la respuesta
  const response = logo.handleImageSelected(event);
}


const submitForm = async () => {
  let formData = new FormData();
  formData.append("file", form.value.logo);
  formData.append("company_id", String(authenticationStore.company.id));

  const { response, data } = await useAxios(`/conciliation/uploadFile`).post(formData);

  if (response.status == 200 && data) {

    if (data.status === 'success') {
      const success = globalLoading.startLoading(data.batch_id);
    }
  }
};

</script>

<template>
  <div>
    <VBtn @click="openModalUploadXlsx()">prueba</VBtn>
    <VBtn @click="submitForm()">subir</VBtn>
    <VFileInput @change="changeFile($event, logo)">
    </VFileInput>
    <ModalUploadXlsx ref="refModalUploadXlsx" />
  </div>
</template>
