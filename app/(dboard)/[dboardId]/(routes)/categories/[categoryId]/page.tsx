import prismadb from "@/lib/prismadb";
import { CategoryForm } from "./components/category-form";

const CategoryPage = async ({
    params
}: {
    params: {categoryId: string, billboardId: string, dboardId: string}
}) => {
    const category = await prismadb.category.findUnique({
        where: {
            id: params.categoryId
        }
    });

    const billboards = await prismadb.billBoard.findMany({
        where: {
            dboardId: params.dboardId
        }
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryForm  billboards={billboards} initialData={category} />
            </div>
        </div>
    )
}

export default CategoryPage;