"use client";

import { Dashboard } from "@prisma/client";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useDashboardModal } from "@/hooks/use-dashboard-modal";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown, Layers, LayersIcon, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "./ui/command";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface DashboardSwitcherProps extends PopoverTriggerProps {
    items: Dashboard[];
};

export default function DashboardSwitcher({
    className,
    items = []
}: DashboardSwitcherProps){
    const dashboardModal = useDashboardModal();
    const params = useParams();
    const router = useRouter();

    const formattedItems = items.map((item) => ({
        label: item.name,
        value: item.id
    }));

    const activeDashboard = formattedItems.find((item) => item.value === params.dboardId );

    const [open, setOpen] = useState(false);

    const onDashboardSelect = (dashboard: {value: string, label: string}) => {
        setOpen(false);
        router.push(`/${dashboard.value}`);
    }

    return (
       <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                variant="outline" 
                size="sm"
                role="combobox"
                aria-expanded={open}
                aria-label="Select a dashboard"
                className={cn("w-[200px] justify-between", className)}
                >
                    <Layers className="mr-2 h-4 w-4"/>
                    {activeDashboard?.label}
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandInput placeholder="Search Dashboard..."/>
                        <CommandEmpty>Dashboard not found</CommandEmpty>
                        <CommandGroup heading="Dashboards">
                            {formattedItems.map((dashboard)=>(
                                <CommandItem
                                key={dashboard.value}
                                onSelect={() => onDashboardSelect(dashboard)}
                                className="text-sm"
                                >
                                <Layers className="mr-2 h-4 w-4"/>
                                {dashboard.label}
                                <Check className={cn(
                                    "ml-auto h-4 w-4",
                                    activeDashboard?.value === dashboard.value
                                    ?"opacity-100"
                                    :"opacity-0"
                                )}
                                />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                        <CommandSeparator/>
                        <CommandList>
                            <CommandGroup>
                                <CommandItem
                                    onSelect={() => {
                                        setOpen(false)
                                        dashboardModal.onOpen()
                                    }}
                                    >
                                    <PlusCircle className="mr-2 h-5 w-5"/>
                                    Create New Dashboard
                                </CommandItem>
                            </CommandGroup>
                        </CommandList>
                </Command>
            </PopoverContent>
       </Popover>
    );
};