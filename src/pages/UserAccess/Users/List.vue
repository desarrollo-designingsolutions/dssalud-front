<script setup lang="ts">
definePage({
  name: "User-List",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "menu.user",
  },
});

import ModalForm from '@/pages/UserAccess/Users/Components/ModalForm.vue';
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";

const authenticationStore = useAuthenticationStore();
const { company, user } = storeToRefs(authenticationStore);


//TABLE
const tableFull = ref()

const optionsTable = {
  url: "/user/paginate",
  paramsGlobal: {
    company_id: company.value.id
  },
  headers: [
    { key: 'full_name', title: 'Nombre Completo' },
    { key: 'email', title: 'Email' },
    { key: 'role_description', title: 'Rol' },
    { key: "is_active", title: 'Estado', },
    { key: 'actions', title: 'Acciones', sortable: false },
  ],
  actions: {
    changeStatus: {
      url: "/user/changeStatus"
    },
    view: {
      show: false,
    },
    delete: {
      show: false,
    },
  }
}

//FILTER
const optionsFilter = ref({
  dialog: {
    width: 500,
    inputs: [
      {
        type: "booleanActive",
        label: "Estado",
        name: "is_active",
      },
    ],
  },
  filterLabels: { inputGeneral: 'Buscar en todo' }
})


//ModalForm
const refModalForm = ref()

const openModalForm = () => {
  refModalForm.value.openModal()
}

const goViewEdit = async (data: any) => {
  refModalForm.value.openModal(data.id)
}

const reloadTable = () => {
  tableFull.value.fetchTableData()
}
</script>

<template>
  <div>

    <VCard>
      <VCardTitle class="d-flex justify-space-between">
        <span>
          Usuarios
        </span>

        <div class="d-flex justify-end gap-3 flex-wrap ">
          <VBtn @click="openModalForm">
            Agregar usuario
          </VBtn>
        </div>
      </VCardTitle>

      <VCardText>
        <FilterDialogNew :options-filter="optionsFilter">
        </FilterDialogNew>
      </VCardText>

      <VCardText class="mt-2">
        <TableFullNew ref="tableFull" :options="optionsTable" @edit="goViewEdit" @view="goViewEdit">
        </TableFullNew>
      </VCardText>
    </VCard>

    <ModalForm ref="refModalForm" @execute="reloadTable" />
  </div>
</template>
