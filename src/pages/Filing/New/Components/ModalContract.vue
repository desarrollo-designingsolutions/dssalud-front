<script setup lang="ts">
import IErrorsBack from "@/interfaces/Axios/IErrorsBack";
import { router } from "@/plugins/1.router";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import type { VForm } from "vuetify/components/VForm";

const errorsBack = ref<IErrorsBack>({});
const refForm = ref<VForm>();
const authenticationStore = useAuthenticationStore();

const emits = defineEmits(["execute"]);

const titleModal = ref<string>("Tipo de contrato")
const isDialogVisible = ref<boolean>(false)
const disabledFiledsView = ref<boolean>(false)
const isLoading = ref<boolean>(false)

const form = ref({
  filing_id: null as null | string,
  type: null as null | string,
  contract_id: null as null | string,
})

const handleClearForm = () => {
  for (const key in form.value) {
    form.value[key] = null
  }
}

const handleDialogVisible = () => {
  isDialogVisible.value = !isDialogVisible.value;
};

const openModal = async (id: string, type: string) => {
  handleClearForm()
  handleDialogVisible();

  form.value.filing_id = id
  form.value.type = type
};

const submitForm = async () => {
  const validation = await refForm.value?.validate();

  if (validation?.valid) {


    isLoading.value = true
    const { response, data } = await useApi(`/filing/updateContract`).post(form.value);
    isLoading.value = false

    if (response.value?.ok && data.value) {
      emits("execute")
      handleDialogVisible()
      router.push({ name: "Filing-New-List", params: { type: form.value.type, id: form.value.filing_id } })
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

</script>

<template>
  <div>
    <VDialog v-model="isDialogVisible" :overlay="false" max-width="30rem" transition="dialog-transition" persistent>
      <!-- <DialogCloseBtn @click="handleDialogVisible" /> -->
      <VCard :loading="isLoading" :disabled="isLoading" class="w-100">
        <!-- Toolbar -->
        <div>
          <VToolbar color="primary">
            <VToolbarTitle>{{ titleModal }}</VToolbarTitle>
          </VToolbar>
        </div>

        <VCardText>
          <VForm ref="refForm" @submit.prevent="() => { }">
            <AppSelectRemote label="Seleccionar contrato"   clearable url="/selectInfiniteContract" array-info="contract" v-model="form.contract_id"
               />
          </VForm>
        </VCardText>


        <VCardText class="d-flex justify-end gap-3 flex-wrap">
          <VBtn :disabled="isLoading" :loading="isLoading" @click="submitForm()" color="primary">
            Continuar
          </VBtn>
        </VCardText>

      </VCard>
    </VDialog>


  </div>
</template>
