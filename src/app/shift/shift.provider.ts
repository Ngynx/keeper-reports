import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Shift, ShiftDocument } from "./model/shift.model";
import { DELTA_DISPATCH_DB_NAME } from "src/common/constants/database.constant";
import { TypeofShift, TypeofShiftDocument } from "./model/typeof-shift.schema";
import * as moment from 'moment-timezone';

@Injectable()
export class ShiftService {

    private readonly TIMEZONE_AMERICA_LIMA = 'America/Lima';

    constructor(
        @InjectModel(Shift.name, DELTA_DISPATCH_DB_NAME)
        private readonly shift_model: Model<ShiftDocument>,

        @InjectModel(TypeofShift.name, DELTA_DISPATCH_DB_NAME)
        private readonly typeof_shift_model: Model<TypeofShiftDocument>,
    ) { }

    private strToTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return moment({ hour: hours, minute: minutes });
    };

    async getAllTypesOfShiftDocuments(): Promise<TypeofShiftDocument[]> {
        return await this.typeof_shift_model.find();
    };

    async getTypeOfShiftByDate(date: moment.Moment): Promise<TypeofShift | null> {
        const turnos = await this.getAllTypesOfShiftDocuments()

        for (const turno of turnos) {
            const startTime = this.strToTime(turno.start_date);
            const endTime = this.strToTime(turno.end_date);

            // Crear las fechas de inicio y fin del turno en la misma zona horaria
            const startDateTime = moment.tz({
                year: date.year(),
                month: date.month(),
                date: date.date(),
                hour: startTime.hour(),
                minute: startTime.minute(),
                second: 0,
                millisecond: 0
            }, this.TIMEZONE_AMERICA_LIMA);

            const endDateTime = moment.tz({
                year: date.year(),
                month: date.month(),
                date: date.date(),
                hour: endTime.hour(),
                minute: endTime.minute(),
                second: 0,
                millisecond: 0
            }, this.TIMEZONE_AMERICA_LIMA);

            if (endTime.hour() < startTime.hour()) {
                if (startDateTime < date) {
                    endDateTime.add(1, 'day');
                } else {
                    startDateTime.subtract(1, 'day')
                };
            };

            if (startDateTime.isSameOrBefore(date) && date.isBefore(endDateTime)) {
                return turno;
            };
        }

        return null
    };




}