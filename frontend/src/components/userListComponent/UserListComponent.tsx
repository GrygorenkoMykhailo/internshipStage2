import axios from 'axios';
import { useEffect, useState } from 'react';

export type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  role: 'user' | 'admin';
  receive_updates: boolean;
  remember_me: boolean;
  image_path: string;
};


export const UserListComponent = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const response = await axios.get(import.meta.env.VITE_BASE_URL + '/users', { withCredentials: true });
        const data = response.data as User[];
        setUsers(data);
    }


    const handleRoleChange = async (id: number, newRole: User["role"]) => {
        const response = await axios.post(import.meta.env.VITE_BASE_URL + '/userRole', { id, newRole }, { withCredentials: true });
        const data = response.data as number;

        if(data){
            const updatedUsers = users.map(user =>
                user.id === id ? { ...user, role: newRole } : user
            );
        
            setUsers(updatedUsers);
        }  
    };

    const handleDelete = async (id: number) => {
        const response = await axios.delete(import.meta.env.VITE_BASE_URL + '/user/' + id, { withCredentials: true });
        const data = response.data as number;
        if(data){
            setUsers(users.filter(user => user.id !== data));
        }
    };

    return (
        <div className="p-4 bg-gray-100">
        <h2 className="text-xl font-semibold mb-4">User List</h2>
        <table className="w-full bg-white border border-gray-300">
            <thead>
            <tr className="border-b border-gray-300">
                <th className="p-2 text-left">Avatar</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Phone</th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2 text-left">Receive Updates</th>
                <th className="p-2 text-left">Remember Me</th>
                <th className="p-2 text-left">Actions</th>
            </tr>
            </thead>
            <tbody>
            {users.map(user => (
                <tr key={user.id} className="border-b border-gray-300">
                <td className="p-2">
                    <img
                    src={import.meta.env.VITE_BASE_URL + user.image_path}
                    alt={`${user.first_name} ${user.last_name}`}
                    className="w-12 h-12 rounded-full"
                    />
                </td>
                <td className="p-2">{`${user.first_name} ${user.last_name}`}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.phone_number || 'N/A'}</td>
                <td className="p-2">
                    <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as User["role"])}
                    className="border border-gray-300 rounded p-1"
                    >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    </select>
                </td>
                <td className="p-2">{user.receive_updates ? 'Yes' : 'No'}</td>
                <td className="p-2">{user.remember_me ? 'Yes' : 'No'}</td>
                <td className="p-2">
                    <button
                    onClick={() => handleDelete(user.id)}
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