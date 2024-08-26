import { FooterComponent, HeaderComponent, SideBarComponent } from "../../components";

export const IndexPage = () => {


    return (
        <div>
            <HeaderComponent />
            <div className="min-w-full min-h-screen flex">
                <SideBarComponent activeItem="home" />
                <main className="w-full bg-lightGray py-20 px-32 ml-28 grid grid-cols-3 gap-6">
                    <div className="col-span-3 mb-12">
                        <img 
                            src="shopping_time_banner.png" 
                            alt="" 
                            className="w-full h-auto" 
                        />
                    </div>
                    <div className="mb-12">
                        <img 
                            src="phones_and_accessories_banner.png" 
                            alt="" 
                            className="w-full h-auto" 
                        />
                    </div>
                    <div className="col-span-2 mb-12">
                        <img 
                            src="laptops_banner.png" 
                            alt="" 
                            className="w-full h-auto" 
                        />
                    </div>
                    <div>
                        <img 
                            src="books_banner.png" 
                            alt="" 
                            className="w-full h-auto"  
                        />
                    </div>
                    <div>
                        <img 
                            src="sport_equipment_banner.png" 
                            alt="" 
                            className="w-full h-auto"  
                        />
                    </div>
                    <div>
                        <img 
                            src="all_for_travel_banner.png" 
                            alt="" 
                            className="w-full h-auto"  
                        />
                    </div>
                </main>
            </div>
            <FooterComponent />
        </div>
    );
};
