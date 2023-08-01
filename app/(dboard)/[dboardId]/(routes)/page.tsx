import prismadb from "@/lib/prismadb";

interface AdmindboardPageProps{
    params: {dboardId: string}
};

const AdmindboardPage: React.FC<AdmindboardPageProps> = async ({
    params
}) => {
    const dashboard = await prismadb.dashboard.findFirst({
        where: {
            id: params.dboardId
        }
    });

    return (
        <div>
            Active Store: {dashboard?.name}
        </div>
    );
}

export default AdmindboardPage;