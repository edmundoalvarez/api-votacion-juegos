import express from 'express'
import accountController from '../controllers/account.js'
import { validateAccount, verifySession } from '../middlewares/account.js'

const route = express.Router()

route.post('/account', [validateAccount], accountController.createAccount)

route.post('/session', [validateAccount], accountController.login)

route.delete('/session', [verifySession], accountController.logout)

export default route 