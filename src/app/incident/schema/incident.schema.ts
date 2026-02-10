import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IncidentDocument = Incident & Document;
@Schema()
export class Incident extends Document {

    @Prop({
        type: String,
        required: false
    })
    incident_priority: string;

    @Prop({
        type: String,
        required: true
    })
    category_name: string;

    @Prop({
        type: String,
        required: false,

    })
    category_name_resolved: string;

    @Prop({
        type: String,
        required: true
    })
    subcategory_name: string;

    @Prop({
        type: String,
        required: false
    })
    subcategory_name_resolved: string;

    @Prop({
        type: String,
    })
    incident_ticket_number: string;

    @Prop({
        type: [Object],
    })
    incident_image: Array<Object>;

    @Prop({
        type: [Object],
    })
    incident_video: Array<Object>;

    @Prop({
        type: String,
    })
    incident_description: string;

    @Prop({
        type: String,
    })
    taxpayer_name: string;

    @Prop({
        type: Number,
        required: false
    })
    taxpayer_cellphone: number;

    @Prop({
        type: Number,
        required: false
    })
    taxpayer_dni: number;


    @Prop({
        type: String,
        required: false
    })
    taxpayer_role: string;

    @Prop({
        type: Boolean,
        required: false
    })
    taxpayer_protection_measure: boolean;

    @Prop({
        type: String,
        required: false
    })
    taxpayer_id: string;

    @Prop({
        type: String,
    })
    referential_location: string;

    @Prop({
        type: Number
    })
    taxpayer_location_latitude: number;

    @Prop({
        type: Number
    })
    taxpayer_location_longitude: number;

    @Prop({
        type: String,
    })
    workgroup_name: string;

    @Prop({
        type: String,
    })
    workgroup_responsable: string;

    @Prop({
        type: Number,
        default: null
    })
    workgroup_contact_number: number;

    @Prop({
        type: Number,
        required: false
    })
    workgroup_responsable_dni?: number;

    @Prop({
        type: String,
        // enum: IncidentState,
        // default: RECEIVED
    })
    incident_state: String;

    @Prop({
        type: Date,

    })
    incident_creation_date: Date;

    @Prop({
        type: Date
    })
    incident_latest_update: Date;

    @Prop({
        type: [Object],
        required: false
    })
    incident_comments: [Object];

    @Prop({
        type: [Object],
        required: false
    })
    incident_logs: [Object];

    @Prop({
        type: Date
    })
    incident_in_progress_date: Date;

    @Prop({
        type: Date
    })
    incident_resolved_date: Date;

    @Prop({
        type: Number,

    })
    incident_assigned_time: number;

    @Prop({
        type: Number
    })
    incident_resolved_time: number;

    @Prop({
        type: String
    })
    incident_description_resolved: string;

    // @Prop({
    //     type: String
    // })
    // incident_image_resolved: string;

    @Prop({
        type: [Object],
    })
    incident_image_resolved: Array<Object>;

    @Prop({
        type: Object,
    })
    incident_file_resolved: Object;

    @Prop({
        type: Boolean,
        default: true
    })
    incident_is_real: boolean;

    @Prop({
        type: String,
    })
    incident_audio: string;

    @Prop({
        type: Boolean,
        // default: true
    })
    incident_jurisdiction: boolean;

    @Prop({
        type: String,
    })
    incident_district: string;

    @Prop({
        type: String,
    })
    incident_district_signed: string;

    @Prop({
        type: [Object],
    })
    incident_vehicles?: Array<Object>;

    @Prop({
        type: [Object],
    })
    incident_users?: Array<Object>;

    @Prop({
        type: [Object],
        required: false
    })
    incident_lawbreakers?: Array<Object>;

    @Prop({
        type: String,
        required: false
    })
    incident_registered_from: string

    @Prop({
        type: String,
        required: false
    })
    incident_registered_from_role: string

    @Prop({
        type: String,
        required: false
    })
    incident_registered_for: string

    @Prop({
        type: String,
        required: false
    })
    incident_typeof_user: string;

    @Prop({
        type: String,
        required: false
    })
    incident_typeof_user_registering: string;

