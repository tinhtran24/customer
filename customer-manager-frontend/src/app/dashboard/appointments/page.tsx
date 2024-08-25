"use client";
import { Flex, Divider, Spin } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Suspense, useEffect, useState } from "react";
import { shantell } from "@/app/utils/fontSetting";
import AppointmentTable from "@/app/components/Appointments/Table";
import { CreateAppointment } from "@/app/components/Appointments/CreateAppointmentButton";
import { fetchAllAppointments } from "@/app/lib/actions";
import { Appointment, Pagination } from "@/app/lib/definitions";

export default async function AppointmentPage() {
  const [appointments, setAppointments] =
    useState<Pagination<Appointment> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  useEffect(() => {
    if (!appointments) {
      getData();
      setIsLoading(true);
    } else setIsLoading(false);
  }, [currentPage, appointments]);

  const getData = async () => {
    setAppointments(
      await fetchAllAppointments({
        page: currentPage.toString(),
        limit: pageSize.toString(),
      })
    );
    setIsLoading(false);
  };

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setAppointments(null);
    setIsLoading(true);
  };

  return (
    <main>
      <AntdRegistry>
        <Flex justify="space-between" gap="large" vertical>
          <Flex justify="space-between" align="flex-end">
            <h2
              className={shantell.className}
              style={{
                color: "#8E3E63",
                alignItems: "end",
                padding: 0,
                margin: 0,
              }}
            >
              QUẢN LÝ LỊCH HẸN
            </h2>
            <Suspense fallback={<Spin size="large" />}>
              <CreateAppointment refresh={getData} />
            </Suspense>
          </Flex>
          <Divider style={{ margin: 0 }} />

          <Suspense fallback={<Spin size="large" />}>
            <AppointmentTable
              appointmentsData={appointments}
              currentPage={currentPage}
              pageSize={pageSize}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              changePage={handleTableChange}
            />
          </Suspense>
        </Flex>
      </AntdRegistry>
    </main>
  );
}
