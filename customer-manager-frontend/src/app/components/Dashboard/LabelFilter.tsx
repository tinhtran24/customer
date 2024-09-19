import { Flex } from "antd";
import ReusableTag from "../Common/Tag";
import {
  FilterValuesDashboard,
  ParamsResetDashboard,
} from "./dashboard.interface";
import moment from "moment";

export const removeFilter = (
  handleFilterReset: (params: ParamsResetDashboard) => void,
  filterKey: string
) => {
  if (filterKey === DashboardFilterKey.DATE) {
    handleFilterReset({ isDateNull: true });
  }

  if (filterKey === DashboardFilterKey.SALE) {
    handleFilterReset({ isSaleNull: true });
  }

  if (filterKey === DashboardFilterKey.SOURCE) {
    handleFilterReset({ isSourceNull: true });
  }
};

export enum DashboardFilterKey {
  DATE = "date",
  SALE = "sale",
  SOURCE = "source",
}

interface LabelFilterProps {
  filteredValue: FilterValuesDashboard;
  handleFilterReset: (params: ParamsResetDashboard) => void;
}
export const LabelFilterDashboard = ({
  filteredValue,
  handleFilterReset,
}: LabelFilterProps) => {
  return (
    <Flex style={{ marginBottom: 24 }}>
      {filteredValue.from && (
        <ReusableTag
          label={`${moment(filteredValue.from).format("YYYY-MM-DD")} - ${moment(
            filteredValue.to
          ).format("YYYY-MM-DD")}`}
          onClose={() =>
            removeFilter(handleFilterReset, DashboardFilterKey.DATE)
          }
        />
      )}

      {filteredValue.year && (
        <ReusableTag
          label={filteredValue.year.toString()}
          onClose={() =>
            removeFilter(handleFilterReset, DashboardFilterKey.DATE)
          }
        />
      )}

      {filteredValue.sale && (
        <ReusableTag
          label={filteredValue.sale}
          onClose={() =>
            removeFilter(handleFilterReset, DashboardFilterKey.SALE)
          }
        />
      )}

      {filteredValue.source && (
        <ReusableTag
          label={filteredValue.source}
          onClose={() =>
            removeFilter(handleFilterReset, DashboardFilterKey.SOURCE)
          }
        />
      )}
    </Flex>
  );
};
