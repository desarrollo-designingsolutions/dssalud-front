<script setup lang="ts">
import IErrorsBack from "@/interfaces/Axios/IErrorsBack";
import IImageSelected from "@/interfaces/FileUpload/IImageSelected";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import type { VForm } from "vuetify/components/VForm";
const authenticationStore = useAuthenticationStore();


const emits = defineEmits(["execute"]);

const errorsBack = ref<IErrorsBack>({});
const refForm = ref<VForm>();

const titleModal = ref<string>("Cargar archivo Zip")
const isDialogVisible = ref<boolean>(false)
const disabledFiledsView = ref<boolean>(false)
const isLoading = ref<boolean>(false)


const handleClearForm = () => {
  file.value.clearData()
}

const handleDialogVisible = () => {
  isDialogVisible.value = !isDialogVisible.value;
};

const openModal = async () => {
  handleClearForm()
  handleDialogVisible();

};

const submitForm = async () => {
  const validation = await refForm.value?.validate();

  if (validation?.valid) {

    let formData = new FormData()
    if (file.value.imageFile) {
      formData.append("archiveZip", file.value.imageFile);
    }
    formData.append("company_id", String(authenticationStore.company.id));
    formData.append("user_id", String(authenticationStore.user.id));

    isLoading.value = true
    const { response, data } = await useApi(`/rip/uploadZip`).post(formData);
    isLoading.value = false

    if (response.value?.ok && data.value) {
      emits("execute")
      handleDialogVisible()
    }
    if ((data.value as any).code == 422) {
      errorsBack.value = (data.value as any).errors ?? {}
    }
  }
}

defineExpose({
  openModal,
  disabledFiledsView,
})


//File file
const file = ref(useFileUpload())
file.value.allowedExtensions = ["zip"];

const changeFile = (event: Event, logo: any) => {
  const response: IImageSelected = logo.handleImageSelected(event);

  if (response.success == false && response.icon) {
    openModalQuestion(response)
  }
}

//ModalQuestion
const refModalQuestion = ref()

const openModalQuestion = (response: IImageSelected) => {
  refModalQuestion.value.componentData.isDialogVisible = true
  refModalQuestion.value.componentData.dialogMaxWidth = '20rem'
  refModalQuestion.value.componentData.showBtnCancel = false
  refModalQuestion.value.componentData.btnSuccessText = 'Ok'
  refModalQuestion.value.componentData.icon = response.icon
  refModalQuestion.value.componentData.title = response.title
  refModalQuestion.value.componentData.subTitle = response.text
}
</script>

<template>
  <div>
    <VDialog v-model="isDialogVisible" :overlay="false" max-width="30rem" transition="dialog-transition" persistent>
      <DialogCloseBtn @click="handleDialogVisible" />
      <VCard :loading="isLoading" :disabled="isLoading" class="w-100">
        <!-- Toolbar -->
        <div>
          <VToolbar color="primary">
            <VToolbarTitle>{{ titleModal }}</VToolbarTitle>
          </VToolbar>
        </div>

        <VCardText v-if="!disabledFiledsView">
          <VForm ref="refForm" @submit.prevent="() => { }">
            <VRow>
              <VCol cols="12">
                <AppFileInput clearable :loading="file.loading" label="Archivo Rips" @change="changeFile($event, file)"
                  :rules="[requiredValidator]" :key="file.key.toString()"></AppFileInput>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>

        <VCardText class="d-flex justify-end gap-3 flex-wrap">
          <VBtn :loading="isLoading" color="secondary" variant="tonal" @click="handleDialogVisible()">
            Cancelar
          </VBtn>
          <VBtn :disabled="isLoading" :loading="isLoading" @click="submitForm()" color="primary">
            Guardar
          </VBtn>
        </VCardText>

      </VCard>
    </VDialog>

    <ModalQuestion ref="refModalQuestion" />

  </div>
</template>
