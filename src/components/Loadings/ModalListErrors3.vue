<template>
  <v-dialog v-model="dialog" max-width="1200px" persistent>
    <v-card>
      <!-- Header -->
      <v-card-title class="d-flex align-center justify-space-between pa-4">
        <div class="d-flex align-center">
          <v-icon icon="tabler-alert-circle" color="error" class="me-2" />
          <span>Errores del Proceso</span>
          <v-chip v-if="totalErrors > 0" color="error" variant="outlined" size="small" class="ms-2">
            {{ totalErrors }} errores
          </v-chip>
        </div>
        <v-btn icon variant="text" @click="closeModal">
          <v-icon icon="tabler-x" />
        </v-btn>
      </v-card-title>

      <v-divider />

      <!-- Filtros -->
      <v-card-text class="pa-4">
        <v-row>
          <v-col cols="12" md="4">
            <v-select
              v-model="selectedErrorType"
              :items="errorTypes"
              label="Filtrar por tipo de error"
              clearable
              variant="outlined"
              density="compact"
              @update:model-value="handleFilterChange"
            >
              <template v-slot:prepend-inner>
                <v-icon icon="tabler-filter" size="small" />
              </template>
            </v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="searchText"
              label="Buscar en errores"
              variant="outlined"
              density="compact"
              clearable
              @keyup.enter="handleSearch"
            >
              <template v-slot:prepend-inner>
                <v-icon icon="tabler-search" size="small" />
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="12" md="4" class="d-flex align-center gap-2">
            <v-btn
              variant="outlined"
              color="primary"
              @click="handleSearch"
              :loading="loading"
              :disabled="loading"
            >
              <v-icon start icon="tabler-search" />
              Buscar
            </v-btn>
            <v-btn
              variant="outlined"
              color="success"
              @click="exportErrors"
              :loading="exporting"
              :disabled="loading || errors.length === 0"
            >
              <v-icon start icon="tabler-download" />
              Exportar Excel
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <!-- Contenido principal -->
      <v-card-text class="pa-0" style="height: 500px;">
        <!-- Loading -->
        <div v-if="loading" class="d-flex justify-center align-center" style="height: 100%;">
          <v-progress-circular indeterminate color="primary" size="64" />
        </div>

        <!-- Sin errores -->
        <div v-else-if="errors.length === 0 && !loading" class="d-flex flex-column justify-center align-center" style="height: 100%;">
          <v-icon icon="tabler-check-circle" size="64" color="success" class="mb-4" />
          <h3 class="text-h6 mb-2">¡Sin errores!</h3>
          <p class="text-body-2 text-medium-emphasis">Este proceso se completó exitosamente sin errores.</p>
        </div>

        <!-- Lista de errores -->
        <div v-else>
          <!-- Tabla de errores -->
          <v-data-table-virtual
            :headers="headers"
            :items="errors"
            :loading="loading"
            height="500"
            item-value="id"
            class="elevation-0"
          >
            <!-- Fila -->
            <template v-slot:item.row="{ item }">
              <v-chip size="small" color="primary" variant="outlined">
                Fila {{ item.row }}
              </v-chip>
            </template>

            <!-- Tipo de error -->
            <template v-slot:item.error_type="{ item }">
              <v-chip 
                size="small" 
                :color="getErrorTypeColor(item.error_type)"
                variant="tonal"
              >
                {{ item.error_type }}
              </v-chip>
            </template>

            <!-- Campo -->
            <template v-slot:item.column="{ item }">
              <code class="text-caption bg-grey-lighten-4 pa-1 rounded">
                {{ item.column }}
              </code>
            </template>

            <!-- Valor -->
            <template v-slot:item.field_value="{ item }">
              <span class="text-body-2" :title="item.field_value">
                {{ truncateText(item.field_value, 30) }}
              </span>
            </template>

            <!-- message -->
            <template v-slot:item.message="{ item }">
              <v-tooltip>
                <template v-slot:activator="{ props }">
                  <span v-bind="props" class="text-body-2">
                    {{ truncateText(item.message, 50) }}
                  </span>
                </template>
                <span>{{ item.message }}</span>
              </v-tooltip>
            </template>
          </v-data-table-virtual>

          <!-- Paginación -->
          <v-divider />
          <div class="d-flex justify-space-between align-center pa-4">
            <div class="text-body-2 text-medium-emphasis">
              Mostrando {{ errors.length }} de {{ totalErrors }} errores
              <span v-if="isChunked" class="ms-2">
                <v-chip size="x-small" color="info" variant="outlined">
                  Datos fragmentados
                </v-chip>
              </span>
            </div>
            
            <div class="d-flex align-center">
              <v-select
                v-model="itemsPerPage"
                :items="[50, 100, 200, 500]"
                label="Por página"
                variant="outlined"
                density="compact"
                style="width: 120px;"
                class="me-4"
                @update:model-value="handlePerPageChange"
              />
              
              <v-pagination
                v-model="currentPage"
                :length="totalPages"
                :total-visible="5"
                @update:model-value="handlePageChange"
                :disabled="loading"
              />
            </div>
          </div>
        </div>
      </v-card-text>

      <!-- Footer -->
      <v-divider />
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" @click="closeModal">
          Cerrar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import axios from 'axios'
import { computed, ref, watch } from 'vue'
import * as XLSX from 'xlsx'

// Props y emits
const emit = defineEmits(['close'])

// Estado del modal
const dialog = ref(false)
const currentBatchId = ref('')

