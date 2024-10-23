import React, { Suspense } from "react";
import AllUsers from "../../_component/module/adminDashboard/manageUser";
import TableSkeleton from "@/src/components/ui/skeleton/tableSkeleton";

export default function UserManagement() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <AllUsers />
    </Suspense>
  );
}
