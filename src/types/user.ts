export interface UserDto {
  fullName: string;
  email: string;
  password: string;
}

export interface UserResponseDto {
  statusCode: number;
  message: string;
  data: UserDto;
}
