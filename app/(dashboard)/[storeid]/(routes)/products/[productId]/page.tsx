import prismabd from "@/lib/prismabd";
import { ProductForm } from "./components/product-form";

const ProductsPage = async ({
    params
}:  {
    params: {productId: string, storeId: string}
}) => {
    const product = await prismabd.product.findUnique({
        // we fetch for a product to see if we are creating a new one or editing
        where: {
            id: params.productId
        },
        include: {
            images: true
        }
    })

    const categories = await prismabd.category.findMany({
        where: {
            storeId: params.storeId
        }
    })

    const models = await prismabd.model.findMany({
        where: {
            storeId: params.storeId
        }
    })

    const memories = await prismabd.memory.findMany({
        where: {
            storeId: params.storeId
        }
    })

    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductForm
                    categories={categories}
                    models={models}
                    memories={memories} 
                    initialData={product}
                />
            </div>
        </div>
     );
}
 
export default ProductsPage;