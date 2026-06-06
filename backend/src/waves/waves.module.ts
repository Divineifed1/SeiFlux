import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wave } from './wave.entity';
import { WavesService } from './waves.service';
import { WavesController } from './waves.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Wave])],
  controllers: [WavesController],
  providers: [WavesService],
  exports: [WavesService],
})
export class WavesModule {}
