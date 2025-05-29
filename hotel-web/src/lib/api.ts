"use client"

// API Base Configuration
const API_BASE_URL = "http://localhost:3001/api"

// Types matching exact backend schema
export interface LoginCredentials {
  name: string
  password: string
}

export interface AuthResponse {
  admin?: {
    id: number
    name: string
    refreshToken: string
    createdAt: string
    updatedAt: string
  }
  accessToken?: string
  refreshToken?: string
  message?: string
  error?: string
}

export interface RoomImage {
  id: number
  url: string
  roomId: number
  createdAt: string
  updatedAt: string
}

export interface Room {
  id: number
  title: string
  description: string
  price: string
  categoryId: number
  amenities: string[]
  createdAt: string
  updatedAt: string
  images: RoomImage[]
  category: Category
}

export interface Category {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T = any> {
  data?: T
  total?: number
  page?: number
  limit?: number
  message?: string
  error?: string
}

export interface CreateRoomData {
  title: string
  description: string
  price: string
  categoryId: number
  amenities: string[]
  files?: File[]
}

export interface UpdateRoomData extends Partial<CreateRoomData> {
  deleteImages?: number[]
}

export interface CreateCategoryData {
  name: string
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {}

// Token Management with automatic refresh
class TokenManager {
  private static readonly TOKEN_KEY = "admin-token"
  private static readonly REFRESH_TOKEN_KEY = "admin-refresh-token"
  private static readonly TOKEN_EXPIRY_KEY = "admin-token-expiry"
  private static readonly USER_KEY = "admin-user"

  // Token expires in 2 hours (7200 seconds)
  private static readonly TOKEN_EXPIRY_TIME = 2 * 60 * 60 * 1000 // 2 hours in milliseconds

  static getToken(): string | null {
    if (typeof window === "undefined") return null

    const token = localStorage.getItem(this.TOKEN_KEY)
    const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY)

    if (!token || !expiry) return null

    // Check if token is expired
    if (Date.now() > Number.parseInt(expiry)) {
      console.log("Access token expired, clearing...")
      this.clearTokens()
      return null
    }

    return token
  }

  static getRefreshToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(this.REFRESH_TOKEN_KEY)
  }

  static getUser(): any {
    if (typeof window === "undefined") return null
    const user = localStorage.getItem(this.USER_KEY)
    return user ? JSON.parse(user) : null
  }

  static setTokens(accessToken: string, refreshToken: string, user?: any): void {
    if (typeof window === "undefined") return

    const expiryTime = Date.now() + this.TOKEN_EXPIRY_TIME

    localStorage.setItem(this.TOKEN_KEY, accessToken)
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken)
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString())

    if (user) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user))
    }

    // Set cookie for middleware
    document.cookie = `admin-token=${accessToken}; path=/; max-age=7200` // 2 hours

    console.log("Tokens set successfully", {
      accessToken: accessToken.substring(0, 20) + "...",
      expiresAt: new Date(expiryTime).toLocaleString(),
    })
  }

  static clearTokens(): void {
    if (typeof window === "undefined") return

    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.REFRESH_TOKEN_KEY)
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY)
    localStorage.removeItem(this.USER_KEY)

    // Clear cookie
    document.cookie = "admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

    console.log("All tokens cleared")
  }

  static isAuthenticated(): boolean {
    return !!this.getToken()
  }

  static isTokenExpiringSoon(): boolean {
    if (typeof window === "undefined") return false

    const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY)
    if (!expiry) return false

    const expiryTime = Number.parseInt(expiry)
    const now = Date.now()
    const timeUntilExpiry = expiryTime - now

    // Return true if token expires in less than 5 minutes
    return timeUntilExpiry < 5 * 60 * 1000
  }

  static getTokenExpiryTime(): Date | null {
    if (typeof window === "undefined") return null

    const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY)
    return expiry ? new Date(Number.parseInt(expiry)) : null
  }
}

// HTTP Client with automatic token handling and refresh
class ApiClient {
  private static isRefreshing = false
  private static refreshPromise: Promise<boolean> | null = null

  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    // Get current token
    let token = TokenManager.getToken()

