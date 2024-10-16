import React, { useState } from "react";
import { Modal, Form, Input, InputNumber, Button, message } from "antd";
import { Product, ProductWarehouse, SETTINGS_TYPE } from "@/app/lib/definitions";
import { productWarehouse } from "@/app/lib/actions";
import { SettingSelect } from "@/app/components/Common/Select";
interface AddProductModalProps {
  product: Product;
  visible: boolean;
  onClose: () => void;
}

export const ProductWarehouseModal: React.FC<AddProductModalProps> = ({
  product,
  visible,
  onClose,
}) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        setIsSubmit(true);
        const body: ProductWarehouse = {
            productWarehouse: {
                source: values.source,
                quantityInStock: values.quantityInStock,
                quantityInUse: 0,
                price: values.price
            }
        };
        const result = await productWarehouse(product.id, body);

        setIsSubmit(false);

        if (result.statusCode) {
          message.error(
            Array.isArray(result.message) ? result.message[0] : result.message
          );
        } else {
          form.resetFields();
          onClose();
          message.success("Nhập kho sản phẩm thành công");
        }
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };

  return (
    <Modal
      visible={visible}
      title={`Nhập kho sản phẩm : ${product.title}`}
      onCancel={onClose}
      onOk={handleOk}
      footer={[
        <Button key="back" onClick={onClose}>
          Thoát
        </Button>,
        <Button
          key="submit"
          type="primary"
          htmlType="submit"
          onClick={handleOk}
          loading={isSubmit}
        >
          Tạo
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">

        <Form.Item name="source" label="Nguồn hàng">
            <SettingSelect
              notFoundContent="Không tìm thấy"
              showSearch
              placeholder="- Chọn -"
              optionFilterProp="children"
              type={SETTINGS_TYPE.SOURCE_OF_GOODS}
            />
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
          name="quantityInStock"
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
  );
};
