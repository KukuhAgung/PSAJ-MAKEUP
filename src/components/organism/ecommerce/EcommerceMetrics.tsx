"use client";
import { useEffect, useState } from "react";
import Badge from "../../molecules/badge/Badge";
import { Admin, ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon, Testimoni } from "@/icons";
import { formatRupiah } from "@/app/admin/(menus)/finance/utils";

export const EcommerceMetrics = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0); // State baru untuk total pengguna
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        setIsLoading(true);

        // Fetch summary data for sales
        const responseSales = await fetch("/api/finance/summary");
        if (!responseSales.ok) {
          throw new Error(`HTTP error! Status: ${responseSales.status}`);
        }
        const resultSales = await responseSales.json();
        if (resultSales.code === 200 && resultSales.data) {
          const { totalAmount, totalSales, percentageChange } = resultSales.data;
          setTotalSales(totalAmount);
          setTotalItems(totalSales);
          setPercentageChange(percentageChange);
        }

        // Fetch total users with role 'USER'
        const responseUsers = await fetch("/api/widgetpengguna");
        if (!responseUsers.ok) {
          throw new Error(`HTTP error! Status: ${responseUsers.status}`);
        }
        const resultUsers = await responseUsers.json();
        if (resultUsers.code === 200 && resultUsers.data) {
          setTotalUsers(resultUsers.data.totalUsers);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummaryData();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      {/* <!-- Customers Metric --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 relative overflow-hidden">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Pengguna</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {isLoading ? "Loading..." : totalUsers}
            </h4>
          </div>
        </div>
      </div>

      {/* <!-- Orders Metric --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 relative overflow-hidden">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div className="max-w-[65%]">
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Penjualan</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90 truncate">
              {isLoading ? "Loading..." : formatRupiah(totalSales)}
            </h4>
            <p className="text-xs text-gray-500 mt-1 truncate">{isLoading ? "" : `${totalItems} item terjual`}</p>
          </div>
          <div className="flex-shrink-0" style={{ maxWidth: "35%" }}>
            {percentageChange >= 0 ? (
              <Badge color="success" startIcon={<ArrowUpIcon />}>
                {Math.abs(percentageChange).toFixed(0)}%
              </Badge>
            ) : (
              <Badge color="error" startIcon={<ArrowDownIcon />}>
                {Math.abs(percentageChange).toFixed(0)}%
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* <!-- Testimoni Metric --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 relative overflow-hidden">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <Testimoni className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Testimoni</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">1,245</h4>
          </div>
          <div className="flex-shrink-0">
            <Badge color="success" startIcon={<ArrowUpIcon />}>
              7.89%
            </Badge>
          </div>
        </div>
      </div>

      {/* <!-- Total Admin Metric --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 relative overflow-hidden">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <Admin className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Admin</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">15</h4>
          </div>
          <div className="flex-shrink-0">
            <Badge color="info" startIcon={<ArrowUpIcon />}>
              2.5%
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};