import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { randomBytes, createHash } from 'crypto';

import { Refresh, MatchCode, Token, Verifier } from './schemas';
import { Model } from 'mongoose';

import { MatchCodeDto } from './dto/match-code.dto';
import { PasswordListType } from './types/password.type';

interface RequestBody {
  grant_type: string;
  code: string;
  code_verifier?: string;
}

type MatchCodeQuery = Partial<Pick<MatchCode, 'used' | 'code'>>;
type TokenCreateInfo = Pick<Token, 'user_id' | 'access_token'>;

type UrlGeneration = { url: string; code: PasswordListType };

@Injectable()
export class AdminService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    @InjectModel(Refresh.name, 'ADMIN')
    private readonly refreshModel: Model<Refresh>,
    @InjectModel(Token.name, 'TOKEN') private readonly tokenModel: Model<Token>,
    @InjectModel(Verifier.name, 'ADMIN')
    private readonly verifierModel: Model<Verifier>,
    @InjectModel(MatchCode.name, 'ADMIN')
    private readonly matchModel: Model<MatchCode>,
  ) {}
  async createVerifierUri() {
    const verifier = this.base64URLEncode(randomBytes(32));
    const challenge = this.base64URLEncode(this.sha256(verifier));

    const password = await this.changePasswordState({ used: false }, true);
    await this.saveVerifierCode(verifier, password.code);

    return this.generateAuthorizationUri(challenge, password.code);
  }

  private base64URLEncode(str: Buffer): string {
    return str
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  private sha256(buffer: string) {
    return createHash('sha256').update(buffer).digest();
  }

  private async changePasswordState(query: MatchCodeQuery, used: boolean) {
    return await this.matchModel.findOneAndUpdate(query, { used });
  }

  private async saveVerifierCode(verifier: string, password: PasswordListType) {
    return await this.verifierModel.create({ verifier, password });
  }

  private generateAuthorizationUri(
    challenge: string,
    code: PasswordListType,
  ): UrlGeneration {
    return {
      url: `${this.configService.get(
        'MERCADO_AUTH',
      )}?response_type=code&client_id=${this.configService.get(
        'CLIENT_ID',
      )}&redirect_uri=${this.configService.get(
        'REDIRECT_URI',
      )}&code_challenge=${challenge}&code_challenge_method=S256`,
      code,
    };
  }

  async getAllUris(): Promise<UrlGeneration[]> {
    const codes = await this.verifierModel.find();

    return codes.map((verifier) =>
      this.generateAuthorizationUri(
        this.base64URLEncode(this.sha256(verifier.verifier)),
        verifier.password,
      ),
    );
  }

  async getAccessToken({ code, password }) {
    const wrongKey =
      'La clave es incorrecta, por favor intente nuevamente o avísele a quien se la brindó.';
    const grant_type = 'authorization_code';
    try {
      const verifier = await this.getVerifier(password);
      if (!verifier) throw new BadRequestException(wrongKey);

      const { data } = await this.callForToken({
        grant_type,
        code,
        code_verifier: verifier.verifier,
      });
      await this.createAccessToken(data);
      await this.createRefresh({
        refresh_token: data.refresh_token as string,
        user_id: data.user_id as number,
        grant_type: 'refresh_token',
      });

      await this.changePasswordState({ code: password }, false);
      verifier.deleteOne();
    } catch (error) {
      throw new BadRequestException(wrongKey);
    }
  }

  async exchangeRefreshForAccessToken({ user_id }: Token): Promise<Token> {
    const { grant_type, refresh_token: code } = await this.refreshModel.findOne(
      {
        user_id,
      },
    );

    const { data } = await this.callForToken({ grant_type, code });

    await this.createRefresh({
      refresh_token: data.refresh_token as string,
      user_id: data.user_id as number,
      grant_type: 'refresh_token',
    });
    return await this.createAccessToken(data);
  }

  private async getVerifier(password: PasswordListType) {
    return await this.verifierModel.findOne({ password });
  }

  private async callForToken({ grant_type, code, code_verifier }: RequestBody) {
    try {
      return await this.httpService.axiosRef.post(
        `${this.configService.get('MERCADO')}/oauth/token`,
        {
          client_secret: this.configService.get('CLIENT_SECRET'),
          client_id: this.configService.get('CLIENT_ID'),
          grant_type,
          code,
          redirect_uri: this.configService.get('REDIRECT_URI'),
          ...(code_verifier && { code_verifier }),
        },
      );
    } catch (error) {
      throw new BadRequestException(error.response.data.error_description);
    }
  }

  private async createAccessToken({ access_token, user_id }: TokenCreateInfo) {
    const existingToken = this.tokenModel.findOne({ user_id });

    if (!existingToken)
      return await this.tokenModel.create({ access_token, user_id });

    return await this.tokenModel.findOneAndUpdate(
      { user_id },
      { access_token },
      { new: true },
    );
  }

  async createRefresh(
    createAdminDto: Pick<Refresh, 'grant_type' | 'refresh_token' | 'user_id'>,
  ) {
    await this.refreshModel.create(createAdminDto);
    return 'Admin created.';
  }

  async findAll(): Promise<Token> {
    return await this.tokenModel.findOne();
  }

  async findToken(user_id: number): Promise<Token> {
    return await this.tokenModel.findOne({ user_id });
  }

  async createMatches(matchCodeDto: MatchCodeDto) {
    const total = await this.matchModel.count();
    if (total) return 'Codes were already seeded';

    matchCodeDto.codes.forEach(
      async (code) => await this.matchModel.create({ code, used: false }),
    );

    return 'Ok.';
  }
}
