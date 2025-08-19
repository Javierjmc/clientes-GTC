import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * Opciones para exportar datos
 */
export interface ExportOptions {
  filename?: string;
  title?: string;
  subtitle?: string;
  author?: string;
  orientation?: 'portrait' | 'landscape';
  pageSize?: 'a4' | 'letter' | 'legal';
  includeDate?: boolean;
  includePageNumbers?: boolean;
  customHeader?: string;
  customFooter?: string;
}

/**
 * Configuración de columna para exportación
 */
export interface ColumnConfig {
  key: string;
  title: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  format?: (value: any) => string;
}

/**
 * Datos para gráficos en PDF
 */
export interface ChartData {
  type: 'bar' | 'line' | 'pie';
  title: string;
  data: any[];
  labels?: string[];
  colors?: string[];
}

/**
 * Utilidades para exportar datos a PDF
 */
export class PDFExporter {
  private doc: jsPDF;
  private currentY: number = 20;
  private pageHeight: number;
  private pageWidth: number;
  private margin: number = 20;

  constructor(options: ExportOptions = {}) {
    this.doc = new jsPDF({
      orientation: options.orientation || 'portrait',
      unit: 'mm',
      format: options.pageSize || 'a4'
    });
    
    this.pageHeight = this.doc.internal.pageSize.height;
    this.pageWidth = this.doc.internal.pageSize.width;
    
    // Configurar metadatos
    if (options.title) {
      this.doc.setProperties({ title: options.title });
    }
    if (options.author) {
      this.doc.setProperties({ author: options.author });
    }
  }

