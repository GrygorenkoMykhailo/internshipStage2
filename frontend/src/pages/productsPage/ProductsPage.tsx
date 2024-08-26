import { useLocation, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Category, Product } from '../../types';
import { FooterComponent, HeaderComponent, ProductComponent, SideBarComponent, BreadcrumbsComponent, ProductDisplayComponent } from '../../components';
import { useFetchSubCategories } from '../../hooks';
import { useFetchKeysAndValues } from '../../hooks/useFetchKeysAndValues';
import { useFetchProducts } from '../../hooks/useFetchProducts';

export const ProductsPage = () => {
    const [categoryData, setCategoryData] = useState<Category>();

    const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
    const [isGridView, setIsGridView] = useState(false);
    const [isAscending, setIsAscending] = useState(true);
    
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string>[]>([]);
    const [showFiltersModal, setShowFiltersModal] = useState(false);
    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(Infinity);

    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const category = query.get('category');
    const subcategory = query.get('subcategory');

    const [subCategories] = useFetchSubCategories(categoryData?.id);
    const [filterOptions, setFilterOptions] = useFetchKeysAndValues(categoryData?.subcategories.find(sc => sc.name === subcategory)?.id);
    const [initialProducts, , loading, error] = useFetchProducts('byCategory', { category: category ?? undefined, subcategory: subcategory ?? undefined });

    useEffect(() => {
        setSelectedFilters([]);
        setFilterOptions([]);
    }, [category, subcategory]);

    useEffect(() => {
        if (category) {
            fetchCategoryData(category);
        }
    }, [category]);

    useEffect(() => {
        applyFilters();
    }, [selectedFilters, initialProducts, minPrice, maxPrice]);

    const fetchCategoryData = async (name: string) => {
        const response = await axios.get(import.meta.env.VITE_BASE_URL + '/categoryByName?name=' + encodeURIComponent(name));
        const data = response.data as Category;
        setCategoryData(data);
    }

    const applyFilters = () => {
        let filteredProducts = [...initialProducts];
        
        selectedFilters.forEach(filter => {
            filteredProducts = filteredProducts.filter(product =>
                product.characteristics.some(characteristic =>
                    characteristic.key === filter.filterName && characteristic.value === filter.filterValue
                )
            );
        });

        filteredProducts = filteredProducts.filter(p => p.price >= minPrice && p.price <= maxPrice);   
        setDisplayProducts(filteredProducts);
    };

    const handleAddFilter = (filterName: string, filterValue: string) => {
        setSelectedFilters(prev => [...prev, { filterName, filterValue }]);
    }

    const handleRemoveFilter = (filterName: string, filterValue: string) => {
        setSelectedFilters(prev => prev.filter(f => f.filterName !== filterName || f.filterValue !== filterValue));
    }

    const handleClickFilter = (e: React.ChangeEvent<HTMLInputElement>, filterName: string, filterValue: string) => {
        if (e.target.checked) {
            handleAddFilter(filterName, filterValue);
        } else {
            handleRemoveFilter(filterName, filterValue);
        }
    }

    const handleSortByPrice = () => {
        setIsAscending(!isAscending);
        setDisplayProducts(prevProducts =>
            [...prevProducts].sort((a, b) => isAscending ? a.price - b.price : b.price - a.price)
        );
    };

    return (
        <>  
            <HeaderComponent/>
            <SideBarComponent activeItem='categories'/>
            <div className="flex min-w-full min-h-screen bg-lightGray">
                <div className="py-4 px-40 w-full ml-28">
                    <BreadcrumbsComponent category={category!} subcategory={subcategory!}/>
                    <ProductDisplayComponent 
                        displayString={subcategory! ? subcategory! : category!} 
                        handleChangeDisplayMode={() => setIsGridView(!isGridView)} 
                        isGridView={isGridView}
                        isAscending={isAscending}
                        handleSortByPrice={handleSortByPrice}
                        onClickFilterCallback={() => setShowFiltersModal(true)}
                    />
                    {loading && <p>Loading...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {!loading && !error && displayProducts.length === 0 && <p>No products found.</p>}
                    <div className={`flex ${isGridView ? 'flex-wrap -mx-4' : 'flex-col'}`}>
                        {displayProducts.map((product: Product) => (
                            <div key={product.id} className={isGridView ? 'w-1/3 px-4' : 'w-full'}>
                                <ProductComponent product={product} compressed={isGridView}/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <FooterComponent/>
            {showFiltersModal && (
                <div className="absolute right-0 top-0 flex items-start justify-end mt-32">
                    <div className="w-80 p-6 bg-white shadow-lg rounded-lg">
                        <button
                            onClick={() => setShowFiltersModal(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            aria-label="Close"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        <h2 className="text-xl font-semibold mb-4">Filters</h2>

                        <div className="mb-6">
                            <h3 className="text-lg font-medium mb-2">Categories</h3>
                            <div className="space-y-2">
                                {subCategories?.map(sc => (
                                    <div key={sc.id} className="flex items-center">
                                        <input
                                            type="radio"
                                            name="category"
                                            id={`category-${sc.id}`}
                                            className="mr-2"
                                            checked={subcategory === sc.name}
                                            onChange={() => navigate(`/products?category=${category}&subcategory=${sc.name}`)}
                                        />
                                        <label htmlFor={`category-${sc.id}`} className="text-gray-700">
                                            {sc.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-medium mb-2">Price</h3>
                            <div className="flex space-x-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    className="border border-gray-300 rounded px-2 py-1 w-24"
                                    onChange={(e) => setMinPrice(+e.target.value || 0)}
                                />
                                <span className="text-gray-600">-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    className="border border-gray-300 rounded px-2 py-1 w-24"
                                    onChange={(e) => setMaxPrice(+e.target.value || Infinity)}
                                />
                            </div>
                        </div>

                        {filterOptions?.map(o => (
                            <div key={o.id} className="mb-6">
                                <h3 className="text-lg font-medium mb-2">{o.name}</h3>
                                <div className="space-y-2">
                                    {o.values?.map(val => (
                                        <div key={val.id} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={`filter-${val.id}`}
                                                className="mr-2"
                                                onChange={(e) => handleClickFilter(e, o.name, val.value)}
                                                />
                                                <label htmlFor={`filter-${val.id}`} className="text-gray-700">
                                                    {val.value}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </>
        );
    };
    
