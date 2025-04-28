<script setup lang="ts">
import ModalFormMasiveGlosa from "@/pages/Glosa/Components/ModalFormMasive.vue";
import ModalListGlosa from "@/pages/Glosa/Components/ModalList.vue";
import ModalErrorsGlosas from "@/pages/InvoiceAudit/Components/ModalErrorsGlosas.vue";
import ModalShowFiles from "@/pages/InvoiceAudit/Components/ModalShowFiles.vue";
import ModalUploadGlosaFileCsv from "@/pages/InvoiceAudit/Components/ModalUploadGlosaFileCsv.vue";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { useRouter } from 'vue-router';

const { toast } = useToast();

definePage({
  path: "InvoiceAuditInformationSheet/invoice-audit/:assignment_batch_id/:third_id/:invoice_audit_id/:patient_id",
  name: "InvoiceAuditInformationSheet-Info",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "invoiceAuditAssignmentBatche.list",
  },
});

const showBtnsView = ref(true);
const invoiceAudit = ref({});
const assignment = ref({});
const third = ref({});
const patient = ref({});
const value_glosa = ref(0);
const value_approved = ref(0);

const authenticationStore = useAuthenticationStore();

const router = useRouter();

const route = useRoute();

const assignment_batch_id = route.params.assignment_batch_id;
const third_id = route.params.third_id;
const invoice_audit_id = route.params.invoice_audit_id;
const patient_id = route.params.patient_id;

//LOADING
const isLoading = ref<boolean>(false)
const isLoadingExcelList = ref<boolean>(false)
const isLoadingSuccessFinalizedAudit = ref<boolean>(false)

//FILTER
const optionsFilter = ref({
  filterLabels: { inputGeneral: 'Buscar en todo' }
})

const goViewPatient = (data: any = { id: null }) => {

  router.push({ name: "InvoiceAuditPatient-List", params: { assignment_batch_id: assignment_batch_id, third_id: third_id, invoice_audit_id: invoice_audit_id } })

}

const fetchData = async () => {

  const url = `/invoiceAudit/getInformationSheet/${third_id}/${invoice_audit_id}/${patient_id}`

  isLoading.value = true
  const { data, response } = await useAxios(url).get({
    params: {
      company_id: authenticationStore.company.id,
      user_id: authenticationStore.user.id,
    }
  });

  if (response.status == 200 && data) {
    invoiceAudit.value = data.data.invoice_audit
    third.value = data.data.third
    patient.value = data.data.patient
    value_glosa.value = data.data.value_glosa
    value_approved.value = data.data.value_approved
    assignment.value = data.assignment

    if (assignment.value && assignment.value.status == 'ASSIGNMENT_EST_003') {
      showBtnsView.value = false
    } else {
      showBtnsView.value = true
    }
  }
  isLoading.value = false
}

onMounted(() => {
  fetchData();
})


//TABLE
const refTableFull = ref()

const optionsTable = {
  url: `/invoiceAudit/getServices/${invoice_audit_id}/${patient_id}`,
  headers: [
    { key: 'id', title: 'ID' },
    { key: 'type', title: 'Tipo' },
    { key: 'nap', title: 'Nap' },
    { key: 'detail_code', title: 'Código' },
    { key: 'description', title: 'Descripcion' },
    { key: 'quantity', title: 'Cantidad' },
    { key: "unit_value", title: 'VL Unitario' },
    { key: "moderator_value", title: 'VL Moderadora' },
    { key: "total_value", title: 'VL Total' },
    { key: 'actionsBtn', title: 'Acciones', sortable: false },
  ],
  showSelect: true,
  paramsGlobal: {
    company_id: authenticationStore.company.id,
    user_id: authenticationStore.user.id,
  },
}

const tableLoading = ref(false); // Estado de carga de la tabla

// Método para refrescar los datos
const refreshTable = () => {
  if (refTableFull.value) {
    refTableFull.value.fetchTableData(null, false, true); // Forzamos la búsqueda
  }
};

//ModalShowFiles
const refModalShowFiles = ref()

const openModalShowFiles = () => {
  refModalShowFiles.value.openModal(invoice_audit_id, "InvoiceAudit")
}

//ModalUploadGlosaFileCsv
const refModalUploadGlosaFileCsv = ref()
const openModalUploadGlosaFileCsv = () => {
  refModalUploadGlosaFileCsv.value.openModal({
    assignment_batch_id: assignment_batch_id,
    third_id: third_id,
    invoice_audit_id: invoice_audit_id,
    patient_id: patient_id,
    user_id: authenticationStore.user.id,
  })
}


const { downloadExcel, isLoadingExcel } = useGlosaInportExport()

const downloadExport = async () => {
  downloadExcel({
    invoice_audit_id: invoice_audit_id,
    patient_id: patient_id,
    user_id: authenticationStore.user.id,
    from: "InvoiceAuditInformationSheet",
  })
}

