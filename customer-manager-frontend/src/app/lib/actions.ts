"use server";
import {
  CreateCustomerAppointmentBody,
  CreateNote,
  CreateSetting,
  LoginPayload,
  NewAppointment,
  NewCustomer,
  NewCustomerProduct,
  NewProduct,
  NewUser,
  UpdateSetting,
  UpdateUser,
} from "@/app/lib/definitions";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

export async function createCustomer(customer: NewCustomer) {
  const accessToken = cookies().get("accessToken");
  try {
    const url = process.env.BACKEND_URL + "/customers";
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(customer),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });
    revalidatePath("/dashboard/customers");
    return res.json();
  } catch {
    return {
      statusCode: 500,
      message: "Có lỗi xảy ra. Không tạo được khách hàng mới",
    };
  }
}

export async function updateCustomer(id: string, customer: NewCustomer) {
  try {
    const accessToken = cookies().get("accessToken");
    const url = process.env.BACKEND_URL + `/customers/${id}`;
    const res = await fetch(url, {
      method: "PATCH",
      body: JSON.stringify(customer),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });

    revalidatePath("/dashboard/customers");
    return res.json();
  } catch {
    return {
      statusCode: 500,
      message: "Có lỗi xảy ra. Không thể cập nhật thông tin khách hàng",
    };
  }
}

export async function deleteCustomer(id: string) {
  try {
    const accessToken = await cookies().get("accessToken");
    const url = process.env.BACKEND_URL + `/customers/${id}`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });

    revalidatePath("/dashboard/customers");
    return res.json();
  } catch {
    return {
      statusCode: 500,
      message: "Có lỗi xảy ra. Không thể xóa khách hàng",
    };
  }
}

export async function login(payload: LoginPayload) {
  try {
    const url = process.env.BACKEND_URL + "/auth/login";
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const parsedRes = await res.json();

    if ("accessToken" in parsedRes) {
      const { accessToken, refreshToken } = parsedRes;

      const accessTokenDecode = jwtDecode(accessToken);

      const refreshTokenDecode = jwtDecode(refreshToken);

      cookies().set({
        name: "accessToken",
        value: accessToken,
        secure: false,
        httpOnly: true,
        expires: payload.remember
          ? new Date(accessTokenDecode.exp! * 1000)
          : undefined,
      });

      cookies().set({
        name: "refreshToken",
        value: refreshToken,
        secure: false,
        httpOnly: true,
        expires: payload.remember
          ? new Date(refreshTokenDecode.exp! * 1000)
          : undefined,
      });
    }
    return parsedRes;
  } catch {
    return {
      statusCode: 500,
      message: "Có lỗi xảy ra. Không thể đăng nhập",
    };
  }
}

export async function logOut() {
  try {
    const accessToken = cookies().get("accessToken");
    const url = process.env.BACKEND_URL + `/auth/logout`;
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });

    cookies().delete("accessToken");
    cookies().delete("refreshToken");

    return await res.json();
  } catch {
    return {
      statusCode: 500,
      message: "Có lỗi xảy ra!",
    };
  }
}

export async function createUser(user: NewUser) {
  const accessToken = cookies().get("accessToken");
  try {
    const url = process.env.BACKEND_URL + "/users";
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });

    revalidatePath("/dashboard/admin");

    return res.json();
  } catch {
    return {
      statusCode: 500,
      message: "Có lỗi xảy ra. Không tạo được người dùng mới",
    };
  }
}

export async function updateUser(id: string, user: UpdateUser) {
  try {
    const accessToken = cookies().get("accessToken");
    const url = process.env.BACKEND_URL + `/users/${id}`;
    const res = await fetch(url, {
      method: "PATCH",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });

    revalidatePath("/dashboard/admin");
    return res.json();
  } catch {
    return {
      statusCode: 500,
      message: "Có lỗi xảy ra. Không thể cập nhật thông tin người dùng",
    };
  }
}

export async function deleteUser(id: string) {
  try {
    const accessToken = await cookies().get("accessToken");
    const url = process.env.BACKEND_URL + `/users/${id}`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });

    revalidatePath("/dashboard/admin");
    return res.json();
  } catch {
    return {
      statusCode: 500,
      message: "Có lỗi xảy ra. Không thể xóa người dùng",
    };
  }
}

