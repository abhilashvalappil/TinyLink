import { Strategy, ExtractJwt, StrategyOptionsWithRequest } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        if (!req.cookies || !req.cookies.jwt) {
          return null;
        }
        return req.cookies.jwt;
      },
      secretOrKey: process.env.JWT_SECRET!,
      ignoreExpiration: false,
      passReqToCallback: true,
    } as StrategyOptionsWithRequest);  
  }

  async validate(req: Request, payload: any) {
    const {  _id } = payload;
    const user = await this.userModel.findById( _id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
