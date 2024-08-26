
export const FavoritesIcon = ({ color, selected }: { color: string, selected: boolean }) => (
    <svg width="65" height="65" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
            d="M14.8858 1.62385L18.1843 8.5897C18.3217 8.87895 18.5864 9.07943 18.8932 9.12631L26.2693 10.2434C27.0413 10.3601 27.3491 11.3485 26.7906 11.916L21.4528 17.3379C21.2312 17.5633 21.1299 17.8875 21.1821 18.2057L22.4423 25.8617C22.5737 26.6626 21.7676 27.274 21.0768 26.895L14.4797 23.2804C14.206 23.1298 13.8782 23.1298 13.6045 23.2804L7.00736 26.895C6.31758 27.273 5.51049 26.6626 5.64183 25.8617L6.90209 18.2057C6.95423 17.8875 6.85296 17.5633 6.63139 17.3379L1.29356 11.916C0.735118 11.3485 1.04292 10.3601 1.81491 10.2434L9.19102 9.12631C9.49782 9.07943 9.7625 8.87895 9.89986 8.5897L13.1984 1.62385C13.5433 0.894751 14.5399 0.894751 14.8858 1.62385Z" 
            stroke={selected ? "yellow" : color} 
            strokeWidth="2" 
            strokeMiterlimit="10" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            fill={selected ? "yellow" : "none"}  
        />
    </svg>
);