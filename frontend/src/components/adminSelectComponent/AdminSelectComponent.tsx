import { UseFormRegister, Path, FieldValues } from "react-hook-form";

interface SelectComponentProps<T, K extends FieldValues>{
    label: string;
    className: string;
    register: UseFormRegister<K>;
    name: keyof K;
    onChangeCallback?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: T[]
    labelId: keyof T;
    labelName: keyof T; 
}

export const AdminSelectComponent = <T,K extends FieldValues>({ label, className, register, name, onChangeCallback, options, labelId, labelName }: SelectComponentProps<T,K>) => {
    return (
        <div className={className}>
            <label className="block text-gray-700 mb-2">{label}:</label>
            <select
                {...register(name as Path<K>, { required: true })}
                className="w-full p-2 border border-gray-300 rounded"
                onChange={onChangeCallback}
            >
                <option value="">Select {label}</option>
                {options.map(option => (
                    <option key={option[labelId] as number} value={option[labelId] as string}>
                        {option[labelName] as string}
                    </option>
                ))}
            </select>
        </div>
    );
};