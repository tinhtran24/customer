import { Flex } from "antd";
import ReusableTag from "../Common/Tag";
import { FilterCustomer } from "./customer.interface";
import { Dayjs } from "dayjs";

export const removeFilterCustomer = (
  handleFilterReset: (params: FilterCustomer) => void,
  filterKey: string
) => {
  if (filterKey === CustomerFilterKey.SEARCH_TEXT) {
    handleFilterReset({ isKwNull: true });
  }

  if (filterKey === CustomerFilterKey.STATUS) {
    handleFilterReset({ isStatusNull: true });
  }

  if (filterKey === CustomerFilterKey.DATE) {
    handleFilterReset({ isDateNull: true });
  }
};

export enum CustomerFilterKey {
  SEARCH_TEXT = "searchText",
  STATUS = "status",
  DATE = "date"
}

interface LabelFilterProps {
  filteredValue: {
    searchText: string;
    status: string;
    date: [Dayjs | null, Dayjs | null];
  };
  handleFilterReset: (params: FilterCustomer) => void;
}
export const LabelFilter = ({
  filteredValue,
  handleFilterReset,
}: LabelFilterProps) => {
  return (
    <Flex>
      {filteredValue.searchText && (
        <ReusableTag
          label={filteredValue.searchText}
          onClose={() =>
            removeFilterCustomer(
              handleFilterReset,
              CustomerFilterKey.SEARCH_TEXT
            )
          }
        />
      )}
      {filteredValue.status && (
        <ReusableTag
          label={filteredValue.status}
          onClose={() =>
            removeFilterCustomer(handleFilterReset, CustomerFilterKey.STATUS)
          }
        />
      )}

      {filteredValue.date[0] !== null && (
        <ReusableTag
          label={`${
            filteredValue.date[0]
              ? filteredValue.date[0].startOf("day").format("YYYY-MM-DD")
              : ""
          } - ${
            filteredValue.date[1]
              ? filteredValue.date[1].endOf("day").format("YYYY-MM-DD")
              : ""
          }`}
          onClose={() =>
            removeFilterCustomer(handleFilterReset, CustomerFilterKey.DATE)
          }
        />
      )}
    </Flex>
  );
};
