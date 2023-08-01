"use client";

//LOCAL IMPORT SHITS
import { DashboardModal } from "@/components/modals/dashboard-modal";

//GLOBAL IMPORT SHITS
import { useEffect, useState } from "react";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(()=> {
        setIsMounted(true);
    }, []);
    //PRECAUTIONARY MEASURE FOR MODAL WHICH CAN CAUSE SHITTY ERRORS WHEN A MODAL IS TRIGGERED ***SERVER SIDE***
    if (!isMounted) {
        return null;
    }
    //RENDER MODAL ***CLIENT SIDE***
    return (
        <>
         <DashboardModal/>     
        </>
    )
}