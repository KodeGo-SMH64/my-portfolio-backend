"use client";

import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Dashboard } from "@prisma/client";
import { Trash2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";


interface SettingsFormProps {
    initialData: Dashboard;
}

const formSchema = z.object({
    name: z.string().min(1),
});

type SettingsFormValues = z.infer<typeof formSchema>;

export const SettingsForm: React.FC<SettingsFormProps> = ({
    initialData
}) => {
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);


    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    });

    const onSubmit = async (data: SettingsFormValues) => {
        try {
            setLoading(true);
            await axios.patch(`/api/dashboards/${params.dboardId}`, data);
            router.refresh();
            toast.success("Store updated.");
        } catch (error) {
            toast.error ("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };
//==============================DELETE FUNCTION BEING CALLED FROM===================
    const onDelete = async () => {
        try {
          setLoading(true)
          await axios.delete(`/api/dashboards/${params.dboardId}`)
          router.refresh();
          router.push("/")
          toast.success("Dashboard deleted")
        } catch (error) {
            toast.error("Please check first if all contents were removed");//(DATABASE RELATIONS)THIS IS A FAILSAFE
        } finally{
            setLoading(false)
            setOpen(false)
        }
    }
//==================================================================================
    return(
        <>
            <AlertModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading
              title= "Settings"
              description = "Manage your Dashboards"
                />
                <Button
                disabled={loading}
                variant = "destructive"
                size = "sm"
                onClick = {() => setOpen (true)}
                >
                <Trash2Icon className="h-4 w-4"/>
                </Button>
            </div>
            <Separator/>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                         <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Dashboard Name" {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                         />
                    </div>
                    <Button disabled={loading} className="ml-auto bg-green-500" type="submit">
                        Save Changes
                    </Button>
                </form>
            </Form>
            <Separator/>
            <ApiAlert title="NEXT_PUBLIC_API_URL" description={`${origin}/api/${params.dboardId}`} variant={"public"}/>
        </>    
    )
}