<script setup lang="ts">
import { useToast } from '@/composables/useToast';
import IErrorsBack from "@/interfaces/Axios/IErrorsBack";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import type { VForm } from "vuetify/components/VForm";

const { toast } = useToast()
const authenticationStore = useAuthenticationStore();
const { company } = storeToRefs(authenticationStore)

const props = defineProps({
  servicesIds: {
    type: Array,
    required: true,
  }
})

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

const openModal = async (id: string | null = null, disabled: boolean = false) => {
  disabledFiledsView.value = disabled

  handleDialogVisible();
  addDataArray();

  await fetchDataForm();
};

const fetchDataForm = async () => {

  const url = form.value.id ? `/glosa/${form.value.id}/edit` : `/glosa/create`

  isLoading.value = true
  const { data, response } = await useAxios(url).get();

  if (response.value?.ok && data.value) {
    if (data.value.form) {
      form.value = cloneObject(data.value.form)
    }
  }
  isLoading.value = false
}


const submitForm = async (isCreateAndNew: boolean = false) => {
  const validation = await refForm.value?.validate()
  if (validation?.valid) {
    form.value.servicesIds = props.servicesIds;
    form.value.glosas.forEach(element => {
      element.code_glosa_id = element.codeGlosa.value;
      element.user_id = authenticationStore.user.id;
    });

    const url = `/glosa/store`

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

const elementId = computed(() => {
  const attrs = useAttrs();
  const _elementIdToken = attrs.id || attrs.label;
  return _elementIdToken
    ? `app-selectInifinite-field-${_elementIdToken}-${Math.random()
      .toString(36)
      .slice(2, 7)}`
    : undefined;
});

const addDataArray = async () => {
  form.value.glosas.push({
    codeGlosa: null,
    partialValue: null,
    observation: null,
    typeGlosa: null,
  })
}

const deleteDataArray = (index: number) => {
  form.value.glosas.splice(index, 1);
}
const shouldShowDeleteButton = () => {
  const visibleItems = form.value.glosas;
  return visibleItems.length > 1; // Mostrar el botón si hay más de un elemento visible
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
          <VForm ref="refForm" @submit.prevent="() => { }" v-if="!isLoading">
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
                    clearable v-bind="{
                      ...$attrs,
                      id: elementId,
                    }">
                  </AppSelectRemote>
                </VCol>

                <VCol cols="12" md="4">
                  <span>Valor a glosar</span>
                </VCol>

                <VCol cols="12" md="8">
                  <VRadioGroup v-model="item.typeGlosa" inline>
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
                  <VTextField label="Valor glosa" v-model="item.partialValue" outlined></VTextField>
                </VCol>

                <VCol cols="12" md="4">
                  <span>Observación</span>
                </VCol>

                <VCol cols="12" md="8">
                  <VTextarea v-model="item.observation" outlined></VTextarea>
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
