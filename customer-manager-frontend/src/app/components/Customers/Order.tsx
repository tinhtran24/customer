"use client";
import { NewCustomerProduct, Product } from "@/app/lib/definitions";
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
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { createCustomerProduct } from "@/app/lib/actions";
const { Option } = Select;

interface OrderData {
  no: number;
  product: Product;
  price: number;
  quantity: number;
  code: string;
  totalPrice: number;
  source: string;
}

interface OrderProductProps {
  products: Product[];
  customerId: string;
  provinces: any[];
}
export default function OrderProduct({
  products,
  customerId,
}: OrderProductProps) {
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const { currentUser } = useAuthContext();
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [data, setData] = useState<OrderData[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [form] = Form.useForm();
  const [formModal] = Form.useForm();

  const handleFinish = async (values: any) => {
    setIsFormSubmitting(true);
    try {
      const body: NewCustomerProduct = {
        items: data.map((item) => ({
          productId: item.product.id,
          quality: item.quantity,
          unitPrice: item.price,
        })),
        createCustomerProduct: {
          code: Date.now().toString(),
          customerId: customerId,
          createdUserId: (currentUser as any).sub,
          street: values.street,
          price: data.reduce((acc, item) => acc + item.totalPrice, 0),
          PaymentMethod: values.PaymentMethod,
          ShipMethod: values.ShipMethod,
        },
      };

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
      }
    } catch {}
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const columns: TableColumnsType<OrderData> = [
    { title: "STT", dataIndex: "no", key: "no", render: (no: number) => no },
    { title: "Mã sản phẩm", dataIndex: "code", key: "code" },
    {
      title: "Tên sản phẩm",
      dataIndex: "product",
      key: "name",
      render: (product: Product) => product.title,
    },
    { title: "Nguồn hàng", dataIndex: "source", key: "source" },
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
  ];

  const handleOk = () => {
    formModal
      .validateFields()
      .then((values) => {
        const newData: OrderData = {
          no: data.length + 1,
          code: Date.now().toString(),
          price: values.price,
          quantity: values.quantity,
          totalPrice: values.price * values.quantity,
          product: selectedProduct!,
          source: values.source,
        };
        setData([...data, newData]);
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
    const product = products.find((p) => p.id === value);
    setSelectedProduct(product);
  };

  //mock data
  const sources = [
    { id: "1", name: "Kho Hà Nội" },
    { id: "2", name: "Kho TP.HCM" },
    { id: "3", name: "Nhà cung cấp A" },
    { id: "4", name: "Nhà cung cấp B" },
    { id: "5", name: "Nhà máy sản xuất X" },
  ];

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
            Tạo
          </Button>,
        ]}
      >
        <Form
          id="productForm"
          form={formModal}
          layout="vertical"
          onFinish={handleOk}
          initialValues={{ quantity: 1 }}
        >
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
              {products.map((product) => (
                <Option key={product.id} value={product.id}>
                  {product.title}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="source" label="Nguồn hàng">
            <Select
              placeholder="Chọn nguồn hàng"
              showSearch
              optionFilterProp="children"
              filterOption={(input: any, option: any) =>
                option?.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {sources.map((source) => (
                <Option key={source.id} value={source.name}>
                  {source.name}
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

      <Divider dashed style={{ margin: "2rem 0", borderColor: "blue" }} />

      <h3>Phương thức giao hàng</h3>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="ShipMethod"
          label="Phương thức giao hàng"
          rules={[
            { required: true, message: "Vui lòng thêm phương thức giao hàng" },
          ]}
        >
          <Input
            placeholder="Phương thức giao hàng ..."
            disabled={data.length === 0}
          />
        </Form.Item>

        <Form.Item label="Số nhà/đường" required>
          <Form.Item
            name="street"
            noStyle
            rules={[
              { required: true, message: "Vui lòng thêm địa chỉ cụ thể" },
            ]}
          >
            <Input
              placeholder="Số nhà/đường ..."
              disabled={data.length === 0}
            />
          </Form.Item>
        </Form.Item>

        <Form.Item
          name="PaymentMethod"
          label="Phương thức thanh toán"
          rules={[
            { required: true, message: "Vui lòng thêm phương thức thanh toán" },
          ]}
        >
          <Input
            placeholder="Phương thức thanh toán ..."
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
            Gửi
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
