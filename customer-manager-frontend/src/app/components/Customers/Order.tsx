"use client";
import {
  Customer,
  NewCustomerProduct,
  Product,
  SETTINGS_TYPE,
  UpdateCustomerProduct,
} from "@/app/lib/definitions";
import {
  Form,
  Input,
  Select,
  Button,
  message,
  InputNumber,
  Table,
  Modal,
  TableColumnsType,
  Divider,
} from "antd";
import { useAuthContext } from "@/app/components/auth";
import { useState, useEffect } from "react";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { generateCode } from "@/app/utils/generateString";
const { Option } = Select;
import {
  createCustomerProduct,
  fetchAllProducts,
  updateCustomerProduct,
} from "@/app/lib/actions";
import { SettingSelect } from "../Common/Select";

export interface OrderData {
  no: number;
  product: Product;
  price: number;
  quantity: number;
  code: string;
  totalPrice: number;
  source: string;
}

export interface PaymentInformation {
  code: string;
  province?: string;
  district?: string;
  ward?: string;
  street?: string;
  price: number;
  PaymentMethod: string;
  ShipMethod: string;
  createdUserId: string;
  updatedUserId?: string | null;
}

interface OrderProductProps {
  products: Product[];
  customer: Customer;
  provinces: any[];
  initData?: {
    id: string;
    products: OrderData[];
    paymentInformation: PaymentInformation;
  };
  refetch?: any;
  sourceSelectedInit?: string;
}
export default function OrderProduct({
  customer,
  provinces,
  initData,
  refetch,
  sourceSelectedInit,
}: OrderProductProps) {
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const { currentUser } = useAuthContext();
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [data, setData] = useState<OrderData[]>(initData?.products || []);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectDisplayQuanlity, setSelectDisplayQuanlity] = useState<number>(0);

  const [form] = Form.useForm();
  const [formModal] = Form.useForm();

  const [sourceSelected, setSourceSelected] = useState<string | undefined>(sourceSelectedInit);
  const [productsBySource, setProductsBySource] = useState<Product[]>([]);

  const refreshProduct = async () => {
    setProductsBySource(
      await fetchAllProducts({ source: sourceSelected || "" })
    );
  };
  useEffect(() => {
    refreshProduct();
  }, [sourceSelected]);

  useEffect(() => {
    if (initData) {
      form.resetFields();
      setData(initData.products);
      form.setFieldsValue({
        ...initData.paymentInformation,
        street: getAddress(),
      });
    } else
      form.setFieldsValue({
        province: customer.ward?.district?.province?.name,
        district: customer.ward?.district?.name,
        ward: customer.ward?.name,
        street: getAddress(),
      });
  }, [initData]);

  const handleFinish = async (values: any) => {
    setIsFormSubmitting(true);
    if (initData) {
      const body: UpdateCustomerProduct = {
        items: data.map((item) => ({
          productId: item.product.id,
          quantity: Number(item.quantity),
          unitPrice: item.price,
          source: item.source,
        })),
        updateCustomerProduct: {
          code: initData.paymentInformation.code,
          customerId: customer.id,
          updatedUserId: (currentUser as any).sub,
          street: values.street,
          price: data.reduce((acc, item) => acc + item.totalPrice, 0),
          paymentMethod: values.PaymentMethod,
          shipMethod: values.ShipMethod,
          status: values.orderStatus,
        },
      };

      const result = await updateCustomerProduct({
        id: initData.id,
        body: body,
      });
      try {
        setIsFormSubmitting(false);
        if (result.statusCode) {
          message.error(
            Array.isArray(result.message) ? result.message[0] : result.message
          );
        } else {
          message.success("Cập nhật đơn thành công");
          form.resetFields();
          setData([]);
          refetch && refetch();
        }
      } catch {}
    } else {
      const body: NewCustomerProduct = {
        items: data.map((item) => ({
          productId: item.product.id,
          quantity: Number(item.quantity),
          unitPrice: item.price,
          source: item.source,
        })),
        createCustomerProduct: {
          code: "",
          customerId: customer.id,
          createdUserId: (currentUser as any).sub,
          street: values.street,
          price: data.reduce((acc, item) => acc + item.totalPrice, 0),
          paymentMethod: values.PaymentMethod,
          shipMethod: values.ShipMethod,
          status: values.orderStatus,
        },
      };
      try {
        const result = await createCustomerProduct(body);
        setIsFormSubmitting(false);
        if (result.statusCode) {
          message.error(
            Array.isArray(result.message) ? result.message[0] : result.message
          );
        } else {
          message.success("Tạo đơn thành công");
          form.resetFields();
          setData([]);
          refetch && refetch();
        }
      } catch {}
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const columns: TableColumnsType<OrderData> = [
    { title: "STT", dataIndex: "no", key: "no", render: (no: number) => no },
    // { title: "Mã sản phẩm", dataIndex: "code", key: "code" },
    {
      title: "Tên sản phẩm",
      dataIndex: "product",
      key: "name",
      render: (product: Product) => product.title,
    },
    { title: "Kho", dataIndex: "source", key: "source" },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (e: number) => formatPrice(e),
    },
    {
      title: "Thành tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (e: number) => formatPrice(e),
    },
    {
      key: "5",
      title: "",
      render: (record) => {
        return (
          <>
            <DeleteOutlined
              onClick={() => {
                onDeleteItem(record);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];

  const handleOk = () => {
    formModal
      .validateFields()
      .then((values) => {
        const newData: OrderData = {
          no: data.length + 1,
          code: "",
          price: values.price,
          quantity: values.quantity,
          totalPrice: values.price * values.quantity,
          product: selectedProduct!,
          source: values.source,
        };
        if (selectDisplayQuanlity < values.quantity) {
          message.error(
              'Số lượng nhập lớn hơn số lượng tồn kho'
          );
        } else {
          setData([...data, newData]);
        }
        setSelectDisplayQuanlity(0);
        formModal.resetFields();
        setIsModalVisible(false);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSelectChange = (value: string) => {
    const product = productsBySource.find((p) => p.id === value);
    if (product) {
      setSelectedProduct(product);
      setSelectDisplayQuanlity(product?.productWarehouses[0].displayQuantity || 0)
      formModal.setFieldsValue({
        price: product!.price, /// check it
      });
    }
  };

  const onDeleteItem = (record: OrderData) => {
    setData((pre) => {
      return pre
        .filter((order) => order.no !== record.no)
        .map((order, index) => ({
          ...order,
          no: index + 1,
        }));
    });
    message.success("Đã xóa đơn hàng thành công");
  };

  const getAddress = () => {
    const { street, ward } = customer;
    if (!street) return "_";
    if (!ward) return street;
    const wardName = ward ? ward.fullName : "";
    const districtName = ward && ward.district ? ward.district.fullName : "";
    const provinceName =
      ward && ward.district && ward.district.province
        ? ward.district.province.fullName
        : "";
    return `${street}, ${wardName}, ${districtName}, ${provinceName}`;
  };

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsModalVisible(true)}
        style={{ float: "right", marginBottom: "1rem" }}
      >
        Thêm sản phẩm
      </Button>
      <Modal
        title="Thêm sản phẩm"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Thoát
          </Button>,
          <Button
            key="submit"
            type="primary"
            htmlType="submit"
            form="productForm"
          >
            Thêm sản phẩm
          </Button>,
        ]}
      >
        <Form
          id="productForm"
          form={formModal}
          layout="vertical"
          onFinish={handleOk}
          initialValues={{ quantity: 1, source: sourceSelected }}
        >
          <Form.Item
            name="source"
            label="Kho"
            rules={
              data.length > 0
                ? []
                : [{ required: true, message: "Vui lòng chọn Kho!" }]
            }
          >
            <SettingSelect
              notFoundContent="Không tìm thấy"
              showSearch
              placeholder="- Chọn -"
              optionFilterProp="children"
              type={SETTINGS_TYPE.SOURCE_OF_GOODS}
              disabled={data.length > 0}
              onChange={(value: string) => {
                setSourceSelected(value);
                formModal.setFieldsValue({ product: undefined });
              }}
            />
          </Form.Item>

          <Form.Item
            name="product"
            label="Sản phẩm"
            rules={[{ required: true, message: "Vui lòng chọn sản phẩm!" }]}
          >
            <Select
              placeholder="Chọn sản phẩm"
              showSearch
              optionFilterProp="children"
              filterOption={(input: any, option: any) =>
                option?.children.toLowerCase().includes(input.toLowerCase())
              }
              onChange={handleSelectChange}
            >
              {productsBySource.map((product) => (
                <Option key={product.id} value={product.id}>
                  {product.title}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá (VNĐ)"
            rules={[
              { required: true, message: "Vui lòng thêm giá" },
              {
                type: "number",
                min: 0,
                message: "Giá sản phẩm là kiểu dữ liệu số",
              },
            ]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="Giá sản phẩm ..."
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value?.replace(/\ VNĐ\s?|(,*)/g, "") as any}
            />
          </Form.Item>
          <h3
              style={{
                textAlign: "left",
                fontSize: "14px",
                fontWeight: "600",
                marginTop: "20px",
              }}
          >
            Số lượng tồn: {selectDisplayQuanlity}
          </h3>
          <Form.Item
            label="Số lượng"
            name="quantity"
            rules={[
              { required: true, message: "Vui lòng nhập số lượng!" },
              {
                validator: (_, value) =>
                  value > 0
                    ? Promise.resolve()
                    : Promise.reject(new Error("Số lượng phải lớn hơn 0!")),
              },
            ]}
          >
            <Input type="number" min={1} />
          </Form.Item>
        </Form>
      </Modal>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 10 }}
        style={{ marginTop: 20 }}
      />
      <h3
        style={{
          textAlign: "right",
          fontSize: "18px",
          fontWeight: "bold",
          marginTop: "20px",
          color: "green",
        }}
      >
        Thành tiền:{" "}
        {formatPrice(data.reduce((sum, order) => sum + order.totalPrice, 0))}
      </h3>
      <Divider dashed style={{ margin: "2rem 0", borderColor: "blue" }} />

      <h3>Phương thức giao hàng</h3>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ street: getAddress(), orderStatus: "Mới" }}
      >
        <Form.Item
          name="ShipMethod"
          label="Phương thức giao hàng"
          rules={[
            { required: true, message: "Vui lòng thêm phương thức giao hàng" },
          ]}
        >
          <SettingSelect
            notFoundContent="Không tìm thấy"
            showSearch
            placeholder="- Chọn -"
            optionFilterProp="children"
            type={SETTINGS_TYPE.DELIVERY_METHOD}
            disabled={data.length === 0}
          />
        </Form.Item>

        <Form.Item label="Địa chỉ" required>
          <Form.Item
            name="street"
            noStyle
            rules={[
              { required: true, message: "Vui lòng thêm địa chỉ cụ thể" },
            ]}
          >
            <Input placeholder="Địa chỉ ..." disabled={data.length === 0} />
          </Form.Item>
        </Form.Item>

        <Form.Item
          name="PaymentMethod"
          label="Phương thức thanh toán"
          rules={[
            { required: true, message: "Vui lòng thêm phương thức thanh toán" },
          ]}
        >
          <SettingSelect
            notFoundContent="Không tìm thấy"
            showSearch
            placeholder="- Chọn -"
            optionFilterProp="children"
            type={SETTINGS_TYPE.PAYMENT_METHOD}
            disabled={data.length === 0}
          />
        </Form.Item>

        <Form.Item
          name="orderStatus"
          label="Trạng thái đơn hàng"
          rules={[
            { required: true, message: "Vui lòng thêm trạng thái đơn hàng" },
          ]}
        >
          <SettingSelect
            notFoundContent="Không tìm thấy"
            showSearch
            placeholder="- Chọn -"
            optionFilterProp="children"
            type={SETTINGS_TYPE.ORDER_STATUS}
            disabled={data.length === 0}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isFormSubmitting}
            disabled={data.length === 0}
          >
            {initData ? "Cập nhật" : "Tạo đơn hàng"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
