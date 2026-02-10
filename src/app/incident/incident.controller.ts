import { Body, Controller, Post, Res } from "@nestjs/common";
import { IncidentService } from "./incident.service";
import { ExcelGeneratorService } from "./excel-generator.service";
import { RangeTimeD } from "./dto/rangetime.dto";
import { Auth, User as UserGuard } from "src/common/decorators";
import { User } from "../user/schema/user.schema";

@Controller("incident")
export class IncidentController {
    constructor(
        private readonly incident_service: IncidentService,
        private readonly excelGeneratorService: ExcelGeneratorService
    ) { }


    @Auth()
    @Post('incidents/download')
    async downloadIncidentsExcel(
        @UserGuard() user: User,
        @Res() res: any,
        @Body() dto: RangeTimeD
    ): Promise<void> {
        try {
            const workbook = await this.excelGeneratorService.generateIncidentsReportFromChunks(
                async (onChunk) => {
                    await this.incident_service.getIncidentsByDateRange(dto, user, onChunk);
                }
            );

            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "incidentes.xlsx",
            );
            await workbook.xlsx.write(res);
            res.end();
        } catch (e) {
            console.log(e);
            res.status(400);
            return res.json({
                success: false,
                data: null,
                message: 'Opps! Ocurred an error'
            })
        }
    };
}