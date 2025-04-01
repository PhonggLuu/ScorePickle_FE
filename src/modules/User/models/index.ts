export interface RegisterUserRequest {
  FirstName: string;
  LastName: string;
  SecondName: string;
  Email: string;
  Password: string;
  DateOfBirth: string;
  Gender: string;
  PhoneNumber: string;
  refereeCode?: string;
  RoleId?: RoleFactory;
}

export interface RegisterUserResponse {
  id: number;
  firstName: string;
  lastName: string;
  secondName: string;
  email: string;
  passwordHash: string;
  dateOfBirth: string;
  avatarUrl: string;
  gender: string;
  status: boolean;
  roleId?: RoleFactory;
  refreshToken: string;
  createAt: string;
  refreshTokenExpiryTime: string;
  userDetails?: string;
  sponsorDetails?: string;
}

export enum RoleFactory {
  Player = 1,
  Admin = 2,
  Sponsor = 3,
  Refree = 4,
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  tokenString: string;
  expiration: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  secondName?: string;
  email: string;
  dateOfBirth?: Date;
  avatarUrl?: string;
  gender?: string;
  status: boolean;
  roleId: number;
  refreshToken: string;
  createAt?: Date;
  refreshTokenExpiryTime: Date;
}

export interface GetNewAccessToken {
  refreshToken: string;
  tokenString: string;
}

export interface Sponsor {
  sponsorId: number;
  companyName: string;
  logoUrl?: string;
  urlSocial: string;
  urlSocial1?: string;
  contactEmail: string;
  description?: string;
  isAccept: boolean;
  joinedAt: Date;
}

export interface Player {
  province: string;
  city: string;
  cccd?: string;
  totalMatch: number;
  totalWins: number;
  rankingPoint: number;
  experienceLevel: number;
  joinedAt: Date;
}

export interface UpdateUserRequest {
  userId: number;
  firstName: string;
  lastName: string;
  secondName: string;
  dateOfBirth: string;
  gender: string;
  avatarUrl: string;
  status: boolean;
}
