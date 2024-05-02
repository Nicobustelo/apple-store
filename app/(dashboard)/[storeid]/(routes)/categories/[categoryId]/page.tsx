import prismabd from "@/lib/prismabd";
import { CategoryForm } from "./components/category-form";

const CategoryPage = async ({
    params
}:  {
    params: {categoryId: string, storeId: string}
}) => {
    const category = await prismabd.category.findUnique({
        // we fetch for a billboard to see if we are creating a new one or editing
        where: {
            id: params.categoryId
        }
    })

    const billboards = await prismabd.billboard.findMany({
        where: {
            storeId: params.storeId
        }
    })

    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryForm 
                    billboards={billboards}
                    initialData={category}
                />
            </div>
        </div>
     );
}
 
export default CategoryPage;