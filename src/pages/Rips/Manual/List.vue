<script setup lang="ts">
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";

definePage({
  name: "Rips-Manual-List",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "rips.manual.list",
  },
});

const authenticationStore = useAuthenticationStore();

const goView = (data: { action: string, id: number | null } = { action: "create", id: null }) => {
  // router.push({ name: "Client-Form", params: { action: data.action, id: data.id } })
}

//TABLE
const tableFull = ref()

const optionsTable = {
  url: "/client/list",
  params: {
    company_id: authenticationStore.company.id,
  },
  headers: [
    { key: 'logo', title: 'Logo' },
    { key: 'name', title: 'Nombre' },
    { key: 'document', title: 'No' },
    { key: 'country_name', title: 'Pais' },
    { key: 'city_name', title: 'Ciudad' },
    { key: "projects_count", title: 'Proyectos' },
    { key: "email", title: 'Correo electronico' },
    { key: "is_active", title: 'Estado' },
    { key: 'actions', title: 'Acciones' },
  ],
  actions: {
    changeStatus: {
      url: "/client/changeStatus"
    },
    delete: {
      url: "/client/delete"
    },
  }
}


//FILTER
const filterTable = ref()
const optionsFilter = ref({
  inputGeneral: {
    relationsGeneral: {
      all: ["name", "document", "email"],
      country: ["name"],
      city: ["name"],
    },
  },
  dialog: {
    width: 500,
    inputs: [
      {
        input_type: "booleanActive",
        title: "Estado",
        key: "is_active",
      },
    ],
  }
})
const returnFilter = (filter: any) => {
  filterTable.value = filter
}



const loading = reactive({ excel: false })

const downloadExcel = async () => {
  loading.excel = true;
  const { data, response } = await useApi("/client/excelExport").post({
    searchQuery: filterTable.value,
    company_id: authenticationStore.company.id,
    user_id: authenticationStore.user.role_id == ROLE_SUPERADMIN_UUID ? null : authenticationStore.user.id,
  })

  loading.excel = false;

  if (response.value?.ok && data.value) {
    downloadExcelBase64(data.value.excel, "Lista de clientes")
  }
}

</script>

<template>
  <div>

    <VCard>
      <VCardTitle class="d-flex justify-space-between">
        <span>
          Clientes
        </span>

        <div class="d-flex justify-end gap-3 flex-wrap ">
          <VBtn :loading="loading.excel" :disabled="loading.excel" size="38" color="primary" icon
            @click="downloadExcel()">
            <VIcon icon="tabler-file-spreadsheet"></VIcon>
            <VTooltip location="top" transition="scale-transition" activator="parent" text="Descargar Excel">
            </VTooltip>
          </VBtn>
          <VBtn @click="goView()">
            Agregar cliente
          </VBtn>
        </div>
      </VCardTitle>

      <VCardText class=" mt-2">
        <TableFull ref="tableFull" :optionsTable="optionsTable" :optionsFilter="optionsFilter" @goView="goView"
          @dataFilter="returnFilter">

          <template #item.logo="{ item }">
            <div class="my-2">
              <VAvatar v-if="item.logo" :size="38" class="me-3">
                <VImg :src="storageBack(item.logo)"></VImg>
              </VAvatar>
              <VAvatar v-else :size="38" class="me-3" color="primary" variant="tonal">
                {{ avatarText(item.name) }}
              </VAvatar>
            </div>
          </template>

        </TableFull>
      </VCardText>
    </VCard>
  </div>
</template>
