import prismabd from "@/lib/prismabd";
import { ModelForm } from "./components/model-form";

const ModelsPage = async ({
    params
}:  {
    params: {modelId: string}
}) => {
    const model = await prismabd.model.findUnique({
        // we fetch for a model to see if we are creating a new one or editing
        where: {
            id: params.modelId
        }
    })

    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ModelForm initialData={model}/>
            </div>
        </div>
     );
}
 
export default ModelsPage;