  /**
   * Agregar título al documento
   */
  addTitle(title: string, fontSize: number = 20): void {
    this.doc.setFontSize(fontSize);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.pageWidth / 2, this.currentY, { align: 'center' });
    this.currentY += fontSize * 0.5 + 10;
  }

  /**
   * Agregar subtítulo
   */
  addSubtitle(subtitle: string, fontSize: number = 14): void {
    this.doc.setFontSize(fontSize);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(subtitle, this.pageWidth / 2, this.currentY, { align: 'center' });
    this.currentY += fontSize * 0.5 + 8;
  }

  /**
   * Agregar fecha actual
   */
  addDate(): void {
    const date = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Fecha: ${date}`, this.pageWidth - this.margin, this.currentY, { align: 'right' });
    this.currentY += 15;
  }

  /**
   * Agregar texto
   */
  addText(text: string, fontSize: number = 12, style: 'normal' | 'bold' = 'normal'): void {
    this.doc.setFontSize(fontSize);
    this.doc.setFont('helvetica', style);
    
    const lines = this.doc.splitTextToSize(text, this.pageWidth - 2 * this.margin);
    this.doc.text(lines, this.margin, this.currentY);
    this.currentY += lines.length * fontSize * 0.5 + 5;
  }

  /**
   * Agregar tabla
   */
  addTable(data: any[], columns: ColumnConfig[], options: any = {}): void {
    const tableColumns = columns.map(col => col.title);
    const tableRows = data.map(row => 
      columns.map(col => {
        const value = row[col.key];
        return col.format ? col.format(value) : String(value || '');
      })
    );

    (this.doc as any).autoTable({
      head: [tableColumns],
      body: tableRows,
      startY: this.currentY,
      margin: { left: this.margin, right: this.margin },
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: columns.reduce((acc, col, index) => {
        acc[index] = {
          halign: col.align || 'left',
          cellWidth: col.width || 'auto'
        };
        return acc;
      }, {} as any),
      ...options
    });

    this.currentY = (this.doc as any).lastAutoTable.finalY + 10;
  }

  /**
   * Agregar nueva página
   */
  addPage(): void {
    this.doc.addPage();
    this.currentY = 20;
  }

  /**
   * Verificar si necesita nueva página
   */
  checkPageBreak(requiredHeight: number = 20): void {
    if (this.currentY + requiredHeight > this.pageHeight - this.margin) {
      this.addPage();
    }
  }

  /**
   * Agregar números de página
   */
  addPageNumbers(): void {
    const pageCount = this.doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(10);
      this.doc.text(
        `Página ${i} de ${pageCount}`,
        this.pageWidth / 2,
        this.pageHeight - 10,
        { align: 'center' }
      );
    }
  }

  /**
   * Guardar el documento
   */
  save(filename: string = 'documento.pdf'): void {
    this.doc.save(filename);
  }

  /**
   * Obtener el blob del documento
   */
  getBlob(): Blob {
    return this.doc.output('blob');
  }
}

/**
 * Utilidades para exportar datos a Excel
 */
export class ExcelExporter {
  private workbook: XLSX.WorkBook;

  constructor() {
    this.workbook = XLSX.utils.book_new();
  }

  /**
   * Agregar hoja de cálculo
   */
  addSheet(data: any[], sheetName: string, columns?: ColumnConfig[]): void {
    let processedData = data;

    // Si se proporcionan columnas, formatear los datos
    if (columns) {
      processedData = data.map(row => {
        const newRow: any = {};
        columns.forEach(col => {
          const value = row[col.key];
          newRow[col.title] = col.format ? col.format(value) : value;
        });
        return newRow;
      });
    }

    const worksheet = XLSX.utils.json_to_sheet(processedData);
    
    // Configurar ancho de columnas
    if (columns) {
      const colWidths = columns.map(col => ({
        wch: col.width || 15
      }));
      worksheet['!cols'] = colWidths;
    }

    XLSX.utils.book_append_sheet(this.workbook, worksheet, sheetName);
  }

  /**
   * Agregar hoja con datos sin procesar
   */
  addRawSheet(data: any[][], sheetName: string, headers?: string[]): void {
    const worksheet = XLSX.utils.aoa_to_sheet(headers ? [headers, ...data] : data);
    XLSX.utils.book_append_sheet(this.workbook, worksheet, sheetName);
  }

  /**
   * Guardar el archivo
   */
  save(filename: string = 'datos.xlsx'): void {
    XLSX.writeFile(this.workbook, filename);
  }

  /**
   * Obtener el buffer del archivo
   */
  getBuffer(): ArrayBuffer {
    return XLSX.write(this.workbook, { bookType: 'xlsx', type: 'array' });
  }

  /**
   * Obtener el blob del archivo
   */
  getBlob(): Blob {
    const buffer = this.getBuffer();
    return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }
}

/**
 * Funciones de utilidad para exportación rápida
 */

/**
 * Exportar datos a PDF
 */
export const exportToPDF = (
  data: any[],
  columns: ColumnConfig[],
  options: ExportOptions = {}
): void => {
  const exporter = new PDFExporter(options);
  
  if (options.title) {
    exporter.addTitle(options.title);
  }
  
  if (options.subtitle) {
    exporter.addSubtitle(options.subtitle);
  }
  
  if (options.includeDate !== false) {
    exporter.addDate();
  }
  
  exporter.addTable(data, columns);
  
  if (options.includePageNumbers !== false) {
    exporter.addPageNumbers();
  }
  
  exporter.save(options.filename || 'reporte.pdf');
};

/**
 * Exportar datos a Excel
 */
export const exportToExcel = (
  data: any[],
  columns: ColumnConfig[],
  options: ExportOptions = {}
): void => {
  const exporter = new ExcelExporter();
  exporter.addSheet(data, options.title || 'Datos', columns);
  exporter.save(options.filename || 'datos.xlsx');
};

/**
 * Exportar múltiples hojas a Excel
 */
export const exportMultipleToExcel = (
  sheets: Array<{
    data: any[];
    name: string;
    columns?: ColumnConfig[];
  }>,
  filename: string = 'reporte.xlsx'
): void => {
  const exporter = new ExcelExporter();
  
  sheets.forEach(sheet => {
    exporter.addSheet(sheet.data, sheet.name, sheet.columns);
  });
  
  exporter.save(filename);
};

/**
 * Exportar datos a CSV
 */
export const exportToCSV = (
  data: any[],
  columns: ColumnConfig[],
  filename: string = 'datos.csv'
): void => {
  const headers = columns.map(col => col.title).join(',');
  const rows = data.map(row => 
    columns.map(col => {
      const value = row[col.key];
      const formattedValue = col.format ? col.format(value) : String(value || '');
      // Escapar comillas y comas
      return `"${formattedValue.replace(/"/g, '""')}"`;
    }).join(',')
  );
  
  const csvContent = [headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, filename);
};

