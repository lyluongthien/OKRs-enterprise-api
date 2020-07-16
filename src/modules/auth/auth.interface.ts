export interface JwtPayload {
  id: number;
  iat: number;
}

export interface AuthResponse {
  token: string;
}
