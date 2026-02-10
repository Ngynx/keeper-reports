import { Injectable } from "@nestjs/common";
import { Workbook, Worksheet, Column } from 'exceljs';
import * as path from 'path';

@Injectable()
export class ExcelGeneratorService {

    async generateIncidentsReportFromChunks(
        processChunks: (onChunk: (chunk: any[]) => Promise<void>) => Promise<void>
    ): Promise<Workbook> {
        const workbook = await this.loadTemplate('src/common/templates/FormatoIncidente.xlsx');
        const worksheet = workbook.getWorksheet("Incidentes");

        if (!worksheet) {
            throw new Error("Worksheet 'Incidentes' not found in the template.");
        };

        this.setupColumns(worksheet);

        let rowIndex = 0;

        await processChunks(async (chunk: any[]) => {
            this.addDataRows(worksheet, chunk, rowIndex);
            rowIndex += chunk.length;
        });

        this.applyFormatting(worksheet);

        return workbook;
    };

    private async loadTemplate(templatePath: string): Promise<Workbook> {
        const workbook = new Workbook();
        const fullPath = path.join(process.cwd(), templatePath);

        try {
            await workbook.xlsx.readFile(fullPath);
            return workbook;
        } catch (error) {
            console.error("Error loading Excel template:", error);
            throw error;
        }
    };

    private setupColumns(worksheet: Worksheet): void {
        const columns: Partial<Column>[] = [
            { header: 'Número', key: 'numero', width: 20 },
            { header: 'Estado', key: 'estado', width: 15 },
            { header: "Categoría", key: "categoria", width: 15 },
            { header: "Subcategoría", key: "subcategoria", width: 30 },
            { header: "Prioridad", key: "prioridad", width: 12 },
            { header: "Plataforma", key: "plataforma", width: 12 },
            { header: "Registrado desde", key: "registrado_desde", width: 15 },
            { header: "Registrado por", key: "registrado_por", width: 20 },
            { header: "Rol del que registra ", key: "registrado_por_rol", width: 20 },
            { header: "Tipo  Informante", key: "informante_tipo", width: 15 },
            { header: "Nombre informante", key: "informante_nombre", width: 18 },
            { header: "Origen", key: "origen", width: 15 },
            { header: "Modalidad patrullaje", key: "modalidad", width: 15 },
            { header: "Tipo patrullaje", key: "tipo_modalidad", width: 15 },
            { header: "Resumen", key: "descripcion", width: 30 },
            { header: "Turno", key: "turno", width: 15 },
            { header: "Jefe de turno (supervisor)", key: "jefe_turno", width: 25 }, // SUPERVISOR
            { header: "Operador (Atendido por/despachador)", key: "operador", width: 32 }, // OPERATOR
            // { header: "Rol del despachador", key: "operator_responsable", width: 18 }, // OPERATOR ROLE
            { header: "Usuarios asignados", key: "usuarios", width: 25 },
            { header: "Vehículos asignados", key: "vehiculos", width: 25 },
            { header: "Grupo de trabajo", key: "grupo_trabajo", width: 30 },
            { header: "Responsable", key: "responsable_area", width: 25 },
            { header: "Descripción resolución interna", key: "descripcion_resolucion", width: 40 },
            { header: "Descripción resolución informante", key: "descripcion_resolucion_informante", width: 40 },
            { header: "Agresores. total", key: "incident_number_of_lawbreakers", width: 15 }, // AG
            { header: "Agresores. hombres", key: "incident_number_of_lawbreakers_male", width: 18 }, // AG M
            { header: "Agresores. mujeres", key: "incident_number_of_lawbreakers_female", width: 18 }, // AG W
            { header: "Agresores. adultos", key: "incident_number_of_lawbreakers_adult", width: 18 }, // AG MAX
            { header: "Agresores. menores", key: "incident_number_of_lawbreakers_minor", width: 18 }, // AG MIN
            { header: "Víctimas. total", key: "incident_number_of_victims", width: 18 }, // VIC
            { header: "Víctimas. hombres", key: "incident_number_of_victims_male", width: 18 }, // VIC M
            { header: "Víctimas. mujeres", key: "incident_number_of_victims_female", width: 18 }, // VIC W
            { header: "Víctimas. adultas", key: "incident_number_of_victims_adult", width: 18 }, // VIC MAX
            { header: "Víctimas. menores", key: "incident_number_of_victims_minor", width: 18 }, // VIC MIN
            { header: "Reportado desde", key: "reportado_desde", width: 32 },
            { header: "Fecha 'Recepción'", key: "incident_creation_date", width: 15 },
            { header: "Hora 'Recepción'", key: "incident_creation_time", width: 15 },
            { header: "Fecha 'En progreso'", key: "incident_in_progress_date", width: 15 },
            { header: "Hora 'En progreso'", key: "incident_in_progress_time", width: 15 },
            { header: "Fecha 'Resolución'", key: "incident_resolved_date", width: 15 },
            { header: "Hora 'Resolución'", key: "incident_resolved_time", width: 15 },
            { header: "Tiempo transcurrido (Tiempo de resolucion)", key: "incident_resolution_time", width: 30 },
            { header: "Clasificación", key: "incident_is_real", width: 20 },
            { header: "Relación del incidente", key: "incident_is_duplicated", width: 20 },
            { header: "Latitud", key: "taxpayer_location_latitude", width: 20 },
            { header: "Longitud", key: "taxpayer_location_longitude", width: 20 },
            // // { header: "Incidente derivado", key: "incident_parent_id", width: 20 },
            // // { header: "Número incidente derivado", key: "incident_parent_ticket_number", width: 25 },

            // // CALIFICACIONEs
            { header: "Reporte - Fotos", key: "reporte_fotos", width: 15 },
            { header: "Reporte - Coordenadas", key: "reporte_coordenadas", width: 25 },
            { header: "Reporte - Descripcion", key: "reporte_descripcion", width: 25 },
            { header: "Reporte - Puntaje", key: "reporte_puntaje", width: 15 },
            // // ATENCIONEs
            { header: "Atención - Operador Base - Tiempo rsp", key: "atencion_op_base_tiempo_rsp", width: 40 },
            { header: "Atención - Operador Base - Tiempo rsp puntaje", key: "atencion_op_base_tiempo_rsp_puntaje", width: 45 },

            { header: "Atención - Operador Base - Asig. vehículos", key: "atencion_op_base_vehiculos", width: 45 },
            { header: "Atención - Operador Base - Asig. personal", key: "atencion_op_base_usuarios", width: 45 },
            { header: "Atención - Operador Base - Comentarios coord", key: "atencion_op_base_comentarios_coord", width: 45 },
            { header: "Atención - Operador Base - puntaje", key: "atencion_op_base_puntaje", width: 30 },

            { header: "Atención - Sereno - Fotos resolución", key: "atencion_sereno_fotos_resolucion", width: 45 },
            { header: "Atención - Sereno - Comentarios de actuados", key: "atencion_sereno_comentarios_act", width: 45 },
            { header: "Atención - Sereno - Número de personas intervenidas", key: "atencion_sereno_personas_interv", width: 50 },
            { header: "Atención - Sereno - puntaje", key: "atencion_sereno_puntaje", width: 30 },
            // // CIERRE
            { header: "Cierre - Detalles de resolucion", key: "cierre_detalle_resolucion", width: 45 },
            { header: "Cierre - Mensaje al vecino", key: "cierre_mensaje_vecino", width: 35 },
            { header: "Cierre - Contador de intervenidos", key: "cierre_personas_interv", width: 35 },
            { header: "Cierre - Puntaje", key: "cierre_puntaje", width: 25 },
            { header: "Tiempo de resolucion", key: "cierre_tiempo_resolucion", width: 30 },
            { header: "Puntaje Final", key: "puntaje_final", width: 25 },

            // // { header: "", key: "", width: 25 },


        ];

        worksheet.columns = columns;
    };