/**
 * Exportar datos a JSON
 */
export const exportToJSON = (
  data: any[],
  filename: string = 'datos.json'
): void => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  saveAs(blob, filename);
};

/**
 * Generar reporte completo con múltiples secciones
 */
export const generateCompleteReport = (
  sections: Array<{
    title: string;
    data: any[];
    columns: ColumnConfig[];
    description?: string;
  }>,
  options: ExportOptions = {}
): void => {
  const exporter = new PDFExporter(options);
  
  // Título principal
  if (options.title) {
    exporter.addTitle(options.title);
  }
  
  if (options.subtitle) {
    exporter.addSubtitle(options.subtitle);
  }
  
  if (options.includeDate !== false) {
    exporter.addDate();
  }
  
  // Agregar cada sección
  sections.forEach((section, index) => {
    if (index > 0) {
      exporter.checkPageBreak(50);
    }
    
    exporter.addText(section.title, 16, 'bold');
    
    if (section.description) {
      exporter.addText(section.description, 12);
    }
    
    exporter.addTable(section.data, section.columns);
  });
  
  if (options.includePageNumbers !== false) {
    exporter.addPageNumbers();
  }
  
  exporter.save(options.filename || 'reporte-completo.pdf');
};

/**
 * Configuraciones predefinidas de columnas para entidades comunes
 */
export const commonColumnConfigs = {
  projects: [
    { key: 'name', title: 'Nombre', width: 30 },
    { key: 'client', title: 'Cliente', width: 25 },
    { key: 'status', title: 'Estado', width: 15, align: 'center' as const },
    { key: 'startDate', title: 'Fecha Inicio', width: 20, format: (date: string) => new Date(date).toLocaleDateString('es-ES') },
    { key: 'budget', title: 'Presupuesto', width: 20, align: 'right' as const, format: (value: number) => `$${value?.toLocaleString() || '0'}` }
  ],
  
  users: [
    { key: 'name', title: 'Nombre', width: 25 },
    { key: 'email', title: 'Email', width: 30 },
    { key: 'role', title: 'Rol', width: 15, align: 'center' as const },
    { key: 'department', title: 'Departamento', width: 20 },
    { key: 'createdAt', title: 'Fecha Registro', width: 20, format: (date: string) => new Date(date).toLocaleDateString('es-ES') }
  ],
  
  tasks: [
    { key: 'title', title: 'Tarea', width: 35 },
    { key: 'assignee', title: 'Asignado', width: 20 },
    { key: 'status', title: 'Estado', width: 15, align: 'center' as const },
    { key: 'priority', title: 'Prioridad', width: 15, align: 'center' as const },
    { key: 'dueDate', title: 'Fecha Límite', width: 20, format: (date: string) => new Date(date).toLocaleDateString('es-ES') }
  ],
  
  invoices: [
    { key: 'number', title: 'Número', width: 15 },
    { key: 'client', title: 'Cliente', width: 25 },
    { key: 'amount', title: 'Monto', width: 20, align: 'right' as const, format: (value: number) => `$${value?.toLocaleString() || '0'}` },
    { key: 'status', title: 'Estado', width: 15, align: 'center' as const },
    { key: 'dueDate', title: 'Vencimiento', width: 20, format: (date: string) => new Date(date).toLocaleDateString('es-ES') }
  ]
};

export default {
  PDFExporter,
  ExcelExporter,
  exportToPDF,
  exportToExcel,
  exportMultipleToExcel,
  exportToCSV,
  exportToJSON,
  generateCompleteReport,
  commonColumnConfigs
};