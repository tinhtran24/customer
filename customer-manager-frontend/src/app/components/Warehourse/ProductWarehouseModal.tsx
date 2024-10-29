import React, { useEffect, useMemo, useState } from "react";
import { Modal, Form, Input, InputNumber, Button, message, Select, SelectProps } from "antd";
import { Product, ProductWarehouse, Setting, SETTINGS_TYPE } from "@/app/lib/definitions";
import { fetchAllProducts, productWarehouse } from "@/app/lib/actions";
import { SettingSelect } from "@/app/components/Common/Select";
interface AddProductModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ProductWarehouseModal: React.FC<AddProductModalProps> = ({
  visible,
  onClose,
}) => {
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);
    const [sourceSelected, setSourceSelected] = useState<string>();
    const [products, setProducts] = useState<Product[]>([]);

    const productOption = useMemo<SelectProps['options']>(
        () => (products as Product[]).map((item) => ({ value: item.id, label: item.title })),
        [products]
    );

    const refreshProduct = async () => {
        setProducts(
            await fetchAllProducts()
        );
    };
    useEffect(() => {
        refreshProduct();
    }, [sourceSelected]);

    const handleSelectChange = (value: string) => {
        const product = products.find((p) => p.id === value);
        if (product) {
            form.setFieldsValue({
                productId: product!.id, /// check it
            });
        }
    };

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
        const result = await productWarehouse(values.product, body);

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

  // @ts-ignore
    return (
    <Modal
      visible={visible}
      title={`Nhập kho sản phẩm`}
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

        <Form.Item name="source" label="Kho">
            <SettingSelect
              notFoundContent="Không tìm thấy"
              showSearch
              placeholder="- Chọn -"
              optionFilterProp="children"
              type={SETTINGS_TYPE.SOURCE_OF_GOODS}
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
                  options={productOption}
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
