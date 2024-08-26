import { useForm, SubmitHandler } from "react-hook-form"
import { TextInputComponent } from "../../components";
import axios from "axios";
import { ProfileDAO, UserLoginDAO, UserRegisterDAO } from "../../types";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setProfile } from "../../redux/profileSlice";
import { useEffect } from "react";
import { registerSchema } from "../../schemas/registerSchema";
import { ValidationError } from "yup";
import { loginSchema } from "../../schemas/loginSchema";

interface LoginForm{
    emailOrPhone: string;
    password: string;
    rememberMe?: boolean;
}

interface RegisterForm{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    getUpdates?: boolean;
}

export const AuthPage = () => {
    const loginForm = useForm<LoginForm>();
    const registerForm = useForm<RegisterForm>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector(state => state.profile);

    const onLoginFormSubmit: SubmitHandler<LoginForm> = async formData => {
        const data: UserLoginDAO = {
            emailOrPhone: formData.emailOrPhone,
            password: formData.password,
            rememberMe: formData.rememberMe,
        };
        try{
            await loginSchema.validate(data, { abortEarly: false });

            const response = await axios.post(import.meta.env.VITE_BASE_URL + '/login', data, {
                withCredentials: true,
            }); 
            dispatch(setProfile(response.data as ProfileDAO));
        } catch(e) {
            if(e instanceof ValidationError){
                e.inner.forEach(e => {
                    loginForm.setError(e.path as keyof LoginForm, { type: e.type, message: e.message });
                });
            }
        }
        
    }; 

    const onRegisterFormSubmit: SubmitHandler<RegisterForm> = async formData => {
        try{
            await registerSchema.validate(formData, { abortEarly: false });

            const data: UserRegisterDAO = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                repeatPassword: formData.confirmPassword,
                receiveUpdates: formData.getUpdates ?? false,
            }  

            const response = await axios.post(import.meta.env.VITE_BASE_URL + '/register', data);
            dispatch(setProfile(response.data as ProfileDAO));
        } catch(e) {
            if(e instanceof ValidationError){
                e.inner.forEach(e => {
                    registerForm.setError(e.path as keyof RegisterForm, { type: e.type, message: e.message });
                });
            }
        }       
    }

    useEffect(() => {
        if(isAuthenticated){
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="h-screen">
            <div className="flex justify-center items-center p-4 shadow-sm bg-white">
                <img src="logo_full.svg" alt="Logo" className="w-1/3 cursor-pointer" onClick={() => navigate('/')}/>
            </div>
            <div className="bg-lightGray">
                <div className="flex justify-center items-start py-12 space-x-24">
                    <div className="flex flex-col w-1/3 bg-white rounded-xl shadow-lg p-8">

                        <form className="flex flex-col w-full" onSubmit={loginForm.handleSubmit(onLoginFormSubmit)}>
                            <h3 className="text-center text-3xl font-bold mb-5">SIGN IN</h3>
                            <TextInputComponent form={loginForm} label="Email address or mobile phone number" name="emailOrPhone" type="text"/>
                            <span className="text-red text-xs mt-1">
                                {loginForm.formState.errors.emailOrPhone && loginForm.formState.errors.emailOrPhone.message}
                            </span>
                            <TextInputComponent form={loginForm} label="Password" name="password" type="password"/>
                            <span className="text-red text-xs mt-1">
                                {loginForm.formState.errors.password && loginForm.formState.errors.password.message}
                            </span>
                            <div className="flex items-center mb-4 self-center text-violet">
                                <input type="checkbox" className="mr-2 border border-violet" {...loginForm.register('rememberMe')}/>
                                <label htmlFor="remember">Remember me</label>
                            </div>
                            <button className="bg-violet text-white rounded-md p-2 hover:bg-violet-dark transition font-bold text-xl">
                                Continue
                            </button>
                        </form>

                        <div className="mt-4">
                            <div className="flex flex-row w-full justify-center items-center mb-4">
                                <div className="w-full h-1 bg-violet"></div>
                                <p className="text-center whitespace-nowrap p-2">Don't have an account yet?</p>
                                <div className="w-full h-1 bg-violet"></div>
                            </div>
                            <button className="bg-transparent text-violet border border-violet rounded-md p-2 hover:bg-violet hover:text-white transition w-full font-bold text-xl">
                                Create your Best Product account
                            </button>
                        </div>
                    </div>

                    <form className="flex flex-col w-1/3 bg-white rounded-xl shadow-lg p-8" onSubmit={registerForm.handleSubmit(onRegisterFormSubmit)}>
                        <h3 className="text-center text-3xl font-bold mb-5">SIGN UP</h3>
                        <TextInputComponent form={registerForm} label="First Name" name="firstName" type="text"/>
                        <span className="text-red text-xs mt-1">
                            {registerForm.formState.errors.firstName && registerForm.formState.errors.firstName.message}
                        </span>
                        <TextInputComponent form={registerForm} label="last Name" name="lastName" type="text"/>
                        <span className="text-red text-xs mt-1">
                            {registerForm.formState.errors.lastName && registerForm.formState.errors.lastName.message}
                        </span>
                        <TextInputComponent form={registerForm} label="Email Adress" name="email" type="text"/>
                        <span className="text-red text-xs mt-1">
                            {registerForm.formState.errors.email && registerForm.formState.errors.email.message}
                        </span>
                        <TextInputComponent form={registerForm} label="Password" name="password" type="password"/>
                        <span className="text-red text-xs mt-1">
                            {registerForm.formState.errors.password && registerForm.formState.errors.password.message}
                        </span>
                        <span className="text-xs text-gray-500 mb-2 opacity-50">
                            Password must contain at least eight characters.
                        </span>
                        <span className="text-xs text-gray-500 mb-4 opacity-50">
                            A strong password contains a combination of letters, numbers, and symbols.
                        </span>
                        <TextInputComponent form={registerForm} label="Confirm Password" name="confirmPassword" type="password"/>
                        <span className="text-red text-xs mt-1">
                            {registerForm.formState.errors.confirmPassword && registerForm.formState.errors.confirmPassword.message}
                        </span>
                        <div className="flex items-center mb-4 self-center text-violet">
                            <input 
                                type="checkbox" 
                                className="mr-2"
                                {...registerForm.register('getUpdates')}
                            />
                            <label htmlFor="updates">Get updates on our shop news and promotions</label>
                        </div>
                        <button className="bg-violet text-white rounded-md p-2 hover:bg-violet-dark transition font-bold text-xl">
                            Create account
                        </button>
                    </form>
                    
                </div>
            </div>
        </div>
    )
}
