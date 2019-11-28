import { Module } from '@nestjs/common'
import { ProductsEntity } from 'src/shared/Entities/products.entity'
import { ProductsRepository } from 'src/shared/Repositories/products.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductService } from './Service/product.service'
import { ProductController } from './Controller/product.controller'
import { CategoriesRepository } from 'src/shared/Repositories/categories.repository'

@Module({
    imports: [TypeOrmModule.forFeature([ProductsEntity, ProductsRepository, CategoriesRepository])],
    providers: [ProductService],
    exports: [ProductService],
    controllers: [ProductController],
})

export class ProductModule {}