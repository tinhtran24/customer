"use client";
import { createNote } from "@/app/lib/actions";
import { CreateNote } from "@/app/lib/definitions";
import { Form, Input, Button, message } from "antd";
import { getNoteByCutomerId } from "@/app/lib/actions";
import { Note } from "@/app/lib/definitions";
import { List, Typography, Spin } from "antd";
import { useEffect, useState } from "react";
import { dayjs } from '../../utils/date';

const { Text } = Typography;

interface NoteListProps {
  isLoading: boolean;
  data: Note[];
}

function NoteList({ isLoading, data }: NoteListProps) {
  const buildMessages = (dataArray: Note[]) => {
    if (!dataArray) return [];

    return dataArray?.map((item) => {
      const date =  dayjs(new Date(item.createdAt));
      const formattedDate = date.local().format('DD/MM/YYYY HH:mm:ss')

      return `${formattedDate} : ${item.description}`;
    });
  };

  if (isLoading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "5rem 0",
        }}
      >
        <Spin size="large" />
      </div>
    );

  const messages = buildMessages(data);

  return (
    <List
      bordered
      dataSource={messages}
      renderItem={(message) => (
        <List.Item>
          <Text>{message}</Text>
        </List.Item>
      )}
      locale={{
        emptyText: "Chưa có ghi chú nào!", 
      }}
      style={{ margin: "0 auto" }}
    />
  );
}

interface DiscussFormProps {
  customerId: string;
}
const DiscussForm = ({ customerId }: DiscussFormProps) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Note[]>([]);

  const getData = async () => {
    setIsLoading(true);
    const notes = await getNoteByCutomerId(customerId);
    const sortedNotes = notes
      ? notes.sort(
          (a: Note, b: Note) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      : [];
    setData(sortedNotes || []);
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, [customerId]);

  const onFinish = async (values: any) => {
    setIsSubmitting(true);

    try {
      const body: CreateNote = {
        customerId: customerId,
        description: values.description,
      };

      const result = await createNote(body);
      if (result.statusCode) {
        message.error(
          Array.isArray(result.message) ? result.message[0] : result.message
        );
      } else {
        message.success("Lưu thông tin thành công");
        getData();
        form.resetFields();
      }
    } catch (error) {
      message.error("Đã có lỗi xảy ra khi gửi dữ liệu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="description"
          label="Nội dung"
          rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
        >
          <Input.TextArea placeholder="Nhập nội dung..." rows={4} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            Gửi
          </Button>
        </Form.Item>
      </Form>
      <NoteList isLoading={isLoading} data={data} />
    </>
  );
};

export default DiscussForm;
