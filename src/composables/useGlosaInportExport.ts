export function useGlosaInportExport() {
  const isLoadingExcel = ref(false);

  const downloadExcel = async (params = {}) => { // Default to empty object if no params provided
    isLoadingExcel.value = true;

    try {
      const { data, response } = await useAxios("/invoiceAudit/exportDataToGlosasImportCsv").post(params);

      if (response.status === 200 && data && data.code === 200) {
        downloadExcelBase64(data.excel, "Servicios " + new Date().toLocaleDateString() + ".xlsx");
      } else {
        // Handle unexpected response status or data structure
        console.error("Unexpected response:", response.status, data);
        // alert("Error: No se pudo descargar el archivo Excel. Por favor, intenta de nuevo.");
      }
    } catch (error) {
      // Handle errors from the request
      console.error("Error downloading Excel:", error);

      // Check if it's an Axios error with a response
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error("Server error:", error.response.status, error.response.data);
        // alert(`Error del servidor: ${error.response.status} - ${error.response.data.message || "Intenta de nuevo."}`);
      } else if (error.request) {
        // Request was made but no response received (e.g., network error)
        console.error("Network error:", error.request);
        // alert("Error de red: No se pudo conectar al servidor. Verifica tu conexión.");
      } else {
        // Other errors (e.g., setup issue or unexpected runtime error)
        console.error("Unexpected error:", error.message);
        // alert("Error inesperado: " + error.message);
      }
    } finally {
      // Ensure loading state is reset regardless of success or failure
      isLoadingExcel.value = false;
    }
  };

  return {
    downloadExcel,
    isLoadingExcel,
  };
}
