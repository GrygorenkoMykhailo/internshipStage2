import { object, string, mixed, number } from "yup";

export const createProductSchema = object({
    name: string().required('Product name is required'),
    price: string().test('is-number', 'Price must be a number', value => {
        if(!value) return false;
        return !isNaN(+value) && +value > 0;
    }).required('Price is required'),
    description: string().required('Description is required'),
    image: mixed()
        .test('fileSize', 'File too large', value => !value || (value instanceof FileList && value[0] && value[0].size <= 2 * 1024 * 1024)) 
        .test('fileType', 'Unsupported File Format', value => !value || (value instanceof FileList &&  value[0] && ['image/jpeg', 'image/png', 'image/gif'].includes(value[0].type))),
    category: number().required('Category is required'),
    subcategory: number().required('Subcategory is required'),
});