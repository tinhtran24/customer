import { Flex } from "antd";
import ReusableTag from "../Common/Tag";

interface LabelFilterProps {
  filteredValue: { searchText: string; status: string };
  handleFilterReset: (params: {
    isKwNull?: boolean;
    isStatusNull?: boolean;
  }) => void;
}
export const LabelFilter = ({
  filteredValue,
  handleFilterReset,
}: LabelFilterProps) => {
  const removeFilter = (filterKey: string) => {
    if (filterKey === "searchText") {
      handleFilterReset({ isKwNull: true });
    }

    if (filterKey === "status") {
      handleFilterReset({ isStatusNull: true });
    }
  };

  return (
    <Flex>
      {filteredValue.searchText && (
        <ReusableTag
          label={filteredValue.searchText}
          onClose={() => removeFilter("searchText")}
        />
      )}
      {filteredValue.status && (
        <ReusableTag
          label={filteredValue.status}
          onClose={() => removeFilter("status")}
        />
      )}
    </Flex>
  );
};
