"use client";

import { useDashboardModal } from "@/hooks/use-dashboard-modal";
import { Modal } from "../ui/modal";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const formSchema = z.object({
    name: z.string().min(1), //DASHBOARD NAMES REQUIRES ATLEAST ONE CHARACTER ONLY
});

export const DashboardModal = () => {
    const dashboardModal = useDashboardModal();

    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);

            const response = await axios.post('/api/dashboards', values);

            window.location.assign(`/${response.data.id}`); //WILL TRIGGER COMPLETE REFRESH ON THE PAGE
            // toast.success("New Dashboard successfuly created!")
        } catch (error) {
            toast.error("Oops! Something went wrong.")
        } finally{
            setLoading(false);
        }
    }

    return(
        <Modal
            title="Create New Dashboard"
            description="Add New Dashboard"
            isOpen={dashboardModal.isOpen}
            onClose={dashboardModal.onClose}
        >
        <div>
            <div className="space-y-4 py-2 pb-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                 <FormLabel>Name</FormLabel>
                                 <FormControl>
                                    <Input disabled={loading} placeholder="Your Dashboard Name" {...field}/>
                                 </FormControl>
                                 <FormMessage/>
                            </FormItem>
                        )}
                        />
                        <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                            <Button disabled={loading} variant="outline" onClick={dashboardModal.onClose}>Cancel</Button>
                            <Button disabled={loading} type="submit" className="bg-green-500">Continue</Button>

                        </div>
                    </form>
                </Form>
            </div>
        </div>
        </Modal>
    )
}