<script setup lang="ts">
import AppTextField from '@/@core/components/app-form-elements/AppTextField.vue';
import { useToast } from '@/composables/useToast';
import IErrorsBack from "@/interfaces/Axios/IErrorsBack";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import type { VForm } from "vuetify/components/VForm";

const { toast } = useToast()
const authenticationStore = useAuthenticationStore();
const { company } = storeToRefs(authenticationStore)

const errorsBack = ref<IErrorsBack>({});
const refForm = ref<VForm>();
const emit = defineEmits(["execute"])

const titleModal = ref<string>("Glosas Masivas")
const isDialogVisible = ref<boolean>(false)
const disabledFiledsView = ref<boolean>(false)

const isLoading = ref<boolean>(false)

const form = ref({
  glosas: [] as Array<{
    codeGlosa: string | null,
    partialValue: string | null,
    observation: string | null,
    typeGlosa: string | null,
    user_id: string | number | null,
    service_id: string | number | null,
  }>,
  servicesIds: null as Array<string> | null
})

const typesValueGlosa = ref([
  'total',
  'parcial',
])

const handleClearForm = () => {
  form.value = {
    glosas: [],
  }
}

const handleDialogVisible = () => {
  isDialogVisible.value = !isDialogVisible.value;
  handleClearForm()
};

const openModal = async (servicesIds: Array<string> | null = null) => {


  handleDialogVisible();
  addDataArray();

  form.value.servicesIds = servicesIds;
};

const submitForm = async (isCreateAndNew: boolean = false) => {
  const validation = await refForm.value?.validate()
  if (validation?.valid) {
    form.value.glosas.forEach(element => {
      element.code_glosa_id = element.codeGlosa.value;
      element.user_id = authenticationStore.user.id;
    });

    const url = `/glosa/storeMasive`

    isLoading.value = true;
    const { data, response } = await useApi(url).post(form);

    if (response.value?.ok && data.value) {
      handleDialogVisible();
    }
    if (data.value.code === 422) errorsBack.value = data.value.errors ?? {};

    isLoading.value = false;
  }
  else {
    toast('Faltan Campos Por Diligenciar', '', 'danger')
  }
}

defineExpose({
  openModal
})

const addDataArray = async () => {
  form.value.glosas.push({
    codeGlosa: null,
    partialValue: '0',
    observation: null,
    typeGlosa: null,
    user_id: null,
    service_id: null,
  })
}

const deleteDataArray = (index: number) => {
  form.value.glosas.splice(index, 1);
}
const shouldShowDeleteButton = () => {
  const visibleItems = form.value.glosas;
  return visibleItems.length > 1; // Mostrar el botón si hay más de un elemento visible
}

const handleTypeGlosaChange = (item: any) => {
  if (item.typeGlosa == 'total') item.partialValue = '100'
}
</script>

<template>
  <div>
    <VDialog v-model="isDialogVisible" :overlay="false" max-width="50rem" transition="dialog-transition" persistent>
      <DialogCloseBtn @click="handleDialogVisible" />
      <VCard :loading="isLoading" :disabled="isLoading" class="w-100">
        <!-- Toolbar -->

        <div>
          <VToolbar color="primary">
            <VToolbarTitle>{{ titleModal }}</VToolbarTitle>
          </VToolbar>
        </div>

        <VCardText>
          <VForm ref="refForm" @submit.prevent="() => { }">
            <VRow>
              <VCol cols="12">
                <VBtn class="ml-3" icon color="success" @click="addDataArray()">
                  <VIcon icon="tabler-plus" />
                </VBtn>
              </VCol>
              <template v-for="(item, index) in form.glosas" :key="index">
                <VCol cols="12" md="4">
                  <span>Glosa</span>
                </VCol>
                <VCol cols="12" md="8">
                  <AppSelectRemote v-model="item.codeGlosa" url="/selectInfiniteCodeGlosa" array-info="codeGlosa"
                    clearable>
                  </AppSelectRemote>
                </VCol>

                <VCol cols="12" md="4">
                  <span>Valor a glosar</span>
                </VCol>

                <VCol cols="12" md="8">
                  <VRadioGroup v-model="item.typeGlosa" @change="handleTypeGlosaChange(item)" inline>
                    <div>
                      <VRadio v-for="radio in typesValueGlosa" :key="radio" :label="radio"
                        :value="radio.toLocaleLowerCase()" />
                    </div>
                  </VRadioGroup>
                </VCol>

                <VCol cols="12" md="4">
                  <span>Valor glosa</span>
                </VCol>

                <VCol cols="12" md="8">
                  <AppTextField :disabled="item.typeGlosa == 'total'" clearable v-model="item.partialValue" outlined>
                  </AppTextField>
                </VCol>

                <VCol cols="12" md="4">
                  <span>Observación</span>
                </VCol>

                <VCol cols="12" md="8">
                  <VTextarea clearable v-model="item.observation" outlined></VTextarea>
                </VCol>

                <VCol cols="12" sm="2">
                  <VBtn icon v-if="shouldShowDeleteButton() && !disabledFiledsView && item.task_count == 0" size="30"
                    class="mt-7" color="error" @click="deleteDataArray(index)">
                    <VIcon icon="tabler-trash"></VIcon>
                  </VBtn>
                </VCol>
                <VDivider />
              </template>

            </VRow>
          </VForm>
        </VCardText>

        <VCardText class="d-flex justify-end gap-3 flex-wrap mt-5">
          <VBtn color="secondary" :disabled="isLoading" :loading="isLoading" @click="handleDialogVisible">Cancelar
          </VBtn>
          <VBtn :disabled="isLoading" :loading="isLoading" @click="submitForm()" color="primary">
            Guardar
          </VBtn>
        </VCardText>


      </VCard>
    </VDialog>

  </div>
</template>
