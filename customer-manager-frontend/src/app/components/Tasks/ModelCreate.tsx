import { Button, DatePicker, Form, Input, message, Modal } from "antd";
import { SettingSelect } from "@/app/components/Common/Select";
import { CreateCustomerAppointmentBody, SETTINGS_TYPE, Task } from "@/app/lib/definitions";
import { useState } from "react";
import { generateCode } from "@/app/utils/generateString";
import { createAppointmentForCustomer } from "@/app/lib/actions";
import { useAuthContext } from "@/app/components/auth";

export function ModelCreate({ customerId, refetch , isModalVisible, setIsModalVisible}: { customerId: string; refetch: any, isModalVisible: boolean, setIsModalVisible: any }) {
    const [formModal] = Form.useForm();
    const { currentUser } = useAuthContext();
    const [isLoadingForm, setIsLoadingForm] = useState(false);

    const handleOk = () => {
        formModal
            .validateFields()
            .then(async (values) => {
                try {
                    setIsLoadingForm(true);
                    const body: CreateCustomerAppointmentBody = {
                        createScheduleDto: {
                            customerId: customerId,
                        },
                        createTaskDto: [
                            {
                                code: generateCode("LH", new Date(), Date.now().valueOf()),
                                description: values.content,
                                date: values.date,
                                status: values.taskStatus,
                                // label: values.label,
                                userInChargeId: (currentUser as any).sub,
                            },
                        ],
                    };

                    const result = await createAppointmentForCustomer(body);
                    if (result.statusCode) {
                        message.error(
                            Array.isArray(result.message) ? result.message[0] : result.message
                        );
                    } else {
                        message.success("Tạo lịch hẹn thành công");
                        formModal.resetFields();
                        setIsModalVisible(false);
                        refetch();
                    }
                } catch (error) {
                    message.error("Đã có lỗi xảy ra khi gửi dữ liệu.");
                } finally {
                    setIsLoadingForm(false);
                }
            })
            .catch((info) => {
                console.log("Validate Failed:", info);
            });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <>
            <Modal
                title="Thêm lịch hẹn"
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
                        form="LHForm"
                        loading={isLoadingForm}
                    >
                        Thêm
                    </Button>,
                ]}
            >
                <Form
                    form={formModal}
                    id="LHForm"
                    layout="vertical"
                    onFinish={handleOk}
                    initialValues={{ taskStatus: "Mới" }}
                >
                    <Form.Item
                        name="date"
                        label="Ngày hẹn"
                        rules={[{ required: true, message: "Vui lòng chọn ngày hẹn" }]}
                    >
                        <DatePicker
                            placeholder="Chọn ngày ..."
                            style={{width: "100%"}}
                        />
                    </Form.Item>

                    <Form.Item
                        name="content"
                        label="Nội dung"
                        rules={[{ required: true, message: "Vui lòng thêm chi tiết" }]}
                    >
                        <Input.TextArea placeholder="Chi tiết..." />
                    </Form.Item>

                    <Form.Item
                        name="taskStatus"
                        label="Trạng thái công việc"
                        rules={[
                            { required: true, message: "Vui lòng trạng thái công việc" },
                        ]}
                    >
                        <SettingSelect
                            notFoundContent="Không tìm thấy"
                            showSearch
                            placeholder="- Chọn -"
                            optionFilterProp="children"
                            type={SETTINGS_TYPE.TASK_STATUS}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}