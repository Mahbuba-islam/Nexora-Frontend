
"use server"

import jwt, { JwtPayload } from "jsonwebtoken";
import { purgeCookieEverywhere, setCookie } from "./cookieUtils";


const getTokenSecondsRemaining =  (token: string): number => {
    if(!token) return 0;
    try {
        const tokenPayload= jwt.decode(token) as JwtPayload;

        if (tokenPayload && !tokenPayload.exp){
            return 0;
        }

        const remainingSeconds = tokenPayload.exp as number - Math.floor(Date.now() / 1000)

        return remainingSeconds > 0 ? remainingSeconds : 0;

    } catch (error) {
        console.error("Error decoding token:", error);
        return 0;
    }
} 

export const setTokenInCookies = async (
    name : string,
    token : string,
    fallbackMaxAgeInSeconds = 60 * 60 * 24 // 1 days
) => {
    // 🧹 Always evict any orphan duplicates of this cookie that were written
    // previously with different attributes (path / secure / httpOnly).
    // Without this sweep, the new write only shadows matching variants and
    // the browser keeps the stale ones forever — which is how two different
    // users' tokens can co-exist in `Application → Cookies`.
    await purgeCookieEverywhere(name);

    // If the caller didn't actually have a token (e.g. the backend's email/
    // password login response omits the BetterAuth `token` field), we MUST
    // bail out *after* the purge so we don't write a literal "undefined"
    // string back into the cookie. Skipping the purge would leave the
    // previous user's session token in place — which is exactly the
    // "logged in as expert but acts like client" bug.
    if (!token || typeof token !== "string") {
        return;
    }

    let maxAgeInSeconds;

    if (name !== "better-auth.session_token"){
        maxAgeInSeconds = getTokenSecondsRemaining(token);
    }

    await setCookie(name, token, maxAgeInSeconds || fallbackMaxAgeInSeconds);
}


export async function isTokenExpiringSoon(token: string, thresholdInSeconds = 300) : Promise<boolean> {
    const remainingSeconds = getTokenSecondsRemaining(token);
    return remainingSeconds > 0 && remainingSeconds <= thresholdInSeconds;
}

export async function isTokenExpired(token: string) : Promise<boolean> {
    const remainingSeconds = getTokenSecondsRemaining(token);
    return remainingSeconds === 0;
}