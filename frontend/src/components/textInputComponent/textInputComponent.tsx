import { FieldValues, UseFormReturn, Path } from "react-hook-form"

interface TextInputComponentProps<T extends FieldValues>{
    label: string;
    name: keyof T;
    type: 'text' | 'password';
    form: UseFormReturn<T>;
    defaultValue?: string;
}

export const TextInputComponent = <T extends FieldValues>( {form, label, name, type, defaultValue }: TextInputComponentProps<T>) => {
    return (
        <>
        <label htmlFor={name as string} className="mb-2">{label}</label>
        <input 
            type={type}  
            id={name as string}
            className="border-2 border-opacity-70 border-violet rounded-md py-2 px-4 mb-4"
            defaultValue={defaultValue}
            {...form.register(name as Path<T>)}
            />
        </>
    )
}