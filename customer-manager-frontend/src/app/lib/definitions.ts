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
  wardCode?: string;
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
  roleId: number;
};

export type UpdateUser = {
  name: string;
  roleId: number;
  password?: string;
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
    status?: string;
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
  productWarehouses: ProductWarehouses[];
};

export type ProductWarehouses = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  productId: string;
  quantityInStock: number;
  quantityInUse: number;
  displayQuantity: number;
  price: number;
  source: string;
  product?: Product;
  productWarehouseLogs?: ProductWarehouseLog[];
  note?: string;
};

export type NewProduct = { title: string; description: string; code: string };
//#endregion

export type ProductWarehouse = {
  productWarehouse: {
    source: string;
    quantityInStock: number;
    quantityInUse: number;
    price: number
  };
};

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
  updatedUserId?: string | null;
  customer: Customer;
  customerProductItems: CustomerProductItem[];
  createdUser: User;
  code?: string;
};

export type CustomerProductItem = {
  unitPrice: 10000;
  quantity: number;
  product: Product;
  source?: string;
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
    status?: string;
  };
};
//#endregion



export type UpdateCustomerProduct = {
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
  updateCustomerProduct: {
    code: string;
    customerId: string;
    updatedUserId: string;
    street: string;
    price: number;
    paymentMethod: string;
    shipMethod: string;
    status?: string;
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
  status: string;
  content: string; // ghi chú
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
  TASK_STATUS = "TASK_STATUS",
  ORDER_STATUS = "ORDER_STATUS",
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
export type TotalPriceByStatus = {
  value: number;
  status: string;
}
export type Pagination<T> = {
  items: T[];
  meta: PaginationMeta;

  //
  data?:T[];
  totalPrice?: number;
  totalPriceByStatus?: TotalPriceByStatus[]
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


export enum UserRole {
  Admin = 1,
  User = 2,
  Marketing = 3,
}

export type Role = {
  id: number;
  role: string;
  description: string;
};

export type ProductWarehouseLog = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  productId: string;
  quantityInStock: number;
  quantityInUse: number;
  displayQuantity: number;
  price: number;
  source: string;
  createdUserId: string;
  productWareHouseId: string;
  product: any;
  createdUser: {
    id: string;
    name: string;
    email: string;
    roleId: number;
    session: string;
    createdAt: string;
    updatedAt: string;
  };
};