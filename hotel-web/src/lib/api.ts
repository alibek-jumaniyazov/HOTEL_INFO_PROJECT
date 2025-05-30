"use client";

// API Base Configuration
const API_BASE_URL = "http://localhost:3001/api";

// Types matching exact backend schema
export interface LoginCredentials {
  name: string;
  password: string;
}

export interface AuthResponse {
  admin?: {
    id: number;
    name: string;
    refreshToken: string;
    createdAt: string;
    updatedAt: string;
  };
  accessToken?: string;
  refreshToken?: string;
  message?: string;
  error?: string;
}

export interface RoomImage {
  id: number;
  url: string;
  roomId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: number;
  title: string;
  description: string;
  price: string;
  categoryId: number;
  amenities: string[];
  createdAt: string;
  updatedAt: string;
  images: RoomImage[];
  category: Category;
}

export interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  total?: number;
  page?: number;
  limit?: number;
  message?: string;
  error?: string;
}

export interface CreateRoomData {
  title: string;
  description: string;
  price: string;
  categoryId: number;
  amenities: string[];
  files?: File[];
}

export interface UpdateRoomData extends Partial<CreateRoomData> {
  deleteImages?: number[];
}

export interface CreateCategoryData {
  name: string;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {}

// Token Management
class TokenManager {
  private static readonly TOKEN_KEY = "admin-token";
  private static readonly REFRESH_TOKEN_KEY = "admin-refresh-token";

  // Access tokenni olish (localStorage dan)
  static getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Refresh tokenni olish
  static getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  // Yangi access token va refresh tokenni saqlash
  static setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);

    // Cookie ga ham tokenni yozish (agar kerak bo‘lsa)
    // max-age: 86400 sekund = 1 kun
    document.cookie = `admin-token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
  }

  // Tokenlarni tozalash (logout uchun)
  static clearTokens(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);

    // Cookie ni o‘chirib tashlash
    document.cookie =
      "admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
  }

  // Foydalanuvchi login qilinganligini tekshirish
  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export class ApiClient {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    let token = TokenManager.getToken();

    let headers: Record<string, string> = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    let config: RequestInit = {
      ...options,
      headers: {
        ...headers,
        ...(options.headers || {}),
      },
    };

    try {
      let response = await fetch(url, config);

      if (response.status === 401) {
        console.log("Token expired. Trying refresh...");

        const refreshed = await this.refreshToken();
        if (refreshed) {
          const newToken = TokenManager.getToken();

          const retryHeaders: Record<string, string> = {
            ...(newToken ? { Authorization: `Bearer ${newToken}` } : {}),
          };

          if (!(options.body instanceof FormData)) {
            retryHeaders["Content-Type"] = "application/json";
          }

          const retryConfig: RequestInit = {
            ...options,
            headers: {
              ...retryHeaders,
              ...(options.headers || {}),
            },
          };

          response = await fetch(url, retryConfig);
        } else {
          TokenManager.clearTokens();
          if (typeof window !== "undefined") {
            window.location.href = "/admin/login";
          }
          throw new Error("Authentication failed");
        }
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error("API Request failed:", error);
      throw error;
    }
  }

  private static async refreshToken(): Promise<boolean> {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });
      console.log("Refresh response:", response);
      if (!response.ok) return false;

      const data = await response.json();
      if (data.accessToken) {
        TokenManager.setTokens(data.accessToken, refreshToken);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  }

  static async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  static async post<T>(
    endpoint: string,
    data?: any,
    isFormData = false
  ): Promise<T> {
    if (isFormData) {
      return this.request<T>(endpoint, {
        method: "POST",
        body: data,
      });
    }
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async patch<T>(
    endpoint: string,
    data?: any,
    isFormData = false
  ): Promise<T> {
    if (isFormData) {
      return this.request<T>(endpoint, {
        method: "PATCH",
        body: data,
      });
    }
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

// Authentication API
export class AuthAPI {
  static async login(
    credentials: LoginCredentials
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok && data.accessToken && data.refreshToken) {
        TokenManager.setTokens(data.accessToken, data.refreshToken);
        return { success: true };
      }

      return {
        success: false,
        error: data.message || data.error || "Login jarayonida xatolik",
      };
    } catch (error) {
      console.error("Login failed:", error);
      return {
        success: false,
        error: "Serverga ulanishda xatolik",
      };
    }
  }

  static async logout(): Promise<void> {
    try {
      const token = TokenManager.getToken();
      if (token) {
        await fetch(`${API_BASE_URL}/admin/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).catch(() => {});
      }
    } finally {
      TokenManager.clearTokens();
    }
  }

  static isAuthenticated(): boolean {
    return TokenManager.isAuthenticated();
  }
}