    // If token is expiring soon, try to refresh it
    if (token && TokenManager.isTokenExpiringSoon() && !this.isRefreshing) {
      console.log("Token expiring soon, attempting refresh...")
      await this.refreshToken()
      token = TokenManager.getToken()
    }

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    // Remove Content-Type header if FormData is being sent
    if (options.body instanceof FormData) {
      delete (config.headers as any)["Content-Type"]
    }

    try {
      const response = await fetch(url, config)

      // Handle 401 - Token expired or invalid
      if (response.status === 401) {
        console.log("Received 401, attempting token refresh...")

        const refreshed = await this.refreshToken()
        if (refreshed) {
          // Retry the original request with new token
          const newToken = TokenManager.getToken()
          const retryConfig: RequestInit = {
            ...config,
            headers: {
              ...config.headers,
              Authorization: `Bearer ${newToken}`,
            },
          }

          console.log("Retrying request with new token...")
          const retryResponse = await fetch(url, retryConfig)

          if (!retryResponse.ok) {
            const retryData = await retryResponse.json()
            throw new Error(retryData.message || retryData.error || `HTTP error! status: ${retryResponse.status}`)
          }

          return await retryResponse.json()
        } else {
          // Refresh failed, redirect to login
          console.log("Token refresh failed, redirecting to login...")
          TokenManager.clearTokens()
          if (typeof window !== "undefined") {
            window.location.href = "/admin/login"
          }
          throw new Error("Authentication failed")
        }
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error("API Request failed:", error)
      throw error
    }
  }

  private static async refreshToken(): Promise<boolean> {
    // Prevent multiple simultaneous refresh attempts
    if (this.isRefreshing) {
      if (this.refreshPromise) {
        return await this.refreshPromise
      }
      return false
    }

    this.isRefreshing = true

    this.refreshPromise = (async () => {
      try {
        const refreshToken = TokenManager.getRefreshToken()
        if (!refreshToken) {
          console.log("No refresh token available")
          return false
        }

        console.log("Attempting to refresh token...")

        const response = await fetch(`${API_BASE_URL}/admin/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        })

        if (response.ok) {
          const data = await response.json()

          if (data.accessToken && data.refreshToken) {
            console.log("Token refresh successful")
            TokenManager.setTokens(data.accessToken, data.refreshToken, data.admin)
            return true
          } else {
            console.log("Invalid refresh response:", data)
            return false
          }
        } else {
          const errorData = await response.json()
          console.log("Token refresh failed:", errorData)
          return false
        }
      } catch (error) {
        console.error("Token refresh error:", error)
        return false
      } finally {
        this.isRefreshing = false
        this.refreshPromise = null
      }
    })()

    return await this.refreshPromise
  }

  static async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  static async post<T>(endpoint: string, data?: any, isFormData = false): Promise<T> {
    if (isFormData) {
      return this.request<T>(endpoint, {
        method: "POST",
        body: data,
      })
    }
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  static async patch<T>(endpoint: string, data?: any, isFormData = false): Promise<T> {
    if (isFormData) {
      return this.request<T>(endpoint, {
        method: "PATCH",
        body: data,
      })
    }
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  static async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }

  // Manual token refresh method
  static async forceRefreshToken(): Promise<boolean> {
    return this.refreshToken()
  }
}

// Authentication API
export class AuthAPI {
  static async login(credentials: LoginCredentials): Promise<{ success: boolean; error?: string; user?: any }> {
    try {
      console.log("Attempting login...")

      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (response.ok && data.accessToken && data.refreshToken) {
        console.log("Login successful")
        TokenManager.setTokens(data.accessToken, data.refreshToken, data.admin)

        return {
          success: true,
          user: data.admin,
        }
      }

      return {
        success: false,
        error: data.message || data.error || "Login jarayonida xatolik",
      }
    } catch (error) {
      console.error("Login failed:", error)
      return {
        success: false,
        error: "Serverga ulanishda xatolik",
      }
    }
  }

  static async logout(): Promise<void> {
    try {
      const token = TokenManager.getToken()
      if (token) {
        console.log("Logging out...")
        await fetch(`${API_BASE_URL}/admin/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).catch(() => {
          // Ignore logout endpoint errors
        })
      }
    } finally {
      TokenManager.clearTokens()
      console.log("Logout completed")
    }
  }

  static isAuthenticated(): boolean {
    return TokenManager.isAuthenticated()
  }

  static getUser(): any {
    return TokenManager.getUser()
  }

  static getTokenExpiryTime(): Date | null {
    return TokenManager.getTokenExpiryTime()
  }

  static async refreshToken(): Promise<boolean> {
    return ApiClient.forceRefreshToken()
  }
}

// Categories API
export class CategoriesAPI {
  static async getAllCategories(): Promise<{ success: boolean; data?: Category[]; error?: string }> {
    try {
      const response = await ApiClient.get<ApiResponse<Category[]>>("/category")
      return {
        success: true,
        data: response.data || [],
      }
    } catch (error: any) {
      console.error("Failed to fetch categories:", error)
      return {
        success: false,
        error: error.message || "Kategoriyalarni yuklashda xatolik",
      }
    }
  }

