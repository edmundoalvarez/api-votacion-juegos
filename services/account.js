import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const client = new MongoClient('mongodb://127.0.0.1:27017')
const db = client.db("AH_PARCIAL1")
const AccountsCollection = db.collection('accounts');
const TokensCollection = db.collection('tokens');

async function createAccount(data) {
    await client.connect()

    const newAccount = {
        ...data
    }

    const salt = await bcrypt.genSalt(10)

    newAccount.password = await bcrypt.hash(data.password, salt)

    await AccountsCollection.insertOne(newAccount)

    return {
        account: {...newAccount, password: undefined},
        token: await createToken({...newAccount, password: undefined})
    }
}

async function verifyAccount(account) {
    await client.connect()

    const accountFound = await AccountsCollection.findOne({email: account.email})

    if(!accountFound){
        throw {msg: 'No se encuentra el email.'}
    }

    const isMatch = await bcrypt.compare(account.password, accountFound.password)

    if(!isMatch){
        throw {msg: 'Contraseña incorrecta.'}
    }

    return {...account, password: undefined, id: accountFound._id}
}

async function createToken(payload){
    const token = jwt.sign(payload, 'secret')

    TokensCollection.insertOne({token, email: payload.email})

    return token
}

async function createSession(account){  

    return {
        account: await verifyAccount(account),
        token: await createToken({...account, password: undefined})
    }
}

async function verifyToken(token){

    await client.connect();

    const payload = jwt.verify(token, 'secret')

    if(!await TokensCollection.findOne({token})){
        throw {msg: 'Token inválido'}
    }

    return payload
}

async function deleteSession(token){
    await client.connect();

    await TokensCollection.deleteOne({token})

}

export default {
    createAccount,
    createSession,
    deleteSession,
    verifyToken
}