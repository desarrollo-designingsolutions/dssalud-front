<script setup lang="ts">

import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
const authenticationStore = useAuthenticationStore();

const emits = defineEmits(["execute"]);

const titleModal = ref<string>("Visualizar soportes");
const isDialogVisible = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const files = ref<Array<object>>([]);

const form = ref({
  fileable_id: null as string | null,
  fileable_type: null as string | null,
})

const handleClearForm = () => {
  for (const key in form.value) {
    form.value[key] = null
  }

  files.value = []
}

const handleDialogVisible = () => {
  isDialogVisible.value = !isDialogVisible.value;
};

const openModal = async (fileable_id: string, fileable_type: string) => {
  handleClearForm();
  handleDialogVisible();

  form.value.fileable_id = fileable_id
  form.value.fileable_type = fileable_type

  getFiles()

};


const getFiles = async () => {
  isLoading.value = true;
  const { data, response } = await useApi<any>(
    createUrl(`/file/listExpansionPanel`, {
      query: {
        fileable_type: form.value.fileable_type,
        fileable_id: form.value.fileable_id
      },
    })
  );

  isLoading.value = false;

  if (response.value?.ok) {
    files.value = data.value.files;
  }
};

defineExpose({
  openModal,
});


const viewFile = (pathname: any) => {
  window.open(
    `${import.meta.env.VITE_API_BASE_BACK}/storage/${pathname}`,
    "_blank"
  );
};
</script>

<template>
  <div>

    <VDialog v-model="isDialogVisible" :overlay="false" max-width="90rem" transition="dialog-transition" persistent>
      <DialogCloseBtn @click="handleDialogVisible" />
      <VCard :loading="isLoading" class="w-100">
        <div>
          <VToolbar color="primary">
            <VToolbarTitle>{{ titleModal }}</VToolbarTitle>
          </VToolbar>
        </div>


        <VCardText>

          <VExpansionPanels multiple>
            <VExpansionPanel v-for="(file, index) in files" :key="index">
              <VExpansionPanelTitle>
                {{ file.support_type.name }}
              </VExpansionPanelTitle>
              <VExpansionPanelText>

                <VRow>
                  <VCol cols="12" md="4" v-for="(item, index2) in file.items" :key="index2">
                    <VCard>
                      <VCardText>
                        <VRow>
                          <VCol cols="12" md="6">
                            <h4>
                              <a href="#" @click="viewFile(item.pathname)">
                                <!-- <a href="#" @click="downloadFileV2(item.pathname, item.filename)"> -->
                                <u>
                                  {{ item.filename }}
                                </u>
                              </a>
                            </h4>
                            <h5>
                              {{ item.type_file }}
                            </h5>
                          </VCol>
                        </VRow>
                      </VCardText>
                      <VCardText>
                        <VRow cols="12" md="6">
                          <VCol> <b>Fecha de creación:</b> {{ item.created_at }} </VCol>
                        </VRow>
                      </VCardText>
                    </VCard>
                  </VCol>
                </VRow>
              </VExpansionPanelText>
            </VExpansionPanel>
          </VExpansionPanels>


        </VCardText>

      </VCard>
    </VDialog>

    <ModalQuestion ref="refModalQuestion" />
  </div>
</template>
