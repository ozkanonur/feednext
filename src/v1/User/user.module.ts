import { Module } from '@nestjs/common'
import { UsersEntity } from 'src/shared/Entities/users.entity'
import { ConfigService } from 'src/shared/Services/config.service'
import { UsersRepository } from 'src/shared/Repositories/users.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserService } from './Service/user.service'
import { UsersController } from './Controller/user.controller'
import { MailService } from 'src/shared/Services/mail.service'

@Module({
    imports: [TypeOrmModule.forFeature([UsersEntity, UsersRepository])],
    providers: [UserService, ConfigService, MailService],
    exports: [UserService],
    controllers: [UsersController],
})

export class UserModule {}
