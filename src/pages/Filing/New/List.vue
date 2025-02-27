<script setup lang="ts">
// import CountAllDataInvoices from "@/pages/Filing/New/Components/CountAllDataInvoices.vue";
import ModalSupportFiles from "@/pages/Filing/New/Components/ModalSupportFiles.vue";
import ModalSupportMasiveFiles from "@/pages/Filing/New/Components/ModalSupportMasiveFiles.vue";
import ModalUploadFileXml from "@/pages/Filing/New/Components/ModalUploadFileXml.vue";
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

const route = useRoute()
const authenticationStore = useAuthenticationStore();
const filing_id = route.params.id;

//TABLE
const tableFull = ref()

const optionsTable = {
  url: "/filingInvoice/list",
  params: {
    company_id: authenticationStore.company.id,
    type: TypeFilingEnum.RADICATION_OLD,
    filing_id: filing_id,
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
  router.push({ name: "Filing-New-ListUsers", params: { id: filing_id, invoice_id: item.id } })

}

//ModalSupportFiles
const refModalSupportFiles = ref()

const openModalSupportFiles = (item: any) => {
  refModalSupportFiles.value.openModal(item)
}

//ModalShowFiles
const refModalShowFiles = ref()

const openModalShowFiles = (item: any) => {
  refModalShowFiles.value.openModal(item.id, "FilingInvoice", {
    status: item.status,
  })
}


const echoChannel = () => {

  tableFull.value.optionsTable.tableData.forEach(element => {
    window.Echo.channel(`filing_invoice.${element.id}`)
      .listen('.FilingInvoiceRowUpdated', (event: any) => {
        console.log("event", event);

        element.files_count = event.files_count

        element.status_xml = event.status_xml
        element.status_xml_backgroundColor = event.status_xml_backgroundColor
        element.status_xml_description = event.status_xml_description

      });
  });
}

//ModalSupportMasiveFiles
const refModalSupportMasiveFiles = ref()

const openModalSupportMasiveFiles = () => {
  refModalSupportMasiveFiles.value.openModal(filing_id)
}

//ModalUploadFileXml
const refModalUploadFileXml = ref()

const openModalUploadFileXml = (item: any) => {
  refModalUploadFileXml.value.openModal(JSON.parse(JSON.stringify(item)))
}


//descarga de XML
const downloadFileData = async (file: any) => {
  descargarArchivo(file, "prueba");
};
</script>

<template>
  <div>
    <CountAllDataInvoices :filing_id="filing_id" />

    <VCard class="mt-5">
      <VCardTitle class="d-flex justify-space-between">
        <span>
          Lista de Facturas
        </span>

        <div class="d-flex justify-end gap-3 flex-wrap ">
          <ProgressCircularChannel :channel="'filing.' + filing_id" tooltipText="Subiendo soportes masivos" />

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
                <VListItem @click="openModalSupportMasiveFiles()">Subir soportes masivo</VListItem>
                <VListItem @click="() => { }">Subir XML masivo</VListItem>
                <VListItem @click="() => { }">Descargar certificacion de radicación</VListItem>
                <VListItem @click="() => { }">Descargar CSV de radicación</VListItem>
                <VListItem @click="() => { }">Ver inconsistencias</VListItem>
              </VList>
            </VMenu>
          </VBtn>
        </div>
      </VCardTitle>

      <VCardText class=" mt-2">
        <TableFull ref="tableFull" :optionsTable="optionsTable" :optionsFilter="optionsFilter"
          @dataFilter="returnFilter" @responseData="echoChannel">

          <template #item.actions="{ item }">
            <div class="d-flex justify-end gap-3">

              <ProgressCircularChannel :channel="'filing_invoice.' + item.id"
                tooltipText="Subiendo soportes a la factura" />

              <VBtn icon color="primary">
                <VIcon icon="tabler-square-rounded-chevron-down"></VIcon>
                <VMenu activator="parent">
                  <VList>

                    <VListItem @click="openModalSupportFiles(item)">Subir soportes</VListItem>
                    <VListItem v-if="item.files_count > 0" @click="openModalShowFiles(item)">Ver soportes</VListItem>
                    <VListItem @click="openModalUploadFileXml(item)">Subir XML</VListItem>
                    <VListItem @click="goViewUsers(item)">Ver usuarios</VListItem>
                    <VListItem v-if="item.status_xml == StatusFillingInvoiceEnum.VALIDATED"
                      @click="downloadFileData(item.path_xml)">Descargar XML</VListItem>
                    <VListItem @click="() => { }">Eliminar factura</VListItem>
                    <VListItem @click="() => { }">Ver inconsistencias</VListItem>

                  </VList>
                </VMenu>
              </VBtn>

            </div>
          </template>

          <template #item.status="{ item }">
            <div>
              <VChip :color="item.status_backgroundColor">{{ item.status_description }}</VChip>
            </div>
          </template>
          <template #item.status_xml="{ item }">
            <div>
              <VChip :color="item.status_xml_backgroundColor">{{ item.status_xml_description }}</VChip>
            </div>
          </template>

        </TableFull>
      </VCardText>
    </VCard>

    <ModalQuestion ref="refModalQuestion" />

    <ModalSupportFiles ref="refModalSupportFiles" />
    <ModalShowFiles ref="refModalShowFiles" />
    <ModalSupportMasiveFiles ref="refModalSupportMasiveFiles" />
    <ModalUploadFileXml ref="refModalUploadFileXml" />


  </div>
</template>