// Categories API
export class CategoriesAPI {
  static async getAllCategories(): Promise<{
    success: boolean;
    data?: Category[];
    error?: string;
  }> {
    try {
      const response =
        await ApiClient.get<ApiResponse<Category[]>>("/category");
      return {
        success: true,
        data: response.data || [],
      };
    } catch (error: any) {
      console.error("Failed to fetch categories:", error);
      return {
        success: false,
        error: error.message || "Kategoriyalarni yuklashda xatolik",
      };
    }
  }

  static async getCategoryById(
    id: number
  ): Promise<{ success: boolean; data?: Category; error?: string }> {
    try {
      const response = await ApiClient.get<Category>(`/category/${id}`);
      return {
        success: true,
        data: response,
      };
    } catch (error: any) {
      console.error("Failed to fetch category:", error);
      return {
        success: false,
        error: error.message || "Kategoriyani yuklashda xatolik",
      };
    }
  }

  static async createCategory(
    categoryData: CreateCategoryData
  ): Promise<{ success: boolean; data?: Category; error?: string }> {
    try {
      const response = await ApiClient.post<Category>(
        "/category",
        categoryData
      );
      return {
        success: true,
        data: response,
      };
    } catch (error: any) {
      console.error("Failed to create category:", error);
      return {
        success: false,
        error: error.message || "Kategoriya yaratishda xatolik",
      };
    }
  }

  static async updateCategory(
    id: number,
    categoryData: UpdateCategoryData
  ): Promise<{ success: boolean; data?: Category; error?: string }> {
    try {
      const response = await ApiClient.patch<Category>(
        `/category/${id}`,
        categoryData
      );
      return {
        success: true,
        data: response,
      };
    } catch (error: any) {
      console.error("Failed to update category:", error);
      return {
        success: false,
        error: error.message || "Kategoriyani yangilashda xatolik",
      };
    }
  }

  static async deleteCategory(
    id: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await ApiClient.delete(`/category/${id}`);
      return { success: true };
    } catch (error: any) {
      console.error("Failed to delete category:", error);
      return {
        success: false,
        error: error.message || "Kategoriyani o'chirishda xatolik",
      };
    }
  }
}

// Rooms API
export class RoomsAPI {
  static async getAllRooms(): Promise<{
    success: boolean;
    data?: Room[];
    error?: string;
  }> {
    try {
      const response = await ApiClient.get<ApiResponse<Room[]>>("/rooms");
      return {
        success: true,
        data: response.data || [],
      };
    } catch (error: any) {
      console.error("Failed to fetch rooms:", error);
      return {
        success: false,
        error: error.message || "Xonalarni yuklashda xatolik",
      };
    }
  }

  static async getRoomsByCategory(
    categoryId: number
  ): Promise<{ success: boolean; data?: Room[]; error?: string }> {
    try {
      const response = await ApiClient.get<ApiResponse<Room[]>>(
        `/rooms?categoryId=${categoryId}`
      );
      return {
        success: true,
        data: response.data || [],
      };
    } catch (error: any) {
      console.error("Failed to fetch rooms by category:", error);
      return {
        success: false,
        error:
          error.message || "Kategoriyaga ko'ra xonalarni yuklashda xatolik",
      };
    }
  }

  static async getRoomById(
    id: number
  ): Promise<{ success: boolean; data?: Room; error?: string }> {
    try {
      const response = await ApiClient.get<Room>(`/rooms/${id}`);
      return {
        success: true,
        data: response,
      };
    } catch (error: any) {
      console.error("Failed to fetch room:", error);
      return {
        success: false,
        error: error.message || "Xonani yuklashda xatolik",
      };
    }
  }

  static async createRoom(
    roomData: CreateRoomData
  ): Promise<{ success: boolean; data?: Room; error?: string }> {
    try {
      // Handle file uploads with FormData
      if (roomData.files && roomData.files.length > 0) {
        const formData = new FormData();

        // Add text fields
        formData.append("title", roomData.title);
        formData.append("description", roomData.description);
        formData.append("price", roomData.price);
        formData.append("categoryId", roomData.categoryId.toString());
        formData.append("amenities", JSON.stringify(roomData.amenities));

        // Add files
        roomData.files.forEach((file) => {
          formData.append("files", file);
        });

        const response = await ApiClient.post<Room>("/rooms", formData, true);
        return {
          success: true,
          data: response,
        };
      } else {
        // No files, use regular JSON
        const { files, ...dataWithoutFiles } = roomData;
        const response = await ApiClient.post<Room>("/rooms", dataWithoutFiles);
        return {
          success: true,
          data: response,
        };
      }
    } catch (error: any) {
      console.error("Failed to create room:", error);
      return {
        success: false,
        error: error.message || "Xona yaratishda xatolik",
      };
    }
  }

