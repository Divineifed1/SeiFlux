import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { WavesService } from './waves.service';
import { CreateWaveDto } from './create-wave.dto';
import { WaveStatus } from './wave-status.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('waves')
export class WavesController {
  constructor(private readonly wavesService: WavesService) {}

  @Get()
  findAll() {
    return this.wavesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wavesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createWaveDto: CreateWaveDto) {
    return this.wavesService.createWave(createWaveDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: WaveStatus,
  ) {
    if (!Object.values(WaveStatus).includes(status)) {
      throw new BadRequestException('Invalid wave status');
    }
    return this.wavesService.updateStatus(id, status);
  }
}
