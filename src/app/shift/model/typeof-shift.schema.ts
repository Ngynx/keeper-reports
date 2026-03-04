import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type TypeofShiftDocument = TypeofShift & Document;

@Schema({
    _id: true,
    id: true,
    timestamps: true,
    versionKey: false
})
export class TypeofShift {

    @Prop({
        type: String,
        required: false
    })
    name: string;

    @Prop({
        type: Number,
        default: 8,
        required: false
    })
    duration_time: number;

    @Prop({
        type: String,
        required: false
    })
    start_date: string;

    @Prop({
        type: String,
        required: false
    })
    end_date: string;

    @Prop({
        type: Number,
        default: 8,
        required: false
    })
    id_excel: number;
}

export const TypeofShiftSchema = SchemaFactory.createForClass(TypeofShift);