export async function fetchCustomers(queryParams: Record<string, string>) {
  try {
    const accessToken = cookies().get("accessToken");
    const url = new URL(`${process.env.BACKEND_URL}/customers`);

    Object.keys(queryParams).forEach((key) => {
      url.searchParams.append(key, queryParams[key]);
    });

    const res = await fetch(url.toString(), {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return {
      statusCode: 500,
      message: error,
    };
  }
}

export async function fetchUsers() {
  try {
    const accessToken = cookies().get("accessToken");
    const url = new URL(`${process.env.BACKEND_URL}/users`);

    const res = await fetch(url.toString(), {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return {
      statusCode: 500,
      message: error,
    };
  }
}

export async function createAppointmentForCustomer(
  body: CreateCustomerAppointmentBody
) {
  const accessToken = cookies().get("accessToken");
  try {
    const url = process.env.BACKEND_URL + "/appoinment/task";
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });

    revalidatePath("/dashboard/products");

    return res.json();
  } catch {
    return {
      statusCode: 500,
      message: "Có lỗi xảy ra. Không tạo được sản phẩm mới",
    };
  }
}

export async function updateCustomersStatus(body: {
  ids: string[];
  status: string;
}) {
  const accessToken = cookies().get("accessToken");
  try {
    const url = process.env.BACKEND_URL + "/customers/status";
    const res = await fetch(url, {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });
    revalidatePath("/dashboard/cutomers");
    return res.json();
  } catch {
    return {
      statusCode: 500,
      message: "Có lỗi xảy ra. không thay đổi được status",
    };
  }
}

export async function updateUserIncharge(body: {
  ids: string[];
  userInChargeId: string;
}) {
  const accessToken = cookies().get("accessToken");
  try {
    const url = process.env.BACKEND_URL + "/customers/userIncharge";
    const res = await fetch(url, {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });
    revalidatePath("/dashboard/cutomers");
    return res.json();
  } catch {
    return {
      statusCode: 500,
      message: "Có lỗi xảy ra. không thay đổi được status",
    };
  }
}

//#region Product
export async function fetchAllProducts() {
  try {
    const accessToken = cookies().get("accessToken");
    const url = new URL(
      `${process.env.BACKEND_URL}/product?page=1&limit=9999999999`
    );

    const res = await fetch(url.toString(), {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch customers");
    }

    // Parse response và lấy items
    const data = await res.json();
    return data.items || [];
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
}

export async function createProduct(body: NewProduct) {
  const accessToken = cookies().get("accessToken");
  try {
    const url = process.env.BACKEND_URL + "/product";
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });

    revalidatePath("/dashboard/products");

    return res.json();
  } catch {
    return {
      statusCode: 500,
      message: "Có lỗi xảy ra. Không tạo được sản phẩm mới",
    };
  }
}
//#endregion

export async function updateProduct(id: string, body: NewProduct) {
  try {
    const accessToken = cookies().get("accessToken");
    const url = process.env.BACKEND_URL + `/product/${id}`;
    const res = await fetch(url, {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });

    revalidatePath("/dashboard/products");
    return res.json();
  } catch {
    return {
      statusCode: 500,
      message: "Có lỗi xảy ra. Không thể cập nhật thông tin người dùng",
    };
  }
}

export async function deleteProduct(id: string) {
  try {
    const accessToken = await cookies().get("accessToken");
    const url = process.env.BACKEND_URL + `/product/${id}`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });

    revalidatePath("/dashboard/products");
    return res.json();
  } catch {
    return {
      statusCode: 500,
      message: "Có lỗi xảy ra. Không thể xóa sản phẩm",
    };
  }
}

//#region Customer product
export async function fetchCustomerProducts(customerId: string) {
  try {
    const accessToken = cookies().get("accessToken");
    const url = new URL(
      `${process.env.BACKEND_URL}/customer-product/customer/` + customerId
    );

    const res = await fetch(url.toString(), {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });

    console.log(res);
    if (!res.ok) {
      throw new Error("Failed to fetch customers");
    }

    const data = await res.json();
    return data.items || [];
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
}

export async function createCustomerProduct(body: NewCustomerProduct) {
  const accessToken = cookies().get("accessToken");
  try {
    const url = process.env.BACKEND_URL + "/customer-product/order";
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });

    revalidatePath("/dashboard/customers");

    return res.json();
  } catch {
    return {
      statusCode: 500,
      message: "Có lỗi xảy ra. Không tạo được người dùng mới",
    };
  }
}

//#endregion

