import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismabd from "@/lib/prismabd";

export async function GET (
    // The data from the request the user made
    // It is not used tho, it is only here becuase the params can only be accesed on the second argument of this function
    _req: Request,
    // The params from the URL 
    {params} : { params : { categoryId: string } }
) {
    // Add CORS headers
    const headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'GET, OPTIONS');
    try {
        if(!params.categoryId) {
            return new NextResponse("Category id is required", { status: 400 })
        }

        const category = await prismabd.category.findUnique({
            // Find the category
            where: {
                id: params.categoryId,
            },
            include: {
                billboard: true,
                subcategories: true,
            }
        })

        return NextResponse.json(category, { headers })

    } catch (error) {
        console.log('[CATEGORY_GET]', error);
        return new NextResponse("Internal Error", {status: 500})
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, categoryId: string } }
  ) {
    try {
      console.log("PATCH request received with params: ", params);
  
      const body = await req.json();
      console.log("PATCH request body: ", body);
  
      const { userId } = auth();
      const { name, billboardId, subcategories } = body;
  
      if (!userId) {
        return new NextResponse("Unauthenticated", { status: 401 });
      }
  
      if (!name) {
        return new NextResponse("Un nombre es requerido", { status: 400 });
      }
  
      if (!billboardId) {
        return new NextResponse("Es necesario elegir un baner", { status: 400 });
      }
  
      if (!params.categoryId) {
        return new NextResponse("Category id es requerido", { status: 400 });
      }
  
      const storeByUserId = await prismabd.store.findFirst({
        where: {
          id: params.storeId,
          userId,
        },
      });
  
      if (!storeByUserId) {
        return new NextResponse("Unauthorized", { status: 403 });
      }
  
      // Primero, elimina los valores de las subcategorías
      const subcategoriesToDelete = await prismabd.subcategory.findMany({
        where: {
          categoryId: params.categoryId,
        },
        include: {
          values: true, // Incluye los valores relacionados con la subcategoría
        },
      });
  
      for (const subcategory of subcategoriesToDelete) {
        await prismabd.subcategoryValue.deleteMany({
          where: {
            subcategoryId: subcategory.id,
          },
        });
      }
  
      // Luego, elimina las subcategorías
      await prismabd.subcategory.deleteMany({
        where: {
          categoryId: params.categoryId,
        },
      });
  
      // Ahora, actualiza la categoría principal
      const category = await prismabd.category.update({
        where: {
          id: params.categoryId,
        },
        data: {
          name,
          billboardId,
        },
      });
  
      // Crea las nuevas subcategorías y sus valores asociados
      for (const subcategory of subcategories) {
        const newSubcategory = await prismabd.subcategory.create({
          data: {
            name: subcategory.name,
            categoryId: params.categoryId,
          },
        });
  
        // Crea los valores de la subcategoría
        for (const value of subcategory.values) {
          await prismabd.subcategoryValue.create({
            data: {
              value,
              subcategoryId: newSubcategory.id,
            },
          });
        }
      }
  
      return NextResponse.json(category);
  
    } catch (error) {
      console.log("[CATEGORY_PATCH]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }
  


export async function DELETE(
    // The data from the request the user made
    // It is not used tho, it is only here becuase the params can only be accesed on the second argument of this function
    _req: Request,
    // The params from the URL 
    { params }: { params: { storeId: string, categoryId: string } }
) {
    try {
        // Obtén el userId desde Clerk
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!params.categoryId) {
            return new NextResponse("Category id is required", { status: 400 });
        }

        // Verifica que el usuario tenga permisos sobre la tienda
        const storeByUserId = await prismabd.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            },
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        // Obtén todas las subcategorías relacionadas con la categoría
        const subcategories = await prismabd.subcategory.findMany({
            where: {
                categoryId: params.categoryId,
            },
        });

        // Primero elimina todos los valores de las subcategorías
        for (const subcategory of subcategories) {
            await prismabd.subcategoryValue.deleteMany({
                where: {
                    subcategoryId: subcategory.id,
                },
            });
        }

        // Luego elimina las subcategorías
        await prismabd.subcategory.deleteMany({
            where: {
                categoryId: params.categoryId,
            },
        });

        // Finalmente, elimina la categoría
        const category = await prismabd.category.delete({
            where: {
                id: params.categoryId,
            },
        });

        return NextResponse.json(category);
    } catch (error) {
        console.log('[CATEGORY_DELETE]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}