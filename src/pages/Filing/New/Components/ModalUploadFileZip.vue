<script setup lang="ts">
import ModalContract from "@/pages/Filing/New/Components/ModalContract.vue";
import ModalErrors from "@/pages/Filing/New/Components/ModalErrors.vue";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";

const authenticationStore = useAuthenticationStore();

const emits = defineEmits(["execute"]);

const titleModal = ref<string>("Cargar archivo Zip")
const isDialogVisible = ref<boolean>(false)
const disabledFiledsView = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const progress = ref(0);
const filingData = ref<{ id: string | null }>({ id: null })

const handleDialogVisible = () => {
  isDialogVisible.value = !isDialogVisible.value;
};

const openModal = async () => {
  handleDialogVisible();

};

const submitForm = async () => {

  if (fileData.value.length > 0) {
    let formData = new FormData();

    // Asegúrate de que hay al menos un archivo en fileData antes de proceder
    if (fileData.value[0]) {
      formData.append("archiveZip", fileData.value[0].file);
    }
    formData.append("company_id", String(authenticationStore.company.id));
    formData.append("user_id", String(authenticationStore.user.id));

    isLoading.value = true;
    const { response, data } = await useApi(`/filing/uploadZip`).post(formData);
    isLoading.value = false;

    if (response.value?.ok && data.value) {
      progress.value = 0
      filingData.value = data.value
      emits("execute");
      // handleDialogVisible(); // Cierra el modal después de una subida exitosa

      refLoading.value.startLoading()

      echoChannel(data.value)

    }

  } else {
    refModalQuestion.value.componentData.isDialogVisible = true
    refModalQuestion.value.componentData.showBtnCancel = false
    refModalQuestion.value.componentData.btnSuccessText = 'Ok'
    refModalQuestion.value.componentData.title = 'Por favor, seleccione un archivo antes de continuar.'
  }
};

defineExpose({
  openModal,
  disabledFiledsView,
})

//ModalQuestion
const refModalQuestion = ref()

//dropZoneRef
const { dropZoneRef, fileData, open, error } = useFileDrop(1, ['zip']);

// Manejar errores
watch(error, (newError) => {
  if (newError) {
    refModalQuestion.value.componentData.isDialogVisible = true
    refModalQuestion.value.componentData.showBtnCancel = false
    refModalQuestion.value.componentData.btnSuccessText = 'Ok'
    refModalQuestion.value.componentData.title = newError

    error.value = null
  }
});

const refLoading = ref()

//ModalErrors
const refModalErrors = ref()
const openModalErrors = (item: any) => {
  refModalErrors.value.openModal(item)
}


const echoChannel = (data: any) => {
  window.Echo.channel(`filing.${data.id}`)
    .listen('.FilingFinishProcessJob', (event: any) => {

      setTimeout(() => {
        refLoading.value.stopLoading()
      }, 1000);

      if (event.status == "ERROR_TXT") {
        openModalErrors(event)
      }
      if (event.status == "PROCESSED") {
        refModalQuestion.value.componentData.isDialogVisible = true
        refModalQuestion.value.componentData.title = "¿Deseas radicar los archivos?"
        refModalQuestion.value.componentData.subTitle = "Todo ha finalizado sin novedad..."
      }
    })
    .listen('.FilingProgressEvent', (event: any) => {
      progress.value = event.progress; // Actualiza el estado de progreso       
    });
}

const deleteFiling = async () => {
  handleDialogVisible();

  isLoading.value = true;
  const { response, data } = await useApi(`/filing/delete/${filingData.value.id}`).delete();
  isLoading.value = false;

  if (response.value?.ok && data.value) {
  }
}


//ModalContract
const refModalContract = ref()
const openModalContract = () => {
  refModalContract.value.openModal(filingData.value.id)
  handleDialogVisible();

} 
</script>

<template>
  <div>
    <Loading ref="refLoading" :progress="progress" :is-loading="isLoading" />

    <VDialog v-model="isDialogVisible" :overlay="false" max-width="30rem" transition="dialog-transition" persistent>
      <DialogCloseBtn @click="handleDialogVisible" />
      <VCard :loading="isLoading" :disabled="isLoading" class="w-100">
        <!-- Toolbar -->
        <div>
          <VToolbar color="primary">
            <VToolbarTitle>{{ titleModal }}</VToolbarTitle>
          </VToolbar>
        </div>

        <VCardText>
          <div class="flex">
            <div class="w-full h-auto relative">
              <div ref="dropZoneRef" class="cursor-pointer" @click="() => open()">
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
                              <span class="clamp-text text-wrap">
                                {{ item.file.name }}
                              </span>
                              <span>
                                {{ item.file.size / 1000 }} KB
                              </span>
                            </div>

                            <div v-if="item.status === 'uploading'" class="mt-2">
                              <VProgressCircular :size="24" :value="item.progress" color="primary" />
                              <span>Cargando...</span>
                            </div>
                            <div v-if="item.status === 'completed'" class="mt-2 text-success">
                              <span>¡Archivo cargado exitosamente!</span>
                            </div>
                            <div v-if="item.status === 'failed'" class="mt-2 text-danger">
                              <span>Error al cargar el archivo</span>
                            </div>

                          </VCardText>
                          <VSpacer />
                          <VCardActions>
                            <VBtn variant="outlined" block @click.stop="fileData.splice(index, 1)">
                              Eliminar archivo
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
          <VBtn :loading="isLoading" color="secondary" variant="tonal" @click="handleDialogVisible()">
            Cancelar
          </VBtn>
          <VBtn :disabled="isLoading" :loading="isLoading" @click="submitForm()" color="primary">
            Continuar
          </VBtn>
        </VCardText>

      </VCard>
    </VDialog>

    <ModalQuestion ref="refModalQuestion" @cancel="deleteFiling" @success="openModalContract" />

    <ModalErrors ref="refModalErrors" @cancel="deleteFiling" @continue="openModalContract" />

    <ModalContract ref="refModalContract" />

  </div>
</template>
