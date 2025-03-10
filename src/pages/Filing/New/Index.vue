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
const refTableFull = ref()

const optionsTable = {
  url: "/filing/paginate",
  paramsGlobal: {
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
  dialog: {
    width: 800,
    inputs: [
      {
        type: "selectApi",
        label: "Estado",
        arrayInfo: "statusFilingEnumOpenAndClosed",
        url: "selectStatusFilingEnumOpenAndClosed",
        name: "status",
      }
    ],
  },
  extraFilters: {
    filing_invoice_pre_radicated_count: { value: '' },
  },
  filterLabels: { inputGeneral: 'Buscar en todo', filing_invoice_pre_radicated_count: 'Facturas preradicadas' }

})

const goView = (id: number) => {
  router.push({ name: "Filing-New-List", params: { id: id } })
}
</script>

<template>
  <div>

    <VCard class="mt-5">
      <VCardTitle class="d-flex justify-space-between">
        <span>
          Lista de radicaciones
        </span>
        <div class="d-flex justify-end gap-3 flex-wrap ">
          <VMenu location="bottom">
            <template #activator="{ props }">
              <VBtn v-bind="props">
                Agregar radicación
                <VIcon icon="tabler-circle-chevrons-down"></VIcon>
              </VBtn>
            </template>

            <VList>
              <VListItem @click="openModalUploadFileZip()">
                Radicación antigua
              </VListItem>
              <VListItem @click="openModalUploadFileJson()">
                Radicación 2275
              </VListItem>
            </VList>
          </VMenu>
        </div>
      </VCardTitle>

      <VCardText>
        <FilterDialogNew :options-filter="optionsFilter">
          <template #default="{ extraFilters }">
            <VCol cols="3">
              <AppTextField prepend-inner-icon="tabler-search"
                v-model="extraFilters.filing_invoice_pre_radicated_count.value" label="Facturar preradicadas"
                placeholder="Filtrar por facturar preradicadas" type="text" name="filing_invoice_pre_radicated_count" />
            </VCol>
          </template>
        </FilterDialogNew>
      </VCardText>

      <VCardText class=" mt-2">
        <TableFullNew ref="refTableFull" :options="optionsTable">
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
        </TableFullNew>
      </VCardText>
    </VCard>

    <ModalUploadFileZip ref="refModalUploadFileZip" />

    <ModalUploadFileJson ref="refModalUploadFileJson" />


  </div>
</template>
