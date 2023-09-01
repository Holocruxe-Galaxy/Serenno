import { Inject, Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { compareSync, hashSync } from 'bcrypt';
import { LoginDto, TokenAuthDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { CommonService } from '../common/common.service';
import { UserService } from 'src/user/user.service';

import { UserPayload } from '../user/interfaces/user-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { forwardRef } from '@nestjs/common/utils';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from 'express';
import { JwtStrategy } from './strategies/jwt.strategies';
import { JwtValidate } from './interfaces/jwt-validate.interface';
import { MailService } from './../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly commonService: CommonService,
    private readonly jwtStrategy: JwtStrategy,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    try {
      const { password, ...userData } = createAuthDto;

      const user: UserPayload = await this.userService.create({
        ...userData,
        password: hashSync(password, 12),
      });

      await this.mailService.send_register_mail(
        createAuthDto.email,
        createAuthDto.name,
      );

      return { ...user, token: this.setJwtToken({ username: user.username }) };
    } catch (error) {
      this.commonService.handleExceptions(error, 'A user');
    }
  }

  async login({ email, password }: LoginAuthDto): Promise<any> {
    const code = Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);
    const user: User = await this.userModel.findOne({ email });

    if (!user)
      throw new BadRequestException('The email introduced is incorrect.');
    if (!compareSync(password, user.password))
      throw new BadRequestException('The password introduced is incorrect.');

    await this.userModel.findByIdAndUpdate(
      user._id,
      { token_login: code },
      { new: true },
    );
    await this.mailService.send_code_mail(user.username, code);
    const token = this.setJwtToken({ username: user.username });
    const cookie = this.createCookie(token);

    return { user, cookie };
  }

  async verification_token(request: Request, tokenAuthDto: TokenAuthDto) {
    const cookieData: string = request.cookies['Authorization'];
    const email: any = this.jwtService.decode(cookieData);
    const user = await this.userModel.findOne({ email: email.email });
    if (user.token_login !== tokenAuthDto.token) {
      throw new BadRequestException('The code is invalid');
    }
    await this.userModel.findByIdAndUpdate(
      user._id,
      { token_login: null },
      { new: true },
    );
    return true;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  createCookie(tokenData: string): string {
    const expiresIn = 60 * 60 * 24;

    return `Authorization=${tokenData}; max-age=${expiresIn}; HttpOnly; Path=/; Secure; SameSite=None;`;
  }

  private setJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
