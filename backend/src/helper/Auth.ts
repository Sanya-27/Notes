import {OAuth2Client} from 'google-auth-library';
const client = new OAuth2Client();
import {Request} from "express";

interface payloadToken{
    iss: string,
    azp: string,
    aud: string,
    sub: string,
    email: string,
    email_verified: boolean,
    nbf: number,
    name: string,
    picture: string,
    given_name: string,
    family_name: string,
    iat: number,
    exp: number,
    jti: string
}

export const headerAuthVerify = async (req : Request) : Promise<false | payloadToken> =>{
    const headers = req.headers
    if(!headers.authorization) return false
    const bearer = headers.authorization.split(' ')[1]

    try{
        const ticket = await client.verifyIdToken({
            idToken: bearer,
        });
        const payload = ticket.getPayload();
        if(!payload) return false;
        return payload as payloadToken
    }catch (e){
        return false
    }
}