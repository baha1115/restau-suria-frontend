// File: src/api/public.js
import api, { unwrap } from "./axios.js";

const publicApi = {
  async home() {
    const res = await api.get("/api/public/home");
    return unwrap(res);
  },
  async listRestaurants(params) {
    const res = await api.get("/api/public/restaurants", { params });
    return unwrap(res);
  },
  async search(q) {
    const res = await api.get("/api/public/search", { params: { q } });
    return unwrap(res);
  },
  async getRestaurant(slug) {
    const res = await api.get(`/api/public/r/${slug}`);
    return unwrap(res);
  },
  async getMenu(slug, q = "") {
    const res = await api.get(`/api/public/r/${slug}/menu`, { params: { q } });
    return unwrap(res);
  },
  async offers(params) {
    const res = await api.get("/api/public/offers", { params });
    return unwrap(res);
  },
  async whatsappMessage(body) {
    const res = await api.post("/api/public/whatsapp-message", body);
    return unwrap(res);
  }
};

export default publicApi;
