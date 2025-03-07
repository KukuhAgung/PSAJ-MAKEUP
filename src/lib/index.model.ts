export interface IJWTDecoded{
    id: string;
    username: string;
    role: string;
    iat: number;
    exp: number;
}