// Estado de datos
const errors = ref([])
const loading = ref(false)
const exporting = ref(false)
const totalErrors = ref(0)
const currentPage = ref(1)
const itemsPerPage = ref(100)
const isChunked = ref(false)

// Filtros
const selectedErrorType = ref(null)
const searchText = ref('')
const errorTypes = ref([])

// Headers de la tabla
const headers = [
  { title: 'Fila', key: 'row', width: '80px', sortable: true },
  { title: 'Tipo de Error', key: 'error_type', width: '150px', sortable: true },
  { title: 'Campo', key: 'column', width: '120px', sortable: true },
  { title: 'Valor', key: 'field_value', width: '150px', sortable: false },
  { title: 'message', key: 'message', sortable: false }
]

// Computed
const totalPages = computed(() => {
  return Math.ceil(totalErrors.value / itemsPerPage.value)
})

// Métodos principales
const openModal = async (batchId) => {
  currentBatchId.value = batchId
  dialog.value = true
  currentPage.value = 1
  selectedErrorType.value = null
  searchText.value = ''
  await loadErrors()
}

const closeModal = () => {
  dialog.value = false
  errors.value = []
  errorTypes.value = []
  totalErrors.value = 0
  currentBatchId.value = ''
  emit('close')
}

const loadErrors = async () => {
  if (!currentBatchId.value) return
  
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      per_page: itemsPerPage.value
    }
    
    if (selectedErrorType.value) {
      params.error_type = selectedErrorType.value
    }

    const { response, data } = await useAxios(`/process/${currentBatchId.value}/errors`).get({
      params
    });

    if (response.status == 200 && data) {
      errors.value = data.data
      totalErrors.value = data.meta.total
      isChunked.value = data.meta.is_chunked || false
      
      // Extraer tipos de error únicos para el filtro
      if (currentPage.value === 1 && !selectedErrorType.value) {
        const uniqueTypes = [...new Set(errors.value.map(error => error.error_type))]
        errorTypes.value = uniqueTypes.map(type => ({
          title: type,
          value: type
        }))
      }
    }
  } catch (error) {
    console.error('Error cargando errores:', error)
    // Aquí podrías mostrar un snackbar de error
  } finally {
    loading.value = false
  }
}

// Manejadores de eventos
const handlePageChange = (page) => {
  currentPage.value = page
  loadErrors()
}

const handlePerPageChange = () => {
  currentPage.value = 1
  loadErrors()
}

const handleFilterChange = () => {
  currentPage.value = 1
  loadErrors()
}

const performSearch = async () => {
  if (!searchText.value.trim()) {
    // Si no hay texto de búsqueda, cargar todos los errores
    await loadErrors()
    return
  }
  
  loading.value = true
  try {
    const params = {
      page: 1,
      btach_id: currentBatchId.value,
      per_page: itemsPerPage.value,
      search: searchText.value.trim()
    }
    
    if (selectedErrorType.value) {
      params.error_type = selectedErrorType.value
    }

    const { response, data } = await useAxios(`/process/${currentBatchId.value}/errors`).get({
      params
    });

    if (response.status == 200 && data) {
      errors.value = data.data
      totalErrors.value = data.meta.total
      currentPage.value = 1 // Reset a la primera página
    }
  } catch (error) {
    console.error('Error buscando errores:', error)
  } finally {
    loading.value = false
  }
}

// Remover la función handleSearch anterior y agregar esta nueva
const handleSearch = () => {
  // Esta función ahora solo se ejecuta cuando se presiona el botón
  performSearch()
}

const getErrorTypeColor = (error_type) => {
  const colors = {
    'validation': 'warning',
    'required': 'error',
    'format': 'info',
    'duplicate': 'secondary',
    'database': 'error'
  }
  return colors[error_type] || 'grey'
}

const truncateText = (text, maxLength) => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

const exportErrors = async () => {
  exporting.value = true
  try {
    const response = await axios.get(`/api/process/${currentBatchId.value}/errors`, {
      params: {
        page: 1,
        per_page: totalErrors.value,
        error_type: selectedErrorType.value
      }
    })

    if (response.data.success) {
      downloadExcel(response.data.data, `errores_${currentBatchId.value}.xlsx`)
    }
  } catch (error) {
    console.error('Error exportando errores:', error)
  } finally {
    exporting.value = false
  }
}

const downloadExcel = (data, filename) => {
  // Preparar los datos para Excel
  const excelData = data.map(error => ({
    'Fila': error.row,
    'Tipo de Error': error.error_type,
    'Columna': error.column,
    'Valor': error.field_value || '',
    'message': error.message
  }))
  
  // Crear workbook y worksheet
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(excelData)
  
  // Ajustar ancho de columnas
  const colWidths = [
    { wch: 10 }, // Fila
    { wch: 20 }, // Tipo de Error
    { wch: 15 }, // Columna
    { wch: 25 }, // Valor
    { wch: 50 }  // message
  ]
  ws['!cols'] = colWidths
  
  // Agregar worksheet al workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Errores')
  
  // Descargar archivo
  XLSX.writeFile(wb, filename)
}

// Exponer métodos
defineExpose({
  openModal
})

// Watchers
watch(dialog, (newVal) => {
  if (!newVal) {
    closeModal()
  }
})
</script>

<style scoped>
.v-data-table-virtual {
  border: none !important;
}

.v-data-table-virtual :deep(.v-data-table__wrapper) {
  border: none !important;
}

code {
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
}

.v-chip {
  font-weight: 500;
}
</style>
