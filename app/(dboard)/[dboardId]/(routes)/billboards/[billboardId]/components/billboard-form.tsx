"use client";

import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { BillBoard } from "@prisma/client";
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
import ImageUpload from "@/components/ui/image-upload";

const formSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1),
});

type BillboardFormValues = z.infer<typeof formSchema>;

interface BillboardFormProps {
    initialData: BillBoard | null;
}
export const BillboardForm: React.FC<BillboardFormProps> = ({
    initialData
}) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Editor billboard" : "Create Billboard";
    const description = initialData ? "Editor a Billboard" : "Add a new Billboard";
    const toastMessage = initialData ? "Billboard Upadated!" : "Billboard Created! ";
    const action = initialData ? "Save changes" : "Create";
    

    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: '',
            imageUrl: '',
        }
    });

    const onSubmit = async (data: BillboardFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
            await axios.patch(`/api/${params.dboardId}/billboards/${params.billboardId}`, data);
        } else {
                await axios.post(`/api/${params.dboardId}/billboards`, data);

            }
            router.refresh();
            router.push(`/${params.dboardId}/billboards`)
            toast.success(toastMessage);
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
          await axios.delete(`/api/${params.dboardId}/billboards/${params.billboardId}`);
          router.refresh();
          router.push(`/${params.dboardId}/billboards`);
          toast.success("Billboard deleted!")
        } catch (error) {
            toast.error("Please check first if all contents were removed using this billboard.");//(DATABASE RELATIONS)THIS IS A FAILSAFE
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
              title= {title}
              description = {description}
                />

                {initialData && (
                <Button
                    disabled={loading}
                    variant = "destructive"
                    size = "sm"
                    onClick = {() => setOpen (true)}
                >
                    <Trash2Icon className="h-4 w-4"/>
                    </Button>
                )}

            </div>

            <Separator/>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Background Image</FormLabel>
                                    <FormControl>
                                        <ImageUpload
                                            value={field.value ? [field.value] : []}
                                            disabled={loading}
                                            onChange={(url) => field.onChange(url)}
                                            onRemove={() => field.onChange("")}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                         />
                    <div className="grid grid-cols-3 gap-8">
                         <FormField
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Label</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Billboard Label" {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                         />
                    </div>
                    <Button disabled={loading} className="ml-auto bg-green-500" type="submit">
                       {action}
                    </Button>
                </form>
            </Form>         
        </>    
    )
}