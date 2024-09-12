import { Flex } from "antd";
import ReusableTag from "../Common/Tag";
import { FilterCustomer } from "./customer.interface";

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
};

export enum CustomerFilterKey {
  SEARCH_TEXT = "searchText",
  STATUS = "status",
}

interface LabelFilterProps {
  filteredValue: { searchText: string; status: string };
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
            removeFilterCustomer(handleFilterReset, CustomerFilterKey.SEARCH_TEXT)
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
    </Flex>
  );
};
