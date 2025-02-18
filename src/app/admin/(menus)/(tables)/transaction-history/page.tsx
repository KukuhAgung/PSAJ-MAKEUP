import ComponentCard from "@/components/organism/common/ComponentCard";
import PageBreadcrumb from "@/components/organism/common/PageBreadCrumb";
import BasicTableOne from "@/components/templates/tables/BasicTableOne";

import React from "react";

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Task Kanban" />
      <div className="space-y-6">
        <ComponentCard title="Basic Table 1">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </div>
  );
}
