import { FieldValues, UseFormRegister, Path } from "react-hook-form";

interface TextInputProps<T extends FieldValues> {
    label: string;
    type?: string;
    register: UseFormRegister<T>;
    name: keyof T;
    placeholder?: string;
    className?: string;
    isTextArea?: boolean;
}

export const AdminTextInputComponent = <T extends FieldValues>({ label, type = 'text', register, name, placeholder, className, isTextArea }: TextInputProps<T>) => {

    if(isTextArea){
        return (
            <div className={className}>
                <label className="block text-gray-700 mb-2">{label}:</label>
                    <textarea
                        {...register(name as Path<T>)}
                        name={name as string}
                        placeholder={placeholder}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
            </div>
        )
    }else{
        return (
            <div className={className}>
                <label className="block text-gray-700 mb-2">{label}:</label>
                <input
                    {...register(name as Path<T>)}
                    type={type}
                    placeholder={placeholder}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
        );
    }
};