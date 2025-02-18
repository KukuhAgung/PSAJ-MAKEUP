import Calendar from "@/components/templates/calendar/Calendar";
import PageBreadcrumb from "@/components/organism/common/PageBreadCrumb";
import React from "react";

export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Calendar" />
      <Calendar />
    </div>
  );
}
