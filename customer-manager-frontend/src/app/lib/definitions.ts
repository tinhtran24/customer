export type Contact = {
  name: string;
  phone: string;
};

export type Customer = {
  id: string;
  fullName: string;
  taxCode: string;
  urn: string;
  street: string;
  contacts: Contact[];
  wardCode: string;
  ward: any;
  gender: string;
  totalOrder: number;
  status: string
};

export type CustomerDataType = {
  key: string;
  customerId: string;
  fullName: string;
  taxCode: string;
  urn: string;
  address: string;
  status: string;
  contacts: Contact[];
};

export type NewCustomer = {
  fullName: string;
  taxCode: string;
  urn: string;
  street: string;
  contacts: Contact[];
  wardCode: string;
  gender: string;
  totalOrder: number;
  status: string
};

export type UpdateCustomer = {
  fullName: string;
  taxCode: string;
  urn: string;
  street: string;
  contacts: Contact[];
  wardCode: string;
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
