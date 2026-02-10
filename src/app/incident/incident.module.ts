import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { WorkgroupModule } from "../workgroup/workgroup.module";
import { Incident, IncidentSchema } from "./schema/incident.schema";
import { IncidentService } from "./incident.service";
import { ExcelGeneratorService } from "./excel-generator.service";
import { IncidentController } from "./incident.controller";
import { DELTA_DISPATCH_DB_NAME } from "src/common/constants/database.constant";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Incident.name, schema: IncidentSchema }], DELTA_DISPATCH_DB_NAME),
        WorkgroupModule,
    ],
    controllers: [
        IncidentController
    ],
    providers: [
        IncidentService,
        ExcelGeneratorService
    ],
    // exports: [
    //     IncidentService,
    //     ExcelGeneratorService
    // ]
})
export class IncidentModule { }
