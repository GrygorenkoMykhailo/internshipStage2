interface ProductDisplayComponentProps {
    displayString: string;
    handleChangeDisplayMode(): void;
    isGridView: boolean;
    isAscending: boolean;
    handleSortByPrice(): void;
    onClickFilterCallback(): void;
}

export const ProductDisplayComponent = ({ displayString, handleChangeDisplayMode, isGridView, isAscending, handleSortByPrice, onClickFilterCallback }: ProductDisplayComponentProps) => {
    return (
        <div className="bg-white py-5 px-6 h-24 flex space-x-5 rounded-xl mt-1 mb-7">
            <img 
                src={isGridView ? "view_change_grid.svg" : "view_change_list.svg"} 
                alt="Change view mode" 
                className="h-full cursor-pointer" 
                onClick={handleChangeDisplayMode}
            />
            <div className="flex justify-center items-center space-x-3 px-3 bg-violet text-white rounded-xl cursor-pointer" onClick={handleSortByPrice}>
                <img src="sort_icon.svg" alt="Sort icon" />
                <p className="text-2xl">Price</p>
                <img src={isAscending ? "sort_icon_ascending.svg" : "sort_icon_descending.svg"} alt="Sort icon order" />
            </div>
            <div className="h-full bg-violet rounded-xl p-3 cursor-pointer" onClick={onClickFilterCallback}>
                <img src="filters.svg" alt="Filters icon" className="h-full "/>
            </div>
            <div className="h-full bg-violet rounded-xl p-3 cursor-pointer text-white text-2xl ">
                <p className="text-center" onClick={onClickFilterCallback}>Category: {displayString}</p>
            </div>
        </div>
    );
};
