import type { Metadata } from "next";
import { Flex } from "antd";
import StatisticsChart from "../components/Dashboard/chart";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function Dashboard() {
  return (
    <main>
      <Flex justify="space-around">
        <Flex
          justify="flex-start"
          vertical
          style={{
            padding: "60px 0px 0px 15px",
            width: "100%",
            maxWidth: "80rem",
          }}
        >
          <div>
            <StatisticsChart />
          </div>
        </Flex>
      </Flex>
    </main>
  );
}