//#region Appointment
export async function fetchAllAppointments(
  queryParams: Record<string, string>
) {
  try {
    const accessToken = cookies().get("accessToken");
    const url = new URL(`${process.env.BACKEND_URL}/appoinment`);

    Object.keys(queryParams).forEach((key) => {
      url.searchParams.append(key, queryParams[key]);
    });

    const res = await fetch(url.toString(), {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch customers");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
}

export async function createAppointment(body: NewAppointment) {
  const accessToken = cookies().get("accessToken");
  try {
    const url = process.env.BACKEND_URL + "/appoinment";
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });

    revalidatePath("/dashboard/appointments");

    return res.json();
  } catch {
    return {
      statusCode: 500,
      message: "Có lỗi xảy ra. Không tạo được sản phẩm mới",
    };
  }
}

export async function updateAppointment(id: string, body: NewAppointment) {
  try {
    const accessToken = cookies().get("accessToken");
    const url = process.env.BACKEND_URL + `/appoinment/${id}`;
    const res = await fetch(url, {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });

    revalidatePath("/dashboard/appointments");
    return res.json();
  } catch {
    return {
      statusCode: 500,
      message: "Có lỗi xảy ra. Không thể cập nhật thông tin người dùng",
    };
  }
}

export async function deleteAppointment(id: string) {
  try {
    const accessToken = await cookies().get("accessToken");
    const url = process.env.BACKEND_URL + `/appoinment/${id}`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });

    revalidatePath("/dashboard/appointments");
    return res.json();
  } catch {
    return {
      statusCode: 500,
      message: "Có lỗi xảy ra. Không thể xóa sản phẩm",
    };
  }
}

//#endregion

//#region Task
export async function fetchAllTask(params?: { from?: string; to?: string }) {
  try {
    const accessToken = cookies().get("accessToken");
    const url = new URL(`${process.env.BACKEND_URL}/task`);

    url.searchParams.set("page", "1");
    url.searchParams.set("limit", "9999999999");

    if (params?.from) {
      url.searchParams.set("from", params.from);
    }
    if (params?.to) {
      url.searchParams.set("to", params.to);
    }

    const res = await fetch(url.toString(), {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch customers");
    }

    // Parse response và lấy items
    const data = await res.json();
    return data.items || [];
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
}

export async function fetchTaskByCustomerId(id: string) {
  try {
    const accessToken = cookies().get("accessToken");
    const url = new URL(
      `${process.env.BACKEND_URL}/task/customer/${id}?page=1&limit=9999999999`
    );

    const res = await fetch(url.toString(), {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch customers");
    }

    // Parse response và lấy items
    const data = await res.json();
    return data.items || [];
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
}
//#endregion

//#region Note
export async function getNoteByCutomerId(id: string) {
  const accessToken = cookies().get("accessToken");
  try {
    const accessToken = cookies().get("accessToken");
    const url = new URL(`${process.env.BACKEND_URL}/note/customer/${id}`);

    const res = await fetch(url.toString(), {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch customers");
    }

    const data = await res.json();
    return data.items || [];
  } catch {
    return {
      statusCode: 500,
      message: "Có lỗi xảy ra",
    };
  }
}

export async function createNote(body: CreateNote) {
  const accessToken = cookies().get("accessToken");
  try {
    const url = process.env.BACKEND_URL + "/note";
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });

    revalidatePath("/dashboard/customers");

    return res.json();
  } catch {
    return {
      statusCode: 500,
      message: "Có lỗi xảy ra. Không tạo được ghi chú",
    };
  }
}
//#endregion

//#region Settings
export async function fetchSettings(type: string) {
  try {
    const accessToken = cookies().get("accessToken");
    const url = new URL(
      `${process.env.BACKEND_URL}/setting/${type}?limit=9999&page=1`
    );

    const res = await fetch(url.toString(), {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch customers");
    }

    // Parse response và lấy items
    const data = await res.json();
    return data.items || [];
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
}

export async function createSettings(body: CreateSetting) {
  const accessToken = cookies().get("accessToken");
  try {
    const url = process.env.BACKEND_URL + "/setting";
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });

    revalidatePath("/dashboard/customers");

    return res.json();
  } catch {
    return {
      statusCode: 500,
      message: "Có lỗi xảy ra. Không tạo được sản phẩm mới",
    };
  }
}

export async function updateSettings(id: string, body: CreateSetting) {
  try {
    const accessToken = cookies().get("accessToken");
    const url = process.env.BACKEND_URL + `/setting/${id}`;
    const res = await fetch(url, {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });

    revalidatePath("/dashboard/customers");
    return res.json();
  } catch {
    return {
      statusCode: 500,
      message: "Có lỗi xảy ra. Không thể cập nhật thông tin",
    };
  }
}

export async function deleteSetting(id: string) {
  try {
    const accessToken = await cookies().get("accessToken");
    const url = process.env.BACKEND_URL + `/setting/${id}`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });

    revalidatePath("/dashboard/appointments");
    return res.json();
  } catch {
    return {
      statusCode: 500,
      message: "Có lỗi xảy ra. Không thể xóa thông tin",
    };
  }
}
//#endregion

//#region customer dashboard
export async function fetchCustomerDashboard(
  page: number,
  limit: number,
  customerName: string | null,
  saleName: string | null,
  source: string | null,
  from: string | null,
  to: string | null,
  customerStatus: string | null,
  status: string | null
) {
  try {
    const accessToken = cookies().get("accessToken");
    const url = new URL(
      `${process.env.BACKEND_URL}/customer-product/dashboard`
    );
    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", limit.toString());

    if (customerName) url.searchParams.append("customerName", customerName);
    if (saleName) url.searchParams.append("saleName", saleName);
    if (source) url.searchParams.append("source", source);
    if (from && to) {
      url.searchParams.append("from", from);
      url.searchParams.append("to", to);
    }
    if (customerStatus)
      url.searchParams.append("customerStatus", customerStatus);

    if (status)
      url.searchParams.append("status", status);

    const res = await fetch(url.toString(), {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return {
      statusCode: 500,
      message: error,
    };
  }
}

//#endregion

//#region Change pw
export async function changePassword(body: {
  newPassword: string;
  oldPassword: string;
}) {
  const accessToken = cookies().get("accessToken");
  try {
    const url = process.env.BACKEND_URL + "/auth/change-password";
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });

    revalidatePath("/dashboard/admin");

    return res.json();
  } catch {
    return {
      statusCode: 500,
      message: "Có lỗi xảy ra.",
    };
  }
}
//#endregion

//#region Chart
export async function getDataChart(params: {
  sale?: string | null;
  source?: string | null;
  from?: string | null;
  to?: string | null;
  year?: string | null;
}) {
  const { sale, source, from, to, year } = params;
  const accessToken = cookies().get("accessToken");

  try {
    const queryString = new URLSearchParams({
      ...(sale && { sale }),
      ...(source && { source }),
      ...(from && { from }),
      ...(to && { to }),
      ...(year && { year }),
    }).toString();

    const url = `${process.env.BACKEND_URL}/customer-product/chart${
      queryString ? `?${queryString}` : ""
    }`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });

    revalidatePath("/dashboard");

    const data = await res.json();
    return data.data || [];
  } catch {
    return {
      statusCode: 500,
      message: "Có lỗi xảy ra.",
    };
  }
}

