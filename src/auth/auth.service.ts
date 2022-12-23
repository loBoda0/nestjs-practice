import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor (
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string}> {
    const { username, password } = authCredentialsDto;
    const user = await this.userRepository.findOne({where: {username}})

    if (user && (await bcrypt.compare(password, user.password))) {
      //create token
      const payload = {username};
      const accessToken = this.jwtService.sign({username});
      return {accessToken};
    } else {
      throw new UnauthorizedException('Login failed!');
    };
  }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({username, password: hashedPassword});
    try {
      await this.userRepository.save(user)
    } catch (error) {
      console.log('error', error)
      if (error.code === "23505") {
        throw new ConflictException('Existing username');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
