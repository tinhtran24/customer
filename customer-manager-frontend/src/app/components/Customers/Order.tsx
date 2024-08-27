"use client";
import { createCustomerProduct } from "@/app/lib/actions";
import { NewCustomerProduct, Product } from "@/app/lib/definitions";
import { Form, Input, Select, Button, message, InputNumber } from "antd";
import { useAuthContext } from "@/app/components/auth";
import { useState } from "react";
const { Option } = Select;

interface OrderProductProps {
  products: Product[];
  customerId: string;
  provinces: any[];
}
export default function OrderProduct({
  products,
  customerId,
}: OrderProductProps) {
  const [quantity, setQuantity] = useState<number | undefined>(1);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const { currentUser } = useAuthContext();
  const [price, setPrice] = useState<number>();

  const [form] = Form.useForm();

  const handleFinish = async (values: any) => {
    setIsFormSubmitting(true);
    try {
      const body: NewCustomerProduct = {
        productId: values.product,
        createdUserId: (currentUser as any).sub || "",
        customerId: customerId,
        quality: quantity!,
        price: (price || 1) * quantity!,
        street: values.street,
        PaymentMethod: values.PaymentMethod,
        ShipMethod: values.ShipMethod,
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
        setPrice(0);
        setQuantity(1);
      }
    } catch {}
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setQuantity(value || undefined);
  };

  const handlePriceChange = (value: number | null) => {
    setPrice(value || undefined);
  };

  const getTotalPrice = () => {
    if (price) {
      return formatPrice(price * quantity!);
    }
    return formatPrice(0);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{ quantity: quantity }}
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
        >
          {products.map((product) => (
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
          onChange={handlePriceChange}
        />
      </Form.Item>

      <Form.Item
        label="Số lượng"
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
        <Input
          type="number"
          min={1}
          value={quantity}
          onChange={handleQuantityChange}
        />
      </Form.Item>

      <Form.Item
        name="ShipMethod"
        label="Phương thức giao hàng"
        rules={[
          { required: true, message: "Vui lòng thêm phương thức giao hàng" },
        ]}
      >
        <Input placeholder="Phương thức giao hàng ..." />
      </Form.Item>

      <Form.Item label="Số nhà/đường" required>
        <Form.Item
          name="street"
          noStyle
          rules={[{ required: true, message: "Vui lòng thêm địa chỉ cụ thể" }]}
        >
          <Input placeholder="Số nhà/đường ..." />
        </Form.Item>
      </Form.Item>

      <Form.Item
        name="PaymentMethod"
        label="Phương thức thanh toán"
        rules={[
          { required: true, message: "Vui lòng thêm phương thức thanh toán" },
        ]}
      >
        <Input placeholder="Phương thức thanh toán ..." />
      </Form.Item>

      {quantity && (
        <div style={{ marginBottom: 16, color: "green" }}>
          <h4>Thành tiền: {getTotalPrice()}</h4>
        </div>
      )}

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isFormSubmitting}>
          Gửi
        </Button>
      </Form.Item>
    </Form>
  );
}
