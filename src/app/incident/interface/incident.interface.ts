interface CompanionUserI {
    _id: any;
    user_name: string;
    user_lastname: string;
    user_dni: number;
    user_cellphone: number;
}
export interface CompanionSnapshotI {
    assignmentType: "vehicle" | "patrol_zone";
    companion_role?: string | null;
    vehicle_id?: any;
    patrol_zone_id?: any;
    companions: CompanionUserI[];
}

export interface CompanionResult {
    vehicleCompanions: string[];
    patrolZoneCompanions: string[];
}
