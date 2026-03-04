import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/**
 * Zona de patrullaje embebida en el turno
 * Puede ser:
 * - Una referencia a una zona del catálogo (isTemporary = false)
 * - Una zona temporal creada solo para este turno (isTemporary = true)
 */
@Schema({ _id: false })
export class ShiftPatrolZone {

    /**
     * ID de la zona
     * - Para zonas de catálogo: ObjectId real de PatrolZone
     * - Para zonas temporales: ID generado (ej: "temp_1704567890123")
     */
    @Prop({
        type: String,
        required: true
    })
    _id: string;

    /**
     * Nombre de la zona de patrullaje
     */
    @Prop({
        type: String,
        required: true
    })
    name: string;

    /**
     * Color para identificar la zona en UI
     */
    @Prop({
        type: String,
        required: false,
        default: '#3B82F6'
    })
    color: string;

    /**
     * Descripción opcional de la zona
     */
    @Prop({
        type: String,
        required: false
    })
    description: string;

    /**
     * Indica si es una zona temporal (solo existe en este turno)
     * - false: Zona del catálogo (PatrolZone collection)
     * - true: Zona creada temporalmente para este turno específico
     */
    @Prop({
        type: Boolean,
        default: false
    })
    isTemporary: boolean;

    /**
     * Comentario sobre la asignación de esta zona en el turno
     */
    @Prop({
        type: String,
        required: false
    })
    comment: string;

    /**
     * Lista de usuarios asignados a esta zona (tripulación)
     * Estructura flexible para permitir usuarios temporales también
     */
    @Prop({
        type: [Object],
        required: false,
        default: []
    })
    crew: object[];

}

export const ShiftPatrolZoneSchema = SchemaFactory.createForClass(ShiftPatrolZone);
