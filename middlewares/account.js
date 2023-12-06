import { AccountSchema } from "../schemas/accountSchema.js";
import accountService from "../services/account.js";

export function validateAccount(req, res, next) {

    AccountSchema.validate(req.body, {
        stripUnknown: true,
        abortEarly: false,

    })
    .then(async function (data) {
        req.body = data;
        next();
    })
    .catch(function (error) {
        res.status(400).json({msg: 'Error al validar la cuenta'})
    })

}

export function verifySession(req, res, next){
    const token = req.headers['auth-token'];

    if(!token){
       return res.status(401).json({msg: 'No se encontró el token'})
    } 

    accountService.verifyToken(token)
    .then((payload) =>{
        req.token = token
        req.session = payload;
        next();
    })
    .catch(()=>{
        res.status(401).json({msg: 'Token inválido'})
    })
}