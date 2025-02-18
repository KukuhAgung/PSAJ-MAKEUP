import { EcommerceMetrics } from "@/components/organism/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/organism/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/organism/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/organism/ecommerce/StatisticsChart";
import RecentOrders from "@/components/organism/ecommerce/RecentOrders";


export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics />

        <MonthlySalesChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12">
        <RecentOrders />
      </div>
    </div>
  );
}
