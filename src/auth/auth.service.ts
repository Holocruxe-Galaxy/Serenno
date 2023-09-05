import { Inject, Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { compareSync, hashSync } from 'bcrypt';
import { LoginDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserService } from 'src/user/user.service';

import { JwtService } from '@nestjs/jwt';
import { forwardRef } from '@nestjs/common/utils';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtStrategy } from './strategies/jwt.strategy';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtStrategy: JwtStrategy,
    private readonly jwtService: JwtService,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async login({ username, password }: LoginDto): Promise<any> {
    const user = await this.userModel.findOne({ username });

    if (!user)
      throw new BadRequestException('The username introduced is incorrect.');
    if (!compareSync(password, user.password))
      throw new BadRequestException('The password introduced is incorrect.');
    const token = this.setJwtToken({ username: user.username });
    const cookie = this.createCookie(token);

    return { user, cookie };
  }

  // async verification_token(request: Request, tokenAuthDto: TokenAuthDto) {
  //   const cookieData: string = request.cookies['Authorization'];
  //   const email: any = this.jwtService.decode(cookieData);
  //   const user = await this.userModel.findOne({ email: email.email });
  //   if (user.token !== tokenAuthDto.token) {
  //     throw new BadRequestException('The code is invalid');
  //   }
  //   await this.userModel.findByIdAndUpdate(
  //     user._id,
  //     { token: null },
  //     { new: true },
  //   );
  //   return true;
  // }

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
