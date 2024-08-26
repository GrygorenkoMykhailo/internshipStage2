import axios from "axios";
import { useNavigate } from "react-router";
import { useFetchProducts } from "../../hooks/useFetchProducts";

export const AdminProductListComponent = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useFetchProducts('all');

    const handleDelete = async (id: number) => {
        const response = await axios.delete(import.meta.env.VITE_BASE_URL + '/product/' + id, { withCredentials: true });
        const data = response.data as number;
        if(data){
            setProducts(products.filter(p => p.id !== data));
        }
    }

    return (
        <div className="p-4 bg-gray-100">
            <h2 className="text-xl font-semibold mb-4">Product List</h2>
            <table className="w-full bg-white border border-gray-300">
                <thead>
                    <tr className="border-b border-gray-300">
                        <th className="p-2 text-left">Image</th>
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-left">Price</th>
                        <th className="p-2 text-left">Category</th>
                        <th className="p-2 text-left">Subcategory</th>
                        <th className="p-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id} className="border-b border-gray-300">
                            <td className="p-2">
                                <img
                                    src={import.meta.env.VITE_BASE_URL + product.imagePath}
                                    alt={product.name}
                                    className="w-12 h-12 rounded"
                                />
                            </td>
                            <td className="p-2 cursor-pointer" onClick={() => navigate('/admin/products/edit/' + product.id)}>{product.name}</td>
                            <td className="p-2">${product.price}</td>
                            <td className="p-2">{product.category.name}</td>
                            <td className="p-2">{product.subcategory.name}</td>
                            <td className="p-2">
                                <button
                                    onClick={() => handleDelete(product.id)}
                                    className="text-black py-1 px-2 rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};