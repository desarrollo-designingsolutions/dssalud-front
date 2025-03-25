<script setup lang="ts">
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { useRouter } from 'vue-router';

definePage({
  path: "InvoiceAuditInformationSheet/invoice-audit/:assignment_batche_id/:third_id/:invoice_audit_id/:patient_id",
  name: "InvoiceAuditInformationSheet-Info",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "invoiceAuditAssignmentBatche.list",
  },
});

const invoiceAudit = ref({});
const third = ref({});
const patient = ref({});

const authenticationStore = useAuthenticationStore();

const router = useRouter();

const route = useRoute();

const assignment_batche_id = route.params.assignment_batche_id;
const third_id = route.params.third_id;
const invoice_audit_id = route.params.invoice_audit_id;
const patient_id = route.params.patient_id;

//LOADING

const isLoading = ref<boolean>(false)

//FILTER
const optionsFilter = ref({
  filterLabels: { inputGeneral: 'Buscar en todo' }
})

const goViewPatient = (data: any = { id: null }) => {

  router.push({ name: "InvoiceAuditPatient-List", params: { assignment_batche_id: assignment_batche_id, third_id: third_id, invoice_audit_id: invoice_audit_id } })

}

const goViewAssignmentBatchesList = () => {

  router.push({ name: "InvoiceAuditAssignmentBatche-List" })

}

const fetchData = async () => {

  const url = `/invoiceAudit/getInformationSheet/${third_id}/${invoice_audit_id}/${patient_id}`

  isLoading.value = true
  const { data, response } = await useApi<any>(url).get();

  if (response.value?.ok && data.value) {
    console.log(data.value)
    invoiceAudit.value = data.value.data.invoice_audit
    third.value = data.value.data.third
    patient.value = data.value.data.patient
  }
  isLoading.value = false
}

onMounted(() => {
  fetchData();
})

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
              <p><strong>N° de radicación</strong> <br> ??? </p>
            </VCol>
            <VCol cols="12" md="2">
              <p><strong>Fecha Radicación</strong> <br> ??? </p>
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
              <p><strong>Nota Credito</strong> <br> ??? </p>
            </VCol>
            <VCol cols="12" md="2">
              <p><strong>Valor Copago</strong> <br> ??? </p>
            </VCol>
            <VCol cols="12" md="2">
              <p><strong>Valor Cuota Moderada</strong> <br> ??? </p>
            </VCol>
            <VCol cols="12" md="2">
              <p><strong>Valor Pago Moderador</strong> <br> ??? </p>
            </VCol>
            <VCol cols="12" md="2">
              <p><strong>Valor Aprobado</strong> <br> ??? </p>
            </VCol>
            <VCol cols="12" md="2">
              <p><strong>Valor Glosado</strong> <br> ??? </p>
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
                  <p><strong>Código Habilitación</strong> <br> ??? </p>
                </VCol>
                <VCol cols="12" md="2">
                  <p><strong>Sede</strong> <br> ??? </p>
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
                  <p><strong>Nombre</strong> <br> {{ patient.first_name }} </p>
                </VCol>
                <VCol cols="12" md="2">
                  <p><strong>Documento</strong> <br> {{ patient.identification_number }} </p>
                </VCol>
                <VCol cols="12" md="2">
                  <p><strong>Edad</strong> <br> ??? </p>
                </VCol>
                <VCol cols="12" md="2">
                  <p><strong>Fecha de Ingreso</strong> <br> ??? </p>
                </VCol>
                <VCol cols="12" md="2">
                  <p><strong>Fecha de Egreso</strong> <br> ??? </p>
                </VCol>
                <VCol cols="12" md="2">
                  <p><strong>Días Estancia</strong> <br> ??? </p>
                </VCol>
              </VRow>
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
      </VCardText>
    </VCard>
  </div>
</template>