  static async getCategoryById(id: number): Promise<{ success: boolean; data?: Category; error?: string }> {
    try {
      const response = await ApiClient.get<Category>(`/category/${id}`)
      return {
        success: true,
        data: response,
      }
    } catch (error: any) {
      console.error("Failed to fetch category:", error)
      return {
        success: false,
        error: error.message || "Kategoriyani yuklashda xatolik",
      }
    }
  }

  static async createCategory(
    categoryData: CreateCategoryData,
  ): Promise<{ success: boolean; data?: Category; error?: string }> {
    try {
      const response = await ApiClient.post<Category>("/category", categoryData)
      return {
        success: true,
        data: response,
      }
    } catch (error: any) {
      console.error("Failed to create category:", error)
      return {
        success: false,
        error: error.message || "Kategoriya yaratishda xatolik",
      }
    }
  }

  static async updateCategory(
    id: number,
    categoryData: UpdateCategoryData,
  ): Promise<{ success: boolean; data?: Category; error?: string }> {
    try {
      const response = await ApiClient.patch<Category>(`/category/${id}`, categoryData)
      return {
        success: true,
        data: response,
      }
    } catch (error: any) {
      console.error("Failed to update category:", error)
      return {
        success: false,
        error: error.message || "Kategoriyani yangilashda xatolik",
      }
    }
  }

  static async deleteCategory(id: number): Promise<{ success: boolean; error?: string }> {
    try {
      await ApiClient.delete(`/category/${id}`)
      return { success: true }
    } catch (error: any) {
      console.error("Failed to delete category:", error)
      return {
        success: false,
        error: error.message || "Kategoriyani o'chirishda xatolik",
      }
    }
  }
}

// Rooms API
export class RoomsAPI {
  static async getAllRooms(): Promise<{ success: boolean; data?: Room[]; error?: string }> {
    try {
      const response = await ApiClient.get<ApiResponse<Room[]>>("/rooms")
      return {
        success: true,
        data: response.data || [],
      }
    } catch (error: any) {
      console.error("Failed to fetch rooms:", error)
      return {
        success: false,
        error: error.message || "Xonalarni yuklashda xatolik",
      }
    }
  }

  static async getRoomById(id: number): Promise<{ success: boolean; data?: Room; error?: string }> {
    try {
      const response = await ApiClient.get<Room>(`/rooms/${id}`)
      return {
        success: true,
        data: response,
      }
    } catch (error: any) {
      console.error("Failed to fetch room:", error)
      return {
        success: false,
        error: error.message || "Xonani yuklashda xatolik",
      }
    }
  }

  static async createRoom(roomData: CreateRoomData): Promise<{ success: boolean; data?: Room; error?: string }> {
    try {
      // Handle file uploads with FormData
      if (roomData.files && roomData.files.length > 0) {
        const formData = new FormData()

        // Add text fields
        formData.append("title", roomData.title)
        formData.append("description", roomData.description)
        formData.append("price", roomData.price)
        formData.append("categoryId", roomData.categoryId.toString())

        // Amenities ni to'g'ri formatda qo'shish
        roomData.amenities.forEach((amenity) => {
          formData.append("amenities[]", amenity)
        })

        // Add files
        roomData.files.forEach((file) => {
          formData.append("files", file)
        })

        console.log("Creating room with FormData:", {
          title: roomData.title,
          amenities: roomData.amenities,
          files: roomData.files.length,
        })

        const response = await ApiClient.post<Room>("/rooms", formData, true)
        return {
          success: true,
          data: response,
        }
      } else {
        // No files, use regular JSON
        const { files, ...dataWithoutFiles } = roomData
        console.log("Creating room with JSON:", dataWithoutFiles)
        const response = await ApiClient.post<Room>("/rooms", dataWithoutFiles)
        return {
          success: true,
          data: response,
        }
      }
    } catch (error: any) {
      console.error("Failed to create room:", error)
      return {
        success: false,
        error: error.message || "Xona yaratishda xatolik",
      }
    }
  }