//#endregion

export async function fetchCustomerStatus() {
  try {
    const accessToken = cookies().get("accessToken");
    const url = new URL(`${process.env.BACKEND_URL}/customers/status`);

    const res = await fetch(url.toString(), {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch customers");
    }

    // Parse response và lấy items
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
}

export async function updateCustomerProduct(params: {
  id: string;
  body: NewCustomerProduct;
}) {
  const accessToken = cookies().get("accessToken");
  try {
    const url =
      process.env.BACKEND_URL + `/customer-product/order/${params.id}`;
    const res = await fetch(url, {
      method: "PATCH",
      body: JSON.stringify(params.body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });

    revalidatePath("/dashboard/admin");

    return res.json();
  } catch {
    return {
      statusCode: 500,
      message: "Có lỗi xảy ra.",
    };
  }
}

export async function deleteOrder(id: string) {
  try {
    const accessToken = await cookies().get("accessToken");
    const url = process.env.BACKEND_URL + `/customer-product/${id}`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });

    revalidatePath("/dashboard/order");
    return res.json();
  } catch {
    return {
      statusCode: 500,
      message: "Có lỗi xảy ra. Không thể xóa thông tin",
    };
  }
}

export async function updateCustomerProductStatus(body: {
  ids: string[];
  status: string;
}) {
  const accessToken = cookies().get("accessToken");
  try {
    const url = process.env.BACKEND_URL + `/customer-product/status`;
    const res = await fetch(url, {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });

    revalidatePath("/dashboard/admin");

    return res.json();
  } catch {
    return {
      statusCode: 500,
      message: "Có lỗi xảy ra.",
    };
  }
}

export async function getToken() {
  return cookies().get("accessToken");
}

export async function getURL() {
  return process.env.BACKEND_URL;
}
