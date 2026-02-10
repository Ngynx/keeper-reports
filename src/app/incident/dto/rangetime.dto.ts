import { IsNumber, IsOptional, IsString } from "class-validator";

export class RangeTimeD {
    @IsString()
    @IsOptional()
    rangetime_from: string;

    @IsString()
    @IsOptional()
    rangetime_to: string;

    @IsNumber()
    @IsOptional()
    user_dni?: number;

}