const downloadExcelList = async () => {
  isLoadingExcelList.value = true;
  const { data, response } = await useAxios("/invoiceAudit/exportListServicesExcel").post({
    invoice_audit_id: invoice_audit_id,
    patient_id: patient_id
  })
  isLoadingExcelList.value = false;

  if (response.status == 200 && data && data.code == 200) {
    downloadExcelBase64(data.excel, "Listado de Servicios Factura: " + invoiceAudit.value?.invoice_number)
  }
}

//ModalFormMasiveGlosa
const refModalFormMasiveGlosa = ref()

const openModalFormMasiveGlosa = () => {
  if (servicesIds.value.length > 0) {
    refModalFormMasiveGlosa.value.openModal(servicesIds.value)
  } else {
    toast("Debe seleccionar almenos un servicio", "", "info")
  }
}

//ModalListGlosa
const refModalListGlosa = ref()

const openModalListGlosa = (data: any) => {
  refModalListGlosa.value.openModal({
    ...data,
    showBtnsView:showBtnsView.value
  })
}

const servicesIds = ref<Array<string>>([]);

const channels = reactive({
  invoiceAuditData: `invoice_audit.${invoice_audit_id}`,
  glosa_service_jobs: `glosa_service_jobs.${authenticationStore.user.id}`,
})

const channelInvoiceAuditData = window.Echo.channel(channels.invoiceAuditData);
channelInvoiceAuditData.listen('ChangeInvoiceAuditData', (event: any) => {
 
  value_glosa.value = event.data.value_glosa
  value_approved.value = event.data.value_approved
});



//ModalQuestion
const refModalQuestion = ref()

const openModalQuestion = () => {
  if (refModalQuestion.value) {
    refModalQuestion.value.componentData.isDialogVisible = true;
    refModalQuestion.value.componentData.btnSuccessText = 'Si';
    refModalQuestion.value.componentData.btnCancelText = 'No';
    refModalQuestion.value.componentData.title = '¿Esta seguro que deseea finalizar la auditoria?'; 
  }
}

const successFinalizedAudit = async () => {
  isLoadingSuccessFinalizedAudit.value = true;
  const { data, response } = await useAxios("/invoiceAudit/successFinalizedAudit").post({
    assignments_ids: [assignment.value.id], 
  })
  isLoadingSuccessFinalizedAudit.value = false;

  if (response.status == 200 && data && data.code == 200) {
    showBtnsView.value = false 
  } 
}

const isLoadingBtn = computed(() => {

let loading = [
isLoadingExcel.value,
isLoadingSuccessFinalizedAudit.value,
isLoadingExcelList.value,
]

return Object.values(loading).some(value => value);
});
</script>

