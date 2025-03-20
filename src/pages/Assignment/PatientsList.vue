<script setup lang="ts">
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { useRouter } from 'vue-router';

definePage({
  path: "assignment/invoice-audit/:assignment_batche_id/:third_id/:invoice_audit_id?",
  name: "AssignmentPatient-List",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "assignmentBatche.list",
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
  url: `/assignment/paginatePatient/${assignment_batche_id}/${third_id}/${invoice_audit_id}`,
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
    delete: { url: '/assignment/delete' }
  },
  paramsGlobal: {
    company_id: authenticationStore.company.id,
  }
}


//FILTER
const optionsFilter = ref({
  filterLabels: { inputGeneral: 'Buscar en todo' }
})

const goViewInvoiceAuditList = () => {
  router.push({ name: "AssignmentInvoiceAudit-List", params: { assignment_batche_id: assignment_batche_id, third_id: third_id } })
}

</script>

<template>
  <div>

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
        </TableFullNew>
      </VCardText>
    </VCard>
  </div>
</template>
