export type Contact = {
  name: string;
  phone: string;
};

export type UserInCharger = {
  id: string;
  name: string;
  email: string;
  roleId: any;
  session: any;
  createdAt: string;
  updatedAt: string;
};

export type Customer = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  code: string;
  fullName: string;
  gender: string;
  street: string;
  contacts: any;
  wardCode: string;
  userInCharge: UserInCharger;
  status: string;
  callCountNumber?: number;
  group: string;
  source: string;
  totalOrder?: number;
  ward: any;
  userInChargeId: string;
  phoneNumber: string;
  note?: string;
};

export type Category = {
  key: string;
  name: string;
  total: number;
};

export type NewCustomer = {
  fullName: string;
  code?: string;
  gender: string;
  group: string;
  source: string;
  status: string;
  userInChargeId: string;
  street: string;
  contacts: any;
  wardCode: string;
  phoneNumber: string;
  note?: string;
};

export type UpdateCustomer = {
  fullName: string;
  code: string;
  gender: string;
  callCountNumber: number;
  totalOrder: number;
  group: string;
  source: string;
  status: string;
  userInChargeId: string;
  street: string;
  contacts: any;
};

export type LoginPayload = {
  email: string;
  password: string;
  remember: boolean;
};

export type UserCredentials = {
  accessToken: string;
  refreshToken: string;
};

export type JwtDecodedPayload = {
  sub: string;
  email: string;
  role: string;
  name: string;
  iat: number;
  exp: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  roleId: number;
  role: string;
};

export type UserDataType = {
  key: string;
  userId: string;
  name: string;
  email: string;
};

export type NewUser = {
  email: string;
  name: string;
  password: string;
};

export type UpdateUser = {
  name: string;
};

export type CreateCustomerAppointmentBody = {
  createScheduleDto: {
    customerId: string;
  };
  createTaskDto: {
    code: string;
    // label: string;
    userInChargeId: string;
    description: string;
    date: string;
  }[];
};

//#region product
export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  code: string;
};

export type NewProduct = { title: string; description: string; code: string };
//#endregion

//#region Customer product
export type CustomerProduct = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  customerId: string;
  productId: string;
  price: 10000;
  paymentMethod: string;
  shipMethod: string;
  street: string;
  shippingWardCode: string;
  createdUserId: string;
  updatedUserId: null;
  customer: Customer;
  customerProductItems: CustomerProductItem[];
  createdUser: User;
};

export type CustomerProductItem = {
  unitPrice: 10000;
  quantity: number;
  product: Product;
};

export type NewCustomerProduct = {
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
  createCustomerProduct: {
    code: string;
    customerId: string;
    createdUserId: string;
    street: string;
    price: number;
    paymentMethod: string;
    shipMethod: string;
  };
};
//#endregion

//#region Appointment
export type Appointment = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  customerId: string; // update later
  userInChargeId: string;
  customerGroup: string;
  userInCharge: User;
  customer: Customer;
};

export type NewAppointment = {
  customerId: string;
  userInChargeId: string;
  customerGroup: string;
};
//#endregion

//#region Task
export type Task = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  appoinmentId: string;
  code: string;
  label: string;
  description: string;
  date: string;
  userInChargeId: string;
  appoinment: Appointment;
  userInCharge: User;
};
//#endregion

//#region Note
export type Note = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  customerId: string;
  description: string;
  customer: Customer;
};

export type CreateNote = {
  customerId: string;
  description: string;
};

//#endregion

//#region  Setting
export enum SETTINGS_TYPE {
  STATUS = "STATUS",
  DELIVERY_METHOD = "DELIVERY_METHOD",
  PAYMENT_METHOD = "PAYMENT_METHOD",
  TASK_CODE = "TASK_CODE",
  CUSTOMER_SOURCE = "CUSTOMER_SOURCE",
  CUSTOMER_GROUP = "CUSTOMER_GROUP",
  SOURCE_OF_GOODS = "SOURCE_OF_GOODS",
}

export type Setting = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  label: string;
  key: string;
  type: SETTINGS_TYPE;
};

export type CreateSetting = {
  key: string;
  label: string;
  type: SETTINGS_TYPE;
};

export type UpdateSetting = {
  label: string;
};
//#endregion

export type PaginationMeta = {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
};

export type Pagination<T> = {
  items: T[];
  meta: PaginationMeta;
};

export enum ENUM_STATUS_TYPE {
  NEW_CUSTOMERS = "KH mới",
  NOT_RECEIVE_CALL = "KH Chưa nghe máy",
  POTENTIAL_CUSTOMERS = "KH tiềm năng",
  NON_EXIGENCY_CUSTOMERS = "KH không có nhu cầu",
  OLD_PATIENT = "BN Cũ",
  NEW_PATIENT = "BN Mới",
  CANCEL_PATIENT = "BN Bỏ",
  RE_TREATMENT_PATIENT = "BN Điều trị lại",
}
