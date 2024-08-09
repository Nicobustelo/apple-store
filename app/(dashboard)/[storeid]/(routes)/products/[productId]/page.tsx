import prismabd from "@/lib/prismabd";
import { ProductForm } from "./components/product-form";

const ProductsPage = async ({
    params
}:  {
    params: {productId: string, storeId: string}
}) => {
    // Obtener el producto para determinar si estamos creando uno nuevo o editando
    const product = await prismabd.product.findUnique({
        where: {
            id: params.productId
        },
        include: {
            images: true,
        }
    });

    // Obtener las categorías disponibles en la tienda
    const categories = await prismabd.category.findMany({
        where: {
            storeId: params.storeId
        }
    });

    // Obtener las subcategorías asociadas a las categorías disponibles en la tienda
    const subcategories = await prismabd.subcategory.findMany({
        where: {
            category: {
                storeId: params.storeId
            }
        },
        include: {
            values: true // Incluir los valores de cada subcategoría
        }
    });

    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductForm
                    categories={categories}
                    subcategories={subcategories}
                    initialData={product}
                />
            </div>
        </div>
     );
}
 
export default ProductsPage;
