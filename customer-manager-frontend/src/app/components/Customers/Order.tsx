"use client";
import { createCustomerProduct } from "@/app/lib/actions";
import { NewCustomerProduct, Product } from "@/app/lib/definitions";
import { Form, Input, Select, Button, message, InputNumber } from "antd";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/app/components/auth";
const { Option } = Select;

interface OrderProductProps {
  products: Product[];
  customerId: string;
}
export default function OrderProduct({
  products,
  customerId,
}: OrderProductProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const { currentUser } = useAuthContext()
  const [price, setPrice] = useState<number>(1);

  const [form] = Form.useForm();
  const handleFinish = async (values: any) => {
    setIsFormSubmitting(true);
    try {
      const body: NewCustomerProduct = {
        productId: values.product,
        createdUserId: currentUser?.id || '',
        customerId: customerId,
        quality: quantity,
        price: price,
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
        setSelectedProduct(null);
        setQuantity(1);
      }
    } catch {}
  };

  const handleProductChange = (value: string) => {
    // Tìm sản phẩm được chọn trong danh sách sản phẩm
    const product = products.find((p) => p.id === value) || null;
    setSelectedProduct(product);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setQuantity(value >= 1 ? value : 1); // Đảm bảo số lượng luôn >= 1
  };

  const getTotalPrice = () => {
    if (selectedProduct) {
      return formatPrice(selectedProduct.price * quantity);
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
          onChange={handleProductChange}
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
        />
      </Form.Item>

      <Form.Item
        name="quantity"
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
        <Input type="number" min={1} onChange={handleQuantityChange} />
      </Form.Item>
      {selectedProduct && (
          <div style={{ marginBottom: 16 }}>
            <h4>Thông tin chi tiết sản phẩm:</h4>
            <p>
              <strong>- Tên:</strong> {selectedProduct.title}
            </p>
            <p>
              <strong>- Mã sản phẩm:</strong> {selectedProduct.id}
            </p>
          </div>
      )}
      {selectedProduct && (
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
