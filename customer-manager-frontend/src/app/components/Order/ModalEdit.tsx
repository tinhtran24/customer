"use client";
import { useState } from "react";
import OrderProduct, {
  OrderData,
  PaymentInformation,
} from "../Customers/Order";
import { CustomerProduct, Product } from "@/app/lib/definitions";
import { FiEdit3 } from "react-icons/fi";
import { Modal } from "antd";
import Loading from "@/app/dashboard/loading";

const cssButton: React.CSSProperties = {
  cursor: "pointer",
  color: "green",
};

export function ModalEdit({
  customerProduct,
  stateUtil,
  refetch,
}: {
  customerProduct: CustomerProduct;
  stateUtil: { products: Product[]; provinces: any[] };
  refetch: any;
}) {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<{
    id: string;
    products: OrderData[];
    paymentInformation: PaymentInformation;
  }>();

  const openModal = async () => {
    setVisible(true);
    const products: OrderData[] = customerProduct.customerProductItems.map(
      (i, index) => ({
        no: index + 1,
        product: i.product,
        price: i.unitPrice,
        quantity: i.quantity,
        code: i.product.code,
        totalPrice: i.quantity * i.unitPrice,
        source: i.source || "",
      })
    );
    const info: PaymentInformation = {
      code: customerProduct.code || "",
      street: customerProduct.street,
      price: customerProduct.price,
      PaymentMethod: customerProduct.paymentMethod,
      ShipMethod: customerProduct.shipMethod,
      createdUserId: customerProduct.createdUserId,
    };

    setSelected((prevState) => ({
      ...prevState,
      id: customerProduct.id,
      products: products,
      paymentInformation: info,
    }));
  };

  return (
    <>
      <FiEdit3 onClick={() => openModal()} size={20} style={cssButton} />
      <Modal
        visible={visible}
        title="Cập nhật"
        onCancel={() => {
          setVisible(false);
          setSelected(undefined);
        }}
        width={"80%"}
        footer={[]}
      >
        {!customerProduct || !stateUtil || !stateUtil.products ? (
          <Loading />
        ) : (
          <OrderProduct
            products={stateUtil.products}
            customer={customerProduct.customer}
            provinces={[]}
            initData={selected}
            refetch={() => {
              setVisible(false);
              refetch();
            }}
            sourceSelectedInit={selected?.products[0].source || undefined}
          />
        )}
      </Modal>
    </>
  );
}
