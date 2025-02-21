import { ref } from 'vue';
export function useFileDrop(maxAllowedFiles: number, allowedExtensions: string[]) {
  const dropZoneRef = ref<HTMLDivElement>();
  const fileData = ref<FileData[]>([]);
  const { open, onChange } = useFileDialog({});
  const error = ref<string | null>(null);

  interface FileData {
    file: File;
    url: string;
    progress?: number;
    status?: 'pending' | 'uploading' | 'completed' | 'failed';
  }

  function onDrop(DroppedFiles: File[] | null) {
    if (!DroppedFiles) return;

    if (fileData.value.length >= maxAllowedFiles) {
      error.value = `Se ha alcanzado el límite de ${maxAllowedFiles} archivo${maxAllowedFiles !== 1 ? 's' : ''}.`;
      return;
    }

    if (!verifyFileLimit(DroppedFiles.length)) {
      return;
    }

    DroppedFiles.forEach(file => {
      if (!validateFileExtension(file)) {
        error.value = `Solo se permiten archivos con extensión ${allowedExtensions.join(', ')}.`;
        return;
      }

      fileData.value.push({
        file,
        url: URL.createObjectURL(file),
        progress: undefined,
        status: 'pending'
      });
    });
  }

  onChange(selectedFiles => {
    if (!selectedFiles) return;

    if (fileData.value.length >= maxAllowedFiles) {
      error.value = `Se ha alcanzado el límite de ${maxAllowedFiles} archivo${maxAllowedFiles !== 1 ? 's' : ''}.`;
      return;
    }

    if (!verifyFileLimit(selectedFiles.length)) {
      return;
    }

    for (const file of selectedFiles) {
      if (!validateFileExtension(file)) {
        error.value = `Solo se permiten archivos con extensión ${allowedExtensions.join(', ')}.`;
        continue; // Pasamos al siguiente archivo sin añadir este
      }

      fileData.value.push({
        file,
        url: URL.createObjectURL(file),
        progress: undefined,
        status: 'pending'
      });
    }
  });

  const verifyFileLimit = (fileCount: number): boolean => {
    if (fileData.value.length + fileCount > maxAllowedFiles) {
      error.value = `Solo puedes seleccionar hasta ${maxAllowedFiles - fileData.value.length} archivo${maxAllowedFiles - fileData.value.length !== 1 ? 's' : ''} más.`;
      return false;
    }
    return true;
  };

  const validateFileExtension = (file: File): boolean => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    return fileExtension ? allowedExtensions.includes(fileExtension) : false;
  };

  const resetValues = () => {
    fileData.value = []
    error.value = null

    // Aseguramos que cualquier Blob URL previo sea limpiado
    fileData.value.forEach(data => {
      if (data.url) URL.revokeObjectURL(data.url);
    });
  }
  useDropZone(dropZoneRef, onDrop);

  return {
    dropZoneRef,
    fileData,
    open,
    resetValues,
    error
  };
}
