import { useAppDispatch, useAppSelector } from "../../hooks";
import { addUserFavourite, removeUserFavourite } from '../../redux/favouritesSlice'
import { FavoritesIcon } from "../../icons";
import { Product } from "../../types";
import { useNavigate } from "react-router";

interface ProductComponentProps {
    product: Product;
    compressed: boolean;
}

export const ProductComponent = ({ product, compressed }: ProductComponentProps) => {
    const dispatch = useAppDispatch();
    const favourites = useAppSelector(state => state.favourites.products);
    const navigate = useNavigate();

    const isFavourite = favourites.find(p => p.id === product.id);

    const handleFavouriteClick = () => {
        if (isFavourite) {
            dispatch(removeUserFavourite(product.id));
        } else {
            dispatch(addUserFavourite(product.id));
        }
    };

    const handleProductClick = () => {
        navigate('/product/' + product.id);
    }

    if(!compressed){
        return (
            <div className="bg-white my-5 flex">
                <div
                    className="bg-violet flex justify-center items-center px-2 cursor-pointer"
                    onClick={handleFavouriteClick}
                >
                    <FavoritesIcon color="white" selected={isFavourite ? true : false} />
                </div>
                <div className="flex flex-grow p-9 cursor-pointer" onClick={handleProductClick}>
                    <img 
                        src={import.meta.env.VITE_BASE_URL + product.imagePath} 
                        alt="" 
                        className="w-64 h-64 mx-12 object-contain"
                        />
                    <div className="min-w-max flex flex-col justify-between py-5">
                        <h2 className="text-3xl font-bold">{product.name}</h2>
                        <div className="flex space-x-2">
                            <p className="font-bold text-lg">{product.characteristics[0].key}:</p>
                            <p className="text-lg">{product.characteristics[0].value}</p>
                        </div>
                        <div className="flex space-x-2">
                            <p className="font-bold text-lg">{product.characteristics[1].key}:</p>
                            <p className="text-lg">{product.characteristics[1].value}</p>
                        </div>
                        <div className="text-3xl flex">
                            <img src="price_icon.svg" alt="" className="mr-6"/> 
                            <p>${product.price}</p>
                        </div>
                    </div>
        
                    <div className="flex flex-col justify-between py-5 ml-auto h-full mr-12">
                        <p className="text-gray-600 flex justify-center items-center h-8 text-2xl">
                            <img src="/views_icon.svg" alt="" className="mr-2 w-full h-full" /> {product.views}
                        </p>
                        <p className="text-gray-600 flex justify-center items-center h-8 text-2xl">
                            <img src="/favorites_stats_icon.svg" alt="" className="mr-2 w-full h-full" /> {product.favourites}
                        </p>
                        <p className="text-gray-600 flex justify-center items-center h-8 text-2xl">
                            <img src="/like_icon.svg" alt="" className="mr-2 w-full h-full" /> {product.likes}
                        </p>
                        <p className="text-gray-600 flex justify-center items-center h-8 text-2xl">
                            <img src="/dislike_icon.svg" alt="" className="mr-2 w-full h-full" /> {product.dislikes}
                        </p>
                    </div>
                </div>
            </div>
        )
    }else{
        return (
            <div className="flex flex-col bg-white space-y-5">
                <div className="bg-violet flex justify-center items-center p-2 cursor-pointer" onClick={handleFavouriteClick}>
                    <FavoritesIcon color="white" selected={isFavourite ? true : false} />
                </div>
                <h2 className="text-3xl font-bold text-center cursor-pointer" onClick={handleProductClick}>{product.name}</h2>

                <div className="flex justify-center items-center space-x-5">
                    <img src="price_icon.svg" alt="" />
                    <p className="text-3xl">${product.price}</p>
                </div>

                <img 
                    src={import.meta.env.VITE_BASE_URL + product.imagePath} 
                    alt="" 
                    className="w-64 h-64 object-contain self-center cursor-pointer"
                    onClick={handleProductClick}
                    />

                <div className="grid grid-cols-2 grid-rows-2 gap-4 py-4">
                    <div className="flex justify-center items-center space-x-2">
                        <p className="text-2xl">{product.views}</p>
                        <img src="/views_icon.svg" alt="" className="h-full"/>
                    </div>
                    <div className="flex justify-center items-center space-x-2">
                        <p className="text-2xl">{product.likes}</p>
                        <img src="/like_icon.svg" alt="" className="h-full"/>
                    </div>
                    <div className="flex justify-center items-center space-x-2">
                        <p className="text-2xl">{product.dislikes}</p>
                        <img src="/dislike_icon.svg" alt="" className="h-full"/>
                    </div>
                    <div className="flex justify-center items-center space-x-2">
                        <p className="text-2xl">{product.favourites}</p>
                        <img src="/favorites_stats_icon.svg" alt="" className="h-full"/>
                    </div>
                </div>
            </div>
            
        )
    }
    
};