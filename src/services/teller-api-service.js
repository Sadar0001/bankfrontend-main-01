import { api } from './api';

// ==================== DASHBOARD ====================
export const getTellerSummary = async () => {
    const response = await api.get('/teller/dashboard/summary');
    return response.data; // Returns ApiResponse
};

// ==================== ACCOUNT REQUESTS ====================
export const getPendingAccounts = () => api.get('/teller/accounts/requests/pending');
export const approveAccount = (id) => api.post(`/teller/accounts/requests/${id}/approve`);
export const rejectAccount = (id, reason) => api.post(`/teller/accounts/requests/${id}/reject`, { reason });

// ==================== CARD REQUESTS ====================
export const getPendingCards = () => api.get('/teller/cards/requests/pending');
export const approveCard = (id) => api.post(`/teller/cards/requests/${id}/approve`);
export const rejectCard = (id, reason) => api.post(`/teller/cards/requests/${id}/reject`, { reason });

// ==================== CHEQUE REQUESTS ====================
export const getPendingCheques = () => api.get('/teller/chequebooks/requests/pending');
export const approveCheque = (id) => api.post(`/teller/chequebooks/requests/${id}/approve`);
export const rejectCheque = (id, reason) => api.post(`/teller/chequebooks/requests/${id}/reject`, { reason });

// ==================== CUSTOMERS ====================
export const getBranchCustomers = () => api.get('/teller/customers');
export const updateCustomer = (id, data) => api.put(`/teller/customers/${id}`, data);

// ==================== TOOLS ====================
export const validateAccount = (id) => api.get(`/teller/accounts/${id}/validate`);
export const performTellerTransaction = (transactionData) => {
    return api.post('/transactions/transfer', transactionData);
};

