<script setup lang="ts">
definePage({
  path: "Filing/New/ListUsers/:id/:invoice_id",
  name: "Filing-New-ListUsers",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "filing.new.list",
  },
});

import { onMounted, ref } from 'vue';

// ID de la factura (ajústalo para que sea dinámico si usas parámetros de ruta)
const route = useRoute();
const invoiceId = ref(route.params.invoice_id);

// Estado reactivo
const users = ref([]);
const loading = ref(false);
const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
  from: 0,
  to: 0,
});

// Encabezados de la tabla
const headers = ref([
  { title: 'Documento', key: 'numDocumentoIdentificacion', align: 'start', sortable: true },
  { title: 'Tipo Usuario', key: 'tipoUsuario', align: 'center', sortable: true },
  { title: 'Sexo', key: 'codSexo', align: 'center', sortable: true },
]);

// Función para obtener los usuarios
const fetchUsers = async (options = {}) => {
  loading.value = true;

  // Extraer opciones de paginación y ordenamiento
  const { page, itemsPerPage, sortBy, sortDesc } = options;

  try {
    const { data, response } = await useApi<any>(
      createUrl(`/filing-invoices/${invoiceId.value}/users`, {
        query: {
          page: page || pagination.value.current_page,
          per_page: itemsPerPage || pagination.value.per_page,
          sortBy: sortBy?.[0] || '', // Primer campo de ordenamiento
          sortDesc: sortDesc?.[0] || false, // Dirección del primer ordenamiento
        },
      })
    );

    if (response.value?.ok && data.value) {
      users.value = data.value.data;
      pagination.value = data.value.pagination;
    }
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
  } finally {
    loading.value = false;
  }
};

// Cargar datos iniciales
onMounted(() => {
  fetchUsers({ page: 1, itemsPerPage: 10 });
});
</script>

<template>
  <div>
    <v-data-table :headers="headers" :items="users" :server-items-length="pagination.total"
      :items-per-page="pagination.per_page" :page="pagination.current_page" :loading="loading" class="elevation-1"
      @update:options="fetchUsers">
      <!-- Mensaje cuando no hay datos -->
      <template v-slot:no-data>
        <v-alert :value="true" color="warning" icon="mdi-alert">
          No hay usuarios disponibles
        </v-alert>
      </template>
    </v-data-table>
  </div>
</template>
