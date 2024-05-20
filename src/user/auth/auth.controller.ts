import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserSignInDto } from '../models/dto/user-sign-in.dto';
import { UserSignInResponseDto } from '../models/dto/user-sign-in-response.dto';

@ApiTags('Auth')
@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({
    type: () => UserSignInResponseDto,
  })
  @ApiOperation({ summary: 'User login' })
  @Post('auth/login')
  async signIn(
    @Body() userSignInDto: UserSignInDto,
  ): Promise<UserSignInResponseDto> {
    this.logger.log(
      `Service [signIn] user login with email ${userSignInDto.email}`,
    );
    return this.authService.signIn(userSignInDto.email, userSignInDto.password);
  }
}
