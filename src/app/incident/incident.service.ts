import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { RangeTimeD } from "./dto/rangetime.dto";
import * as moment from 'moment-timezone';
import { WorkgroupService } from "../workgroup/workgroup.service";
import { User } from "../user/schema/user.schema";
import { ROLEMAP } from "./constants/incident.constant";
import { Incident, IncidentDocument } from "./schema/incident.schema";
import { formatDuration } from "./helpers/format-duration.helper";
import { DELTA_DISPATCH_DB_NAME } from "src/common/constants/database.constant";

@Injectable()
export class IncidentService {

    constructor(
        @InjectModel(Incident.name, DELTA_DISPATCH_DB_NAME)
        private readonly incidentModel: Model<IncidentDocument>,
        private readonly workgroupService: WorkgroupService
    ) { }

    private indexAreaByKey(area_name: string, areas: any[]) {
        const index = Object.create(null);

        for (const c of areas ?? []) {
            index[`${area_name}_area_${c.stage}`] = c;
        };

        return index;
    };

    private indexCriteriasByKey(criterias: any[]) {
        const index = Object.create(null);

        for (const c of criterias ?? []) {
            index[c.criteriaKey] = c;
        }

        return index;
    };

    private getRegisteredFromRoleLabel(incident: any): string {
        const role = incident.incident_registered_from_role;

        if (!role) {
            return incident.incident_registered_from ?? "N/A"
        };
        return ROLEMAP[role] ?? role;
    };

    private getRoleName(fullyRole: string): string {
        if (!fullyRole) return '';
        const separator = ' - ';
        const idx = fullyRole.indexOf(separator);

        return idx === -1
            ? fullyRole
            : fullyRole.slice(idx + separator.length);
    };

    private getUserFullNames(incident: any): string {
        return (
            incident.incident_users
                ?.map(u => u.user_fullname)
                .filter(Boolean)
                .join(', ') || ''
        );
    };

    private getVehicleLabels(incident: any): string {
        return incident.incident_vehicles
            .map(v =>
                v.vehicle_alias
                    ? `${v.vehicle_license_plate} (${v.vehicle_alias})`
                    : v.vehicle_license_plate
            )
            .join(', ');
    };

    //# GENERAL
    private getRegisteredForLabel(registeredFor: string): string {
        const registeredFullName = registeredFor;
        return ROLEMAP[registeredFullName] ?? registeredFullName;
    };

    private formatDate(date: Date): string {
        if (!date) return '';
        // return moment(date)
        //     .tz('America/Lima')
        //     .format('DD/MM/YYYY HH:mm');

        const parsed = new Date(date);
        return isNaN(parsed.getTime())
            ? ''
            : parsed.toLocaleDateString('es-PE', { timeZone: 'America/Lima' });
    };

    private formatTime(date: Date): string {
        if (!date) return '';

        const parsed = new Date(date);
        return isNaN(parsed.getTime())
            ? ''
            : parsed.toLocaleTimeString('es-PE', { timeZone: 'America/Lima' });
    };

    private getResolutionTime(incident: Incident): string {
        if (!incident.incident_resolved_date) {
            return '';
        }

        const diff =
            new Date(incident.incident_resolved_date).getTime() -
            new Date(incident.incident_creation_date).getTime();

        return formatDuration(diff);
    };

    private getDispatchTime(incident: Incident): string {
        if (!incident.incident_in_progress_date) {
            return '';
        }

        const diff =
            new Date(incident.incident_in_progress_date).getTime() -
            new Date(incident.incident_creation_date).getTime();

        return formatDuration(diff);
    };

    private finalCalificationScore(areas: any, attention: any, closure: any): number {
        const totalScore = areas?.reporte_area_funcionario?.totalScore +
            attention?.atencion_area_tiempo_respuesta?.totalScore +
            attention?.atencion_area_operacion_base?.totalScore +
            attention?.atencion_area_sereno?.totalScore +
            closure?.cierre_area_cierre_general?.totalScore;
        return totalScore
    };

