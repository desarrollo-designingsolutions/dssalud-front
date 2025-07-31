<script setup lang="ts"> 
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
  formData.append("user_id", String(authenticationStore.user.id));

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
      <MultipleLoadingManager />

    <VBtn @click="openModalUploadXlsx()">prueba</VBtn>
    <VBtn @click="submitForm()">subir</VBtn>
    <VFileInput @change="changeFile($event, logo)">
    </VFileInput> 
  </div>
</template>
