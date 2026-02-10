import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Workgroup, WorkgroupDocument } from "./schema/workgroup.schema";
import { DELTA_DISPATCH_DB_NAME } from "src/common/constants/database.constant";

@Injectable()
export class WorkgroupService {
    constructor(
        @InjectModel(Workgroup.name, DELTA_DISPATCH_DB_NAME)
        private readonly workgroupModel: Model<WorkgroupDocument>,
    ) { }

    async getMasterWorkarea(): Promise<Workgroup | null> {
        return await this.workgroupModel.findOne({ workgroup_master: true }).limit(1)
    }

    async getSupervisorWorkarea(): Promise<Workgroup | null> {
        return await this.workgroupModel.findOne({ workgroup_supervisor: true }).limit(1).exec();
    }
}