    async getIncidentsByDateRange(
        dto: RangeTimeD,
        user: User,
        onChunk: (chunk: any[]) => Promise<void>  // Callback para procesar cada chunk
    ): Promise<any[]> {
        const incidents: any[] = [];

        const CHUNK_SIZE = 500;
        let chunk: any[] = [];

        const rangetimeFrom = moment
            .tz(dto.rangetime_from, 'America/Lima')
            .startOf('day')
            .toDate();

        const rangetimeTo = moment
            .tz(dto.rangetime_to, 'America/Lima')
            .endOf('day')
            .toDate();

        const [workareaMaster, workareaSupervisor] = await Promise.all([
            this.workgroupService.getMasterWorkarea(),
            this.workgroupService.getSupervisorWorkarea(),
        ]);

        const workareaMasterName = workareaMaster?.workgroup_name ?? 'Gerencia de seguridad ciudadana';
        const workareaSupervisorName = workareaSupervisor?.workgroup_name ?? 'Alcaldia';

        const generalPipeline: any = {
            incident_creation_date: {
                $gte: rangetimeFrom, $lt: rangetimeTo
            }
        };

        // # RULEs
        const isAdmin = user.user_admin === true;
        const isMaster = user.workgroup_name === workareaMasterName;
        const isSupervisor = user.workgroup_name === workareaSupervisorName;

        if (!isAdmin && !isMaster && !isSupervisor) {
            generalPipeline.$or = [
                { workgroup_name: user.workgroup_name },
                { 'incident_users.workgroup_name': user.workgroup_name },
                { 'incident_vehicles.vehicle_workgroup_name': user.workgroup_name },
            ];
        };

        const rawData = await this.incidentModel.aggregate([
            { $match: generalPipeline },
            { $sort: { incident_creation_date: -1 } },
            {
                $lookup: {
                    from: 'califications',
                    let: { incidentId: { $toString: '$_id' } },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$incidentId', '$$incidentId'] }
                            }
                        },
                        {
                            $lookup: {
                                from: 'calificationareas',
                                let: { calificationId: { $toString: '$_id' } },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: { $eq: ['$calificationId', '$$calificationId'] }
                                        }
                                    },
                                    {
                                        $sort: { order: 1 }
                                    },
                                    {
                                        $project: {
                                            _id: 1,
                                            calificationId: 1,
                                            totalScore: 1,
                                            stage: 1,
                                            order: 1
                                        }
                                    }
                                ],
                                as: 'areas'
                            }
                        },
                        {
                            $lookup: {
                                from: 'calificationcriterias',
                                let: { calificationId: { $toString: '$_id' } },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: { $eq: ['$calificationId', '$$calificationId'] }
                                        }
                                    },
                                    {
                                        $sort: {
                                            order: 1
                                        }
                                    },
                                    {
                                        $project: {
                                            _id: 1,
                                            calificationId: 1,
                                            areaId: 1,
                                            criteriaName: 1,
                                            criteriaKey: 1,
                                            fulfilled: 1,
                                            actorType: 1,
                                            scoreWeight: 1,
                                            scoreObtained: 1,
                                            order: 1
                                        }
                                    }
                                ],
                                as: 'criterias'
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                incidentId: 1,
                                phase: 1,
                                criterias: 1,
                                areas: 1
                            }
                        }
                    ],
                    as: 'califications'
                }
            },
            {
                $addFields: {
                    incident_califications: {
                        $arrayToObject: {
                            $map: {
                                input: "$califications",
                                as: "c",
                                in: {
                                    k: "$$c.phase",
                                    v: "$$c"
                                }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    incident_priority: 1,
                    category_name_resolved: 1,
                    subcategory_name: 1,
                    subcategory_name_resolved: 1,
                    incident_ticket_number: 1,
                    incident_description: 1,
                    taxpayer_name: 1,
                    taxpayer_cellphone: 1,
                    taxpayer_dni: 1,
                    referential_location: 1,
                    taxpayer_location_latitude: 1,
                    taxpayer_location_longitude: 1,
                    workgroup_name: 1,
                    workgroup_responsable: 1,
                    workgroup_responsable_dni: 1,
                    incident_state: 1,
                    incident_creation_date: 1,
                    incident_is_real: 1,
                    incident_jurisdiction: 1,
                    incident_district: 1,
                    incident_district_signed: 1,
                    "incident_vehicles._id": 1,
                    "incident_vehicles.vehicle_license_plate": 1,
                    "incident_users._id": 1,
                    "incident_users.user_dni": 1,
                    "incident_users.user_fullname": 1,
                    incident_registered_from: 1,
                    incident_registered_from_role: 1,
                    incident_registered_for: 1,
                    incident_typeof_user: 1,
                    incident_typeof_user_registering: 1,
                    incident_is_duplicated: 1,
                    shift_name: 1,
                    shift_manager: 1,
                    shift_id: 1,
                    origin: 1,
                    surveillance_mode: 1,
                    typeof_surveillance: 1,
                    incident_in_progress_date: 1,
                    operator_dni: 1,
                    operator_responsable: 1,
                    incident_offender_accountants: 1,
                    incident_victim_accountants: 1,
                    incident_description_resolved: 1,
                    taxpayer_solved_description: 1,
                    incident_resolved_date: 1,
                    incident_califications: 1
                }
            }
        ])

        try {
            for await (const incident of rawData) {
                // Transformar inmediatamente
                const transformed = this.transformIncidentsToExcelFormat(incident);
                chunk.push(transformed);

                // Cuando el chunk está lleno, procesarlo
                if (chunk.length >= CHUNK_SIZE) {
                    await onChunk([...chunk]);  // Procesar chunk
                    chunk = [];  // Liberar memoria
                }
            };
            // Procesar el último chunk si tiene datos
            if (chunk.length > 0) {
                await onChunk(chunk);
            }
        } finally {
            // await rawData.close();  
        };

        return incidents;

    };

    /**
     * Transforma un incidente individual al formato Excel
     */
    private transformIncidentsToExcelFormat(incident: any): any {
        // ÍNDICES DE AREAS Y CRITERIAS - REPORT
        const reportAreas = this.indexAreaByKey('reporte', incident.incident_califications?.reporte?.areas);
        const reporte = this.indexCriteriasByKey(incident.incident_califications?.reporte?.criterias);

        const attentionAreas = this.indexAreaByKey('atencion', incident.incident_califications?.atencion?.areas);
        const atencion = this.indexCriteriasByKey(incident.incident_califications?.atencion?.criterias);

        const closureAreas = this.indexAreaByKey('cierre', incident.incident_califications?.cierre?.areas);
        const cierre = this.indexCriteriasByKey(incident.incident_califications?.cierre?.criterias);

        return {
            numero: incident.incident_ticket_number,
            estado: incident.incident_state,
            categoria: incident.category_name_resolved,
            subcategoria: incident.subcategory_name_resolved,
            prioridad: incident.incident_priority,
            plataforma: incident.incident_registered_from,
            registrado_desde: this.getRegisteredFromRoleLabel(incident),
            registrado_por: this.getRegisteredForLabel(incident.incident_registered_for),
            registrado_por_rol: this.getRoleName(incident?.incident_registered_from_role),
            informante_tipo: incident.incident_typeof_user,
            informante_nombre: incident.taxpayer_name,
            origen: incident.origin,
            modalidad: incident.surveillance_mode,
            tipo_modalidad: incident.typeof_surveillance,
            descripcion: incident.incident_description,
            turno: incident.shift_name,
            jefe_turno: incident.shift_manager,
            operador: this.getRegisteredForLabel(incident.operator_responsable),
            // operator_role: null,
            usuarios: this.getUserFullNames(incident),
            vehiculos: this.getVehicleLabels(incident),
            grupo_trabajo: incident.workgroup_name,
            responsable_area: incident.workgroup_responsable,
            descripcion_resolucion: incident.incident_description_resolved,
            descripcion_resolucion_informante: incident.taxpayer_solved_description,
            incident_number_of_lawbreakers: incident.incident_offender_accountants?.incident_number_of_lawbreakers,
            incident_number_of_lawbreakers_male: incident.incident_offender_accountants?.incident_number_of_lawbreakers_male,
            incident_number_of_lawbreakers_female: incident.incident_offender_accountants?.incident_number_of_lawbreakers_female,
            incident_number_of_lawbreakers_adult: incident.incident_offender_accountants?.incident_number_of_lawbreakers_adult,
            incident_number_of_lawbreakers_minor: incident.incident_offender_accountants?.incident_number_of_lawbreakers_minor,
            incident_number_of_victims: incident.incident_victim_accountants?.incident_number_of_victims,
            incident_number_of_victims_male: incident.incident_victim_accountants?.incident_number_of_victims_male,
            incident_number_of_victims_female: incident.incident_victim_accountants?.incident_number_of_victims_female,
            incident_number_of_victims_adult: incident.incident_victim_accountants?.incident_number_of_victims_adult,
            incident_number_of_victims_minor: incident.incident_victim_accountants?.incident_number_of_victims_minor,
            reportado_desde: incident.incident_district,
            incident_creation_date: this.formatDate(incident.incident_creation_date),
            incident_creation_time: this.formatTime(incident.incident_creation_date),
            incident_in_progress_date: this.formatDate(incident.incident_in_progress_date),
            incident_in_progress_time: this.formatTime(incident.incident_in_progress_date),
            incident_resolved_date: this.formatDate(incident.incident_resolved_date),
            incident_resolved_time: this.formatTime(incident.incident_resolved_date),
            incident_resolution_time: this.getResolutionTime(incident),
            incident_is_real: incident.incident_is_real,
            incident_is_duplicated: incident.incident_is_duplicated ? 'Duplicado' : '',
            taxpayer_location_latitude: incident.taxpayer_location_latitude,
            taxpayer_location_longitude: incident.taxpayer_location_longitude,

            // //** DERIVED INCIDENT */
            // Boolean(incident.incident_parent_id),
            // incident.incident_parent_ticket_number

            reporte_fotos: reporte?.fotos_reporte?.fulfilled,
            reporte_coordenadas: reporte?.coordenadas?.fulfilled,
            reporte_descripcion: reporte?.descripcion?.fulfilled,
            reporte_puntaje: reportAreas?.reporte_area_funcionario?.totalScore,
            atencion_op_base_tiempo_rsp: this.getDispatchTime(incident),
            atencion_op_base_tiempo_rsp_puntaje: atencion?.assigned_time_received_to_inprogress?.scoreObtained,
            atencion_op_base_vehiculos: atencion?.asignacion_vehiculo?.fulfilled,
            atencion_op_base_usuarios: atencion?.asignacion_usuario?.fulfilled,
            atencion_op_base_comentarios_coord: atencion?.comentarios_coordinacion?.fulfilled,
            atencion_op_base_puntaje: attentionAreas?.atencion_area_operacion_base?.totalScore,

            atencion_sereno_fotos_resolucion: atencion?.fotos_actuado?.fulfilled,
            atencion_sereno_comentarios_act: atencion?.comentarios_actuado?.fulfilled,
            atencion_sereno_personas_interv: atencion?.personas_intervenidas?.fulfilled,
            atencion_sereno_puntaje: attentionAreas?.atencion_area_sereno?.totalScore,

            cierre_detalle_resolucion: cierre?.detalles_resolucion?.fulfilled,
            cierre_mensaje_vecino: cierre?.mensaje_vecino_resolucion?.fulfilled,
            cierre_personas_interv: cierre?.contador_intervenido_resolucion?.fulfilled,
            cierre_puntaje: closureAreas?.cierre_area_cierre_general?.totalScore,
            cierre_tiempo_resolucion: this.getResolutionTime(incident),
            puntaje_final: this.finalCalificationScore(reportAreas, attentionAreas, closureAreas),

        };
    };
}