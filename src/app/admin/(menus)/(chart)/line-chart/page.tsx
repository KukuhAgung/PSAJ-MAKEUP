import LineChartOne from "@/components/organism/charts/line/LineChartOne";
import ComponentCard from "@/components/organism/common/ComponentCard";
import PageBreadcrumb from "@/components/organism/common/PageBreadCrumb";
import React from "react";

export default function LineChart() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Line Chart" />
      <div className="space-y-6">
        <ComponentCard title="Line Chart 1">
          <LineChartOne />
        </ComponentCard>
      </div>
    </div>
  );
}
