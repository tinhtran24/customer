import { IsNotEmpty } from 'class-validator';
import { REFRESH_TOKEN_MUST_NOT_EMPTY } from 'src/utils/messageConstants';

export class RefreshTokenDto {
  @IsNotEmpty({ message: REFRESH_TOKEN_MUST_NOT_EMPTY })
  refreshToken: string;
}
