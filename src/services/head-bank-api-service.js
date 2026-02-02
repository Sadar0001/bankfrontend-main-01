import { api } from './api';

// ==================== BRANCH MANAGEMENT ====================
export const addBranch = (data) => api.post('/headBank/add_branch', data);
export const getAllBranches = () => api.get('/headBank/branches');
export const deactivateBranch = (id) => api.delete(`/headBank/deactivate_branch/${id}`);

// ==================== BRANCH MANAGER MANAGEMENT ====================
export const addBranchManager = (data) => api.post('/headBank/branch_manager/add', data);
export const deactivateBranchManager = (id) => api.delete(`/headBank/branch_manager/deactive/${id}`);

// ==================== LOAN OFFERS ====================
export const getAllLoanOffers = () => api.get('/headBank/loan-offers/all');
export const addLoanOffer = (data) => api.post('/headBank/create-loan-offers', data);
export const updateLoanOffer = (id, data) => api.put(`/headBank/loan-offers/${id}`, data);
export const deactivateLoanOffer = (id) => api.delete(`/headBank/loan-offers/deactive/${id}`);

// ==================== DEBIT CARD RULES ====================
export const getAllCardRules = () => api.get('/headBank/debit-card-rules/head-bank');
export const addCardRule = (data) => api.post('/headBank/debit-card-rules', data);
export const updateCardRule = (id, data) => api.put(`/headBank/debit-card-rules/${id}`, data);
export const deactivateCardRule = (id) => api.delete(`/headBank/debit-card-rules/${id}`);

// ==================== EARNINGS & ANALYTICS ====================
export const getHeadBankEarnings = () => api.get('/headBank/headBank-earning');
export const getBranchEarnings = (branchId) => api.get('/headBank/bank-earning', { params: { bankId: branchId } });

// ==================== CHARGES REPORT ====================
export const getHeadBankChargesDateRange = (start, end) => api.get('/headBank/charges/date-range', { params: { startDate: start, endDate: end } });
export const getHeadBankChargesLastMonth = () => api.get('/headBank/charges/last-month');
export const getHeadBankChargesLastYear = () => api.get('/headBank/charges/last-year');
