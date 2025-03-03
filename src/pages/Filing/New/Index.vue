<script setup lang="ts">
import ModalUploadFileJson from "@/pages/Filing/New/Components/ModalUploadFileJson.vue";
import ModalUploadFileZip from "@/pages/Filing/New/Components/ModalUploadFileZip.vue";
import { router } from "@/plugins/1.router";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";

definePage({
  name: "Filing-New-Index",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "filing.new.index",
  },
});

const authenticationStore = useAuthenticationStore();

//ModalUploadFileZip
const refModalUploadFileZip = ref()
const openModalUploadFileZip = () => {
  refModalUploadFileZip.value.openModal({ id: null, contract_id: null })
}


//ModalUploadFileJson
const refModalUploadFileJson = ref()

const openModalUploadFileJson = () => {
  refModalUploadFileJson.value.openModal()
}

//TABLE
const tableFull = ref()

const optionsTable = {
  url: "/filing/list",
  params: {
    company_id: authenticationStore.company.id,
  },
  headers: [
    { key: 'contract_name', title: 'Contrato' },
    { key: 'type', title: 'Tipo' },
    { key: 'status', title: 'Estado' },
    { key: 'sumVr', title: 'Valor' },
    { key: 'filing_invoice_pre_radicated_count', title: 'Facturas preradicadas' },
    { key: 'actions', title: 'Acciones' },
  ],
}


//FILTER
const optionsFilter = ref({
  inputGeneral: {
    relationsGeneral: {
      all: ["type", "sumVr"],
      contract: ["name"],
    },
  },
  dialog: {
    width: 500,
    inputs: [
      {
        input_type: "selectInfinite",
        title: "Estado",
        key: "statusFilingEnumOpenAndClosed",
        api: "selectStatusFilingEnumOpenAndClosed",
        search_key: "status",
      }
    ],
  }
})

const goView = (id: number) => {
  router.push({ name: "Filing-New-List", params: { id: id } })
}
</script>

<template>
  <div>

    <VCard>
      <VCardTitle class="d-flex justify-center">
        <h2>
          Nueva Radicación
        </h2>
      </VCardTitle>

      <VCardText class="d-flex justify-space-around">
        <VBtn size="x-large" @click="openModalUploadFileZip()">Radicación antigua</VBtn>
        <VBtn size="x-large" @click="openModalUploadFileJson()">Radicación 2275</VBtn>
      </VCardText>
    </VCard>

    <VCard class="mt-5">
      <VCardTitle class="d-flex justify-space-between">
        <span>
          Lista de radicaciones
        </span>
      </VCardTitle>

      <VCardText class=" mt-2">
        <TableFull ref="tableFull" :optionsTable="optionsTable" :optionsFilter="optionsFilter">
          <template #item.status="{ item }">
            <div>
              <VChip :color="item.status_backgroundColor">{{ item.status_description }}</VChip>
            </div>
          </template>

          <template #item.actions="{ item }">
            <div>
              <VBtn icon color="primary" v-if="item.status == 'FILING_EST_008'">
                <VIcon icon="tabler-square-rounded-chevron-down"></VIcon>
                <VMenu activator="parent">
                  <VList>
                    <VListItem @click="goView(item.id)">
                      Ingresar
                    </VListItem>
                  </VList>
                </VMenu>
              </VBtn>
            </div>
          </template>
        </TableFull>
      </VCardText>
    </VCard>

    <ModalUploadFileZip ref="refModalUploadFileZip" />

    <ModalUploadFileJson ref="refModalUploadFileJson" />


  </div>
</template>
