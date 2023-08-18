import { Controller, Get, Post, Body, Patch } from '@nestjs/common';

import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { MatchCodeDto } from './dto/match-code.dto';
import { CreateTokenDto } from './dto/create-token.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  async create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createRefresh(createAdminDto);
  }

  @Post('match')
  async matchCode(@Body() matchCodeDto: MatchCodeDto) {
    return this.adminService.createMatches(matchCodeDto);
  }

  @Post('code')
  async generateToken(@Body() generationData: CreateTokenDto) {
    return this.adminService.getAccessToken(generationData);
  }

  @Get('all')
  getAllUris() {
    return this.adminService.getAllUris();
  }

  @Get()
  generateUri() {
    return this.adminService.createVerifierUri();
  }
}
