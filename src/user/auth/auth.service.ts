import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user.service';
import * as bcrypt from 'bcrypt';
import { UserSignInResponseDto } from '../models/dto/user-sign-in-response.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<UserSignInResponseDto> {
    this.logger.log(`Service [signIn] user login with ${email}`);
    const [ex, user] = await this.userService.getUserByEmail(email);
    if (ex || !user)
      throw new UnauthorizedException('Invalid email or password');

    // Use bcrypt to compare hashed passwords
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      success: true,
      message: 'Logged in successfully',
      user,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
