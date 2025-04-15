<script setup lang="ts">
import ModalUploadGlosaFileCsv from "@/pages/InvoiceAudit/Components/ModalUploadGlosaFileCsv.vue";

import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { useRouter } from 'vue-router';

definePage({
  path: "invoiceAuditAssignmentList/invoice-audit/:assignment_batch_id/:third_id/:invoice_audit_id",
  name: "InvoiceAuditPatient-List",
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
const third_id = route.params.third_id;
const invoice_audit_id = route.params.invoice_audit_id;

//TABLE
const refTableFull = ref()

const optionsTable = {
  url: `/invoiceAudit/paginatePatient/${assignment_batch_id}/${third_id}/${invoice_audit_id}`,
  headers: [
    { key: 'identification_number', title: 'Documento' },
    { key: 'full_name', title: 'Nombre' },
    { key: 'gender', title: 'Genero' },
    { key: 'glosas', title: 'Glosas', sortable: false },
    { key: 'value_glosa', title: 'Valor Glosado', sortable: false },
    { key: 'value_borrowed', title: 'Valor Prestado', sortable: false },
    { key: 'total_value', title: 'Valor Total', sortable: false },
    { key: 'status', title: 'Estado', sortable: false },
    // { key: 'actions', title: 'Acciones', sortable: false, width: 100 },
  ],
  actions: {
    delete: { url: '/invoiceAudit/delete' }
  },
  paramsGlobal: {
    company_id: authenticationStore.company.id,
  }
}


//FILTER
const optionsFilter = ref({
  filterLabels: { inputGeneral: 'Buscar en todo' }
})

const goViewInformationSheet = (data: any = { id: null }) => {

  router.push({ name: "InvoiceAuditInformationSheet-Info", params: { assignment_batch_id: assignment_batch_id, third_id: third_id, invoice_audit_id: invoice_audit_id, patient_id: data.id } })

}

const goViewInvoiceAuditList = () => {
  router.push({ name: "InvoiceAuditInvoiceAudit-List", params: { assignment_batch_id: assignment_batch_id, third_id: third_id } })
}


const { downloadExcel, isLoadingExcel } = useGlosaInportExport()

const downloadExport = async () => {
  downloadExcel({
    third_id: third_id,
    assignment_batch_id: assignment_batch_id,
    invoice_audit_id: invoice_audit_id,
    user_id: authenticationStore.user.id,
    from: "patients",
  })
}

//ModalUploadGlosaFileCsv
const refModalUploadGlosaFileCsv = ref()
const openModalUploadGlosaFileCsv = () => {
  refModalUploadGlosaFileCsv.value.openModal({
    assignment_batch_id: assignment_batch_id,
    third_id: third_id,
    invoice_audit_id: invoice_audit_id,
    user_id: authenticationStore.user.id,
  })
}




// const disbaledBtn = ref(false)
// const channels = reactive({
//   glosa: `glosa.${authenticationStore.user.id}`,
// })

// // Función para iniciar y manejar el canal dinámicamente
// const startEchoChannel = () => {
//   const channelGlosaModalErrors = window.Echo.channel(channels.glosa);
//   channelGlosaModalErrors.listen('ProgressCircular', (event: any) => {
//     const progress = Number(event.progress);

//     if (progress != 100) {
//       disbaledBtn.value = true;
//     }
//     if (progress == 100) {
//       disbaledBtn.value = false;
//     }
//   });
// };

// startEchoChannel()


</script>

<template>
  <div>

    <CountAllData :assignment_batch_id="assignment_batch_id" :third_id="third_id" />

    <VRow>
      <VCol>
        <VCard>
          <VCardTitle class="d-flex justify-space-between">
            <span>
              Usuarios
            </span>


            <div class="d-flex justify-end gap-3 flex-wrap ">

              <!-- <ProgressCircularChannel :channel="'glosa.' + authenticationStore.user.id"
                tooltipText="Cargando glosas" /> -->

              <VBtn @click="goViewInvoiceAuditList">
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

              <template #item.identification_number="{ item }">
                <div style="cursor: pointer;" @click="goViewInformationSheet({ id: item.id })">
                  {{ item.identification_number }}
                </div>
              </template>

              <template #item.full_name="{ item }">
                <div style="cursor: pointer;" @click="goViewInformationSheet({ id: item.id })">
                  {{ item.full_name }}
                </div>
              </template>

              <template #item.gender="{ item }">
                <div style="cursor: pointer;" @click="goViewInformationSheet({ id: item.id })">
                  {{ item.gender }}
                </div>
              </template>

              <template #item.glosas="{ item }">
                <div style="cursor: pointer;" @click="goViewInformationSheet({ id: item.id })">
                  {{ item.glosas }}
                </div>
              </template>

              <template #item.value_glosa="{ item }">
                <div style="cursor: pointer;" @click="goViewInformationSheet({ id: item.id })">
                  {{ item.value_glosa }}
                </div>
              </template>

              <template #item.value_borrowed="{ item }">
                <div style="cursor: pointer;" @click="goViewInformationSheet({ id: item.id })">
                  {{ item.value_borrowed }}
                </div>
              </template>

              <template #item.total_value="{ item }">
                <div style="cursor: pointer;" @click="goViewInformationSheet({ id: item.id })">
                  {{ item.total_value }}
                </div>
              </template>

              <template #item.status="{ item }">
                <div style="cursor: pointer;" @click="goViewInformationSheet({ id: item.id })">
                  {{ item.status }}
                </div>
              </template>


            </TableFullNew>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <ModalUploadGlosaFileCsv ref="refModalUploadGlosaFileCsv" />



  </div>

</template>
