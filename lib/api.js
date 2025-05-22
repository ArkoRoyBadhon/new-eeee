export const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://fff-3755.onrender.com/api";

// Helper function to handle API requests
const apiRequest = async (
  endpoint,
  method = "GET",
  data = null,
  token = null
) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Something went wrong");
    }

    return responseData;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
};

// Auth API
export const authApi = {
  register: (userData) => apiRequest("/auth/register", "POST", userData),
  login: (credentials) => apiRequest("/auth/login", "POST", credentials),
  getProfile: (token) => apiRequest("/auth/profile", "GET", null, token),
  updateProfile: (token, payload) =>
    apiRequest("/auth/profile/update", "PATCH", payload, token),
  getSupplierInfo: (sellerId) =>
    apiRequest(`/auth/supplier/${sellerId}`, "GET", null, null),

  // adminRegister: (adminData) =>
  //   apiRequest("/admin/register", "POST", adminData),
  getSellerDashboard: () => apiRequest("/seller/dashboard"),
  getBuyerDashboard: () => apiRequest("/buyer/dashboard"),

  // adminRegister: (adminData) =>
  //   apiRequest("/admin/register", "POST", adminData),
  adminLogin: async (credentials) => {
    const response = await apiRequest("/admin/login", "POST", credentials);
    return response;
  },

  getAdminProfile: async (token) => {
    const response = await apiRequest("/admin/profile", "GET", null, token);
    return response;
  },
};

export const productApi = {
  getProducts: (token, params = null) =>
    apiRequest(
      `/products/show${params ? `?${params}` : ""}`,
      "GET",
      null,
      token
    ),
  getProductsAll: (params) =>
    apiRequest(`/products/${params ? `?${params}` : ""}`, "GET", null, null),
  getStoreProducts: (token, queryString) =>
    apiRequest(
      `/products/store${queryString ? "?" + queryString : ""}`,
      "GET",
      null,
      token
    ),
  createProduct: (productData, token) =>
    apiRequest("/products/add", "POST", productData, token),
  updateProduct: (productId, productData, token) =>
    apiRequest(`/products/${productId}`, "PATCH", productData, token),
  deleteProduct: (token, productId) =>
    apiRequest(`/products/${productId}`, "DELETE", null, token),
  getProductBySlug: (slug) =>
    apiRequest(`/products/product-by-slug/${slug}`, "GET"),
};

export const categoryApi = {
  getCategories: () => apiRequest("/categories/all", "GET"),
};

export const inquiryApi = {
  createInquiry: (inquiryData) => apiRequest("/inquiry/", "POST", inquiryData),
  addMessage: (inquiryId, inquiryData) =>
    apiRequest(`/inquiry/${inquiryId}/messages`, "POST", inquiryData),
  getInquiries: (inquiryId, token) =>
    apiRequest(`/inquiry/${inquiryId}`, "GET", null, token),
  getInquiriesbyBuyer: (buyerId) =>
    apiRequest(`/inquiry/buyer/${buyerId}`, "GET", null),
  getInquiriesbySeller: (sellerId) =>
    apiRequest(`/inquiry/seller/${sellerId}`, "GET", null),
  getMessage: (sellerId, payload) =>
    apiRequest(`/inquiry/${sellerId}/seller`, "POST", payload),
};

export const orderApi = {
  createOrder: (orderData, token) =>
    apiRequest("/order-user/add", "POST", orderData, token),
  getOrders: (token, status = "All", page = 1, itemsPerPage = 10) =>
    apiRequest(
      `/order-user?status=${status}&page=${page}&limit=${itemsPerPage}`,
      "GET",
      null,
      token
    ),
  getOrderbyId: (id, token) =>
    apiRequest(`/order-user/${id}`, "GET", null, token),
  getOrderbyIdAdmin: (id, token) =>
    apiRequest(`/order-user/${id}/admin`, "GET", null, token),
  updateOrder: (id, orderData, token) =>
    apiRequest(`/order/update/${id}`, "PATCH", orderData, token),
  updateOrderAdmin: (id, orderData, token) =>
    apiRequest(`/order/update/${id}/admin`, "PATCH", orderData, token),
  getAllOrderRequestSupplier: (token) =>
    apiRequest("/order/all-order-request-supplier", "GET", null, token),
  getOrdersAdmin: (token) =>
    apiRequest("/order-user/admin-order", "GET", null, token),

  // buyer dashboard
  getBuyerDashboardStats: (token) =>
    apiRequest(`/order-user/dashboard-stats`, "GET", null, token),
};

export const ImageDeleteApi = {
  deleteImage: (publicId) =>
    apiRequest(`/images/delete`, "DELETE", publicId, token),
};
export const subscriptionApi = {
  requestSubscription: (plan, token) =>
    apiRequest("/subscriptions/request", "POST", { plan }, token),
  getSubscriptionRequests: (token) =>
    apiRequest("/subscriptions", "GET", null, token),
  manageSubscription: (id, status, token) =>
    apiRequest(`/subscriptions/${id}`, "PUT", { status }, token),
};

export const reviewApi = {
  createReview: (reviewData, token) =>
    apiRequest("/reviews/add", "POST", reviewData, token),

  getReviews: (productId) => apiRequest(`/reviews/get/${productId}`, "GET"),

  getReviewsByOrder: (orderId) =>
    apiRequest(`/reviews/get-by-order/${orderId}`, "GET"),
};

export const modificationApi = {
  createModification: (modificationData, token) =>
    apiRequest("/modifications/add", "POST", modificationData, token),
  getModification: (orderId, token) =>
    apiRequest(`/modifications/get/${orderId}`, "GET", null, token),
  updateModification: (orderId, modificationId, status, token) =>
    apiRequest(
      `/modifications/${orderId}/update/${modificationId}`,
      "PATCH",
      status,
      token
    ),
};

export const disputeApi = {
  createDispute: (disputeData, token) =>
    apiRequest("/disputes/add", "POST", disputeData, token),
  getDispute: (orderId, token) =>
    apiRequest(`/disputes/get/${orderId}`, "GET", null, token),
  updateDispute: (orderId, disputeId, status, token) =>
    apiRequest(`/disputes/update/${disputeId}`, "PATCH", status, token),
};

export const transactionApi = {
  createTransaction: (transactionData, token) =>
    apiRequest("/transactions/create", "POST", transactionData, token),
  getTransaction: (orderId, token) =>
    apiRequest(`/transactions/user/${orderId}`, "GET", null, token),
};
