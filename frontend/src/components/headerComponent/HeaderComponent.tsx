import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { logOut } from "../../redux/profileSlice";
import './style.css';
import axios from "axios";
import { SearchStringDAO } from "../../types";

export const HeaderComponent = React.memo(() => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const searchResultsRef = useRef<HTMLDivElement | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [modalDissapearTimeout, setmodalDissapearTimeout] = useState<number>();
    const [fetchSearchStringTimeout, setFetchSearchStringTimeout] = useState<number>();
    const [searchResults, setSearchResults] = useState<SearchStringDAO | null>(null);
    const profile = useAppSelector(state => state.profile);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchResultsRef.current && !searchResultsRef.current.contains(event.target as Node)) {
                setSearchResults(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleIconClick = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleLogOut = () => {
        dispatch(logOut());
        navigate('/auth');
    };

    const handleSearchTextInput = () => {
        if (!fetchSearchStringTimeout) {
            const id = setTimeout(() => {
                fetchSearchString(inputRef.current?.value);
            }, 500);
            setFetchSearchStringTimeout(id);
        } else {
            clearTimeout(fetchSearchStringTimeout);
            const id = setTimeout(() => {
                fetchSearchString(inputRef.current?.value);
            }, 500);
            setFetchSearchStringTimeout(id);
        }
    };

    const fetchSearchString = async (string?: string) => {
        if (string && string.trim()) {
            const response = await axios.get(import.meta.env.VITE_BASE_URL + '/searchString?string=' + string);
            const data: SearchStringDAO = response.data;
            setSearchResults(data);
        } else {
            setSearchResults(null);
        }
    };

    const handleCategoryClick = (name: string) => {
        navigate('/products?category=' + name);
        setSearchResults(null); 
    };

    const handleSubCategoryClick = (categoryName: string, subCategoryName: string) => {
        navigate(`/products?category=${categoryName}&subcategory=${subCategoryName}`);
        setSearchResults(null);
    };

    return (
        <div className="p-2 flex justify-between items-center shadow-md z-20 relative">
            <div>
                <img
                    src="/Logo.svg"
                    alt="Logo"
                    className="cursor-pointer"
                    onClick={() => navigate('/')}
                />
            </div>
            <div className="w-1/3 relative">
                <div className="flex">
                    <div className="bg-lightGray rounded-l-xl flex justify-center items-center w-24">
                        <img
                            src="/search_icon.svg"
                            alt="Search Icon"
                            className="w-30 h-30 cursor-pointer"
                            onClick={handleIconClick}
                        />
                    </div>
                    <input
                        type="text"
                        className="w-full p-3 py-5 bg-palePink"
                        ref={inputRef}
                        placeholder="Search"
                        onInput={handleSearchTextInput}
                    />
                </div>

                {searchResults && (
                    <div
                        ref={searchResultsRef}
                        className="absolute top-full left-0 w-full bg-white shadow-lg rounded-xl mt-2 z-20"
                    >
                        <div className="p-4">
                            {searchResults.categories.length > 0 || searchResults.subCategories.length > 0 ? (
                                <ul>
                                    {searchResults.categories.map(category => (
                                        <li
                                            key={category.id}
                                            className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                                            onClick={() => handleCategoryClick(category.name)}
                                        >
                                            {category.name}
                                        </li>
                                    ))}
                                    {searchResults.subCategories.map(subcategory => (
                                        <li
                                            key={subcategory.id}
                                            className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSubCategoryClick(subcategory.category.name, subcategory.name);
                                            }}
                                        >
                                            {subcategory.name}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No results found.</p>
                            )}
                        </div>
                        <div className="p-4 border-t-2 border-lightGray">
                            <h3 className="font-bold mb-2">Goods</h3>
                            {searchResults.products.length > 0 ? (
                                <ul>
                                    {searchResults.products.map(product => (
                                        <li
                                        key={product.id}
                                        className="cursor-pointer hover:bg-gray-100 p-2 rounded flex justify-start items-center"
                                        onClick={() => navigate('/product/' + product.id)}
                                    >
                                        <img
                                            src={import.meta.env.VITE_BASE_URL + product.imagePath}
                                            alt={product.name}
                                            className="w-10 h-10 mr-5"
                                        />
                                        {product.name}
                                    </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No products found.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <div
                className="mr-5 relative"
                onMouseEnter={() => {
                    if (modalDissapearTimeout) {
                        clearTimeout(modalDissapearTimeout);
                        setmodalDissapearTimeout(0);
                    }
                    setIsHovered(true);
                }}
                onMouseLeave={() => {
                    const id = setTimeout(() => setIsHovered(false), 1000);
                    setmodalDissapearTimeout(id);
                }}
            >
                <img
                    src={import.meta.env.VITE_BASE_URL + profile.imagePath}
                    alt="Profile"
                    onClick={() => navigate('/profile')}
                    className="cursor-pointer w-16 h-16 rounded-full"
                />
                {isHovered && profile.isAuthenticated && (
                    <div
                        className="absolute top-full right-0 w-48 bg-white shadow-lg rounded-xl mt-10 z-20 flex flex-col"
                        onMouseEnter={() => {
                            if (modalDissapearTimeout) {
                                clearTimeout(modalDissapearTimeout);
                                setmodalDissapearTimeout(0);
                            }
                            setIsHovered(true);
                        }}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <div className="arrow-up absolute bottom-full"></div>
                        <div className="flex flex-col justify-center items-center">
                            <p className="text-2xl font-bold py-4">{profile.firstName} {profile.lastName}</p>
                            <div className="self-end bg-lightGray w-full flex justify-end items-center rounded-b-xl">
                                <button
                                    onClick={handleLogOut}
                                    className="px-4 py-2 bg-red-500 text-black rounded-md hover:bg-red-600 transition italic text-center"
                                >
                                    Log Out
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});