<template>
  <div>
    <VCard :loading="isLoading">
      <VCardTitle class="d-flex justify-space-between">
        <h1>
          <p><strong>N° de Factura: </strong>{{ invoiceAudit.invoice_number }}</p>
        </h1>
        <div class="d-flex justify-end gap-3 flex-wrap">
          <VBtn @click="goViewPatient">Regresar</VBtn>
        </div>
      </VCardTitle>

      <VCardText class="mt-2">
        <div class="mb-4">
          <VRow>
            <VCol cols="12" md="2">
              <p><strong>N° de radicación</strong> <br> </p>
            </VCol>
            <VCol cols="12" md="2">
              <p><strong>Fecha Radicación</strong> <br> </p>
            </VCol>
            <VCol cols="12" md="2">
              <p><strong>N° Factura</strong> <br> {{ invoiceAudit.invoice_number }}</p>
            </VCol>
            <VCol cols="12" md="2">
              <p><strong>Fecha Factura</strong> <br> {{ invoiceAudit.date_entry }}</p>
            </VCol>
            <VCol cols="12" md="2">
              <p><strong>Valor Factura</strong> <br> {{ invoiceAudit.total_value }}</p>
            </VCol>
            <VCol cols="12" md="2">
              <p><strong>Nota Credito</strong> <br> </p>
            </VCol>
            <VCol cols="12" md="2">
              <p><strong>Valor Copago</strong> <br> </p>
            </VCol>
            <VCol cols="12" md="2">
              <p><strong>Valor Cuota Moderada</strong> <br> </p>
            </VCol>
            <VCol cols="12" md="2">
              <p><strong>Valor Pago Moderador</strong> <br> </p>
            </VCol>
            <VCol cols="12" md="2">
              <p><strong>Valor Aprobado</strong> <br> {{ value_approved }}</p>
            </VCol>
            <VCol cols="12" md="2">
              <p><strong>Valor Glosado</strong> <br>{{ value_glosa }} </p>
            </VCol>
          </VRow>
        </div>

        <VExpansionPanels variant="accordion">
          <VExpansionPanel>
            <VExpansionPanelTitle>
              Información Prestador
            </VExpansionPanelTitle>
            <VExpansionPanelText>
              <VRow>
                <VCol cols="12" md="2">
                  <p><strong>Razón Social</strong> <br> {{ third.name }} </p>
                </VCol>
                <VCol cols="12" md="2">
                  <p><strong>NIT</strong> <br> {{ third.nit }} </p>
                </VCol>
                <VCol cols="12" md="2">
                  <p><strong>Código Habilitación</strong> <br> </p>
                </VCol>
                <VCol cols="12" md="2">
                  <p><strong>Sede</strong> <br> </p>
                </VCol>
              </VRow>
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>

        <VExpansionPanels variant="accordion">
          <VExpansionPanel>
            <VExpansionPanelTitle>
              Información Paciente
            </VExpansionPanelTitle>
            <VExpansionPanelText>
              <VRow>
                <VCol cols="12" md="2">
                  <p><strong>Nombre</strong> <br> {{ patient.full_name }} </p>
                </VCol>
                <VCol cols="12" md="2">
                  <p><strong>Documento</strong> <br> {{ patient.identification_number }} </p>
                </VCol>
                <VCol cols="12" md="2">
                  <p><strong>Edad</strong> <br> </p>
                </VCol>
                <VCol cols="12" md="2">
                  <p><strong>Fecha de Ingreso</strong> <br> </p>
                </VCol>
                <VCol cols="12" md="2">
                  <p><strong>Fecha de Egreso</strong> <br> </p>
                </VCol>
                <VCol cols="12" md="2">
                  <p><strong>Días Estancia</strong> <br> </p>
                </VCol>
              </VRow>
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
      </VCardText>


      <VCardTitle class="d-flex justify-space-between">
        <span>
          Gestión Cuenta
        </span>

        <div class="d-flex justify-end gap-3 flex-wrap ">

          <!-- <ProgressCircularChannel :channel="'glosa.' + authenticationStore.user.id" tooltipText="Cargando glosas" /> -->

          <VBtn @click="openModalShowFiles">
            <template #prepend>
              <VIcon start icon="tabler-files" />
            </template>
            Soportes
          </VBtn>
          <VBtn v-if="showBtnsView" @click="openModalFormMasiveGlosa">
            <template #prepend>
              <VIcon start icon="tabler-folder" />
            </template>
            Glosa Masiva
          </VBtn>
 
          <VBtn color="primary" append-icon="tabler-chevron-down" :loading="isLoadingBtn">
            Más Acciones
            <VMenu activator="parent">
              <VList>
                <VListItem  v-if="showBtnsView" @click="openModalUploadGlosaFileCsv()">
                  <template #prepend>
                    <VIcon start icon="tabler-file-upload" />
                  </template>
                  <span>Importar</span>
                </VListItem>
                <VListItem  v-if="showBtnsView" @click="downloadExport()" :loading="isLoadingExcel" :disabled="isLoadingExcel">
                  <template #prepend>
                    <VIcon start icon="tabler-file-download" />
                  </template>
                  <span>Exportar</span>
                </VListItem>
                <VListItem @click="downloadExcelList()" :loading="isLoadingExcelList" :disabled="isLoadingExcelList">
                  <template #prepend>
                    <VIcon start icon="tabler-download" />
                  </template>
                  <span>Descargar</span>
                </VListItem>

                <VListItem v-if="showBtnsView" @click="openModalQuestion()">
                      <template #prepend>
                        <VIcon start icon="tabler-file-download" />
                      </template>
                      <span>Finalizar auditoria</span>
                    </VListItem>

              </VList>
            </VMenu>
          </VBtn>
        </div>
      </VCardTitle>

      <VCardText>
        <FilterDialogNew :options-filter="optionsFilter" @force-search="refreshTable" :table-loading="tableLoading">
        </FilterDialogNew>
      </VCardText>

      <VCardText>
        <TableFullNew v-model:selected="servicesIds" ref="refTableFull" :options="optionsTable"
          @update:loading="tableLoading = $event">

          <template #item.actionsBtn="{ item }">
            <VBtn color="primary" append-icon="tabler-chevron-down">
              Acciones
              <VMenu activator="parent">

                <VList>
                  <VListItem @click="openModalListGlosa(item)">
                    <template #prepend>
                      <VIcon size="22" icon="tabler-square-rounded-arrow-right" />
                    </template>
                    <span>Listado Glosas</span>
                  </VListItem>
                </VList>
              </VMenu>
            </VBtn>
          </template>

        </TableFullNew>
      </VCardText>
    </VCard>

    <ModalShowFiles ref="refModalShowFiles"></ModalShowFiles>

    <ModalUploadGlosaFileCsv ref="refModalUploadGlosaFileCsv" />

    <ModalFormMasiveGlosa ref="refModalFormMasiveGlosa"></ModalFormMasiveGlosa>

    <ModalListGlosa ref="refModalListGlosa"></ModalListGlosa>

    <ModalErrorsGlosas ref="refModalErrorsGlosas" />

    <ModalQuestion ref="refModalQuestion" @success="successFinalizedAudit" />
  </div>
</template>
