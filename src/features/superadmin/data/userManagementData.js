export const userManagementStats = {
  totalCustomers: 250,
  activeCustomers: 182,
  pausedCustomers: 28,
  suspendedCustomers: 12,
  totalLoanCustomers: 143,
  newCustomersThisMonth: 19,
};

export const userManagementCustomers = [
  {
    id: 'CUS-1001',
    customerName: 'Arun Kumar',
    phone: '+91 98765 43210',
    email: 'arun@example.com',
    kycStatus: 'Verified',
    status: 'Active',
    loanCount: 2,
    totalLoanAmount: 3200000,
    address: 'Chennai, Tamil Nadu',
    createdDate: '2026-05-10',
    notes: 'Premium customer',
    loans: [
      {
        loanId: 'LN-1001',
        loanType: 'Home Loan',
        loanAmount: 2500000,
        status: 'Approved',
        applicationDate: '2026-07-01',
      },
      {
        loanId: 'LN-1034',
        loanType: 'Personal Loan',
        loanAmount: 700000,
        status: 'Approved',
        applicationDate: '2026-06-12',
      }
    ],
    transactions: [
      {
        transactionId: 'TXN-9001',
        date: '2026-07-02',
        type: 'EMI Payment',
        paymentMethod: 'UPI',
        amount: 25000,
        status: 'Success',
      },
      {
        transactionId: 'TXN-9002',
        date: '2026-06-15',
        type: 'Loan Disbursal',
        paymentMethod: 'Bank Transfer',
        amount: 2500000,
        status: 'Success',
      }
    ]
  },
  {
    id: 'CUS-1002',
    customerName: 'Priya Sharma',
    phone: '+91 87654 32109',
    email: 'priya@example.com',
    kycStatus: 'Pending',
    status: 'Paused',
    loanCount: 1,
    totalLoanAmount: 500000,
    address: 'Bangalore, Karnataka',
    createdDate: '2026-05-18',
    notes: 'KYC pending review',
    loans: [
      {
        loanId: 'LN-1002',
        loanType: 'Personal Loan',
        loanAmount: 500000,
        status: 'Pending',
        applicationDate: '2026-06-28',
      }
    ],
    transactions: [
      {
        transactionId: 'TXN-9003',
        date: '2026-06-29',
        type: 'Loan Processing Fee',
        paymentMethod: 'Credit Card',
        amount: 2500,
        status: 'Success',
      }
    ]
  },
  {
    id: 'CUS-1003',
    customerName: 'Sanjay Gupta',
    phone: '+91 91234 56780',
    email: 'sanjay@example.com',
    kycStatus: 'Verified',
    status: 'Suspended',
    loanCount: 1,
    totalLoanAmount: 1200000,
    address: 'Mumbai, Maharashtra',
    createdDate: '2025-11-20',
    notes: 'Defaulted on payments',
    loans: [
      {
        loanId: 'LN-1015',
        loanType: 'Vehicle Loan',
        loanAmount: 1200000,
        status: 'Defaulted',
        applicationDate: '2025-12-05',
      }
    ],
    transactions: [
      {
        transactionId: 'TXN-9010',
        date: '2026-04-10',
        type: 'Penalty',
        paymentMethod: 'Bank Transfer',
        amount: 15000,
        status: 'Failed',
      }
    ]
  },
  {
    id: 'CUS-1004',
    customerName: 'Neha Reddy',
    phone: '+91 99887 76655',
    email: 'neha@example.com',
    kycStatus: 'Rejected',
    status: 'Suspended',
    loanCount: 0,
    totalLoanAmount: 0,
    address: 'Hyderabad, Telangana',
    createdDate: '2026-07-01',
    notes: 'Fraudulent documents submitted',
    loans: [],
    transactions: []
  },
  {
    id: 'CUS-1005',
    customerName: 'Vikram Singh',
    phone: '+91 98765 11223',
    email: 'vikram@example.com',
    kycStatus: 'Verified',
    status: 'Active',
    loanCount: 3,
    totalLoanAmount: 8500000,
    address: 'Delhi, NCR',
    createdDate: '2024-03-15',
    notes: 'High net worth individual',
    loans: [
      {
        loanId: 'LN-0980',
        loanType: 'Business Loan',
        loanAmount: 5000000,
        status: 'Approved',
        applicationDate: '2024-04-10',
      },
      {
        loanId: 'LN-1120',
        loanType: 'Personal Loan',
        loanAmount: 1000000,
        status: 'Closed',
        applicationDate: '2025-01-20',
      },
      {
        loanId: 'LN-1450',
        loanType: 'Home Loan',
        loanAmount: 2500000,
        status: 'Approved',
        applicationDate: '2026-02-14',
      }
    ],
    transactions: [
      {
        transactionId: 'TXN-9021',
        date: '2026-06-10',
        type: 'EMI Payment',
        paymentMethod: 'Net Banking',
        amount: 150000,
        status: 'Success',
      }
    ]
  },
  {
    id: 'CUS-1006',
    customerName: 'Meera Menon',
    phone: '+91 94433 22110',
    email: 'meera@example.com',
    kycStatus: 'Verified',
    status: 'Active',
    loanCount: 1,
    totalLoanAmount: 400000,
    address: 'Kochi, Kerala',
    createdDate: '2026-01-05',
    notes: 'Regular payer',
    loans: [
      {
        loanId: 'LN-1205',
        loanType: 'Personal Loan',
        loanAmount: 400000,
        status: 'Approved',
        applicationDate: '2026-01-15',
      }
    ],
    transactions: [
      {
        transactionId: 'TXN-9044',
        date: '2026-06-15',
        type: 'EMI Payment',
        paymentMethod: 'UPI',
        amount: 35000,
        status: 'Success',
      }
    ]
  },
  {
    id: 'CUS-1007',
    customerName: 'Rohan Desai',
    phone: '+91 81122 33445',
    email: 'rohan@example.com',
    kycStatus: 'Pending',
    status: 'Paused',
    loanCount: 0,
    totalLoanAmount: 0,
    address: 'Ahmedabad, Gujarat',
    createdDate: '2026-07-02',
    notes: 'Awaiting address proof',
    loans: [],
    transactions: []
  },
  {
    id: 'CUS-1008',
    customerName: 'Kavita Iyer',
    phone: '+91 90011 22334',
    email: 'kavita@example.com',
    kycStatus: 'Verified',
    status: 'Active',
    loanCount: 2,
    totalLoanAmount: 1800000,
    address: 'Pune, Maharashtra',
    createdDate: '2025-08-12',
    notes: '',
    loans: [
      {
        loanId: 'LN-1100',
        loanType: 'Vehicle Loan',
        loanAmount: 800000,
        status: 'Approved',
        applicationDate: '2025-09-01',
      },
      {
        loanId: 'LN-1300',
        loanType: 'Personal Loan',
        loanAmount: 1000000,
        status: 'Approved',
        applicationDate: '2026-03-10',
      }
    ],
    transactions: [
      {
        transactionId: 'TXN-9055',
        date: '2026-06-01',
        type: 'EMI Payment',
        paymentMethod: 'Auto Debit',
        amount: 45000,
        status: 'Success',
      }
    ]
  },
  {
    id: 'CUS-1009',
    customerName: 'Anand Patel',
    phone: '+91 88877 66554',
    email: 'anand@example.com',
    kycStatus: 'Rejected',
    status: 'Paused',
    loanCount: 1,
    totalLoanAmount: 200000,
    address: 'Surat, Gujarat',
    createdDate: '2026-04-18',
    notes: 'KYC re-verification failed',
    loans: [
      {
        loanId: 'LN-1350',
        loanType: 'Personal Loan',
        loanAmount: 200000,
        status: 'Pending',
        applicationDate: '2026-04-20',
      }
    ],
    transactions: [
      {
        transactionId: 'TXN-9060',
        date: '2026-04-21',
        type: 'Refund',
        paymentMethod: 'Bank Transfer',
        amount: 1500,
        status: 'Success',
      }
    ]
  },
  {
    id: 'CUS-1010',
    customerName: 'Smriti Sen',
    phone: '+91 77788 99001',
    email: 'smriti@example.com',
    kycStatus: 'Verified',
    status: 'Active',
    loanCount: 1,
    totalLoanAmount: 4500000,
    address: 'Kolkata, West Bengal',
    createdDate: '2024-11-05',
    notes: '',
    loans: [
      {
        loanId: 'LN-0950',
        loanType: 'Home Loan',
        loanAmount: 4500000,
        status: 'Approved',
        applicationDate: '2024-12-01',
      }
    ],
    transactions: [
      {
        transactionId: 'TXN-9071',
        date: '2026-06-05',
        type: 'EMI Payment',
        paymentMethod: 'Net Banking',
        amount: 42000,
        status: 'Success',
      }
    ]
  },
  {
    id: 'CUS-1011',
    customerName: 'Ajay Varma',
    phone: '+91 95544 33221',
    email: 'ajay@example.com',
    kycStatus: 'Verified',
    status: 'Suspended',
    loanCount: 2,
    totalLoanAmount: 1500000,
    address: 'Lucknow, UP',
    createdDate: '2025-05-22',
    notes: 'Account frozen due to suspicious activity',
    loans: [
      {
        loanId: 'LN-1050',
        loanType: 'Personal Loan',
        loanAmount: 500000,
        status: 'Approved',
        applicationDate: '2025-06-10',
      },
      {
        loanId: 'LN-1080',
        loanType: 'Business Loan',
        loanAmount: 1000000,
        status: 'Approved',
        applicationDate: '2025-10-15',
      }
    ],
    transactions: [
      {
        transactionId: 'TXN-9080',
        date: '2026-03-12',
        type: 'EMI Payment',
        paymentMethod: 'UPI',
        amount: 55000,
        status: 'Failed',
      }
    ]
  },
  {
    id: 'CUS-1012',
    customerName: 'Divya Nair',
    phone: '+91 93322 11009',
    email: 'divya@example.com',
    kycStatus: 'Pending',
    status: 'Paused',
    loanCount: 1,
    totalLoanAmount: 600000,
    address: 'Trivandrum, Kerala',
    createdDate: '2026-06-25',
    notes: 'Income proof required',
    loans: [
      {
        loanId: 'LN-1480',
        loanType: 'Vehicle Loan',
        loanAmount: 600000,
        status: 'Pending',
        applicationDate: '2026-06-28',
      }
    ],
    transactions: [
      {
        transactionId: 'TXN-9092',
        date: '2026-06-28',
        type: 'Processing Fee',
        paymentMethod: 'Credit Card',
        amount: 3000,
        status: 'Success',
      }
    ]
  },
  {
    id: 'CUS-1013',
    customerName: 'Tariq Ali',
    phone: '+91 92211 00998',
    email: 'tariq@example.com',
    kycStatus: 'Verified',
    status: 'Active',
    loanCount: 1,
    totalLoanAmount: 3000000,
    address: 'Bhopal, MP',
    createdDate: '2025-02-14',
    notes: '',
    loans: [
      {
        loanId: 'LN-0995',
        loanType: 'Home Loan',
        loanAmount: 3000000,
        status: 'Approved',
        applicationDate: '2025-03-01',
      }
    ],
    transactions: [
      {
        transactionId: 'TXN-9105',
        date: '2026-06-01',
        type: 'EMI Payment',
        paymentMethod: 'Auto Debit',
        amount: 28000,
        status: 'Success',
      }
    ]
  },
  {
    id: 'CUS-1014',
    customerName: 'Geeta Phogat',
    phone: '+91 91100 99887',
    email: 'geeta@example.com',
    kycStatus: 'Verified',
    status: 'Active',
    loanCount: 0,
    totalLoanAmount: 0,
    address: 'Chandigarh, Punjab',
    createdDate: '2026-07-03',
    notes: 'New registration',
    loans: [],
    transactions: []
  },
  {
    id: 'CUS-1015',
    customerName: 'Manoj Tiwari',
    phone: '+91 90099 88776',
    email: 'manoj@example.com',
    kycStatus: 'Verified',
    status: 'Active',
    loanCount: 1,
    totalLoanAmount: 150000,
    address: 'Patna, Bihar',
    createdDate: '2026-05-20',
    notes: 'Short term loan',
    loans: [
      {
        loanId: 'LN-1420',
        loanType: 'Personal Loan',
        loanAmount: 150000,
        status: 'Approved',
        applicationDate: '2026-05-25',
      }
    ],
    transactions: [
      {
        transactionId: 'TXN-9115',
        date: '2026-05-28',
        type: 'Loan Disbursal',
        paymentMethod: 'Bank Transfer',
        amount: 150000,
        status: 'Success',
      }
    ]
  }
];
