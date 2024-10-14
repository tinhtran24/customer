"use client";
import { useState } from "react";
import { SETTINGS_TYPE, Task } from "@/app/lib/definitions";
import { FiEdit3 } from "react-icons/fi";
import { Button, Form, message, Modal } from "antd";
import Loading from "@/app/dashboard/loading";
import { SettingSelect } from "../Common/Select";
import { updateTask } from "@/app/lib/actions";

const cssButton: React.CSSProperties = {
  cursor: "pointer",
  color: "green",
};

export function ModalEdit({ task, refetch }: { task: Task; refetch: any }) {
  const [formModal] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openModal = async () => {
    setVisible(true);
  };

  const handleChangeTaskStatus = () => {
    formModal.validateFields().then(async (values) => {
      setIsLoading(true);
      try {
        const result = await updateTask({
          id: task.id,
          body: { status: values.status },
        });
        message.success("Cập nhật trạng thái công việc thành công");
        formModal.resetFields();
        refetch();
      } catch (error) {
      }
      setVisible(false);
      setIsLoading(false);
    });
  };

  return (
    <>
      <FiEdit3 onClick={() => openModal()} size={20} style={cssButton} />
      <Modal
        visible={visible}
        title="Cập nhật"
        onCancel={() => {
          setVisible(false);
        }}
        footer={[
          <Button key="back" onClick={() => setVisible(false)}>
            Thoát
          </Button>,
          <Button
            key="submit"
            type="primary"
            htmlType="submit"
            onClick={handleChangeTaskStatus}
            loading={isLoading}
          >
            Cập nhật
          </Button>,
        ]}
      >
        {!task ? (
          <Loading />
        ) : (
          <Form
            form={formModal}
            layout="vertical"
            style={{ marginTop: 24 }}
            initialValues={{
              status: task.status,
            }}
          >
            <Form.Item
              label="Trạng thái công việc"
              name="status"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn trạng thái công việc",
                },
              ]}
            >
              <SettingSelect
                type={SETTINGS_TYPE.TASK_STATUS}
                placeholder="- Chọn -"
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
}
