import * as jwt from "jsonwebtoken";
import * as config from "config";
import { Request, Response, NextFunction } from "express";
interface UserRecorded {
  user:object
}
type RequestM = Request & UserRecorded;
export class Authenticated {
  public basicAuthenticated(req: RequestM, res: Response, next: NextFunction) {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({
        msg: "No Token, Autorizacion denegada",
      });
    }

    // Verificar Token
    try {
      const clave = "secretTokenScriptEncription";
      const decoded = jwt.verify(token, clave);
      req.user = decoded.user;
      next();
    } catch (err) {
      res.status(401).json({
        msg: "Token is not valid",
      });
    }
  }

  superUserAuthenticated(req, res, next) {
    // Get token
    const token = req.header("Authorization");
    // Check if not token
    if (!token) {
      return res.status(401).json({
        msg: "No Token, Autorizacion denegada",
      });
    }
    // Verificar Token
    try {
      const clave = "secretTokenScriptEncription";
      const decoded = jwt.verify(token, clave);
      req.user = decoded.user;
      console.log("mirando token decoded");
      console.log(decoded);
      if (decoded.user.superuser && decoded.user.admin) {
        next();
      } else {
        console.log("algun error en este middleware");
      }
    } catch (err) {
      console.log("no es super usuario");
      res.status(401).json({
        msg: "you are not SuperUser",
      });
    }
  }

  adminAuthenticated(req, res, next) {
    // Get token
    const token = req.header("Authorization");

    // Check if not token
    if (!token) {
      return res.status(401).json({
        msg: "No Token, Autorizacion denegada",
      });
    }
    // Verificar Token
    try {
      const clave = "secretTokenScriptEncription"; 
      const decoded = jwt.verify(token, clave);
      req.user = decoded.user;
      if (decoded.user.admin) {
        next();
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        msg: "el tiempo del token ha expirado",
      });
    }
  }

  isadmin(req, res, next) {
    const token = req.header("Authorization");
    try {
      const clave = "secretTokenScriptEncription";
      const decoded = jwt.verify(token, clave);
      if (decoded.user.admin) {
        /* es admin y tiene permisos */
        console.log("usuario admin haciendo peticiones");
        next();
      } else {
        console.log("el cajero " + decoded.user.name + " no tiene permisos");
        return res.status(200).send("You have no permission");
      }
    } catch (error) {
      console.error(error);
      return res.status(401).json({
        msg: "You do not have permission to make this action",
      });
    }
  }
}
