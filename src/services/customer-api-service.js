import { api } from './api';

// ==================== TRANSACTIONS ====================
export const makeTransaction = async (data) => {
    const response = await api.post('/customer/transaction', data);
    return response.data;
};

// ==================== ACCOUNTS ====================
export const requestNewAccount = async (data) => {
    const response = await api.post('/customer/accounts/request', data);
    return response.data;
};

export const getAccountDetails = async (accountId) => {
    const response = await api.get(`/customer/accounts/${accountId}`);
    return response.data;
};

// ==================== CARDS ====================
export const requestCard = async (data) => {
    const response = await api.post('/customer/cards/request', data);
    return response.data;
};

export const blockCard = async (cardId) => {
    const response = await api.put(`/customer/cards/${cardId}/block`);
    return response.data;
};

export const unblockCard = async (cardId, pin) => {
    const response = await api.put(`/customer/cards/${cardId}/unblock`, null, {
        params: { transactionPin: pin }
    });
    return response.data;
};

// ==================== LOANS ====================
export const applyLoan = async (data) => {
    const response = await api.post('/customer/loans/apply', data);
    return response.data;
};

export const getLoanOffers = async () => {
    const response = await api.get('/customer/loans/offers');
    return response.data;
};

// ==================== CHEQUE BOOK ====================
export const requestChequeBook = async (data) => {
    const response = await api.post('/customer/chequebooks/request', data);
    return response.data;
};

// ==================== SETTINGS (PIN) ====================
export const updateTransactionPin = async (data) => {
    const response = await api.put('/customer/pin/update', data);
    return response.data;
};

// ==================== REQUEST STATUS ====================
export const getCustomerRequestsData = async () => {
    const [acctReqs, cardReqs, chequeReqs] = await Promise.all([
        api.get('/customer/accounts/requests').catch(() => ({ data: { data: [] } })),
        api.get('/customer/cards/requests').catch(() => ({ data: { data: [] } })),
        api.get('/customer/chequebooks/requests').catch(() => ({ data: { data: [] } }))
    ]);

    return {
        accountRequests: acctReqs.data?.data || [],
        cardRequests: cardReqs.data?.data || [],
        chequeRequests: chequeReqs.data?.data || []
    };
};