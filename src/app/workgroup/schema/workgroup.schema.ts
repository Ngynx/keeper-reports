import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WorkgroupDocument = Workgroup & Document;

@Schema({
    _id: true,
    id: true,
    timestamps: true,

})
export class Workgroup {

    @Prop({
        type: String
    })
    workgroup_name: string;

    @Prop({
        type: Number
    })
    workgroup_code: number;

    @Prop({
        type: Number
    })
    workgroup_contact_number: number;

    @Prop({
        type: String
    })
    workgroup_description: string;

    @Prop({
        type: String
    })
    workgroup_manager_name: string;

    @Prop({
        type: Boolean
    })
    workgroup_state: boolean;

    @Prop({
        type: Boolean
    })
    workgroup_master?: boolean;

    @Prop({
        type: Boolean,
        default: false,
        required: false
    })
    workgroup_supervisor: boolean;

    @Prop({
        type: [Object],
        required: false
    })
    workgroup_phone_numbers: [Object];

    @Prop({
        type: [Object],
        required: false
    })
    workgroup_responsibles_phone_numbers: [Object];

    @Prop({
        type: Boolean,
        required: false
    })
    workgroup_pnp_effective: boolean;
}

export const WorkgroupSchema = SchemaFactory.createForClass(Workgroup);