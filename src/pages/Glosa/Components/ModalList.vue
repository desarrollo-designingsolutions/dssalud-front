<script setup lang="ts">
import ListGlosa from "@/pages/Glosa/Components/List.vue";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";

const authenticationStore = useAuthenticationStore();

const emit = defineEmits(["execute"])

const titleModal = ref<string>("Listado de Glosas")
const isDialogVisible = ref<boolean>(false)
const disabledFiledsView = ref<boolean>(false)

const isLoading = ref<boolean>(false)

const form = ref({
  id: null as string | null,
  total_value_origin: null as string | null,
})

const handleClearForm = () => {
  for (const key in form.value) {
    form.value[key] = null;
  }
}

const handleDialogVisible = () => {
  isDialogVisible.value = !isDialogVisible.value;
  handleClearForm()
};

const openModal = async ({ id, description, total_value_origin }: any, disabled: boolean = false) => {
  disabledFiledsView.value = disabled

  handleDialogVisible();

  form.value.id = id;
  form.value.total_value_origin = total_value_origin;
  titleModal.value = "Listado de Glosas: " + description;
};

defineExpose({
  openModal
})

</script>

<template>
  <div>
    <VDialog v-model="isDialogVisible" max-width="70rem" transition="dialog-transition" persistent>
      <DialogCloseBtn @click="handleDialogVisible" />
      <VCard :loading="isLoading" :disabled="isLoading" class="w-100">
        <!-- Toolbar -->

        <div>
          <VToolbar color="primary">
            <VToolbarTitle>{{ titleModal }}</VToolbarTitle>
          </VToolbar>
        </div>

        <VCardText class="px-0">
          <ListGlosa :service_id="form.id" :total_value="form.total_value_origin"></ListGlosa>
        </VCardText>
      </VCard>
    </VDialog>

  </div>
</template>
