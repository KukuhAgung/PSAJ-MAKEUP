import BarChartOne from "@/components/organism/charts/bar/BarChartOne";
import ComponentCard from "@/components/organism/common/ComponentCard";
import PageBreadcrumb from "@/components/organism/common/PageBreadCrumb";
import React from "react";

export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Bar Chart" />
      <div className="space-y-6">
        <ComponentCard title="Bar Chart 1">
          <BarChartOne />
        </ComponentCard>
      </div>
    </div>
  );
}
