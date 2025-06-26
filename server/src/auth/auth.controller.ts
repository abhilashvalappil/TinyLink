import { Controller, Body, Post, Res, UseGuards, Get, Req } from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthGuard } from "@nestjs/passport";
import { AuthenticatedRequest } from "src/types/auth-request";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    async register(@Body() signUpDto: SignUpDto,@Res({ passthrough: true }) res: Response) {
        const result = await this.authService.register(signUpDto)
        res.cookie('jwt', result.token, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          maxAge: 3600000,
        });

        return {
            message: 'Registration successful',
            user: result.user,
        };
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res:Response){
        const {token, user} = await this.authService.login( loginDto)
        res.cookie('jwt', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          maxAge: 3600000,
        });
         return {
        message: 'Login successful',user};
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    getProfile(@Req() req: AuthenticatedRequest) {
      return req.user;
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response){
      res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'none',
        secure: true, 
    });

    return { message: 'Logged out successfully' };
 }
}

