import prismabd from "@/lib/prismabd";
import { CategoryForm } from "./components/category-form";

const CategoryPage = async ({
    params
}:  {
    params: {categoryId: string, storeId: string}
}) => {
    const category = await prismabd.category.findUnique({
        // we fetch for a category to see if we are creating a new one or editing
        where: {
            id: params.categoryId
        },
        include: {
            subcategories: { // Incluir subcategorías
                include: {
                    values: true // Incluir valores de subcategorías
                }
            }
        }
    })

    const billboards = await prismabd.billboard.findMany({
        where: {
            storeId: params.storeId
        }
    })

    let subcategories: {
        name: string; values: string[]; // Mapear los valores correctamente
    }[] = [];
    if (category) {
        // Make a copy of the subcategories array
        subcategories = category.subcategories.map((subcategory) => ({
            name: subcategory.name,
            values: subcategory.values.map(value => value.value) // Mapear los valores correctamente
        }));
    
        // Delete the subcategories from the category object
        delete (category as any)?.subcategories;
    }

    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryForm 
                    billboards={billboards}
                    initialData={category}
                    Initialsubcategories={subcategories}
                />
            </div>
        </div>
     );
}
 
export default CategoryPage;
