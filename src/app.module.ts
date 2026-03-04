import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './app/auth/auth.module';
import { UserModule } from './app/user/user.module';
import { IncidentModule } from './app/incident/incident.module';
import { DatabaseModule } from './app/database/database.module';
import { ShiftModule } from './app/shift/shift.module';

@Module({
  imports: [
    //** Dotenv */
    ConfigModule.forRoot({
      load: [],
      isGlobal: true,
      envFilePath: ['.env']
    }),

    //** DATABASE */
    DatabaseModule.forDeltaDispatchApplication(process.env.MONGO_DELTA_DISPATCH_URI!),
    DatabaseModule.forAuthSoftwareApplication(process.env.MONGO_AUTHSOFTWARE_URI!),

    UserModule,
    AuthModule,
    IncidentModule,
    ShiftModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
