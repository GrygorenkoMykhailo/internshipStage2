import { useNavigate } from 'react-router';
import { useAppSelector } from "../../hooks/useAppSelector";
import React, { useState } from "react";
import { CategoriesIcon, FavoritesIcon, HomeIcon } from '../../icons';

interface SideBarComponentProps {
    activeItem?: 'favorites' | 'home' | 'categories';
}

export const SideBarComponent = React.memo(({ activeItem }: SideBarComponentProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalCategory, setModalCategory] = useState<string | null>(null);
    const { categories } = useAppSelector(state => state.categories);

    const navigate = useNavigate();

    const handleCategoryMouseEnter = (category: string) => {
        if(!showModal){
            setModalCategory(category);
            setShowModal(true);
        }else{
            setModalCategory(category);
            setShowModal(true);
        }
    };

    const handleItemClick = (item: SideBarComponentProps["activeItem"], categoryName?: string) => {
        switch (item) {
            case 'categories':
                if (categoryName) {
                    navigate(`/products?category=${encodeURIComponent(categoryName)}`, { state: { category: categories.find(c => c.name === categoryName) } });
                }
                break;
            case 'favorites':
                navigate('/favorites');
                break;
            case 'home':
                navigate('/');
                break;
        }
    };

    return (
        <div
            className={`fixed left-0 top-0 h-full bg-white transition-all duration-100 flex flex-col items-start
            ${isOpen ? 'w-80' : 'w-28'} z-10`} 
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => {
                setIsOpen(false);
            }}
        >
            <div className="mt-60 p-3 flex flex-col justify-start items-start w-full relative space-y-8"> 
                <div 
                    className={`flex space-x-4 rounded-xl cursor-pointer p-2 justify-center items-center
                        ${activeItem === 'home' ? 'bg-violet text-white' : isOpen ? 'bg-gray-100 text-gray-700' : 'bg-transparent text-gray-700'}`}
                    onClick={() => handleItemClick('home')}
                >
                    <HomeIcon color={activeItem === 'home' ? '#FFFFFF' : '#524F5E'} />
                    <p 
                        className={`transition-all duration-100 text-3xl ${isOpen ? 'opacity-100 w-48' : 'opacity-0 w-0'}`} 
                        style={{ marginLeft: isOpen ? '1rem' : 0 }}
                    >
                        Home
                    </p>
                </div>
                <div 
                    className={`flex space-x-4 rounded-xl cursor-pointer p-2 justify-center items-center
                        ${activeItem === 'favorites' ? 'bg-violet text-white' : isOpen ? 'bg-gray-100 text-gray-700' : 'bg-transparent text-gray-700'}`}
                    onClick={() => handleItemClick('favorites')}
                >
                    <FavoritesIcon color={activeItem === 'favorites' ? '#FFFFFF' : '#524F5E'} selected={false}/>
                    <p 
                        className={`transition-all duration-100 text-3xl ${isOpen ? 'opacity-100 w-48' : 'opacity-0 w-0'}`}
                        style={{ marginLeft: isOpen ? '1rem' : 0 }}
                    >
                        Favorites
                    </p>
                </div>
                <div 
                    className={`flex space-x-4 rounded-xl cursor-pointer p-2 justify-center items-center
                        ${activeItem === 'categories' ? 'bg-violet text-white' : isOpen ? 'bg-gray-100 text-gray-700' : 'bg-transparent text-gray-700'}`}
                    onClick={() => handleItemClick('categories')}
                >
                    <CategoriesIcon color={activeItem === 'categories' ? '#FFFFFF' : '#524F5E'} />
                    <p 
                        className={`transition-all duration-100 text-3xl ${isOpen ? 'opacity-100 w-48' : 'opacity-0 w-0'}`}
                        style={{ marginLeft: isOpen ? '1rem' : 0 }}
                    >
                        Categories
                    </p>
                </div>
                <div className="w-full relative">
                    {categories && categories.map((c) => (
                        <div key={c.id}>
                            <div 
                                className={`transition-all duration-100 text-3xl p-2 mb-3 cursor-pointer ${isOpen ? 'opacity-100 w-full' : 'opacity-0 w-0'}`}
                                style={{ marginLeft: isOpen ? '1rem' : 0 }}
                                onClick={() => handleItemClick('categories', c.name)}
                                onMouseEnter={() => handleCategoryMouseEnter(c.name)}
                            >   
                                <div className="flex space-x-5 items-center">
                                    <img src={import.meta.env.VITE_BASE_URL + c.imagePath} alt="" className='w-6 h-6' /> 
                                    <p>{c.name}</p>
                                </div>
                            </div>
                            {showModal && c.name === modalCategory && c.subcategories.length !== 0 && (
                                <div 
                                    className="absolute left-full top-0 bg-white shadow-lg border-2 border-violet rounded-lg p-4 transition-opacity duration-300 z-30 ml-3"
                                    style={{ minWidth: '200px' }}
                                    onMouseLeave={() => {
                                        setShowModal(false);
                                    }}
                                >
                                    {c.subcategories.map(sc => (
                                        <p key={sc.id} className="text-xl p-2 mb-2 cursor-pointer hover:bg-gray-100 rounded"
                                        onClick={() => navigate(`/products?category=${c.name}&subcategory=${sc.name}`, { state: { category: c, subcategory: sc } })}>
                                            {sc.name}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});
