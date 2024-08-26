import React from "react";

export const FooterComponent = React.memo(() => {
    return (
        <div className="flex justify-around items-start mx-24 my-6">
            <div className="flex flex-col">
                <p className="font-bold text-2xl mb-1">Our services</p>
                <p className="text-xl mb-1 hover:underline cursor-pointer">Product reviews</p>
                <p className="text-xl mb-1 hover:underline cursor-pointer">Reviews of stores</p>
            </div>
            <div className="flex flex-col">
                <p className="font-bold text-2xl mb-1">To users</p>
                <p className="text-xl mb-1 hover:underline cursor-pointer">FAQ for users</p>
                <p className="text-xl mb-1 hover:underline cursor-pointer">About the project</p>
            </div>
            <div className="flex flex-col">
                <p className="font-bold text-2xl mb-1">Feedback</p>
                <p className="text-xl mb-1 hover:underline cursor-pointer">For users</p>
                <p className="text-xl mb-1 hover:underline cursor-pointer">For online stores</p>
            </div>
            <div className="flex flex-col items-start">
                <p className="font-bold text-2xl mb-1">Social media</p>
                <div className="flex justify-between w-full">
                    <img src="facebook.svg" alt="" className="cursor-pointer" />
                    <img src="instagram.svg" alt="" className="cursor-pointer" />
                    <img src="youtube.svg" alt="" className="cursor-pointer" />
                </div>
            </div>
            <div className="flex items-start">
                <div className="flex flex-col justify-center items-center">
                    <img src="logo_full.svg" alt="" className="cursor-pointer" />
                    <p className="text-center font-bold text-xl hover:underline cursor-pointer">@Best products 2022</p>
                </div>
            </div>
        </div>
    );
});
