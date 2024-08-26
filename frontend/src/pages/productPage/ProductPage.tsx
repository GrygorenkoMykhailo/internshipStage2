import { useNavigate, useParams } from "react-router";
import { Comment } from "../../types";
import { useState } from "react";
import axios from "axios";
import { HeaderComponent, SideBarComponent } from "../../components";
import { Line } from "react-chartjs-2";
import { useForm, SubmitHandler } from "react-hook-form";

import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { CommentDAO } from "../../types/CommentDAO";
import { useAppSelector } from "../../hooks";
import { useFetchProducts } from "../../hooks/useFetchProducts";
import { CommentsListComponent } from "./commentsListComponent/CommentsListComponent";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

interface SendCommentForm{
    content: string;
}

export const ProductPage = () => {
    const [commentError, setCommentError] = useState('');
    const { id } = useParams();
    const [productArray, setProductArray] = useFetchProducts('byId', { id: id ? +id : undefined});
    const product = productArray[0];
    const [activeTab, setActiveTab] = useState<'description' | 'characteristics' | 'comments' | 'price-dynamics'>('description');
    const profile = useAppSelector(state => state.profile);
    
    const { register, handleSubmit } = useForm<SendCommentForm>();
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<SendCommentForm> = async formData => {
        if(profile.isAuthenticated){
            if(product){
                if(formData.content){
                    const data: CommentDAO = {
                        content: formData.content,
                        createdAt: new Date().toISOString(),
                        productId: product.id
                    };
        
                    const response = await axios.post(import.meta.env.VITE_BASE_URL + '/comment', data, { withCredentials: true });
                    const responseData = response.data as Comment;
                    setProductArray([{...product, comments: [...product.comments, responseData]}]);
                }else{
                    setCommentError('Comment must be not empty');
                }
            } 
        }else{
            navigate('/auth');
        }
    }

    if(!product) return <p>Loading...</p>;

    return (
        <>
            <HeaderComponent />
            <SideBarComponent />
            <div className="flex min-w-full min-h-screen bg-lightGray">
                <div className="ml-28 w-full py-12 px-20">
                    <div className="bg-white w-full flex p-6 rounded-lg">
                        <div className="w-1/2 px-20 flex justify-center items-center">
                            <img src={import.meta.env.VITE_BASE_URL + product.imagePath} alt="" className="w-96 h-96" />
                        </div>
                        <div className="flex flex-col w-1/2">
                            <div className="flex items-center space-x-20 w-full">
                                <div className="flex justify-center items-center space-x-2">
                                    <p className="text-2xl">{product.views}</p>
                                    <img src="/views_icon.svg" alt="" className="h-full" />
                                </div>
                                <div className="flex justify-center items-center space-x-2">
                                    <p className="text-2xl">{product.favourites}</p>
                                    <img src="/favorites_stats_icon.svg" alt="" className="h-full" />
                                </div>
                                <div className="flex justify-center items-center space-x-2">
                                    <p className="text-2xl">{product.likes}</p>
                                    <img src="/like_icon.svg" alt="" className="h-full" />
                                </div>
                                <div className="flex justify-center items-center space-x-2">
                                    <p className="text-2xl">{product.dislikes}</p>
                                    <img src="/dislike_icon.svg" alt="" className="h-full" />
                                </div>
                            </div>
                            <div className="">
                                <h2 className="text-3xl font-bold my-10">{product.name}</h2>
                                <div className="flex space-x-2 my-4">
                                    <p className="font-bold text-lg">{product.characteristics[0].key}:</p>
                                    <p className="text-lg">{product.characteristics[0].value}</p>
                                </div>
                                <div className="flex space-x-2 my-4">
                                    <p className="font-bold text-lg">{product.characteristics[1].key}:</p>
                                    <p className="text-lg">{product.characteristics[1].value}</p>
                                </div>
                            </div>
                            <div className="text-3xl flex mt-auto">
                                <img src="/price_icon.svg" alt="" className="mr-6" />
                                <p>${product.price}</p>
                            </div>
                        </div>
                    </div>
    
                    <div className="bg-white w-full mt-6 p-6 rounded-lg">
                        <div className="flex w-full justify-around mb-6">
                            <button
                                onClick={() => setActiveTab('description')}
                                className={`py-3 px-5 rounded-xl transition-colors ${activeTab === 'description' ? 'bg-violet text-white' : 'bg-lightGray text-black'}`}
                            >
                                Description
                            </button>
                            <button
                                onClick={() => setActiveTab('characteristics')}
                                className={`py-3 px-5 rounded-xl transition-colors ${activeTab === 'characteristics' ? 'bg-violet text-white' : 'bg-lightGray text-black'}`}
                            >
                                Characteristics
                            </button>
                            <button
                                onClick={() => setActiveTab('comments')}
                                className={`py-3 px-5 rounded-xl transition-colors ${activeTab === 'comments' ? 'bg-violet text-white' : 'bg-lightGray text-black'}`}
                            >
                                Comments ({product.comments.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('price-dynamics')}
                                className={`py-3 px-5 rounded-xl transition-colors ${activeTab === 'price-dynamics' ? 'bg-violet text-white' : 'bg-lightGray text-black'}`}
                            >
                                Price Dynamics
                            </button>
                        </div>
    
                        <div>
                            {activeTab === 'description' && (
                                <div className="p-6">
                                    <p className="text-lg">{product.description}</p>
                                </div>
                            )}
                            {activeTab === 'characteristics' && (
                                <div className="p-6 space-y-10">
                                    {product.characteristics.map((char, index) => (
                                        <div key={index} className="flex space-x-2">
                                            <p className="font-bold text-lg">{char.key}:</p>
                                            <p className="text-lg">{char.value}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {activeTab === 'comments' && (
                                <CommentsListComponent comments={product.comments} userEmail={profile.email} 
                                    className="p-6" register={register} name="content" handleSubmit={handleSubmit} onSubmit={onSubmit} error={commentError}/>
                            )}
                            {activeTab === 'price-dynamics' && (
                            <div>
                                <Line data={{
                                        labels: product.priceInMonth.map((entry) => entry.month),
                                        datasets: [
                                            {
                                                label: '',
                                                data: product.priceInMonth.map((entry) => entry.price),
                                                borderColor: 'rgba(139, 92, 246, 1)', 
                                                backgroundColor: 'rgba(139, 92, 246, 0.2)', 
                                            },
                                        ],
                                    }}
                                    options={{
                                        plugins: {
                                            legend: {
                                                display: false,
                                            },
                                        },
                                    }}
                                />
                            </div>
                        )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
