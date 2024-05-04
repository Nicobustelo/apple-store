import prismabd from "@/lib/prismabd";
import { MemoryForm } from "./components/memory-form";

const MemoryPage = async ({
    params
}:  {
    params: {memoryId: string}
}) => {
    const memory = await prismabd.memory.findUnique({
        // we fetch for a memory to see if we are creating a new one or editing
        where: {
            id: params.memoryId
        }
    })

    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <MemoryForm initialData={memory}/>
            </div>
        </div>
     );
}
 
export default MemoryPage;