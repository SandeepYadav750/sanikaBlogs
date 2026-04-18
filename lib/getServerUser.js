// lib/getServerUser.js
import { cookies } from "next/headers";

export async function getServerUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    // Decode JWT token
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );

    const userData = JSON.parse(jsonPayload);
    return userData;
  } catch (error) {
    console.error("Error getting user from cookie:", error);
    return null;
  }
}
