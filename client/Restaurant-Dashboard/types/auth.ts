export interface LoginRequest {
    username: string;
    pinCode: string;
}

export interface User {
    id: string;
    username: string;
    avatar?: string;
    shiftStart?: string;
    shiftEnd?: string;
    role: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface RefreshTokenRequest {
    accessToken: string;
    refreshToken: string;
}