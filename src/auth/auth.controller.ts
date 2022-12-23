import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDto } from './auth-credentials.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService
  ) {}

  @Post('signin')
  signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
    return this.authService.signIn(authCredentialsDto)
  }

  @Post('/signup')
  signUp(@Body(ValidationPipe) authCredentials: AuthCredentialsDto): Promise<void> {
    console.log(authCredentials)
    return this.authService.signUp(authCredentials);
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  authTest(@GetUser() user) {
    console.log('user', user)
  }

}
