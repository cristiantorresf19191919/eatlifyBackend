import * as jwt from "jsonwebtoken";
import { Request, Response, Router, NextFunction } from "express";

const customResponses =  {
    'invalidPass':'Contraseña Incorrecta',
    'badReq': 'Peticion Incorrecta',
    'noEntity': 'No se encuentra documento en la base de datos'

}

export type ResponseStr = keyof typeof customResponses;

export class CommonServices {

 handleJWT(payload, expiresIn = 240){
    return new Promise((resolve,reject) => {  
        if (payload?.password) delete payload.password          
        const jwtoptions = {expiresIn};   
        const db = "secretTokenScriptEncription"; //.env luego 
        jwt.sign(payload, db, jwtoptions, (err, token) => {
            resolve(token)
            if (err) reject(err)
        });
    })
    }

 handleCustomException(res: Response, status:number, msg:ResponseStr) {
    return res.status(status).send(customResponses[msg]);

 }
}



