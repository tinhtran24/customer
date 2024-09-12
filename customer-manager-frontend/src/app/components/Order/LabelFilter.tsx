import { Flex } from "antd";
import ReusableTag from "../Common/Tag";
import { FilterValues, ParamsReset } from "./order.interface";
import moment from "moment";

interface LabelFilterProps {
  filteredValue: FilterValues;
  handleFilterReset: (params: ParamsReset) => void;
}
export const LabelFilterOrder = ({
  filteredValue,
  handleFilterReset,
}: LabelFilterProps) => {
  const removeFilter = (filterKey: string) => {
    if (filterKey === "date") {
      handleFilterReset({ isDateNull: true });
    }

    if (filterKey === "customerName") {
      handleFilterReset({ isCustomerNameNull: true });
    }

    if (filterKey === "sale") {
      handleFilterReset({ isSaleNull: true });
    }

    if (filterKey === "source") {
      handleFilterReset({ isSourceNull: true });
    }
  };

  return (
    <Flex style={{marginBottom: 24}}>
      {filteredValue.from && (
        <ReusableTag
          label={`${moment(filteredValue.from).format("YYYY-MM-DD")} - ${moment(
            filteredValue.to
          ).format("YYYY-MM-DD")}`}
          onClose={() => removeFilter("date")}
        />
      )}

      {filteredValue.customerName && (
        <ReusableTag
          label={filteredValue.customerName}
          onClose={() => removeFilter("customerName")}
        />
      )}

      {filteredValue.sale && (
        <ReusableTag
          label={filteredValue.sale}
          onClose={() => removeFilter("sale")}
        />
      )}

      {filteredValue.source && (
        <ReusableTag
          label={filteredValue.source}
          onClose={() => removeFilter("source")}
        />
      )}
    </Flex>
  );
};
