import JWT_SECRET from "../clave";
import * as JWT from "jsonwebtoken";

import * as bcrypt from "bcryptjs";



export function signToken (user):string{
    const payload = {
      iss: "express js server",
      sub: user._id,
      email:user.email,
      iat: new Date().getTime(), // current time
      exp: new Date().setDate(new Date().getDate() + 1), // current time + 1 day ahead
    };
    return JWT.sign(payload, JWT_SECRET);
  };

export async function hashPassword(password:string):Promise<string>{
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password,salt);
    return hashed;
}

