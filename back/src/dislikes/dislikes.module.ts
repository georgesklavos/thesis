import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dislikes } from 'src/schemas/dislikes.schema';
import { DislikesController } from './dislikes.controller';
import { DislikesService } from './dislikes.service';

//Module that defines controllers, models, services, exports
@Module({
  imports: [TypeOrmModule.forFeature([Dislikes])],
  controllers: [DislikesController],
  providers: [DislikesService],
  exports: [DislikesService],
})
export class DislikesModule {}
