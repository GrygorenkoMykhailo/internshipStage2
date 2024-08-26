import { Outlet, useNavigate } from "react-router-dom";
import { HeaderComponent } from "../../components";

export const AdminPage = () => {
    const navigate = useNavigate();
    return (
        <>
        <HeaderComponent />
        <div className="flex min-h-screen">
            <ul className="w-64 border-r border-gray-300 min-h-full">
                <li className="border-b border-gray-300 cursor-pointer p-5" onClick={() => navigate('/admin/products')}>
                    <p className="text-lg text-center">Products</p>
                </li>
                <li className="border-b border-gray-300 cursor-pointer p-5" onClick={() => navigate('/admin/users')}>
                    <p className="text-lg text-center">Users</p>
                </li>
                <li className="border-b border-gray-300 cursor-pointer p-5" onClick={() => navigate('/admin/products/create')}>
                    <p className="text-lg text-center">Create product</p>
                </li>
            </ul>
            <div className="flex-1 p-4">
            <Outlet />
            </div>
        </div>
        </>
    );
};