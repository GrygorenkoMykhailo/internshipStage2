import { boolean, object, string, ref } from "yup";

export const registerSchema = object({
    firstName: string().required('First name is required').max(20, 'First name must be less than 20 characters'),
    lastName: string().required('Last name is required').max(20, 'Last name must be less than 20 characters'),
    email: string().required('Email is required').email('Incorrect email format'),
    password: string().required().min(8, 'Password must be at least 8 characters').matches(/^[A-Za-z0-9+-_?$%#]+$/, 'Password can only contain Latin letters, numbers, and the following special characters: +-_?$%#'),
    confirmPassword: string().required('Please confirm your password').oneOf([ref('password')], 'Passwords must match'),
    getUpdates: boolean(),
});