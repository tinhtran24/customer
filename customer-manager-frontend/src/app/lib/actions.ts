"use server";
import {
  LoginPayload,
  NewAppointment,
  NewCustomer,
  NewCustomerProduct,
  NewProduct,
  NewUser,
  UpdateCustomer,
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

    if (!res.ok) {
      throw new Error("Failed to fetch users");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

//#region Product
export async function fetchAllProducts() {
  try {
    const accessToken = cookies().get("accessToken");
    const url = new URL(`${process.env.BACKEND_URL}/Product`);

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
    return data.items || []; // Trả về danh sách items hoặc mảng rỗng nếu không có dữ liệu
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
export async function createCustomerProduct(body: NewCustomerProduct) {
  const accessToken = cookies().get("accessToken");
  try {
    const url = process.env.BACKEND_URL + "/customer-product";
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
