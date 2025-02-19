<script setup lang="ts">
import ModalErrors from "@/pages/Rips/Automatic/Components/ModalErrors.vue";
import ModalUploadFileZip from "@/pages/Rips/Automatic/Components/ModalUploadFileZip.vue";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";

definePage({
  name: "Rips-Automatic-List",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "rips.automatic.list",
  },
});

const authenticationStore = useAuthenticationStore();

const loading = reactive({
  table: false,
  downloadFile: false,
  upload: false,
  excel: false,
});


const goView = (data: { action: string, id: number | null } = { action: "create", id: null }) => {
  // router.push({ name: "Client-Form", params: { action: data.action, id: data.id } })
}

//TABLE
const tableFull = ref()

const optionsTable = {
  url: "rip/list",
  params: {
    company_id: authenticationStore.company.id,
  },
  headers: [
    { key: 'actions', title: 'Acciones' },
    { key: 'numeration', title: 'No Validación' },
    { key: 'successfulInvoices', title: 'Data Completa' },
    { key: 'failedInvoices', title: 'Data Incompleta' },
    { key: "sumVr", title: 'Valor' },
    { key: "send", title: 'Correo Enviado' },
    { key: "status", title: 'Estado' },
    { key: "created_at", title: 'Fecha de validación' },
    { key: "user_name", title: 'Usuario' },
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
      all: [],
    },
  },
})
const returnFilter = (filter: any) => {
  filterTable.value = filter
}


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


//ModalUploadFileZip
const refModalUploadFileZip = ref()
const openModalUploadFileZip = () => {
  refModalUploadFileZip.value.openModal()
}


const reloadTable = () => {
  tableFull.value.executeFetchTable()
}

//descarga de json
const downloadFileData = async (file: any) => {
  loading.downloadFile = true;
  descargarArchivo(file, "prueba.json");
  loading.downloadFile = false;
};


//check de errores de validación
const parseAndCheckArray = (jsonString: any) => {
  if (jsonString) {
    const parsed = JSON.parse(jsonString);
    if (parsed) {
      return (
        Array.isArray(parsed?.errorMessages) && parsed?.errorMessages.length > 0
      );
    }
    return false;
  }
};

const viewBtnErrors = (obj: any) => {
  return (
    parseAndCheckArray(obj.validationExcel) ||
    parseAndCheckArray(obj.validationTxt) ||
    parseAndCheckArray(obj.validationXml) ||
    parseAndCheckArray(obj.validationZip)
  );
};

//ModalErrors
const refModalErrors = ref()
const openModalErrors = (item: any) => {
  item.typeError = "txt"
  refModalErrors.value.openModal(item)
}


const echoChannel = () => {

  tableFull.value.optionsTable.tableData.forEach(element => {
    window.Echo.channel(`rip.${element.id}`)
      .listen('.RipStatusUpdated', (event: any) => {

        element.status = event.status
        element.status_backgroundColor = event.status_backgroundColor
        element.status_description = event.status_description
        element.path_json = event.path_json
        element.numInvoices = event.numInvoices
        element.sumVr = event.sumVr
        element.send = event.send
        element.path_json = event.path_json
        element.path_xls = event.path_xls
        element.successfulInvoices = event.successfulInvoices
        element.failedInvoices = event.failedInvoices
        element.view_btn_error = event.view_btn_error

      });
  });
}

const canDownloadExcel = (item: any) => {
  return [StatusRipsEnum.INCOMPLETE, StatusRipsEnum.ERROR_EXCEL, StatusRipsEnum.ERROR_XML, StatusRipsEnum.PENDING_EXCEL].includes(item.status)
}
</script>

<template>
  <div>

    <VCard>
      <VCardTitle class="d-flex justify-space-between">
        <span>
          Listado de RIPS Automáticos
        </span>

        <div class="d-flex justify-end gap-3 flex-wrap ">
          <VBtn :loading="loading.excel" :disabled="loading.excel" size="38" color="primary" icon
            @click="downloadExcel()">
            <VIcon icon="tabler-file-spreadsheet"></VIcon>
            <VTooltip location="top" transition="scale-transition" activator="parent" text="Descargar Excel">
            </VTooltip>
          </VBtn>
          <VBtn @click="openModalUploadFileZip()">
            Agregar archivo
          </VBtn>
        </div>
      </VCardTitle>

      <VCardText class=" mt-2">
        <TableFull ref="tableFull" :optionsTable="optionsTable" :optionsFilter="optionsFilter" @goView="goView"
          @dataFilter="returnFilter" @responseData="echoChannel">

          <template #item.actions="{ item }">
            <div>
              <VBtn icon color="primary" v-if="item.status !== StatusRipsEnum.IN_PROCESS">
                <VIcon icon="tabler-square-rounded-chevron-down"></VIcon>
                <VMenu activator="parent">
                  <VList>
                    <VListItem @click="downloadFileData(item.path_json)" v-if="!isEmpty(item.path_json)">
                      <template #prepend>
                        <VIcon icon="tabler-json" />
                      </template>
                      <span>Descargar JSON</span>
                    </VListItem>

                    <VListItem v-if="canDownloadExcel(item)" @click="downloadFileData(item.path_xls)">
                      Descargar EXCEL
                    </VListItem>

                    <VListItem v-if="item.view_btn_error" @click="openModalErrors(item)">Ver inconsistencias</VListItem>

                  </VList>
                </VMenu>
              </VBtn>
            </div>
          </template>

          <template #item.status="{ item }">
            <VChip :color="item.status_backgroundColor">
              <VProgressCircular indeterminate color="secondary" size="20" class="mr-2"
                v-if="item.status === StatusRipsEnum.IN_PROCESS" />
              <span>{{ item.status_description }}</span>
            </VChip>
          </template>

        </TableFull>
      </VCardText>
    </VCard>

    <ModalUploadFileZip ref="refModalUploadFileZip" @execute="reloadTable" />

    <ModalErrors ref="refModalErrors" @execute="reloadTable" />

  </div>
</template>
