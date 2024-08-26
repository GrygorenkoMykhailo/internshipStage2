import { Link } from 'react-router-dom';

interface BreadcrumbsComponentProps {
    category?: string;
    subcategory?: string;
}

export const BreadcrumbsComponent = ({ category, subcategory }: BreadcrumbsComponentProps) => {
    const categoryPath = category ? `?category=${encodeURIComponent(category)}` : '';
    const subcategoryPath = subcategory ? `&subcategory=${encodeURIComponent(subcategory)}` : '';

    return (
        <nav className="bg-lightGray py-4">
            <ol className="flex space-x-2 text-2xl">
                {category && (
                    <li>
                        <Link to={`/products${categoryPath}`} className="hover:underline">
                            {category}
                        </Link>
                    </li>
                )}
                {subcategory && (
                    <>
                        <li>
                            <span className="mx-2">{'>'}</span>
                        </li>
                        <li>
                            <Link
                                to={`/products${categoryPath}${subcategoryPath}`}
                                className="hover:underline"
                            >
                                {subcategory}
                            </Link>
                        </li>
                    </>
                )}
            </ol>
        </nav>
    );
};