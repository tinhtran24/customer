import { Flex, Divider, Spin } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Suspense } from "react";
import { shantell } from "@/app/utils/fontSetting";
import ProductTable from "@/app/components/Products/Table";
import { CreateProduct } from "@/app/components/Products/CreateProductButton";
import { fetchAllProducts } from "@/app/lib/actions";

export default async function ProductPage() {
  const products = await fetchAllProducts();

  return (
    <main>
      <AntdRegistry>
        <Flex justify="space-between" gap="large" vertical>
          <Flex justify="space-between" align="flex-end">
            <h2
              className={shantell.className}
              style={{
                color: "#8E3E63",
                alignItems: "end",
                padding: 0,
                margin: 0,
              }}
            >
              QUẢN LÝ SẢN PHẨM
            </h2>
            <CreateProduct />
          </Flex>
          <Divider style={{ margin: 0 }} />

          <Suspense fallback={<Spin size="large" />}>
            <ProductTable products={products} />
          </Suspense>
        </Flex>
      </AntdRegistry>
    </main>
  );
}
