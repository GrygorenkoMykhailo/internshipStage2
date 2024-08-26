import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { useFetchKeysAndValues } from "../../hooks/useFetchKeysAndValues";
import { useAppSelector } from "../../hooks";
import { useFetchProducts } from "../../hooks/useFetchProducts";
import { Category, SubCategory } from "../../types";
import { AdminTextInputComponent, AdminSelectComponent } from "../";
import { editProductSchema } from "../../schemas/editProductSchema";
import { ValidationError } from "yup";


interface EditProductForm {
    name: string;
    price: number;
    description: string;
    image: FileList;
    category: number;
    subcategory: number;
    characteristics: { [key: string]: string };
}

export const AdminEditProductComponent = () => {
    const [characteristicsError, setCharacteristicsError] = useState('');
    const { id } = useParams(); 
    const { register, handleSubmit, setValue, watch, setError, formState: { errors } } = useForm<EditProductForm>();
    const [productsArray, setProductArray] = useFetchProducts('byId', { id: id ? +id : undefined });
    const product = productsArray[0];
    
    const { categories } = useAppSelector(state => state.categories);
    const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(null);

    const selectedCategory = watch('category');
    const selectedSubCategory = watch('subcategory');

    const [allowedCharacteristics, setAllowedCharacteristics] = useFetchKeysAndValues(selectedSubCategory);

    useEffect(() => {
        product?.characteristics.forEach(ch => {
            setValue(`characteristics.${ch.key}`, ch.value);
        });
    }, [product?.characteristics, allowedCharacteristics]);

    useEffect(() => {
        setAllowedCharacteristics([]);
    }, [selectedCategory])

    useEffect(() => {
        if (product) {
            setValue('name', product.name);
            setValue('price', product.price);
            setValue('description', product.description);
            setValue('category', product.categoryId);
            setValue('subcategory', product.subcategoryId);  
            setImagePreview(import.meta.env.VITE_BASE_URL + product.imagePath);
        }
    }, [product]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleDeleteComment = async (id: number) => {
        const response = await axios.delete(import.meta.env.VITE_BASE_URL + '/comment/' + id, { withCredentials: true });
        const data = response.data as number;
        setProductArray([{...product, comments: product.comments.filter(c => c.id !== data)} ]);
    }

    const onSubmit: SubmitHandler<EditProductForm> = async data => {
        try {
            await editProductSchema.validate(data, { abortEarly: false });

            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('price', data.price.toString());
            formData.append('description', data.description);
            formData.append('category', data.category + '');
            formData.append('subcategory', data.subcategory + '');

            if (data.image && data.image[0]) {
                formData.append('image', data.image[0]);
            }

            Object.entries(data.characteristics).forEach(([key, value]) => {
                if(!value){
                    setCharacteristicsError('Not all characteristics are specified');
                    return;
                }
                formData.append(`characteristics[${key}]`, value);
            });

            try {
                await axios.put(import.meta.env.VITE_BASE_URL + '/product/' + product!.id, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true
                });
                console.log('Product updated successfully');
            } catch (error) {
                console.error('Error updating product:', error);
            }
        } catch (e) {
            if (e instanceof ValidationError) {
                e.inner.forEach(e => {
                    setError(e.path as keyof EditProductForm, { type: e.type, message: e.message });
                });
            }
        }
    };

    return (
        <div className="p-4 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4">Edit Product</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                <AdminTextInputComponent label="Name" type="text" register={register} name="name" placeholder="Product Name" className="mb-4"/>
                {errors.name && <span className="text-red text-xs mt-1">{errors.name.message}</span>}
                <AdminTextInputComponent label="Price" type="text" register={register} name="price" placeholder="Product Price" className="mb-4"/>
                {errors.price && <span className="text-red text-xs mt-1">{errors.price.message}</span>}
                <AdminTextInputComponent label="Description" type="text" register={register} name="description" placeholder="Product Description" className="mb-4" isTextArea/>
                {errors.description && <span className="text-red text-xs mt-1">{errors.description.message}</span>}

                <div className="mb-4 flex flex-col">
                    <label className="block text-gray-700 mb-2">Image:</label>
                    {imagePreview && <img src={imagePreview as string} alt="Preview" className="w-64 h-64 self-center mb-2"/>}
                    <input {...register("image")} type="file" accept="image/png, image/gif, image/jpeg" onChange={handleImageChange}/>
                </div>
                {errors.image && <span className="text-red text-xs mt-1">{errors.image.message}</span>}

                <AdminSelectComponent<Category, EditProductForm> label="Category" className="mb-4" register={register} name="category" options={categories} labelId="id" labelName="name" 
                    onChangeCallback={(e) => {
                        setValue('category', +e.target.value)
                        setValue('subcategory', 0);
                    }}/>
                {errors.category && <span className="text-red text-xs mt-1">{errors.category.message}</span>}

                <AdminSelectComponent<SubCategory, EditProductForm> label="Subcategory" className="mb-4" register={register} name="subcategory" 
                    options={categories.find(c => c.id === +selectedCategory)?.subcategories ?? []}
                    labelId="id" labelName="name"
                    onChangeCallback={(e) => {
                        setValue('subcategory', +e.target.value);
                    }}/>
                {errors.subcategory && <span className="text-red text-xs mt-1">{errors.subcategory.message}</span>}

                {allowedCharacteristics && allowedCharacteristics.length > 0 && (
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold mb-2">Characteristics</h2>
                        {allowedCharacteristics.map((characteristic, index) => (
                            <div key={index} className="mb-2">
                                <label className="block text-gray-700 mb-1">{characteristic.name}:</label>
                                <select
                                    {...register(`characteristics.${characteristic.name}`)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                >
                                    <option value="">Select {characteristic.name}</option>
                                    {characteristic.values.map(value => (
                                        <option key={value.id} value={value.value}>
                                            {value.value}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                        {characteristicsError &&  <span className="text-red text-xs mt-1">{characteristicsError}</span>}
                    </div>
                )}

                <button type="submit" className="px-4 py-2 mt-4 bg-blue-500 border rounded hover:bg-blue-600">
                    Save Changes
                </button>
            </form>

            <table className="w-full bg-white border border-gray-300 mt-10">
                <thead>
                    <tr className="border-b border-gray-300">
                        <th className="p-2 text-left">Comment</th>
                        <th className="p-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {product && product.comments && product.comments.length > 0 ? (
                        product.comments.map(comment => (
                            <tr key={comment.id} className="border-b border-gray-300">
                                <td className="p-2">{comment.content}</td>
                                <td className="p-2">
                                    <button
                                        onClick={() => handleDeleteComment(comment.id)}
                                        className="text-black py-1 px-2 rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={2} className="p-2 text-center">No comments available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};



