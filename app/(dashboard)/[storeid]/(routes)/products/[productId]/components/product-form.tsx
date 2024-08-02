"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react";
import { Category, Image, Memory, Model, Product } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
    Form,
    FormControl, 
    FormDescription, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";
import { Checkbox } from "@/components/ui/checkbox";

interface ProductFormProps {
    initialData: Product & {
        images: Image[]
    } | null;
    categories: Category[]
    models: Model[]
    memories: Memory[]
}

const formSchema = z.object({
    name: z.string().min(1),
    images: z.object({ url: z.string() }).array(),
    price: z.coerce.number().min(1),
    categoryId: z.string().min(1),
    modelId: z.string().min(1),
    memoryId: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional()
})

type ProductFormValues = z.infer<typeof formSchema>

export const ProductForm: React.FC<ProductFormProps> = ({
    initialData,
    categories,
    models,
    memories
}) => {
    const params = useParams()
    const router = useRouter()

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Editar Producto" : "Crear producto"
    const description = initialData ? "Editar un Producto" : "Añadir un nuevo producto"
    const toastMessage = initialData ? "Producto Actualizado" : "Producto creado"
    const action = initialData ? "Guardar Cambios" : "Crear"

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            price: parseFloat(String(initialData?.price))
        } : {
            name: '',
            images: [],
            price: 0,
            categoryId: '',
            modelId: '',
            memoryId: '',
            isFeatured: false,
            isArchived: false
        }
    })

    const onSumbit = async (data: ProductFormValues) =>{
        try {
            setLoading(true)
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data)
            } else {
                await axios.post(`/api/${params.storeId}/products`, data)
            }
            router.refresh()
            router.push(`/${params.storeId}/products`)
            toast.success(toastMessage)
        } catch (error) {
            toast.error("Algo salio mal.")
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
            router.refresh()
            router.push(`/${params.storeId}/products`)
            toast.success("Producto eliminado.")
        } catch (error) {
            toast.error("Algo salio mal.")
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    return (
        <>
            <AlertModal 
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading 
                    title={title}
                    description={description}
                />
                { initialData && (
                <Button
                    disabled={loading}
                    variant="destructive"
                    size="sm"
                    onClick={() => setOpen(true)}
                >
                    <Trash className="h-4 w-4"/>
                </Button>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSumbit)} className="space-y-8 w-full">
                    <FormField 
                        control={form.control}
                        name="images"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Imagenes
                                </FormLabel>
                                <FormControl>
                                <ImageUpload  
                                    value={field.value.map((image) => image.url)}
                                    disabled={loading}
                                    onChange={(url) => {
                                        const newValue = [...field.value, { url }];
                                        field.onChange(newValue);
                                    }}
                                    onRemove={(url) => {
                                        const newValue = field.value.filter((current) => current.url !== url);
                                        field.onChange(newValue);
                                    }}
                                />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-3 gap-8">
                        <FormField 
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Nombre
                                    </FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Nombre del Producto" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="price"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Precio
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="number" disabled={loading} placeholder="9.99" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="categoryId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Categoría
                                    </FormLabel>
                                    <Select 
                                        disabled={loading} 
                                        onValueChange={field.onChange} 
                                        value={field.value} 
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue 
                                                    defaultValue={field.value} 
                                                    placeholder="Selecciona una categoría"
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="modelId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Modelo
                                    </FormLabel>
                                    <Select 
                                        disabled={loading} 
                                        onValueChange={field.onChange} 
                                        value={field.value} 
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue 
                                                    defaultValue={field.value} 
                                                    placeholder="Selecciona un modelo"
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {models.map((model) => (
                                                <SelectItem key={model.id} value={model.id}>
                                                    {model.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="memoryId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Memoria
                                    </FormLabel>
                                    <Select 
                                        disabled={loading} 
                                        onValueChange={field.onChange} 
                                        value={field.value} 
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue 
                                                    defaultValue={field.value} 
                                                    placeholder="Selecciona una Memoria"
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {memories.map((memory) => (
                                                <SelectItem key={memory.id} value={memory.id}>
                                                    {memory.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="isFeatured"
                            render={({field}) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox 
                                            checked={field.value}
                                            // @ts-ignore
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Destacado
                                        </FormLabel>
                                        <FormDescription>
                                            Este producto se mostrara como destacado
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="isArchived"
                            render={({field}) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox 
                                            checked={field.value}
                                            // @ts-ignore
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Archivado
                                        </FormLabel>
                                        <FormDescription>
                                            Este producto no se mostrara en la tienda.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    )
}