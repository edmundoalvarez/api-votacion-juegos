import accountService from '../services/account.js'

function createAccount(req, res) {

    accountService.createAccount(req.body)
    .then(() => {
        res.status(201).json({msg: 'La cuenta ha sido creada con éxito'})
    })
    .catch((error)=>{
        res.status(500).json({msg: 'No se pudo crear la cuenta', err: error})
    })
}

function login(req, res) {
    accountService.createSession(req.body)
    .then((session) => {
        res.status(200).json(session)
    })
    .catch(()=>{
        res.status(500).json({msg: 'No se pudo iniciar sesión'})
    })
}

function logout(req, res) {
    accountService.deleteSession(req.token)
    .then(() => {
        res.status(200).json({msg: 'La sesión ha sido cerrada con éxito'})
    })
    .catch(()=>{
        res.status(500).json({msg: 'No se pudo cerrar sesión'})
    })
}

export default {
    createAccount,
    login,
    logout
}