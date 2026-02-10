import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Workgroup, WorkgroupSchema } from "./schema/workgroup.schema";
import { WorkgroupService } from "./workgroup.service";
import { DELTA_DISPATCH_DB_NAME } from "src/common/constants/database.constant";

@Module({
    imports: [MongooseModule.forFeature([{ name: Workgroup.name, schema: WorkgroupSchema }], DELTA_DISPATCH_DB_NAME)],
    providers: [WorkgroupService],
    exports: [WorkgroupService]
})
export class WorkgroupModule { }
