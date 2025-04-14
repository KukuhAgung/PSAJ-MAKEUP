"use client";
import { useEffect, useState } from "react";
import Badge from "../../molecules/badge/Badge";
import {
  Admin,
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
  Testimoni,
} from "@/icons";
import { formatRupiah } from "@/app/admin/(menus)/finance/utils";
import { useApi } from "@/hooks/useFetchApi";
import { IResponseAPI } from "@/lib/index.model";
import { IReviewsApiResponse } from "@/components/sections/testimoni-section/index.model";
import { User } from "@prisma/client";
import useMediaQuery from "@/hooks/useMediaQuery";
import { Modal } from "@/components/molecules/modal";
import Alert from "@/components/molecules/alert/Alert";


interface IAdminsApiResponse {
  admin: User[];
  totalCount: number;
}

export const EcommerceMetrics = () => {
  const mobile = useMediaQuery("(max-width: 768px)");
  const { trigger: triggerReview } = useApi("/api/user-service/reviews");
  const { trigger: triggerAdmin } = useApi("/api/user-service/reviews");
  const [reviews, setReviews] = useState<IResponseAPI<IReviewsApiResponse>>();
  const [admins, setAdmins] = useState<IResponseAPI<IAdminsApiResponse>>();
  const [totalSales, setTotalSales] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0); // State baru untuk total pengguna
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    triggerReview(
      { method: "GET", data: { page: 1, size: 10 } },
      { onSuccess: (data) => setReviews(data) },
    );

    triggerAdmin({ method: "GET" }, { onSuccess: (data) => setAdmins(data) });

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
          const { totalAmount, totalSales, percentageChange } =
            resultSales.data;
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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
      {/* <!-- Customers Metric --> */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <GroupIcon className="size-6 text-gray-800 dark:text-white/90" />
        </div>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Pengguna
            </span>
            <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">
              {isLoading ? "Loading..." : totalUsers}
            </h4>
          </div>
        </div>
      </div>

      {/* <!-- Orders Metric --> */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="mt-5 flex items-end justify-between">
          <div className="max-w-[65%]">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Penjualan
            </span>
            <h4 className="mt-2 truncate text-title-sm font-bold text-gray-800 dark:text-white/90">
              {isLoading ? "Loading..." : formatRupiah(totalSales)}
            </h4>
            <p className="mt-1 truncate text-xs text-gray-500">
              {isLoading ? "" : `${totalItems} item terjual`}
            </p>
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
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <Testimoni className="size-6 text-gray-800 dark:text-white/90" />
        </div>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Testimoni
            </span>
            <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">
              {isLoading ? "Loading..." : reviews?.data.totalCount}
            </h4>
          </div>
          {/* <div className="flex-shrink-0">
            <Badge color="success" startIcon={<ArrowUpIcon />}>
              7.89%
            </Badge>
          </div> */}
        </div>
      </div>

      {/* <!-- Total Admin Metric --> */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <Admin className="size-6 text-gray-800 dark:text-white/90" />
        </div>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Admin
            </span>
            <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">
              {isLoading ? "Loading..." : admins?.data.totalCount}
            </h4>
          </div>
          {/* <div className="flex-shrink-0">
            <Badge color="info" startIcon={<ArrowUpIcon />}>
              2.5%
            </Badge>
          </div> */}
        </div>
      </div>

      <Modal
        showCloseButton={false}
        isOpen={mobile}
        onClose={() => {}}
      >
        <Alert
          variant="error"
          title="Halaman Admin Tidak Tersedia"
          message="Demi kenyamanan, silahkan gunakan desktop untuk mengakses halaman admin."
        />
      </Modal>
    </div>
  );
};
