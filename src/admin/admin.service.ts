import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Admin } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token } from './schemas/token.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name, 'ADMIN') private readonly adminModel: Model<Admin>,
    @InjectModel(Token.name, 'TOKEN') private readonly tokenModel: Model<Token>,
  ) {}

  async create(createAdminDto: CreateAdminDto) {
    delete createAdminDto.client_secret;

    await this.adminModel.create(createAdminDto);
    return 'Admin created.';
  }

  async updateToken() {
    await this.adminModel.findOne();
  }

  async findAll(): Promise<Token> {
    return await this.tokenModel.findOne();
  }
}
