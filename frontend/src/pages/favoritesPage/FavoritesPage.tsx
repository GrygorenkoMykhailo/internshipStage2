import { useNavigate } from 'react-router';
import { HeaderComponent, FooterComponent, SideBarComponent, ProductComponent } from '../../components'
import { useAppSelector } from '../../hooks';
import { Product } from '../../types';
import { useEffect } from 'react';

export const FavoritesPage = () => {
    const { products, status } = useAppSelector(state => state.favourites);
    const isAuthenticated = useAppSelector(state => state.profile.isAuthenticated);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth');
        }
    }, [isAuthenticated, navigate]);

    return (
        <>  
            <HeaderComponent/>
            <SideBarComponent activeItem='favorites'/>
            <div className="flex min-w-full min-h-screen bg-lightGray">
                <div className="py-4 px-40 w-full ml-28">
                    {status === 'pending' && <p>Loading...</p>}
                    {status === 'pending' && products.length === 0 && <p>No products found.</p>}
                    <div className="flex flex-col">
                        {products.map((product: Product) => (
                            <ProductComponent key={product.id} product={product} compressed={false}/>
                        ))}
                    </div>
                </div>
            </div>
            <FooterComponent/>
        </>
    );
}