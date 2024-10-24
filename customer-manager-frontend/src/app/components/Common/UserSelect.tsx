import { ComponentRef, forwardRef, useMemo, useState, useEffect } from "react";
import { Select, SelectProps } from "antd";
import { fetchUsers } from "@/app/lib/actions";
import { User } from "@/app/lib/definitions";

export interface UserSelectProps
  extends Omit<SelectProps, "options" | "loading"> {}

export type UserSelectRef = ComponentRef<typeof Select>;

export const UserSelect = forwardRef<UserSelectRef, UserSelectProps>(
  (props, ref) => {
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
      getUsers();
    }, []);

    const getUsers = async () => {
      setIsLoading(true);
      const results = await fetchUsers();
      setUsers(results);
      setIsLoading(false);
    };

    const options = useMemo<SelectProps["options"]>(
      () =>
        users.map((user) => ({
          value: user.id,
          label: `${user.name} - ${user.email}`,
        })),
      [users]
    );

    return (
      <Select
        ref={ref}
        showSearch
        loading={isLoading}
        optionFilterProp="label"
        options={options}
        {...props}
      />
    );
  }
);
