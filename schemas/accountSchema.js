import yup from 'yup';

const AccountSchema = yup.object({
    email: yup.string().email().min(7).required(),
    password: yup.string().min(6).required(),
})

export {
    AccountSchema
}