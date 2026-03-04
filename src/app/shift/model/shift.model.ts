import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ShiftPatrolZone, ShiftPatrolZoneSchema } from './shift-patrol-zone.schema';

export type ShiftDocument = Shift & Document;

@Schema({
    _id: true,
    id: true,
    timestamps: true,
    versionKey: false
})
export class Shift {

    @Prop({
        type: Object,
        required: false
    })
    shift_manager: object;

    @Prop({
        type: String,
        required: false
    })
    shift_manager_name: string;

    @Prop({
        type: String,
        required: false
    })
    ticket_number: string;

    @Prop({
        type: String,
        required: false
    })
    name: string;

    @Prop({
        type: [Object],
        required: false
    })
    vehicles: object[];

    @Prop({
        type: [Object],
        required: false
    })
    users: object[];

    @Prop({
        type: Object,
        required: false
    })
    shift: object;

    @Prop({
        required: false
    })
    shift_logs: [object];

    /**
     * Fecha objetivo del turno (sin hora) en formato YYYY-MM-DD
     * Este campo facilita las consultas por fecha específica
     */
    @Prop({
        type: String,
        required: false
    })
    shift_target_date: string;

    /**
     * Usuario que creó el turno (diferente al shift_manager/supervisor)
     */
    @Prop({
        type: Object,
        required: false
    })
    created_by: object;

    /**
     * Nombre del usuario que creó el turno
     */
    @Prop({
        type: String,
        required: false
    })
    created_by_name: string;

    /**
     * Ruta del documento de Asignación de Personal (PDF, Img, etc.)
     */
    @Prop({
        type: String,
        required: false
    })
    personal_assignment_path: string;

    /**
     * Nombre original del archivo de Asignación de Personal
     */
    @Prop({
        type: String,
        required: false
    })
    personal_assignment_original_name: string;

    /**
     * Ruta del documento de Reporte Final de Turno (PDF, Img, etc.)
     */
    @Prop({
        type: String,
        required: false
    })
    final_report_path: string;

    /**
     * Nombre original del archivo de Reporte Final
     */
    @Prop({
        type: String,
        required: false
    })
    final_report_original_name: string;

    /**
     * Zonas de patrullaje asignadas al turno
     * Soporta dos tipos:
     * - Zonas de catálogo (isTemporary = false): Referencias a PatrolZone
     * - Zonas temporales (isTemporary = true): Creadas solo para este turno
     */
    @Prop({
        type: [ShiftPatrolZoneSchema],
        required: false,
        default: []
    })
    patrol_zones: ShiftPatrolZone[];

    /**
     * Asignación de equipos (radio y teléfono) por usuario
     * - Cada usuario puede tener máximo 1 radio y 1 teléfono
     * - Un mismo equipo no puede estar asignado a más de un usuario
     */
    @Prop({
        type: [Object],
        required: false,
        default: []
    })
    equipment_assignments: object[];

    @Prop({
        type: Object,
        required: false,
        default: {
            patrol_cars: 0,
            motorcycles: 0,
            ambulances: 0
        }
    })
    vehicle_availability_stats: {
        patrol_cars: number;
        motorcycles: number;
        ambulances: number;
    };
}

export const ShiftSchema = SchemaFactory.createForClass(Shift);