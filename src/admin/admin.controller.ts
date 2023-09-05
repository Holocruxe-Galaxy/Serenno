import { Controller, Get, Post, Body } from '@nestjs/common';

import { AdminService } from './admin.service';
import { MatchCodeDto } from './dto/match-code.dto';
import { CreateTokenDto } from './dto/create-token.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('match')
  async matchCode(@Body() matchCodeDto: MatchCodeDto) {
    return this.adminService.createMatches(matchCodeDto);
  }

  @Post('code')
  async generateToken(@Body() generationData: CreateTokenDto) {
    return this.adminService.getAccessToken(generationData);
  }

  // @Post('refresh')
  // async refresh(@Body() generationData: any) {
  //   return this.adminService.exchangeRefreshForAccessToken(generationData);
  // }

  @Get('all')
  getAllUris() {
    return this.adminService.getAllUris();
  }

  @Get()
  generateUri() {
    return this.adminService.createVerifierUri();
  }
}
