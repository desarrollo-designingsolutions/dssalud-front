<script setup lang="ts">
import ModalUploadGlosaFileCsv from "@/pages/InvoiceAudit/Components/ModalUploadGlosaFileCsv.vue";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { useRouter } from 'vue-router';

definePage({
  path: "invoiceAuditAssignmentList/invoice-audit/:assignment_batch_id/:third_id",
  name: "InvoiceAuditInvoiceAudit-List",
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

//TABLE
const refTableFull = ref()

const optionsTable = {
  url: `/invoiceAudit/paginateInvoiceAudit/${assignment_batch_id}/${third_id}`,
  headers: [
    { key: 'invoice_number', title: 'Factura' },
    { key: 'count_patients', title: 'Cantidad Usuarios', sortable: false },
    { key: 'count_services', title: 'Cant Servicios', sortable: false },
    { key: 'total_value_services', title: 'Valor Factura', sortable: false },
    { key: 'glosas', title: 'Glosas', sortable: false },
    { key: 'value_glosa', title: 'Valor Glosado', sortable: false },
    { key: 'spent', title: 'Gastado', sortable: false },
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

const goViewPatients = (data: any = { id: null }) => {
  router.push({ name: "InvoiceAuditPatient-List", params: { assignment_batch_id: assignment_batch_id, third_id: third_id, invoice_audit_id: data.id } })
}

const goViewAssignmentList = () => {
  router.push({ name: "InvoiceAuditAssignment-List", params: { assignment_batch_id: assignment_batch_id } })
}


const { downloadExcel, isLoadingExcel } = useGlosaInportExport()

const downloadExport = async () => {
  downloadExcel({
    third_id: third_id,
    assignment_batch_id: assignment_batch_id,
    user_id: authenticationStore.user.id,
    from: "invoices",

  })
}

//ModalUploadGlosaFileCsv
const refModalUploadGlosaFileCsv = ref()
const openModalUploadGlosaFileCsv = () => {
  refModalUploadGlosaFileCsv.value.openModal({
    third_id: third_id,
    assignment_batch_id: assignment_batch_id,
    user_id: authenticationStore.user.id,
  })
}


</script>

<template>
  <div>
    <CountAllData :assignment_batch_id="assignment_batch_id" :third_id="third_id"
      :user_id="authenticationStore.user.id" />

    <VRow>
      <VCol>
        <VCard>
          <VCardTitle class="d-flex justify-space-between">
            <span>
              Facturas
            </span>

            <div class="d-flex justify-end gap-3 flex-wrap ">
              <VBtn @click="goViewAssignmentList">
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

              <template #item.invoice_number="{ item }">
                <div style="cursor: pointer;" @click="goViewPatients({ id: item.id })">
                  {{ item.invoice_number }}
                </div>
              </template>

              <template #item.count_patients="{ item }">
                <div style="cursor: pointer;" @click="goViewPatients({ id: item.id })">
                  {{ item.count_patients }}
                </div>
              </template>

              <template #item.count_services="{ item }">
                <div style="cursor: pointer;" @click="goViewPatients({ id: item.id })">
                  {{ item.count_services }}
                </div>
              </template>

              <template #item.total_value_services="{ item }">
                <div style="cursor: pointer;" @click="goViewPatients({ id: item.id })">
                  {{ item.total_value_services }}
                </div>
              </template>

              <template #item.glosas="{ item }">
                <div style="cursor: pointer;" @click="goViewPatients({ id: item.id })">
                  {{ item.glosas }}
                </div>
              </template>

              <template #item.value_glosa="{ item }">
                <div style="cursor: pointer;" @click="goViewPatients({ id: item.id })">
                  {{ item.value_glosa }}
                </div>
              </template>

              <template #item.spent="{ item }">
                <div style="cursor: pointer;" @click="goViewPatients({ id: item.id })">
                  {{ item.spent }}
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
