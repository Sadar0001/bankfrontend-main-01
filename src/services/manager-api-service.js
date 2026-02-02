import { api } from './api';

// ==================== TELLER ====================
export const addTeller = (data) => api.post('/branch-manager/tellers/add', data);
export const getTellers = () => api.get('/branch-manager/tellers/getAllByBranch');
export const deactivateTeller = (id) => api.delete(`/branch-manager/tellers/deactivate/${id}`);

// ==================== LOANS ====================
export const getPendingLoans = () => api.get('/branch-manager/loans/pending');
export const approveLoan = (id, amount, tenure) =>
    api.post(`/branch-manager/loans/${id}/approve`, null, { params: { approvedAmount: amount, approvedTenure: tenure }});
export const rejectLoan = (id, reason) =>
    api.post(`/branch-manager/loans/${id}/reject`, null, { params: { rejectionReason: reason }});

// ==================== ACCOUNTS & CUSTOMERS ====================
export const getAllCustomers = () => api.get('/branch-manager/customers');
export const getCustomerDetails = (id) => api.get(`/branch-manager/customers/${id}/details`);
export const getAllAccounts = () => api.get('/branch-manager/accounts'); // Ensure this endpoint exists in Controller

export const freezeAccount = (id) => api.put(`/branch-manager/accounts/${id}/freeze`);
export const unfreezeAccount = (id) => api.put(`/branch-manager/accounts/${id}/unfreeze`);
export const closeAccount = (id) => api.delete(`/branch-manager/accounts/${id}/close`);
export const freezeAllCustomerAccounts = (id) => api.put(`/branch-manager/customers/${id}/freeze-all`);

// ==================== ANALYTICS ====================
export const getBranchEarnings = (start, end) => api.get('/branch-manager/earnings', { params: { startDate: start, endDate: end }});
export const getLoanStats = () => api.get('/branch-manager/loans/statistics');
export const getBranchTransactions = (start, end) => api.get('/branch-manager/transactions', { params: { startDate: start, endDate: end }});

// ==================== CHARGES ====================
export const getChargesByDate = (start, end) => api.get('/branch-manager/charges/date-range', { params: { startDate: start, endDate: end }});
export const getChargesLastMonth = () => api.get('/branch-manager/charges/last-month');
export const getChargesLastYear = () => api.get('/branch-manager/charges/last-year');
export const getTransactionCharges = (id) => api.get(`/branch-manager/charges/transaction/${id}`);