    @Prop({
        type: String,
        required: false
    })
    incident_jurisdiction_verified_by?: string;

    @Prop({
        type: Boolean,
        required: false,
        default: false
    })
    incident_is_duplicated?: boolean;

    @Prop({
        type: [Object],
        required: false
    })
    //** STORE ID DUPS */
    incident_duplicated?: Array<Object>;

    @Prop({
        type: Object,
        required: false
    })
    //** STORE THE MAIN ISSUES */
    incident_is_duplicated_by?: Object;

    // @Prop({
    //     type: [Object],
    //     required: false
    // })
    // //** STORE THE MAIN ISSUES */
    // incident_is_duplicated_by?: Array<Object>;

    @Prop({
        type: String
    })
    operator_workgroup_name: string;

    @Prop({
        type: String
    })
    operator_responsable: string;

    @Prop({
        type: Number,
        // default: null 
    })
    operator_contact_number: number;

    @Prop({
        type: Number,
        // default: null 
    })
    operator_dni: number;

    @Prop({
        type: Object,
        required: false
    })
    belong_to_sector: object;

    @Prop({
        type: Boolean,
        required: false,
        default: false
    })
    exported_to_sipcop: boolean;

    @Prop({
        type: String,
        required: false
    })
    route_address?: string;

    @Prop({
        type: String,
        required: false
    })
    shift_name?: string;

    @Prop({
        type: String,
        required: false
    })
    shift_id?: string;

    @Prop({
        type: String,
        required: false
    })
    shift_manager?: string;

    @Prop({
        type: String,
        required: false
    })
    shift_manager_id?: string;

    @Prop({
        type: Date
    })
    shift_date_creation: Date;

    @Prop({
        type: [Object],
        required: false
    })
    incident_victims?: Array<Object>;

    @Prop({
        type: String,
        required: false,
        default: "Otros"
    })
    origin: string;

    @Prop({
        type: String,
        required: false,
        default: "Municipal"
    })
    surveillance_mode: string;

    @Prop({
        type: String,
        required: false,
        default: "Motorizado"
    })
    typeof_surveillance: string;

    @Prop({
        type: Number,
        required: false,
        default: 0
    })
    rating_number: number;

    @Prop({
        type: String,
        required: false,
        // default: 
    })
    rating_comment: string;

    @Prop({
        type: Boolean,
        required: false,
        // default: 
    })
    rating_enabled: boolean;

    @Prop({
        type: String,
        required: false,
        // default: 
    })
    taxpayer_solved_description: string;

    @Prop({
        type: [Object],
        required: false,
        // default: []
    })
    tracking_messages: Object[];

    @Prop({
        type: String,
        required: false,
        default: null
    })
    neighborhood_metting_id?: string;

    @Prop({
        type: String,
        required: false,
        default: null
    })
    neighborhood_metting_name?: string;

    @Prop({
        type: Boolean,
        required: false,
        default: false
    })
    incident_inside_quadrant?: boolean;

    @Prop({
        type: Object,
        required: false,
        // default: null
    })
    incident_quadrant?: Object;

    @Prop({
        type: String,
        required: false,
        // default: ""
    })
    incident_parent_id?: string;

    @Prop({
        type: Boolean,
        required: false,
        default: false
    })
    incident_parent?: boolean

    @Prop({
        type: String,
        required: false,
        // default: ""
    })
    incident_parent_ticket_number?: string;

    @Prop({
        type: Object,
        required: false
    })
    incident_offender_accountants?: Array<Object>;

    @Prop({
        type: Object,
        required: false
    })
    incident_victim_accountants?: Array<Object>;

    @Prop({
        type: Boolean,
        required: false,
        default: false
    })
    incident_import?: boolean;

    @Prop({
        type: Boolean,
        required: false,
        default: false
    })
    incident_presumed_duplicated: boolean;

    @Prop({
        type: Array<Object>,
        required: false,
        // default: false
    })
    incident_presumed_relations: Array<object>;

    @Prop({
        type: Number,
        required: false,
        default: 0
    })
    incident_total_accountants: number;
}

export const IncidentSchema = SchemaFactory.createForClass(Incident);