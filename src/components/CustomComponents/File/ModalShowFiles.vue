<script setup lang="ts">
const emits = defineEmits(["execute"]);

const titleModal = ref<string>("Visualizar soportes");
const isDialogVisible = ref<boolean>(false);
const isLoading = ref<boolean>(false);

const form = ref({
  fileable_id: null as string | null,
  fileable_type: null as string | null,
})

const handleClearForm = () => {
  for (const key in form.value) {
    form.value[key] = null
  }
}

const handleDialogVisible = () => {
  isDialogVisible.value = !isDialogVisible.value;
};

const openModal = async (fileable_id: string, fileable_type: string) => {
  handleClearForm();
  handleDialogVisible();

  form.value.fileable_id = fileable_id
  form.value.fileable_type = fileable_type

  // Update optionsTable after form is filled
  updateTableParams();
};

defineExpose({
  openModal,
});

//TABLE
const tableFull = ref()
const tableFullKey = ref<number>(0)

const optionsTable = {
  url: "file/listTableV2",
  params: {},
  headers: [
    { key: 'filename', title: 'Nombre' },
    { key: 'support_type_name', title: 'Tipo de soporte' },
    { key: "created_at", title: 'Fecha' },
    { key: 'actions', title: 'Acciones' },
  ],
  actions: {
    view: {
      show: false
    },
    edit: {
      show: false
    },
    delete: {
      url: "/file/delete"
    },
  }
}

const updateTableParams = () => {
  optionsTable.params = {
    fileable_type: form.value.fileable_type,
    fileable_id: form.value.fileable_id,
  };
};

//FILTER
const filterTable = ref()
const optionsFilter = ref({
  inputGeneral: {
    relationsGeneral: {
      all: ['filename', 'created_at|custom'],
      supportType: ['name'],
    },
  },
})

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


        <VCardText class="mt-2">
          <TableFull ref="tableFull" :optionsTable="optionsTable" :optionsFilter="optionsFilter" :key="tableFullKey">
            <template #item.actions2="{ item }">
              <VListItem @click="viewFile(item.pathname)">
                <template #prepend>
                  <VIcon icon="tabler-eye" />
                </template>
                <span>Ver soporte</span>
              </VListItem>
            </template>
          </TableFull>
        </VCardText>

      </VCard>
    </VDialog>
  </div>
</template>
