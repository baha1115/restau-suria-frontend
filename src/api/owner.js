// File: src/api/owner.js
import api, { unwrap } from "./axios.js";

const ownerApi = {
  // Restaurant
  async createRestaurant(body) {
    const res = await api.post("/api/owner/restaurants", body);
    return unwrap(res);
  },
  async updateRestaurant(id, body) {
    const res = await api.put(`/api/owner/restaurants/${id}`, body);
    return unwrap(res);
  },
 async  getRestaurant(id) {
  const res = await api.get(`/api/owner/restaurants/${id}`);
  return unwrap(res); // => { restaurant }
},
  // Uploads
  async uploadLogo(restaurantId, file) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await api.post(`/api/owner/restaurants/${restaurantId}/logo`, fd, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return unwrap(res);
  },
  async uploadCovers(restaurantId, files) {
    const fd = new FormData();
    [...files].forEach((f) => fd.append("files", f));
    const res = await api.post(`/api/owner/restaurants/${restaurantId}/covers`, fd, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return unwrap(res);
  },

  // Sections
  async createSection(restaurantId, body) {
    const res = await api.post(`/api/owner/restaurants/${restaurantId}/sections`, body);
    return unwrap(res);
  },
  async updateSection(sectionId, body) {
    const res = await api.put(`/api/owner/sections/${sectionId}`, body);
    return unwrap(res);
  },
  async toggleSection(sectionId) {
    const res = await api.patch(`/api/owner/sections/${sectionId}/toggle`);
    return unwrap(res);
  },
  async deleteSection(sectionId) {
    const res = await api.delete(`/api/owner/sections/${sectionId}`);
    return unwrap(res);
  },

  // Items
  async createItem(restaurantId, body) {
    const res = await api.post(`/api/owner/restaurants/${restaurantId}/items`, body);
    return unwrap(res);
  },
  async updateItem(itemId, body) {
    const res = await api.put(`/api/owner/items/${itemId}`, body);
    return unwrap(res);
  },
  async updateAvailability(itemId, isAvailable) {
    const res = await api.patch(`/api/owner/items/${itemId}/availability`, { isAvailable });
    return unwrap(res);
  },
  async deleteItem(itemId) {
    const res = await api.delete(`/api/owner/items/${itemId}`);
    return unwrap(res);
  },

  // ✅ NEW: Upload menu item image (dish photo)
  async uploadItemImage(itemId, file) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await api.post(`/api/owner/items/${itemId}/image`, fd, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return unwrap(res);
  },
async uploadOfferImage(offerId, file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await api.post(`/api/owner/offers/${offerId}/image`, fd, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return unwrap(res);
},

  // Offers
  async createOffer(restaurantId, body) {
    const res = await api.post(`/api/owner/restaurants/${restaurantId}/offers`, body);
    return unwrap(res);
  },
  async updateOffer(offerId, body) {
    const res = await api.put(`/api/owner/offers/${offerId}`, body);
    return unwrap(res);
  },
  async deleteOffer(offerId) {
    const res = await api.delete(`/api/owner/offers/${offerId}`);
    return unwrap(res);
  },
async listOffers(restaurantId) {
  const res = await api.get(`/api/owner/restaurants/${restaurantId}/offers`);
  return unwrap(res);
},

  // Tables
  async bulkCreateTables(restaurantId, body) {
    const res = await api.post(`/api/owner/restaurants/${restaurantId}/tables/bulk`, body);
    return unwrap(res);
  },
  async listTables(restaurantId) {
    const res = await api.get(`/api/owner/restaurants/${restaurantId}/tables`);
    return unwrap(res);
  },

  // QR (protected image) -> fetch blob and use URL.createObjectURL
  async fetchQrBlob(restaurantId, table) {
    const res = await api.get(`/api/owner/restaurants/${restaurantId}/qr`, {
      params: table ? { table } : {},
      responseType: "blob"
    });
    return res.data;
  },
async deleteLogo(restaurantId) {
  const res = await api.delete(`/api/owner/restaurants/${restaurantId}/logo`);
  return unwrap(res);
},

async deleteCover(restaurantId, url) {
  const res = await api.delete(`/api/owner/restaurants/${restaurantId}/covers`, {
    data: { url }
  });
  return unwrap(res);
},


};







export default ownerApi;
