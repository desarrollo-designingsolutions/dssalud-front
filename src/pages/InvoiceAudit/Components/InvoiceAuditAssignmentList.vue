<script setup lang="ts">
import ModalErrorsGlosas from "@/pages/InvoiceAudit/Components/ModalErrorsGlosas.vue";
import ModalUploadGlosaFileCsv from "@/pages/InvoiceAudit/Components/ModalUploadGlosaFileCsv.vue";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { useRouter } from 'vue-router';

definePage({
  path: "invoiceAuditAssignmentList/:assignment_batch_id",
  name: "InvoiceAuditAssignment-List",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "invoiceAuditAssignmentBatche.list",
  },
});

const authenticationStore = useAuthenticationStore();

const router = useRouter();

const route = useRoute();

const assignment_batch_id = route.params.assignment_batch_id;

//TABLE
const refTableFull = ref()

const optionsTable = {
  url: "/invoiceAudit/paginateThirds/" + assignment_batch_id,
  headers: [
    { key: 'nit', title: 'Nit' },
    { key: 'name', title: 'Razón Social' },
    { key: 'count_invoice_total', title: 'Cant Fact Totales', sortable: false },
    { key: 'count_invoice_pending', title: 'Cant Fact Pendientes', sortable: false },
    { key: 'count_invoice_finish', title: 'Cant Fact Finalizadas', sortable: false },
    { key: 'values', title: 'Valores', sortable: false },
    // { key: 'actions', title: 'Acciones', sortable: false, width: 100 },
  ],
  actions: {
    delete: { url: '/invoiceAudit/delete' }
  },
  paramsGlobal: {
    user_id: authenticationStore.user.id,
    assignment_batch_id: assignment_batch_id,
  }
}


//FILTER
const optionsFilter = ref({
  filterLabels: { inputGeneral: 'Buscar en todo' }
})

const goViewInvoiceAudit = (data: any = { id: null }) => {

  router.push({ name: "InvoiceAuditInvoiceAudit-List", params: { assignment_batch_id: assignment_batch_id, third_id: data.id } })

}

const goViewAssignmentBatchesList = () => {

  router.push({ name: "InvoiceAuditAssignmentBatche-List" })

}

const { downloadExcel, isLoadingExcel } = useGlosaInportExport()

const downloadExport = async () => {
  downloadExcel({
    assignment_batch_id: assignment_batch_id,
    user_id: authenticationStore.user.id,
    from: "thirds",
  })
}

//ModalUploadGlosaFileCsv
const refModalUploadGlosaFileCsv = ref()
const openModalUploadGlosaFileCsv = () => {
  refModalUploadGlosaFileCsv.value.openModal()
}

//ModalErrorsGlosas
const refModalErrorsGlosas = ref()
const openModalErrorsGlosas = (data: any) => {
  refModalErrorsGlosas.value.openModal(data, authenticationStore.user.id)
}

// Función para iniciar y manejar el canal dinámicamente
const startEchoChannel = () => {
  const channel = window.Echo.channel(`glosaModalErrors.${authenticationStore.user.id}`);
  channel.listen('ModalError', (event: any) => {
    if (event.errors.length > 0) {
      openModalErrorsGlosas(event.errors);
    }
  });
};

startEchoChannel()
</script>

<template>

  <div>
    <CountAllData :assignment_batch_id="assignment_batch_id" :user_id="authenticationStore.user.id" />

    <VRow>
      <VCol>
        <VCard>
          <VCardTitle class="d-flex justify-space-between">
            <span>
              Prestadores
            </span>

            <div class="d-flex justify-end gap-3 flex-wrap ">
              <ProgressCircularChannel :channel="'glosa.' + authenticationStore.user.id"
                tooltipText="Cargando glosas" />


              <VBtn @click="goViewAssignmentBatchesList">
                Regresar
              </VBtn>

              <VBtn color="primary" append-icon="tabler-chevron-down">
                Más Acciones
                <VMenu activator="parent" :loading="isLoadingExcel">
                  <VList>
                    <VListItem @click="openModalUploadGlosaFileCsv()">
                      <template #prepend>
                        <VIcon start icon="tabler-file-upload" />
                      </template>
                      <span>Importar</span>
                    </VListItem>
                    <VListItem @click="downloadExport()">
                      <template #prepend>
                        <VIcon start icon="tabler-file-download" />
                      </template>
                      <span>Exportar</span>
                    </VListItem>

                  </VList>
                </VMenu>
              </VBtn>
            </div>
          </VCardTitle>

          <VCardText>
            <FilterDialogNew :options-filter="optionsFilter">
            </FilterDialogNew>
          </VCardText>

          <VCardText class="mt-2">
            <TableFullNew ref="refTableFull" :options="optionsTable">

              <template #item.nit="{ item }">
                <div style="cursor: pointer;" @click="goViewInvoiceAudit({ id: item.id })">
                  {{ item.nit }}
                </div>
              </template>

              <template #item.name="{ item }">
                <div style="cursor: pointer;" @click="goViewInvoiceAudit({ id: item.id })">
                  {{ item.name }}
                </div>
              </template>

              <template #item.count_invoice_assignment="{ item }">
                <div style="cursor: pointer;" @click="goViewInvoiceAudit({ id: item.id })">
                  {{ item.count_invoice_assignment }}
                </div>
              </template>

              <template #item.count_invoice_pending="{ item }">
                <div style="cursor: pointer;" @click="goViewInvoiceAudit({ id: item.id })">
                  {{ item.count_invoice_pending }}
                </div>
              </template>

              <template #item.count_invoice_finish="{ item }">
                <div style="cursor: pointer;" @click="goViewInvoiceAudit({ id: item.id })">
                  {{ item.count_invoice_finish }}
                </div>
              </template>

              <template #item.values="{ item }">
                <div style="cursor: pointer;" @click="goViewInvoiceAudit({ id: item.id })">
                  {{ item.values }}
                </div>
              </template>

            </TableFullNew>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>


    <ModalUploadGlosaFileCsv ref="refModalUploadGlosaFileCsv" />

    <ModalErrorsGlosas ref="refModalErrorsGlosas" />
  </div>

</template>
