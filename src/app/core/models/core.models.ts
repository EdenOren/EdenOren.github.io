export interface GoogleIdentityResponse {
  readonly credential: string;
}

export interface GoogleIdTokenPayload {
  readonly aud: string;
  readonly azp: string;
  readonly email: string;
  readonly email_verified: boolean;
  readonly exp: number;
  readonly family_name: string;
  readonly given_name: string;
  readonly iat: number;
  readonly iss: string;
  readonly jti: string;
  readonly name: string;
  readonly nbf: number;
  readonly picture: string;
  readonly sub: string;
}
