import { ConflictException, Injectable,UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from 'bcryptjs';
import { User } from "./schema/user.schema";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import { SignUpDto } from "./dto/signup.dto"; 


@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService,
    ) {}

    async register({ username, email, password }: SignUpDto){
        const  existingUser = await this.userModel.findOne({email})
        if(existingUser){
            throw new ConflictException('User with email already exists')
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.userModel.create({
            username,
            email,
            password:hashedPassword
        })

        const token = this.jwtService.sign({_id: user._id})
        return { token, user };
    }

    async login({ email, password }: LoginDto) {
        const user = await this.userModel.findOne({email})
        if(!user){
            throw new UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password,user.password)
        if(!isPasswordValid){
            throw new UnauthorizedException('Invalid Password')
        }
        const token = this.jwtService.sign({_id: user._id})
        const { password: _, ...userData } = user.toObject();
        return { token, user: userData };
    }
}