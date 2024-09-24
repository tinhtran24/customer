import { Flex } from "antd";
import ReusableTag from "../Common/Tag";
import { FilterValues, ParamsReset } from "./order.interface";
import moment from "moment";

export const removeFilter = (
  handleFilterReset: (params: ParamsReset) => void,
  filterKey: string
) => {
  if (filterKey === OrderFilterKey.DATE) {
    handleFilterReset({ isDateNull: true });
  }

  if (filterKey === OrderFilterKey.CUSTOMER_NAME) {
    handleFilterReset({ isCustomerNameNull: true });
  }

  if (filterKey === OrderFilterKey.SALE) {
    handleFilterReset({ isSaleNull: true });
  }

  if (filterKey === OrderFilterKey.SOURCE) {
    handleFilterReset({ isSourceNull: true });
  }
  
  if (filterKey === OrderFilterKey.CUSTOMER_STATUS) {
    handleFilterReset({ isCustomerStatusNull: true });
  }
};

export enum OrderFilterKey {
  DATE = "date",
  CUSTOMER_NAME = "customerName",
  SALE = "sale",
  SOURCE = "source",
  CUSTOMER_STATUS = "customerStatus",
}

interface LabelFilterProps {
  filteredValue: FilterValues;
  handleFilterReset: (params: ParamsReset) => void;
}
export const LabelFilterOrder = ({
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
          onClose={() => removeFilter(handleFilterReset, OrderFilterKey.DATE)}
        />
      )}

      {filteredValue.customerName && (
        <ReusableTag
          label={filteredValue.customerName}
          onClose={() =>
            removeFilter(handleFilterReset, OrderFilterKey.CUSTOMER_NAME)
          }
        />
      )}

      {filteredValue.sale && (
        <ReusableTag
          label={filteredValue.sale}
          onClose={() => removeFilter(handleFilterReset, OrderFilterKey.SALE)}
        />
      )}

      {filteredValue.source && (
        <ReusableTag
          label={filteredValue.source}
          onClose={() => removeFilter(handleFilterReset, OrderFilterKey.SOURCE)}
        />
      )}

      {filteredValue.status && (
        <ReusableTag
          label={filteredValue.status}
          onClose={() => removeFilter(handleFilterReset, OrderFilterKey.CUSTOMER_STATUS)}
        />
      )}
    </Flex>
  );
};
