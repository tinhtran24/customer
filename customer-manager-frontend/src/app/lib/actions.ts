"use server";
import {
  LoginPayload,
  NewAppointment,
  NewCustomer,
  NewCustomerProduct,
  NewProduct,
  NewUser,
  UpdateUser,
} from "@/app/lib/definitions";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { AuthApi, PublicApi } from "@/app/api/api";

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
    const res = await PublicApi.post("/auth/login", payload) ;
    if (res.status === 200) {
      localStorage.setItem('token', JSON.stringify(res));
    }
    return res
  } catch {
    return {
      statusCode: 500,
      message: "Có lỗi xảy ra. Không thể đăng nhập",
    };
  }
}

export async function logOut() {
  try {
    return await AuthApi.get('/auth/logout');
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
    const url = new URL('customers');
    Object.keys(queryParams).forEach((key) => {
      url.searchParams.append(key, queryParams[key]);
    });

    const res = await AuthApi.get(url.toString())

    if (!res) {
      throw new Error("Failed to fetch customers");
    }
    return await res;
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
}

export async function fetchUsers() {
  try {
    const url = new URL(`users`);
    const res = await AuthApi.get(url.toString())
    if (!res) {
      throw new Error("Failed to fetch customers");
    }
    return await res;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

//#region Product
export async function fetchAllProducts() {
  try {
    const url = new URL(`product?page=1&limit=10`);

    const res = await AuthApi.get(url.toString())
    if (!res) {
      throw new Error("Failed to fetch customers");
    }
    return res?.data.items || []; // Trả về danh sách items hoặc mảng rỗng nếu không có dữ liệu
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
}

export async function createProduct(body: NewProduct) {
  try {
    const url = "/product";
    const res = await AuthApi.post(url.toString(), body)
    if (!res) {
      throw new Error("Failed to fetch customers");
    }
    revalidatePath("/dashboard/products");
    return res;
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
    const url = "/product";
    const res = await AuthApi.patch(url.toString(), body)
    if (!res) {
      throw new Error("Failed to fetch customers");
    }
    revalidatePath("/dashboard/products");
    return res;
  } catch {
    return {
      statusCode: 500,
      message: "Có lỗi xảy ra. Không thể cập nhật thông tin người dùng",
    };
  }
}

export async function deleteProduct(id: string) {
  try {
    const url = `/product/${id}`;
    const res = await AuthApi.delete(url.toString())
    if (!res) {
      throw new Error("Failed to fetch customers");
    }
    revalidatePath("/dashboard/products");
    return res;
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
    const url = new URL(
      `customer-product/customer/` + customerId
    );

    const res = await AuthApi.get(url.toString())

    if (!res) {
      throw new Error("Failed to fetch customers");
    }
    const data = await res.data;
    return data.items || [];
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
}

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
