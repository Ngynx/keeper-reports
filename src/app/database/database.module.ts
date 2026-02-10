import { DynamicModule, Global, Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { AUTHSOFTWARE_SERVER_DB_NAME, DELTA_DISPATCH_DB_NAME } from "src/common/constants/database.constant"

@Global()
@Module({})
export class DatabaseModule {
    static forDeltaDispatchApplication(_uri: string): DynamicModule {
        return {
            module: DatabaseModule,
            imports: [MongooseModule.forRoot(_uri, { connectionName: DELTA_DISPATCH_DB_NAME })],
            exports: [MongooseModule]
        }
    };

    static forAuthSoftwareApplication(_uri: string): DynamicModule {
        return {
            module: DatabaseModule,
            imports: [MongooseModule.forRoot(_uri, { connectionName: AUTHSOFTWARE_SERVER_DB_NAME })],
            exports: [MongooseModule]
        }
    }

    // static forRobinApplication(_uri: string): DynamicModule {
    //     return {
    //         module: DatabaseModule,
    //         imports: [MongooseModule.forRoot(_uri, { connectionName: ROBIN_SERVER_DB_NAME })],
    //         exports: [MongooseModule]
    //     }
    // };
}