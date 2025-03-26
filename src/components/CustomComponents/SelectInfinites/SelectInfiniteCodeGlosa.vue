<script setup lang="ts">
// import ThirdForm from "@/pages/Third/Form.vue";

import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
const authenticationStore = useAuthenticationStore();

const props = defineProps({
  showBtnCreate: {
    type: Boolean,
    default: true,
    required: false,
  },
  url: {
    type: String,
    required: true
  },
  arrayInfo: {
    type: String,
    required: true,
  }
})

const emit = defineEmits(["execute", "update:modelValue"])

const elementId = computed(() => {
  const attrs = useAttrs();
  const _elementIdToken = attrs.id || attrs.label;
  return _elementIdToken
    ? `app-selectInifinite-field-${_elementIdToken}-${Math.random()
      .toString(36)
      .slice(2, 7)}`
    : undefined;
});

const isDialogVisible = ref<boolean>(false)
const handleDialogVisible = () => {
  isDialogVisible.value = !isDialogVisible.value;
};

const openDialog = async () => {
  handleDialogVisible();
};
defineExpose({
})

const isLoading = ref<boolean>(false)
const valueSelectInfinite = ref()

//SELECT INFINITE
onMounted(() => {
  valueSelectInfinite.value = useAttrs().modelValue
  emit("update:modelValue", useAttrs().modelValue);
})

const getDataSaved = (data: any) => {
  if (isObject(data)) {
    const title = `${data.name}`
    valueSelectInfinite.value = {
      value: data.id,
      title: title,
    }
    emit("update:modelValue", valueSelectInfinite.value);
  }

  handleDialogVisible()

}

</script>

<template>
  <div>

    <AppSelectRemote v-model="valueSelectInfinite" :url="props.url" :array-info="props.arrayInfo" clearable v-bind="{
      ...$attrs,
      id: elementId,
    }">
      <!-- <template #append  >
  <VBtn v-if="props.showBtnCreate" icon color="success" @click="openDialog()">
    <VIcon icon="tabler-plus" />
  </VBtn>
</template> -->
    </AppSelectRemote>

    <!-- <VDialog v-model="isDialogVisible" :overlay="false" max-width="1400px" transition="dialog-transition" persistent>
      <DialogCloseBtn @click="handleDialogVisible" />
      <VCard :title="title" :loading="isLoading" :disabled="isLoading">
        <VCardText>
          <ThirdForm @closeModal="getDataSaved" :btnBack="false" :saveAndCloseModal="true" :btnCancel="true" />
        </VCardText>
      </VCard>
    </VDialog> -->

  </div>
</template>
