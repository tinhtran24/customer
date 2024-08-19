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
import { NewCustomer } from "@/app/lib/definitions";
import { createSchemaFieldRule } from "antd-zod";
import { CreateCustomerFormSchema } from "@/app/lib/validations";
import { createCustomer } from "@/app/lib/actions";
import { useRouter } from "next/navigation";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";


export default function CreateCustomerForm({
  provinces,
}: {
  provinces: any[];
}) {
  const [form] = Form.useForm();
  const [districtOptions, setDistrictOptions] = useState([]);
  const [wardOptions, setWardOptions] = useState([]);
  const [wardCode, setWardCode] = useState("");
  const [gender, setGender] = useState("");
  const [isProvincesLoading, setIsProvincesLoading] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
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

  const genderOptions = [{
    value: 'Male',
    label: 'Nam'
  },{
    value: 'Female',
    label: 'Nữ'
  }]

  const onFinish = async (values: any) => {
    setIsFormSubmitting(true);

    const newCustomer: NewCustomer = {
      fullName: values.fullName,
      taxCode: values.taxCode,
      urn: values.urn,
      street: values.street,
      contacts: values.contacts,
      totalOrder: Number(values.totalOrder),
      gender,
      status: 'NEW',
      wardCode,
    };

    const result = await createCustomer(newCustomer);

    setIsFormSubmitting(false);

    if (result.statusCode) {
      message.error(
        Array.isArray(result.message) ? result.message[0] : result.message
      );
    } else {
      message.success(result.message);
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
      value: ward.name,
      label: ward.name,
      wardCode: ward.code,
    }));
    setWardOptions(_wardOptions);
  };

  const onSelectGender = (value: any, option: any) => {
    setGender(option.value);
  };

  const onSelectWard = (value: any, option: any) => {
    setWardCode(option.wardCode);
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

              <Form.Item label="Giới Tính" required>
                <Form.Item name="gender" noStyle>
                  <Select
                      notFoundContent="Không tìm thấy"
                      showSearch
                      placeholder="- Chọn -"
                      optionFilterProp="children"
                      filterOption={filterOption}
                      onSelect={onSelectGender}
                      options={genderOptions}
                  />
                </Form.Item>
              </Form.Item>

              <Form.Item label="Mã số thuế">
                <Form.Item name="taxCode" noStyle rules={[rule]}>
                  <Input />
                </Form.Item>
              </Form.Item>

              <Form.Item label="Số URN">
                <Form.Item name="urn" noStyle rules={[rule]}>
                  <Input />
                </Form.Item>
              </Form.Item>

              <Form.Item label="Số lượng đơn hàng" required>
                <Form.Item name="totalOrder" noStyle rules={[rule]}>
                  <Input type='number' />
                </Form.Item>
              </Form.Item>

              <Form.Item label="Số nhà/đường">
                <Form.Item name="street" noStyle rules={[rule]}>
                  <Input />
                </Form.Item>
              </Form.Item>

              <Form.Item label="Tỉnh/TP" required>
                <Form.Item name="province" noStyle>
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
                <Form.Item name="district" noStyle>
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
                    onSelect={onSelectWard}
                  />
                </Form.Item>
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

              <div style={{ alignContent: "center" }}>
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
                          Thêm người liên hệ
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
            <Col span={24} lg={{ span: 12 }}>
              <Form.Item
                label=" "
                labelCol={{ xs: { span: 0 }, lg: { span: 7 } }}
                colon={false}
              >
                <Space size={"middle"}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isFormSubmitting}
                  >
                    Tạo
                  </Button>

                  <Button type="primary" style={{ background: "gray" }}>
                    <Link href="/dashboard/customers/">Hủy</Link>
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
}
