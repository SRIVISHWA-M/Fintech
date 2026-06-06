import { apiRequest } from './api';
import { loanStore } from '../store/loanStore';

export const loanService = {
  getActiveLoan: async () => {
    const data = await apiRequest('/loans/active');
    // Sync backend data into local store so existing UI components re-render
    loanStore.setLoan(data.data);
    return data.data;
  },
};