  static async updateRoom(
    id: number,
    roomData: UpdateRoomData,
  ): Promise<{ success: boolean; data?: Room; error?: string }> {
    try {
      // Handle file uploads with FormData
      if (roomData.files && roomData.files.length > 0) {
        const formData = new FormData()

        // Add text fields if they exist
        if (roomData.title) formData.append("title", roomData.title)
        if (roomData.description) formData.append("description", roomData.description)
        if (roomData.price) formData.append("price", roomData.price)
        if (roomData.categoryId) formData.append("categoryId", roomData.categoryId.toString())

        // Amenities ni to'g'ri formatda qo'shish
        if (roomData.amenities) {
          roomData.amenities.forEach((amenity) => {
            formData.append("amenities[]", amenity)
          })
        }

        // Add deleteImages if provided
        if (roomData.deleteImages && roomData.deleteImages.length > 0) {
          roomData.deleteImages.forEach((imageId) => {
            formData.append("deleteImages[]", imageId.toString())
          })
        }

        // Add files
        roomData.files.forEach((file) => {
          formData.append("files", file)
        })

        console.log("Updating room with FormData:", {
          id,
          title: roomData.title,
          amenities: roomData.amenities,
          files: roomData.files.length,
          deleteImages: roomData.deleteImages,
        })

        const response = await ApiClient.patch<Room>(`/rooms/${id}`, formData, true)
        return {
          success: true,
          data: response,
        }
      } else {
        // No files, use regular JSON
        const { files, ...dataWithoutFiles } = roomData
        console.log("Updating room with JSON:", { id, ...dataWithoutFiles })
        const response = await ApiClient.patch<Room>(`/rooms/${id}`, dataWithoutFiles)
        return {
          success: true,
          data: response,
        }
      }
    } catch (error: any) {
      console.error("Failed to update room:", error)
      return {
        success: false,
        error: error.message || "Xonani yangilashda xatolik",
      }
    }
  }

  static async deleteRoom(id: number): Promise<{ success: boolean; error?: string }> {
    try {
      await ApiClient.delete(`/rooms/${id}`)
      return { success: true }
    } catch (error: any) {
      console.error("Failed to delete room:", error)
      return {
        success: false,
        error: error.message || "Xonani o'chirishda xatolik",
      }
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
    features: ["Bepul WiFi", "Parking", "Restaurant", "Fitnes zal", "Spa", "Biznes markaz"],
    image: "/placeholder.svg?height=600&width=800",
    rating: 5.0,
    totalRooms: 150,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  static async getHotelInfo() {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return {
      success: true,
      data: this.hotelData,
    }
  }

  static async updateHotelInfo(data: any) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    this.hotelData = {
      ...this.hotelData,
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return {
      success: true,
      data: this.hotelData,
      message: "Hotel ma'lumotlari muvaffaqiyatli yangilandi",
    }
  }
}

// Statistics API (using real rooms data)
export class StatsAPI {
  static async getDashboardStats() {
    try {
      const roomsResponse = await RoomsAPI.getAllRooms()
      const hotelResponse = await HotelAPI.getHotelInfo()

      if (roomsResponse.success && hotelResponse.success) {
        const rooms = roomsResponse.data || []
        const totalRooms = rooms.length
        // Simulate room statuses since backend doesn't have status field
        const availableRooms = Math.floor(totalRooms * 0.7)
        const occupiedRooms = Math.floor(totalRooms * 0.25)
        const maintenanceRooms = totalRooms - availableRooms - occupiedRooms
        const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0

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
        }
      }

      return {
        success: false,
        error: "Statistikalarni yuklashda xatolik",
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
      return {
        success: false,
        error: "Statistikalarni yuklashda xatolik yuz berdi",
      }
    }
  }
}

export { TokenManager }
