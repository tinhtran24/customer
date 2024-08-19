import { Contact, CustomerDataType } from "@/app/lib/definitions";
import { Modal, Button, Space, Divider, theme, Flex, Input } from "antd";
import {
  InfoCircleOutlined,
  ContactsOutlined,
  EnvironmentOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import CopyToClipboardInput from "@/app/components/Customers/CopyToClipboardInput";

export default function CustomerDetailModal({
  customer,
  isDetailModalOpen,
  setIsDetailModalOpen,
}: {
  customer: CustomerDataType;
  isDetailModalOpen: boolean;
  setIsDetailModalOpen: (v: boolean) => void;
}) {
  const {
    token: { colorPrimary },
  } = theme.useToken();

  const handleCloseUpdateModal = () => {
    setIsDetailModalOpen(false);
  };

  return (
    <Modal
      width={650}
      title={
        <>
          <Space size={"middle"}>
            <InfoCircleOutlined style={{ color: colorPrimary, fontSize: 18 }} />
            <span style={{ color: colorPrimary, fontSize: 16 }}>Chi tiết</span>
          </Space>
          <Divider style={{ margin: "10px 0px 25px 0px" }} />
        </>
      }
      open={isDetailModalOpen}
      footer={
        <>
          <Divider style={{ margin: "25px 0px 10px 0px" }} />

          <Button type="primary" onClick={() => handleCloseUpdateModal()}>
            OK
          </Button>
        </>
      }
      onCancel={() => handleCloseUpdateModal()}
      centered
    >
      <Flex justify="space-between">
        <Flex justify="flex-start" gap={"middle"} vertical>
          <CopyToClipboardInput
            value={customer.fullName}
            prefixIcon={<HomeOutlined style={{ padding: "0px 5px 0px 0px" }} />}
          />

          <CopyToClipboardInput
            value={customer.address}
            prefixIcon={
              <EnvironmentOutlined style={{ padding: "0px 5px 0px 0px" }} />
            }
          />

          <CopyToClipboardInput
            value={customer.taxCode}
            prefixIcon={
              <span style={{ padding: "0px 3px 0px 0px", fontSize: "8px" }}>
                MST
              </span>
            }
          />

          <CopyToClipboardInput
            value={customer.urn}
            prefixIcon={
              <span style={{ padding: "0px 3px 0px 0px", fontSize: "8px" }}>
                URN
              </span>
            }
          />
        </Flex>

        <Flex gap={"middle"} vertical>
          {customer.contacts?.map((contact: Contact, index) => {
            return (
              <CopyToClipboardInput
                key={`customer-contacts-${index}`}
                value={`${contact.name} - ${contact.phone}`}
                prefixIcon={
                  <ContactsOutlined style={{ padding: "0px 5px 0px 0px" }} />
                }
              />
            );
          })}
        </Flex>
      </Flex>
    </Modal>
  );
}
