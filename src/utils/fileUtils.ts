// Utilidades para manejo de archivos y uploads

/**
 * Interfaz para información de archivo
 */
export interface FileInfo {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  extension: string;
}

/**
 * Interfaz para resultado de upload
 */
export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  progress?: number;
}

/**
 * Convierte bytes a formato legible
 * @param bytes - Número de bytes
 * @param decimals - Número de decimales (por defecto 2)
 * @returns Tamaño formateado
 */
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Obtiene la extensión de un archivo
 * @param filename - Nombre del archivo
 * @returns Extensión del archivo
 */
export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase();
};

/**
 * Obtiene información de un archivo
 * @param file - Archivo
 * @returns Información del archivo
 */
export const getFileInfo = (file: File): FileInfo => {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
    extension: getFileExtension(file.name)
  };
};

/**
 * Verifica si un archivo es una imagen
 * @param file - Archivo a verificar
 * @returns true si es una imagen
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

/**
 * Verifica si un archivo es un documento
 * @param file - Archivo a verificar
 * @returns true si es un documento
 */
export const isDocumentFile = (file: File): boolean => {
  const documentTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv'
  ];
  
  return documentTypes.includes(file.type);
};

/**
 * Convierte un archivo a base64
 * @param file - Archivo a convertir
 * @returns Promise con el string base64
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Error al convertir archivo a base64'));
      }
    };
    reader.onerror = error => reject(error);
  });
};

/**
 * Lee un archivo como texto
 * @param file - Archivo a leer
 * @returns Promise con el contenido del archivo
 */
export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Error al leer archivo como texto'));
      }
    };
    reader.onerror = error => reject(error);
  });
};

/**
 * Crea una URL temporal para un archivo
 * @param file - Archivo
 * @returns URL temporal
 */
export const createFileURL = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Libera una URL temporal de archivo
 * @param url - URL a liberar
 */
export const revokeFileURL = (url: string): void => {
  URL.revokeObjectURL(url);
};

/**
 * Comprime una imagen
 * @param file - Archivo de imagen
 * @param quality - Calidad de compresión (0-1)
 * @param maxWidth - Ancho máximo
 * @param maxHeight - Alto máximo
 * @returns Promise con el archivo comprimido
 */
export const compressImage = (
  file: File,
  quality: number = 0.8,
  maxWidth: number = 1920,
  maxHeight: number = 1080
): Promise<File> => {
  return new Promise((resolve, reject) => {
    if (!isImageFile(file)) {
      reject(new Error('El archivo no es una imagen'));
      return;
    }
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calcular nuevas dimensiones
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Dibujar imagen redimensionada
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Convertir a blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Error al comprimir imagen'));
          }
        },
        file.type,
        quality
      );
    };
    
    img.onerror = () => reject(new Error('Error al cargar imagen'));
    img.src = createFileURL(file);
  });
};

/**
 * Simula un upload de archivo con progreso
 * @param file - Archivo a subir
 * @param onProgress - Callback de progreso
 * @returns Promise con el resultado del upload
 */
export const uploadFile = (
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResult> => {
  return new Promise((resolve) => {
    let progress = 0;
    
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Simular URL de archivo subido
        const fileUrl = `https://storage.example.com/files/${Date.now()}-${file.name}`;
        
        setTimeout(() => {
          resolve({
            success: true,
            url: fileUrl,
            progress: 100
          });
        }, 200);
      }
      
      onProgress?.(Math.min(progress, 100));
    }, 100);
  });
};

/**
 * Descarga un archivo desde una URL
 * @param url - URL del archivo
 * @param filename - Nombre del archivo
 */
export const downloadFile = (url: string, filename?: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || 'download';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Descarga contenido como archivo
 * @param content - Contenido del archivo
 * @param filename - Nombre del archivo
 * @param type - Tipo MIME del archivo
 */
export const downloadContent = (
  content: string,
  filename: string,
  type: string = 'text/plain'
): void => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  downloadFile(url, filename);
  URL.revokeObjectURL(url);
};

/**
 * Convierte datos a CSV y los descarga
 * @param data - Array de objetos
 * @param filename - Nombre del archivo
 */
export const downloadCSV = (data: any[], filename: string): void => {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escapar comillas y envolver en comillas si contiene comas
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');
  
  downloadContent(csvContent, filename, 'text/csv');
};

/**
 * Convierte datos a JSON y los descarga
 * @param data - Datos a exportar
 * @param filename - Nombre del archivo
 */
export const downloadJSON = (data: any, filename: string): void => {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadContent(jsonContent, filename, 'application/json');
};

/**
 * Valida múltiples archivos
 * @param files - Lista de archivos
 * @param options - Opciones de validación
 * @returns Array de errores por archivo
 */
export const validateFiles = (
  files: FileList | File[],
  options: {
    maxSize?: number;
    allowedTypes?: string[];
    maxFiles?: number;
  } = {}
): string[] => {
  const errors: string[] = [];
  const fileArray = Array.from(files);
  
  if (options.maxFiles && fileArray.length > options.maxFiles) {
    errors.push(`Máximo ${options.maxFiles} archivos permitidos`);
  }
  
  fileArray.forEach((file, index) => {
    if (options.maxSize && file.size > options.maxSize) {
      errors.push(`Archivo ${index + 1}: Tamaño excede el límite (${formatFileSize(options.maxSize)})`);
    }
    
    if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
      errors.push(`Archivo ${index + 1}: Tipo no permitido (${file.type})`);
    }
  });
  
  return errors;
};

/**
 * Obtiene el icono apropiado para un tipo de archivo
 * @param file - Archivo o tipo MIME
 * @returns Nombre del icono
 */
export const getFileIcon = (file: File | string): string => {
  const type = typeof file === 'string' ? file : file.type;
  
  if (type.startsWith('image/')) return 'image';
  if (type.startsWith('video/')) return 'videocam';
  if (type.startsWith('audio/')) return 'audiotrack';
  if (type === 'application/pdf') return 'picture_as_pdf';
  if (type.includes('word')) return 'description';
  if (type.includes('excel') || type.includes('spreadsheet')) return 'table_chart';
  if (type.includes('powerpoint') || type.includes('presentation')) return 'slideshow';
  if (type.startsWith('text/')) return 'text_snippet';
  if (type.includes('zip') || type.includes('rar') || type.includes('archive')) return 'archive';
  
  return 'insert_drive_file';
};