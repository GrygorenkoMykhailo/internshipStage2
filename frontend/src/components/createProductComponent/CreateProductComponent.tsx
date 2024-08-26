import axios from "axios";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useFetchKeysAndValues } from "../../hooks/useFetchKeysAndValues";
import { useFetchSubCategories, useAppSelector } from "../../hooks";
import { AdminTextInputComponent } from "../adminTextInputComponent/AdminTextInputComponent";
import { AdminSelectComponent } from "../adminSelectComponent/AdminSelectComponent";
import { Category, SubCategory } from "../../types";
import { ValidationError } from "yup";
import { createProductSchema } from "../../schemas/createProductSchema";
import { useState } from "react";

interface CreateProductForm {
    name: string;
    price: number;
    description: string;
    image: FileList;
    category: number;
    subcategory: number;
    characteristics: { [key: string]: string };
}

export const CreateProductComponent = () => {
    const [characteristicError, setCharacteristicsError] = useState('');
    const { register, handleSubmit, control, reset, watch, setValue, setError, formState: { errors } } = useForm<CreateProductForm>();
    const { categories } = useAppSelector(state => state.categories);
    const selectedCategory = watch("category");
    const selectedSubCategoryId = watch("subcategory");

    const [subCategories] = useFetchSubCategories(selectedCategory);
    const [allowedCharacteristics, setAllowedCharacteristics] = useFetchKeysAndValues(selectedSubCategoryId);

    const onSubmit: SubmitHandler<CreateProductForm> = async data => {
        try {
            await createProductSchema.validate(data, { abortEarly: false });

            const formData = new FormData();
            
            formData.append('name', data.name);
            formData.append('price', data.price.toString());
            formData.append('description', data.description);
            formData.append('category', data.category + '');
            formData.append('subcategory', data.subcategory + '');
        
            if (data.image && data.image.length > 0) {
                formData.append('image', data.image[0]);
            }
        
            for (const key in data.characteristics) {
                if(!data.characteristics[key]){
                    setCharacteristicsError('Not all characteristics are specified');
                    return;
                }
                formData.append(`characteristics[${key}]`, data.characteristics[key]);
            }
        
            try {
                await axios.post(import.meta.env.VITE_BASE_URL + '/product', formData, { 
                    withCredentials: true, 
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                });
                setCharacteristicsError('');
                reset();
            } catch (error) {
                console.error("Error creating product:", error);
            }
        } catch (e) {
            if (e instanceof ValidationError) {
                e.inner.forEach(e => {
                    setError(e.path as keyof CreateProductForm, { type: e.type, message: e.message });
                }); 
            }
        }
    };

    return (
        <div className="p-4 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4">Create Product</h1>

            <form onSubmit={handleSubmit(onSubmit)}>
                <AdminTextInputComponent
                    label="Name"
                    register={register}
                    name="name"
                    className="mb-4"
                    placeholder="Product name"
                />
                {errors.name && <span className="text-red text-xs mt-1">{errors.name.message}</span>}
                
                <AdminTextInputComponent
                    label="Price"
                    register={register}
                    name="price"
                    className="mb-4"
                    placeholder="Product price"
                />
                {errors.price && <span className="text-red text-xs mt-1">{errors.price.message}</span>}
                
                <AdminTextInputComponent
                    label="Description"
                    register={register}
                    name="description"
                    className="mb-4"
                    placeholder="Product description"
                />
                {errors.description && <span className="text-red text-xs mt-1">{errors.description.message}</span>}
                
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Image:</label>
                    <input
                        {...register("image")}
                        type="file"
                        accept="image/png, image/gif, image/jpeg"
                    />
                    {errors.image && <span className="text-red text-xs mt-1">{errors.image.message}</span>}
                </div>

                <AdminSelectComponent<Category, CreateProductForm>
                    label="Category"
                    className="mb-4"
                    register={register}
                    name="category"
                    options={categories}
                    labelId="id"
                    labelName="name"
                    onChangeCallback={(e) => {
                        setValue('category', +e.target.value);
                        setValue('subcategory', 0);
                        setAllowedCharacteristics([]);
                    }}
                />
                {errors.category && <span className="text-red text-xs mt-1">{errors.category.message}</span>}

                <AdminSelectComponent<SubCategory, CreateProductForm>
                    label="Subcategory"
                    className="mb-4"
                    register={register}
                    name="subcategory"
                    options={subCategories}
                    labelId="id"
                    labelName="name"
                    onChangeCallback={(e) => {
                        setValue('subcategory', +e.target.value);
                    }}
                />
                {errors.subcategory && <span className="text-red text-xs mt-1">{errors.subcategory.message}</span>}

                {allowedCharacteristics.length > 0 && (
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold mb-2">Characteristics</h2>
                        {allowedCharacteristics.map((characteristic, index) => (
                            <div key={index} className="mb-2">
                                <label className="block text-gray-700 mb-1">{characteristic.name}:</label>
                                <Controller
                                    name={`characteristics.${characteristic.name}`}
                                    control={control}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            className="w-full p-2 border border-gray-300 rounded"
                                        >
                                            <option value="">Select {characteristic.name}</option>
                                            {characteristic.values.map((value, idx) => (
                                                <option key={idx} value={value.value}>
                                                    {value.value}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                />
                                {errors.characteristics?.[characteristic.name] && (
                                    <span className="text-red text-xs mt-1">
                                        {errors.characteristics[characteristic.name]?.message}
                                    </span>
                                )}
                            </div>
                        ))}
                        {characteristicError &&  <span className="text-red text-xs mt-1">{characteristicError}</span>}
                    </div>
                )}
                <button
                    type="submit"
                    className="px-4 py-2 mt-4 bg-blue-500 border rounded hover:bg-blue-600"
                >
                    Save Product
                </button>
            </form>
        </div>
    );
};
