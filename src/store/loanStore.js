import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_LOAN = {
  id: 'LN-48211',
  type: 'Personal Loan',
  principal: 48000,
  outstanding: 22320,
  paid: 25680,
  interestRate: 8.4,
  termMonths: 36,
  paidEmis: 9,
  nextDueAmount: 1240,
  nextDueDate: '2026-06-05',
  paymentMethod: 'HDFC Bank ••4421',
  breakdown: {
    principal: 980,
    interest: 210,
    fees: 50,
  },
};

let listeners = [];
let state = DEFAULT_LOAN;

AsyncStorage.getItem('nova_loan').then((json) => {
  if (json) {
    state = JSON.parse(json);
    notify();
  }
});

const notify = () => {
  listeners.forEach((listener) => listener(state));
};

export const loanStore = {
  getState() {
    return state;
  },
  subscribe(listener) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
  makePayment(amount) {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) return;

    const emiValue = 1240;
    const emiCountPaid = Math.floor(numericAmount / emiValue) || 1;
    const newOutstanding = Math.max(0, state.outstanding - numericAmount);
    const newPaid = state.paid + numericAmount;
    const newPaidEmis = Math.min(state.termMonths, state.paidEmis + emiCountPaid);

    const currentDate = new Date(state.nextDueDate);
    currentDate.setMonth(currentDate.getMonth() + emiCountPaid);
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const newDueDate = `${year}-${month}-${day}`;

    state = {
      ...state,
      outstanding: newOutstanding,
      paid: newPaid,
      paidEmis: newPaidEmis,
      nextDueDate: newDueDate,
    };

    AsyncStorage.setItem('nova_loan', JSON.stringify(state));
    notify();
  },
  resetStore() {
    state = DEFAULT_LOAN;
    AsyncStorage.setItem('nova_loan', JSON.stringify(DEFAULT_LOAN));
    notify();
  },
  // Populate store fully from backend loan object
  setLoan(loanData) {
    state = {
      ...state,
      ...loanData,
      // Map backend field names to store field names
      paymentMethod: loanData.paymentMethod || state.paymentMethod,
    };
    AsyncStorage.setItem('nova_loan', JSON.stringify(state));
    notify();
  },
  // Partial update after a payment (outstanding, paid, paidEmis, nextDueDate)
  syncFromBackend(partial) {
    state = { ...state, ...partial };
    AsyncStorage.setItem('nova_loan', JSON.stringify(state));
    notify();
  },
};