  static async updateRoom(
    id: number,
    roomData: UpdateRoomData
  ): Promise<{ success: boolean; data?: Room; error?: string }> {
    try {
      // Handle file uploads with FormData
      if (roomData.files && roomData.files.length > 0) {
        const formData = new FormData();

        // Add text fields if they exist
        if (roomData.title) formData.append("title", roomData.title);
        if (roomData.description)
          formData.append("description", roomData.description);
        if (roomData.price) formData.append("price", roomData.price);
        if (roomData.categoryId)
          formData.append("categoryId", roomData.categoryId.toString());
        if (roomData.amenities)
          formData.append("amenities", JSON.stringify(roomData.amenities));

        // Add deleteImages if provided
        if (roomData.deleteImages && roomData.deleteImages.length > 0) {
          formData.append(
            "deleteImages",
            JSON.stringify(roomData.deleteImages)
          );
        }

        // Add files
        roomData.files.forEach((file) => {
          formData.append("files", file);
        });

        const response = await ApiClient.patch<Room>(
          `/rooms/${id}`,
          formData,
          true
        );
        return {
          success: true,
          data: response,
        };
      } else {
        // No files, use regular JSON
        const { files, ...dataWithoutFiles } = roomData;
        const response = await ApiClient.patch<Room>(
          `/rooms/${id}`,
          dataWithoutFiles
        );
        return {
          success: true,
          data: response,
        };
      }
    } catch (error: any) {
      console.error("Failed to update room:", error);
      return {
        success: false,
        error: error.message || "Xonani yangilashda xatolik",
      };
    }
  }

  static async deleteRoom(
    id: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await ApiClient.delete(`/rooms/${id}`);
      return { success: true };
    } catch (error: any) {
      console.error("Failed to delete room:", error);
      return {
        success: false,
        error: error.message || "Xonani o'chirishda xatolik",
      };
    }
  }
}

// Static Hotel API (frontend only)
export class HotelAPI {
  private static hotelData = {
    id: "1",
    name: "Luxury Hotel",
    description:
      "Toshkent markazida joylashgan zamonaviy 5 yulduzli mehmonxona. Biz mijozlarimizga eng yuqori sifatli xizmat va unutilmas tajriba taqdim etamiz.",
    address: "Toshkent, Amir Temur ko'chasi 15",
    phone: "+998 90 123 45 67",
    email: "info@luxuryhotel.uz",
    features: [
      "Bepul WiFi",
      "Parking",
      "Restaurant",
      "Fitnes zal",
      "Spa",
      "Biznes markaz",
    ],
    image: "",
    rating: 5.0,
    totalRooms: 150,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  static async getHotelInfo() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      success: true,
      data: this.hotelData,
    };
  }

  static async updateHotelInfo(data: any) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    this.hotelData = {
      ...this.hotelData,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return {
      success: true,
      data: this.hotelData,
      message: "Hotel ma'lumotlari muvaffaqiyatli yangilandi",
    };
  }
}

// Statistics API (using real rooms data)
export class StatsAPI {
  static async getDashboardStats() {
    try {
      const roomsResponse = await RoomsAPI.getAllRooms();
      const hotelResponse = await HotelAPI.getHotelInfo();

      if (roomsResponse.success && hotelResponse.success) {
        const rooms = roomsResponse.data || [];
        const totalRooms = rooms.length;
        // Simulate room statuses since backend doesn't have status field
        const availableRooms = Math.floor(totalRooms * 0.7);
        const occupiedRooms = Math.floor(totalRooms * 0.25);
        const maintenanceRooms = totalRooms - availableRooms - occupiedRooms;
        const occupancyRate =
          totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

        return {
          success: true,
          data: {
            totalRooms,
            availableRooms,
            occupiedRooms,
            maintenanceRooms,
            occupancyRate,
            hotelInfo: hotelResponse.data,
          },
        };
      }

      return {
        success: false,
        error: "Statistikalarni yuklashda xatolik",
      };
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      return {
        success: false,
        error: "Statistikalarni yuklashda xatolik yuz berdi",
      };
    }
  }
}

export { TokenManager };
