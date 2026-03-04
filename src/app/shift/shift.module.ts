import { Global, Module } from "@nestjs/common";
import { DELTA_DISPATCH_DB_NAME } from "src/common/constants/database.constant";
import { TypeofShift, TypeofShiftSchema } from "./model/typeof-shift.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { Shift, ShiftSchema } from "./model/shift.model";
import { ShiftService } from "./shift.provider";

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([{ name: Shift.name, schema: ShiftSchema }], DELTA_DISPATCH_DB_NAME),
        MongooseModule.forFeature([{ name: TypeofShift.name, schema: TypeofShiftSchema }], DELTA_DISPATCH_DB_NAME)
    ],
    controllers: [],
    providers: [ShiftService],
    exports: [ShiftService]
})
export class ShiftModule { }