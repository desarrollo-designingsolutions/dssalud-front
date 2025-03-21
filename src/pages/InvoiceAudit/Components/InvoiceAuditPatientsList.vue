<script setup lang="ts">
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { useRouter } from 'vue-router';

definePage({
  path: "invoiceAuditAssignmentList/invoice-audit/:assignment_batche_id/:third_id/:invoice_audit_id?",
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
const assignment_batche_id = route.params.assignment_batche_id;
const third_id = route.params.third_id;
const invoice_audit_id = route.params.invoice_audit_id;

//TABLE
const refTableFull = ref()

const optionsTable = {
  url: `/invoiceAudit/paginatePatient/${assignment_batche_id}/${third_id}/${invoice_audit_id}`,
  headers: [
    { key: 'identification_number', title: 'Documento' },
    { key: 'full_name', title: 'Nombre' },
    { key: 'gender', title: 'Genero' },
    { key: 'glosas', title: 'Glosas' },
    { key: 'value_glosa', title: 'Valor Glosado' },
    { key: 'value_borrowed', title: 'Valor Prestado' },
    { key: 'total_value', title: 'Valor Total' },
    { key: 'status', title: 'Estado' },
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

  router.push({ name: "InvoiceAuditInformationSheet-Info", params: { assignment_batche_id: assignment_batche_id, third_id: third_id, invoice_audit_id: invoice_audit_id, patient_id: data.id } })

}

const goViewInvoiceAuditList = () => {
  router.push({ name: "InvoiceAuditInvoiceAudit-List", params: { assignment_batche_id: assignment_batche_id, third_id: third_id } })
}

</script>

<template>

  <CountAllData />

  <VRow>
    <VCol>
      <VCard>
        <VCardTitle class="d-flex justify-space-between">
          <span>
            Usuarios
          </span>

          <div class="d-flex justify-end gap-3 flex-wrap ">
            <VBtn @click="goViewInvoiceAuditList">
              Regresar
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
</template>
