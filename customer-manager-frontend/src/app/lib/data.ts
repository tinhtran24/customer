import { cookies } from "next/headers";

export async function fetchAllProvinces() {
  try {
    const url = process.env.BACKEND_URL + "/addresses";
    const res = await fetch(url, { cache: "no-store" });
    const allProvinces = await res.json();
    return allProvinces;
  } catch {
    return [];
  }
}

export async function fetchAllCustomers(queryParams: Record<string, string>) {
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
    return data.items || []; 
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
}

export async function fetchCustomerById(id: string) {
  try {
    const accessToken = cookies().get("accessToken");
    const url = process.env.BACKEND_URL + `/customers/${id}`;
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });
    const customer = await res.json();

    if (customer.statusCode === 404) {
      return null;
    }

    return customer;
  } catch {
    return {};
  }
}

export async function getUserProfile() {
  try {
    const accessToken = cookies().get("accessToken");
    const url = process.env.BACKEND_URL + `/profile`;
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });
    const userProfile = await res.json();

    return userProfile;
  } catch {
    return null;
  }
}

export async function fetchAllUsers() {
  try {
    const accessToken = cookies().get("accessToken");
    const url = process.env.BACKEND_URL + "/users";
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });
    const allUsers = await res.json();
    return allUsers;
  } catch {
    return [];
  }
}

export async function fetchUserById(id: string) {
  try {
    const accessToken = cookies().get("accessToken");
    const url = process.env.BACKEND_URL + `/users/${id}`;
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });
    const user = await res.json();

    if (user.statusCode === 404) {
      return null;
    }

    return user;
  } catch {
    return {};
  }
}
