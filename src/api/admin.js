// File: src/api/admin.js
import api, { unwrap } from "./axios.js";

const adminApi = {
  async listRestaurants(params) {
    const res = await api.get("/api/admin/restaurants", { params });
    return unwrap(res);
  },
  async activateRestaurant(id, isActive) {
    const res = await api.patch(`/api/admin/restaurants/${id}/activate`, { isActive });
    return unwrap(res);
  },
  async featureRestaurant(id, isFeatured) {
    const res = await api.patch(`/api/admin/restaurants/${id}/feature`, { isFeatured });
    return unwrap(res);
  },

  async listUsers(params) {
    const res = await api.get("/api/admin/users", { params });
    return unwrap(res);
  },
  async createOwner(body) {
    const res = await api.post("/api/admin/owners", body);
    return unwrap(res);
  },
  async activateUser(id, isActive) {
    const res = await api.patch(`/api/admin/users/${id}/activate`, { isActive });
    return unwrap(res);
  }
};

export default adminApi;
