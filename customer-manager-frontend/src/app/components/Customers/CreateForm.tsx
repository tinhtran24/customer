"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Form,
  Input,
  Select,
  Button,
  Space,
  message,
  Col,
  Row,
  Divider,
} from "antd";
import {
  ENUM_STATUS_TYPE,
  NewCustomer,
  SETTINGS_TYPE,
  User,
} from "@/app/lib/definitions";
import { createSchemaFieldRule } from "antd-zod";
import { CreateCustomerFormSchema } from "@/app/lib/validations";
import { createCustomer, fetchUsers } from "@/app/lib/actions";
import { useRouter } from "next/navigation";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useAuthContext } from "@/app/components/auth";
import { SettingSelect } from "../Common/Select";
const { Option } = Select;

export default function CreateCustomerForm({
  provinces,
}: {
  provinces: any[];
}) {
  const [form] = Form.useForm();
  const [districtOptions, setDistrictOptions] = useState([]);
  const [wardOptions, setWardOptions] = useState([]);
  const [users, setUSers] = useState<User[]>([]);
  const [isProvincesLoading, setIsProvincesLoading] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const router = useRouter();

  const { currentUser } = useAuthContext();

  const getUsers = async () => {
    var results = await fetchUsers();
    setUSers(results);
  };

  useEffect(() => {
    getUsers();
    if (!provinces) setIsProvincesLoading(true);
  }, [provinces]);

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const provinceOptions = provinces.map((province: any) => ({
    value: province.name,
    label: province.name,
    districts: province.districts,
  }));

  const genderOptions = [
    {
      value: "Nam",
      label: "Nam",
    },
    {
      value: "Nữ",
      label: "Nữ",
    },
  ];

  const onFinish = async (values: any) => {
    setIsFormSubmitting(true);
    const body: NewCustomer = {
      fullName: values.fullName,
      contacts: values.contacts?.map((s: any) => JSON.stringify(s)),
      gender: values.gender,
      group: values.group,
      source: values.source,
      status: values.status,
      userInChargeId: values.userInChargeId,
      street: values.street,
      wardCode: values.ward,
      phoneNumber: values.phoneNumber,
    };

    const result = await createCustomer(body);

    setIsFormSubmitting(false);

    if (result.statusCode) {
      message.error(
        Array.isArray(result.message) ? result.message[0] : result.message
      );
    } else {
      message.success("Tạo khách hàng thành công");
      router.push("/dashboard/customers");
    }
  };

  const onSelectProvince = (value: any, option: any) => {
    form.resetFields(["district", "ward"]);
    const districts = option.districts;
    const _districtOptions = districts.map((district: any) => ({
      value: district.name,
      label: district.name,
      wards: district.wards,
    }));
    setDistrictOptions(_districtOptions);
  };

  const onSelectDistrict = (value: any, option: any) => {
    form.resetFields(["ward"]);
    const wards = option.wards;
    const _wardOptions = wards.map((ward: any) => ({
      value: ward.code,
      label: ward.name,
      wardCode: ward.code,
    }));
    setWardOptions(_wardOptions);
  };

  const rule = createSchemaFieldRule(CreateCustomerFormSchema);

  return (
    <Row>
      <Col span={24}>
        <Form
          autoCorrect="off"
          autoComplete="off"
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 16 }}
          form={form}
          onFinish={onFinish}
        >
          <Row>
            <Col span={24} lg={{ span: 12 }} style={{ padding: "0px 10px" }}>
              <Divider style={{ padding: "0px 20px" }}>
                Thông tin cơ bản
              </Divider>

              <Form.Item label="Tên đầy đủ" required>
                <Form.Item name="fullName" noStyle rules={[rule]}>
                  <Input />
                </Form.Item>
              </Form.Item>

              <Form.Item label="Điện thoại" required>
                <Form.Item name="phoneNumber" noStyle rules={[rule]}>
                  <Input />
                </Form.Item>
              </Form.Item>

              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[
                  { required: true, message: "Vui lòng chọn trạng thái" },
                ]} // Validation rule
              >
                <Select placeholder="- Chọn -" style={{ width: "100%" }}>
                  {Object.entries(ENUM_STATUS_TYPE).map(([key, value]) => (
                    <Select.Option key={key} value={value}>
                      {value}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Nhóm khách hàng" required>
                <Form.Item name="group" noStyle rules={[rule]}>
                  <SettingSelect type={SETTINGS_TYPE.CUSTOMER_GROUP} />
                </Form.Item>
              </Form.Item>

              <Form.Item label="Nguồn khách hàng" required>
                <Form.Item name="source" noStyle rules={[rule]}>
                  <SettingSelect type={SETTINGS_TYPE.CUSTOMER_SOURCE} />
                </Form.Item>
              </Form.Item>

              <Form.Item
                name="userInChargeId"
                label="Người phụ trách"
                rules={[{ required: true, message: "Chọn người phụ trách" }]} // Validation rule
              >
                <Select placeholder="- Chọn -" style={{ width: "100%" }}>
                  {users?.map((user) => (
                    <Option key={user.id} value={user.id}>
                      {`${user.name} - ${user.email}`}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col
              span={24}
              lg={{ span: 12 }}
              style={{
                padding: "0px 10px",
              }}
            >
              <Divider style={{ padding: "0px 20px" }}>Khác</Divider>

              <Form.Item label="Giới Tính" required>
                <Form.Item name="gender" noStyle>
                  <Select
                    notFoundContent="Không tìm thấy"
                    showSearch
                    placeholder="- Chọn -"
                    optionFilterProp="children"
                    filterOption={filterOption}
                    options={genderOptions}
                  />
                </Form.Item>
              </Form.Item>

              <Form.Item label="Tỉnh/TP" required>
                <Form.Item name="province" noStyle rules={[rule]}>
                  <Select
                    loading={isProvincesLoading}
                    notFoundContent="Không tìm thấy"
                    showSearch
                    placeholder="- Chọn -"
                    optionFilterProp="children"
                    filterOption={filterOption}
                    onSelect={onSelectProvince}
                    options={provinceOptions}
                  />
                </Form.Item>
              </Form.Item>

              <Form.Item label="Quận/Huyện" required>
                <Form.Item name="district" noStyle rules={[rule]}>
                  <Select
                    notFoundContent="Không tìm thấy"
                    showSearch
                    placeholder="- Chọn -"
                    optionFilterProp="children"
                    filterOption={filterOption}
                    onSelect={onSelectDistrict}
                    options={districtOptions}
                  />
                </Form.Item>
              </Form.Item>

              <Form.Item label="Phường/Xã" required>
                <Form.Item name="ward" noStyle rules={[rule]}>
                  <Select
                    notFoundContent="Không tìm thấy"
                    showSearch
                    placeholder="- Chọn -"
                    optionFilterProp="children"
                    filterOption={filterOption}
                    options={wardOptions}
                  />
                </Form.Item>
              </Form.Item>

              <Form.Item label="Số nhà/đường" required>
                <Form.Item name="street" noStyle rules={[rule]}>
                  <Input />
                </Form.Item>
              </Form.Item>

              <div
                style={{
                  alignContent: "center",
                  alignItems: "end",
                  display: "flex",
                  flexDirection: "column",
                  paddingRight: "2.5rem",
                }}
              >
                <Form.List name="contacts">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Space
                          key={key}
                          style={{ display: "flex", marginBottom: 8 }}
                          align="baseline"
                        >
                          <Form.Item
                            {...restField}
                            name={[name, "name"]}
                            rules={[
                              { required: true, message: "Thông tin bắt buộc" },
                            ]}
                          >
                            <Input placeholder="Tên" />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, "phone"]}
                            rules={[
                              { required: true, message: "Thông tin bắt buộc" },
                            ]}
                          >
                            <Input placeholder="Số điện thoại" />
                          </Form.Item>
                          <MinusCircleOutlined onClick={() => remove(name)} />
                        </Space>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          icon={<PlusOutlined />}
                        >
                          Thêm thông tin liên hệ
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </div>
            </Col>
          </Row>

          <Row>
            <Divider />
            <div
              style={{
                width: "100%",
                display: "flex",
                position: "relative",
                justifyContent: "center",
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                loading={isFormSubmitting}
              >
                Tạo
              </Button>
              <div style={{ position: "absolute", top: 0, right: "3rem" }}>
                <Button type="primary" style={{ background: "gray" }}>
                  <Link href="/dashboard/customers/">Hủy</Link>
                </Button>
              </div>
            </div>
          </Row>
        </Form>
      </Col>
    </Row>
  );
}
