"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react";
import { Billboard, Category } from "@prisma/client";
import { CirclePlus, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
    Form,
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import { 
    Select, 
    SelectTrigger, 
    SelectValue, 
    SelectContent, 
    SelectItem
} from "@/components/ui/select";

interface CategoryFormProps {
    initialData: Category | null;
    billboards: Billboard[]
    Initialsubcategories: { name: string, values: string[] }[]
}

const formSchema = z.object({
    name: z.string().min(1),
    billboardId: z.string().min(1)
})

type CategoryFormValues = z.infer<typeof formSchema>

export const CategoryForm: React.FC<CategoryFormProps> = ({
    initialData,
    billboards,
    Initialsubcategories,
}) => {
    const params = useParams()
    const router = useRouter()

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [subcategories, setSubcategories] = useState<{ name: string, values: string[] }[]>(Initialsubcategories || [])

    const title = initialData ? "Editar Categoría" : "Crear categoría"
    const description = initialData ? "Editar una Categoría" : "Añadir nueva categoría"
    const toastMessage = initialData ? "Categoría actualizada" : "Categoría creada"
    const action = initialData ? "Guardar Cambios" : "Crear Categoría"

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            billboardId: ''
        }
    })

    console.log("initial data");
    console.log(initialData);

    const onSumbit = async (data: CategoryFormValues) =>{
        try {
            setLoading(true)
            console.log("submited data");
            console.log({ ...data, subcategories });
            
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, { ...data, subcategories })
            } else {
                await axios.post(`/api/${params.storeId}/categories`, { ...data, subcategories })
            }
            router.refresh()
            router.push(`/${params.storeId}/categories`)
            toast.success(toastMessage)
        } catch (error: any) {
            console.error("Request Error: ", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Algo salio mal.")
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`)
            router.refresh()
            router.push(`/${params.storeId}/categories`)
            toast.success("Categoría eliminada.")
        } catch (error) {
            toast.error("Es necesario eliminar todas los productos que esten utilizando esta categoría.")
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    const addSubcategory = () => {
        setSubcategories([...subcategories, { name: "", values: [] }])
    }

    const removeSubcategory = (index: number) => {
        setSubcategories(subcategories.filter((_, i) => i !== index))
    }

    const handleSubcategoryChange = (index: number, value: string) => {
        const newSubcategories = [...subcategories]
        newSubcategories[index].name = value
        console.log("newSubcategories");
        console.log(newSubcategories);
        setSubcategories(newSubcategories)
    }

    const addSubcategoryValue = (index: number) => {
        const newSubcategories = [...subcategories];
        newSubcategories[index].values.push(""); // Añadir un valor vacío por defecto
        setSubcategories(newSubcategories);
    };

    const handleSubcategoryValueChange = (subIndex: number, valueIndex: number, value: string) => {
        const newSubcategories = [...subcategories];
        newSubcategories[subIndex].values[valueIndex] = value;
        setSubcategories(newSubcategories);
    };

    const removeSubcategoryValue = (subIndex: number, valueIndex: number) => {
        const newSubcategories = [...subcategories];
        newSubcategories[subIndex].values = newSubcategories[subIndex].values.filter((_, i) => i !== valueIndex);
        setSubcategories(newSubcategories);
    };

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
                                        <Input disabled={loading} placeholder="Nombre de Categoría" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="billboardId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Baner
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
                                                    placeholder="Selecciona un baner"
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {billboards.map((billboard) => (
                                                <SelectItem key={billboard.id} value={billboard.id}>
                                                    {billboard.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="space-y-4">
                        <FormLabel>Subcategorías</FormLabel>
                        {subcategories.map((subcategory, subIndex) => (
                            <div key={subIndex} className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <Input 
                                        value={subcategory.name} 
                                        onChange={(e) => handleSubcategoryChange(subIndex, e.target.value)} 
                                        placeholder="Nombre de Subcategoría" 
                                        disabled={loading} 
                                    />
                                    <Button 
                                        type="button" 
                                        onClick={() => addSubcategoryValue(subIndex)} 
                                        variant="default"
                                        disabled={loading}
                                        size="sm"
                                    >
                                        <CirclePlus className="h-4 w-4"/>
                                    </Button>
                                    <Button 
                                        type="button" 
                                        onClick={() => removeSubcategory(subIndex)} 
                                        variant="destructive" 
                                        size="sm"
                                        disabled={loading}
                                    >
                                        <Trash className="h-4 w-4"/>
                                    </Button>
                                </div>
                                <div className="pl-8">
                                    {subcategory.values.map((value, valueIndex) => (
                                        <div key={valueIndex} className="flex items-center space-x-4 mb-2">
                                            <Input 
                                                value={value} 
                                                onChange={(e) => handleSubcategoryValueChange(subIndex, valueIndex, e.target.value)} 
                                                placeholder="Valor de Subcategoría" 
                                                disabled={loading} 
                                            />
                                            <Button 
                                                type="button" 
                                                onClick={() => removeSubcategoryValue(subIndex, valueIndex)} 
                                                variant="destructive" 
                                                size="sm"
                                                disabled={loading}
                                            >
                                                <Trash className="h-4 w-4"/>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <Button type="button" onClick={addSubcategory} disabled={loading}>
                            Añadir Subcategoría
                        </Button>
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    )
}
