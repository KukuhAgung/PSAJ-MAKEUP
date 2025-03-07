import { EcommerceMetrics } from "@/components/organism/ecommerce/EcommerceMetrics";
import React from "react";
//import MonthlyTarget from "@/components/organism/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/organism/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/organism/ecommerce/StatisticsChart";
import TabelPengguna from "@/components/organism/ecommerce/TabelPengguna";


export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-20">
        <EcommerceMetrics />

        <MonthlySalesChart />
      </div>

      

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12">
        <TabelPengguna />
      </div>
    </div>
  );
}
