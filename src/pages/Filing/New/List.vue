<script setup lang="ts">
import CountAllDataInvoices from "@/pages/Filing/New/Components/CountAllDataInvoices.vue";
import { router } from "@/plugins/1.router";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";

definePage({
  path: "Filing/New/List/:id",
  name: "Filing-New-List",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "filing.new.list",
  },
});

const authenticationStore = useAuthenticationStore();

//TABLE
const tableFull = ref()
const route = useRoute()

const optionsTable = {
  url: "/filing/list",
  params: {
    company_id: authenticationStore.company.id,
    type: TypeFilingEnum.RADICATION_OLD,
    filing_id: route.params.id,
  },
  headers: [
    { key: 'invoice_number', title: 'Número de factura' },
    { key: 'users_count', title: 'Cant. Usuarios' },
    { key: 'files_count', title: 'Soportes Cargados' },
    { key: 'case_number', title: 'N° Radicado' },
    { key: 'sumVr', title: 'Valor' },
    { key: "status", title: 'Estado' },
    { key: "date", title: 'Fecha' },
    { key: "status_xml", title: 'XML' },
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
      all: ["invoice_number", "status|custom", "status_xml|custom"],
    },
  },
  dialog: {
    width: 500,
    inputs: [
      {
        input_type: "selectInfinite",
        title: "Estado",
        key: "statusFillingInvoiceEnum",
        api: "selectStatusFillingInvoiceEnum",
        search_key: "status",
      },
      {
        input_type: "selectInfinite",
        title: "XML",
        key: "statusXmlFillingInvoiceEnum",
        search_key: "status_xml",
        api: "selectStatusXmlFillingInvoiceEnum",
      },
    ],
  }
})
const returnFilter = (filter: any) => {
  filterTable.value = filter
}



const loading = reactive({ excel: false })

//ModalQuestion
const refModalQuestion = ref()

const finishFilling = () => {
  refModalQuestion.value.componentData.isDialogVisible = true
  refModalQuestion.value.componentData.showBtnCancel = false
  refModalQuestion.value.componentData.principalIcon = 'tabler-circle-check'
  refModalQuestion.value.componentData.btnSuccessText = 'Aceptar'
  refModalQuestion.value.componentData.title = 'Radicación finalizada de manera exitosa'

}


//Visualizar usuarios
const goViewUsers = (item: any) => {
  router.push({ name: "Filing-New-ListUsers", params: { id: route.params.id, invoice_id: item.id } })

}
</script>

<template>
  <div>
    <CountAllDataInvoices :filing_id="route.params.id" />

    <VCard class="mt-5">
      <VCardTitle class="d-flex justify-space-between">
        <span>
          Lista de Facturas
        </span>

        <div class="d-flex justify-end gap-3 flex-wrap ">
          <VBtn :loading="loading.excel" :disabled="loading.excel" color="primary" @click="finishFilling">
            Finalizar radicación
          </VBtn>
          <VBtn color="primary">
            <template #append>
              <VIcon icon="tabler-chevron-compact-down"></VIcon>
            </template>
            Más opciones
            <VMenu activator="parent">
              <VList>
                <VListItem @click="() => { }">Subir soportes masivo</VListItem>
                <VListItem @click="() => { }">Subir XML masivo</VListItem>
                <VListItem @click="() => { }">Descargar certificacion de radicación</VListItem>
                <VListItem @click="() => { }">Descargar CSV de radicación</VListItem>
              </VList>
            </VMenu>
          </VBtn>
        </div>
      </VCardTitle>

      <VCardText class=" mt-2">
        <TableFull ref="tableFull" :optionsTable="optionsTable" :optionsFilter="optionsFilter"
          @dataFilter="returnFilter">

          <template #item.actions="{ item }">
            <div>
              <VBtn icon color="primary">
                <VIcon icon="tabler-square-rounded-chevron-down"></VIcon>
                <VMenu activator="parent">
                  <VList>

                    <VListItem @click="() => { }">Subir soportes</VListItem>
                    <VListItem @click="() => { }">Subir XML</VListItem>
                    <VListItem @click="goViewUsers(item)">Ver usuarios</VListItem>
                    <VListItem @click="() => { }">Descargar XML</VListItem>
                    <VListItem @click="() => { }">Eliminar factura</VListItem>
                    <VListItem @click="() => { }">Ver inconsistencias</VListItem>

                  </VList>
                </VMenu>
              </VBtn>
            </div>
          </template>

          <template #item.status="{ item }">
            <div>
              <VChip :color="item.status_background">{{ item.status_description }}</VChip>
            </div>
          </template>
          <template #item.status_xml="{ item }">
            <div>
              <VChip :color="item.status_xml_background">{{ item.status_xml_description }}</VChip>
            </div>
          </template>

        </TableFull>
      </VCardText>
    </VCard>

    <ModalQuestion ref="refModalQuestion" />

  </div>
</template>
