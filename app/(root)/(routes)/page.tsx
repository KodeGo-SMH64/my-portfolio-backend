"use client";

import { Modal } from "@/components/ui/modal";
import { useDashboardModal } from "@/hooks/use-dashboard-modal";
import { UserButton } from "@clerk/nextjs";
import { useEffect } from "react";

const SetupPage = () => {
  const onOpen = useDashboardModal((state) => state.onOpen);
  const isOpen = useDashboardModal((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return null;
  // return (
  //   <div className="p-4">
  //     Root Page
  //   </div>
  // )
}

export default SetupPage; 