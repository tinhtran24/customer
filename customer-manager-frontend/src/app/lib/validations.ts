import { REQUIRED_FIELD } from "@/app/lib/messages";
import z from "zod";

export const CustomerFormSchema = z.object({
  id: z.number(),
  fullName: z
    .string({
      required_error: REQUIRED_FIELD,
    })
    .min(1, REQUIRED_FIELD),
  source: z
    .string({
      required_error: REQUIRED_FIELD,
    })
    .min(1, REQUIRED_FIELD),
  group: z
    .string({
      required_error: REQUIRED_FIELD,
    })
    .min(1, REQUIRED_FIELD),
  code: z
    .string({
      required_error: REQUIRED_FIELD,
    })
    .min(1, REQUIRED_FIELD),
  phoneNumber: z
    .string({
      required_error: REQUIRED_FIELD,
    })
    .min(1, REQUIRED_FIELD),
  // street: z.string({
  //   required_error: REQUIRED_FIELD,
  // }),
  // ward: z
  //   .string({
  //     required_error: REQUIRED_FIELD,
  //     invalid_type_error: "Chưa chọn Tỉnh/Thành",
  //   })
  //   .min(1, REQUIRED_FIELD),
  // province: z
  //   .string({
  //     required_error: REQUIRED_FIELD,
  //     invalid_type_error: "Chưa chọn Quận/Huyện",
  //   })
  //   .min(1, REQUIRED_FIELD),
  // district: z
  //   .string({
  //     required_error: REQUIRED_FIELD,
  //     invalid_type_error: "Chưa chọn Phường/Xã",
  //   })
  //   .min(1, REQUIRED_FIELD),
});

export const CreateCustomerFormSchema = CustomerFormSchema.omit({ id: true });

export const UpdateCustomerFormSchema = CustomerFormSchema.omit({ id: true });
