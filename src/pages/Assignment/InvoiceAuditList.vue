<script setup lang="ts">
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { useRouter } from 'vue-router';

definePage({
  path: "assignment/invoice-audit/:assignment_batche_id/:third_id?",
  name: "AssignmentInvoiceAudit-List",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "assignmentBatche.list",
  },
});

const authenticationStore = useAuthenticationStore();

const router = useRouter();

const route = useRoute();

//TABLE
const refTableFull = ref()

const optionsTable = {
  url: `/assignment/paginateInvoiceAudit/${route.params.assignment_batche_id}/${route.params.third_id}`,
  headers: [
    { key: 'invoice_number', title: 'Factura' },
    { key: 'count_patients', title: 'Cantidad Usuarios' },
    { key: 'count_services', title: 'Cant Servicios' },
    { key: 'total_value_services', title: 'Valor Factura' },
    { key: 'glosas', title: 'Glosas' },
    { key: 'value_glosa', title: 'Valor Glosado' },
    { key: 'spent', title: 'Gastado' },
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

const goViewPatients = (data: any = { id: null }) => {
  router.push({ name: "AssignmentPatient-List", params: { assignment_batche_id: route.params.assignment_batche_id, third_id: route.params.third_id, invoice_audit_id: data.id } })
}

const goViewAssignmentList = () => {
  router.push({ name: "Assignment-List", params: { assignment_batche_id: route.params.assignment_batche_id } })
}

</script>

<template>
  <div>

    <VCard>
      <VCardTitle class="d-flex justify-space-between">
        <span>
          Facturas
        </span>

        <div class="d-flex justify-end gap-3 flex-wrap ">
          <VBtn @click="goViewAssignmentList">
            Regresar
          </VBtn>
        </div>
      </VCardTitle>

      <VCardText>
        <FilterDialogNew :options-filter="optionsFilter">
        </FilterDialogNew>
      </VCardText>

      <VCardText class="mt-2">
        <TableFullNew ref="refTableFull" :options="optionsTable" @edit="goViewEdit" @view="goViewView">

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
  </div>
</template>