    private addDataRows(worksheet: Worksheet, data: any[], startIndex: number): void {
        data.forEach((rowData, index) => {
            const row = worksheet.addRow(rowData);
            const globalIndex = startIndex + index;

            // Aplicar formato condicional por prioridad
            // this.applyConditionalFormatting(row, rowData, globalIndex);
        });
    };

    private applyFormatting(worksheet: Worksheet): void {
        // Formatear encabezados
        const headerRow = worksheet.getRow(1);
        headerRow.font = {
            bold: true,
            size: 12,
            color: { argb: 'FFFFFFFF' }
        };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4472C4' }
        };
        headerRow.alignment = {
            vertical: 'middle',
            horizontal: 'center'
        };
        headerRow.height = 25;

        // Aplicar bordes a todas las celdas con datos
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            row.eachCell({ includeEmpty: true }, (cell) => {
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FFD3D3D3' } },
                    left: { style: 'thin', color: { argb: 'FFD3D3D3' } },
                    bottom: { style: 'thin', color: { argb: 'FFD3D3D3' } },
                    right: { style: 'thin', color: { argb: 'FFD3D3D3' } }
                };

                // Alinear texto
                if (rowNumber > 1) {
                    cell.alignment = {
                        vertical: 'middle',
                        horizontal: 'left',
                        wrapText: true
                    };
                }
            });
        });

        // Congelar la primera fila (encabezados)
        worksheet.views = [
            { state: 'frozen', xSplit: 0, ySplit: 1 }
        ];

        // Auto-filtro
        worksheet.autoFilter = {
            from: 'A1',
            to: `G${worksheet.rowCount}`
        };
    };

}