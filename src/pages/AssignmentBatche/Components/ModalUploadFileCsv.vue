<script setup lang="ts">
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";

const authenticationStore = useAuthenticationStore();
const emit = defineEmits(["reloadTable"]);

const { toast } = useToast();

// Referencias
const refModalQuestion = ref()
const refLoading = ref()

const titleModal = ref<string>("Cargar archivo Csv")
const isDialogVisible = ref<boolean>(false)
const disabledFiledsView = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const progress = ref(0)

const handleDialogVisible = () => {
  isDialogVisible.value = !isDialogVisible.value;
};

const openModal = async () => {
  handleDialogVisible();
  resetValues();
  progress.value = 0;
};

const submitForm = async () => {
  if (fileData.value.length > 0) {
    let formData = new FormData();
    if (fileData.value[0]) {
      formData.append("archiveCsv", fileData.value[0].file);
    }
    formData.append("company_id", String(authenticationStore.company.id));
    formData.append("user_id", String(authenticationStore.user.id));

    isLoading.value = true;
    const { response, data } = await useApi(`/assignment/uploadCsv`).post(formData);
    isLoading.value = false;

    if (response.value?.ok && data.value) {

      progress.value = 0;
      refLoading.value.startLoading();
      startEchoChannel(data.value); // Inicia el canal aquí
    }
  } else {
    if (refModalQuestion.value) {
      refModalQuestion.value.componentData.isDialogVisible = true;
      refModalQuestion.value.componentData.showBtnCancel = false;
      refModalQuestion.value.componentData.btnSuccessText = 'Ok';
      refModalQuestion.value.componentData.title = 'Por favor, seleccione un archivo antes de continuar.';
    }
  }
};

defineExpose({
  openModal,
  disabledFiledsView,
});

// DropZone
const { dropZoneRef, fileData, open, error, resetValues } = useFileDrop(1, ['csv']);

watch(error, (newError) => {
  if (newError && refModalQuestion.value) {
    refModalQuestion.value.componentData.isDialogVisible = true;
    refModalQuestion.value.componentData.showBtnCancel = false;
    refModalQuestion.value.componentData.btnSuccessText = 'Ok';
    refModalQuestion.value.componentData.title = newError;
  }
});

// Función para iniciar y manejar el canal dinámicamente
const startEchoChannel = (data: any) => {
  const channel = window.Echo.channel(`assignment.${authenticationStore.user.id}`);
  channel.listen('ProgressCircular', (event: any) => {

    progress.value = Number(event.progress);
    setTimeout(() => {
      if (progress.value == 100) {
        refLoading.value.stopLoading();
        handleDialogVisible();
        toast('Cargado Exitosamente', '', "success");
      }
    }, 1000);
  });
};

const openFileDialog = () => {
  error.value = null;
  open();
};
</script>

<template>
  <div>
    <Loading ref="refLoading" :progress="progress" :is-loading="isLoading" />
    <VDialog v-model="isDialogVisible" :overlay="false" max-width="30rem" transition="dialog-transition" persistent>
      <DialogCloseBtn @click="handleDialogVisible" />
      <VCard :loading="isLoading" :disabled="isLoading" class="w-100">
        <VToolbar color="primary">
          <VToolbarTitle>{{ titleModal }}</VToolbarTitle>
        </VToolbar>
        <VCardText>
          <!-- DropZone y resto del contenido -->
          <div class="flex">
            <div class="w-full h-auto relative">
              <div ref="dropZoneRef" class="cursor-pointer" @click="openFileDialog">
                <div v-if="fileData.length === 0"
                  class="d-flex flex-column justify-center align-center gap-y-3 px-6 py-10 border-dashed drop-zone">
                  <IconBtn variant="tonal" class="rounded-sm">
                    <VIcon icon="tabler-upload" />
                  </IconBtn>
                  <div class="text-base text-high-emphasis font-weight-medium">
                    Arrastra y suelta tu archivo aquí.
                  </div>
                  <span class="text-disabled">o</span>
                  <VBtn variant="tonal">Explorar archivos</VBtn>
                </div>
                <div v-else class="d-flex justify-center align-center gap-3 pa-8 border-dashed drop-zone flex-wrap">
                  <VRow class="match-height w-100">
                    <template v-for="(item, index) in fileData" :key="index">
                      <VCol cols="12">
                        <VCard :ripple="false" border class="d-flex flex-column">
                          <VCardText @click.stop>
                            <VImg :src="item.url" />
                            <div class="mt-2">
                              <span class="clamp-text text-wrap">{{ item.file.name }}</span>
                              <span>{{ item.file.size / 1000 }} KB</span>
                            </div>
                            <!-- Estado del archivo -->
                          </VCardText>
                          <VSpacer />
                          <VCardActions>
                            <VBtn variant="outlined" @click.stop="fileData.splice(index, 1)">
                              <VIcon icon="tabler-trash" />
                            </VBtn>
                          </VCardActions>
                        </VCard>
                      </VCol>
                    </template>
                  </VRow>
                </div>
              </div>
            </div>
          </div>
        </VCardText>
        <VCardText class="d-flex justify-end gap-3 flex-wrap">
          <VBtn :loading="isLoading" color="secondary" variant="tonal" @click="handleDialogVisible()">Cancelar</VBtn>
          <VBtn :disabled="isLoading" :loading="isLoading" @click="submitForm()" color="primary">Continuar</VBtn>
        </VCardText>
      </VCard>
    </VDialog>

    <ModalQuestion ref="refModalQuestion" />
  </div>
</template>
