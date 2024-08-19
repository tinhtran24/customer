import { REQUIRED_FIELD } from "@/app/lib/messages";
import z from "zod";

export const CustomerFormSchema = z.object({
  id: z.number(),
  taxCode: z.string().optional().nullish(),
  urn: z.string().optional().nullish(),
  fullName: z
    .string({
      required_error: REQUIRED_FIELD,
    })
    .min(1, REQUIRED_FIELD),
  street: z.string().optional().nullish(),
  ward: z
    .string({
      required_error: REQUIRED_FIELD,
      invalid_type_error: "Chưa chọn Phường/Xã",
    })
    .min(1, REQUIRED_FIELD),
});

export const CreateCustomerFormSchema = CustomerFormSchema.omit({ id: true });

export const UpdateCustomerFormSchema = CustomerFormSchema.omit({ id: true });
