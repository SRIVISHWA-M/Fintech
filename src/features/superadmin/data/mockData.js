// ─── Nova Finance · Super Admin Mock Data ────────────────────────────────────

export const overviewMetrics = {
  totalAUM: '₹8,240 Cr',
  totalAUMChange: '+12.4%',
  activeLoans: '2,41,831',
  activeLoansChange: '+3.2%',
  disbursedToday: '₹48.6 Cr',
  disbursedTodayChange: '+8.7%',
  collectionRate: '97.86%',
  collectionRateChange: '+0.3%',
  nplRatio: '2.14%',
  nplRatioChange: '-0.08%',
  pendingApplications: '2,418',
  pendingChange: '-142',
};

export const disbursementTrend = [
  { month: 'Jan', amount: 320, applications: 1820 },
  { month: 'Feb', amount: 380, applications: 2100 },
  { month: 'Mar', amount: 420, applications: 2340 },
  { month: 'Apr', amount: 390, applications: 2180 },
  { month: 'May', amount: 460, applications: 2560 },
  { month: 'Jun', amount: 486, applications: 2418 },
];

export const riskDistribution = [
  { label: 'Low Risk', value: 58, color: '#34d87c' },
  { label: 'Medium Risk', value: 29, color: '#fbbf24' },
  { label: 'High Risk', value: 9, color: '#fb923c' },
  { label: 'Critical', value: 4, color: '#f87171' },
];

export const recentActivity = [
  { id: 1, type: 'approval', message: 'Loan #LN-48291 approved · ₹4.2L', time: '2 min ago', user: 'Aanya K.' },
  { id: 2, type: 'flag', message: 'Application #APP-12083 flagged for review', time: '8 min ago', user: 'System' },
  { id: 3, type: 'collection', message: 'Collection ₹18,400 received · A/C 9823', time: '15 min ago', user: 'Rohan M.' },
  { id: 4, type: 'config', message: 'Credit score threshold updated to 680', time: '1 hr ago', user: 'Priya S.' },
  { id: 5, type: 'user', message: 'KYC tier-2 verified for 48 users', time: '2 hr ago', user: 'System' },
  { id: 6, type: 'approval', message: 'Loan #LN-48189 disbursed · ₹7.8L', time: '3 hr ago', user: 'Vikram R.' },
];

// ─── Underwriting ─────────────────────────────────────────────────────────────
export const underwritingStats = {
  activeApplications: '2,418',
  totalExposure: '₹612 Cr',
  slaBreachRisk: 7,
  avgProcessingTime: '18.4 hrs',
  approvalRate: '64.2%',
  autoApproved: '38%',
};

export const underwritingQueue = [
  { id: 'APP-12091', applicant: 'Rahul Sharma', amount: '₹5,00,000', score: 742, risk: 'Low', status: 'Pending Review', assignee: 'Aanya K.', submitted: '2 hr ago', sla: '22 hr', priority: 'Normal' },
  { id: 'APP-12090', applicant: 'Priya Menon', amount: '₹2,50,000', score: 698, risk: 'Medium', status: 'Under Review', assignee: 'Vikram R.', submitted: '4 hr ago', sla: '6 hr', priority: 'High' },
  { id: 'APP-12089', applicant: 'Arjun Nair', amount: '₹8,00,000', score: 611, risk: 'High', status: 'Pending Review', assignee: 'Unassigned', submitted: '6 hr ago', sla: '2 hr', priority: 'Critical' },
  { id: 'APP-12088', applicant: 'Sneha Patel', amount: '₹1,50,000', score: 780, risk: 'Low', status: 'Approved', assignee: 'Rohan M.', submitted: '8 hr ago', sla: '—', priority: 'Normal' },
  { id: 'APP-12087', applicant: 'Karthik Reddy', amount: '₹3,75,000', score: 659, risk: 'Medium', status: 'Rejected', assignee: 'Aanya K.', submitted: '10 hr ago', sla: '—', priority: 'Normal' },
  { id: 'APP-12086', applicant: 'Divya Krishnan', amount: '₹6,00,000', score: 725, risk: 'Low', status: 'Pending Review', assignee: 'Priya S.', submitted: '12 hr ago', sla: '12 hr', priority: 'High' },
  { id: 'APP-12085', applicant: 'Mohan Das', amount: '₹4,25,000', score: 581, risk: 'High', status: 'Under Review', assignee: 'Vikram R.', submitted: '14 hr ago', sla: '4 hr', priority: 'High' },
  { id: 'APP-12084', applicant: 'Lakshmi Iyer', amount: '₹2,00,000', score: 812, risk: 'Low', status: 'Approved', assignee: 'System', submitted: '16 hr ago', sla: '—', priority: 'Normal' },
  { id: 'APP-12083', applicant: 'Suresh Babu', amount: '₹9,50,000', score: 547, risk: 'Critical', status: 'Flagged', assignee: 'Aanya K.', submitted: '20 hr ago', sla: '1 hr', priority: 'Critical' },
  { id: 'APP-12082', applicant: 'Anita Joshi', amount: '₹1,20,000', score: 755, risk: 'Low', status: 'Approved', assignee: 'System', submitted: '22 hr ago', sla: '—', priority: 'Normal' },
];

// ─── User Management ──────────────────────────────────────────────────────────
export const userStats = {
  totalBorrowers: '1,84,209',
  activeBorrowers: '1,34,431',
  kycTier2: '73%',
  suspended: '1,842',
  avgCreditScore: '701',
  newThisMonth: '4,821',
};

export const usersList = [
  { id: 'USR-00182', name: 'Rahul Sharma', phone: '98712 34567', kyc: 'Tier-2', loanStatus: 'Active', creditScore: 742, risk: 'Low', joined: 'Jan 12, 2024', status: 'Active' },
  { id: 'USR-00181', name: 'Priya Menon', phone: '87623 45678', kyc: 'Tier-1', loanStatus: 'Active', creditScore: 698, risk: 'Medium', joined: 'Feb 3, 2024', status: 'Active' },
  { id: 'USR-00180', name: 'Arjun Nair', phone: '76534 56789', kyc: 'Tier-2', loanStatus: 'Overdue', creditScore: 611, risk: 'High', joined: 'Nov 20, 2023', status: 'Restricted' },
  { id: 'USR-00179', name: 'Sneha Patel', phone: '65445 67890', kyc: 'Tier-2', loanStatus: 'Closed', creditScore: 780, risk: 'Low', joined: 'Oct 5, 2023', status: 'Active' },
  { id: 'USR-00178', name: 'Karthik Reddy', phone: '54356 78901', kyc: 'Pending', loanStatus: 'None', creditScore: 659, risk: 'Medium', joined: 'Mar 18, 2024', status: 'KYC Pending' },
  { id: 'USR-00177', name: 'Divya Krishnan', phone: '43267 89012', kyc: 'Tier-2', loanStatus: 'Active', creditScore: 725, risk: 'Low', joined: 'Dec 1, 2023', status: 'Active' },
  { id: 'USR-00176', name: 'Mohan Das', phone: '32178 90123', kyc: 'Tier-1', loanStatus: 'Overdue', creditScore: 581, risk: 'High', joined: 'Sep 14, 2023', status: 'Suspended' },
  { id: 'USR-00175', name: 'Lakshmi Iyer', phone: '21089 01234', kyc: 'Tier-2', loanStatus: 'Active', creditScore: 812, risk: 'Low', joined: 'Aug 22, 2023', status: 'Active' },
  { id: 'USR-00174', name: 'Suresh Babu', phone: '10990 12345', kyc: 'Tier-1', loanStatus: 'Default', creditScore: 547, risk: 'Critical', joined: 'Jul 7, 2023', status: 'Suspended' },
  { id: 'USR-00173', name: 'Anita Joshi', phone: '99801 23456', kyc: 'Tier-2', loanStatus: 'Active', creditScore: 755, risk: 'Low', joined: 'Jun 30, 2023', status: 'Active' },
];

// ─── Collections ──────────────────────────────────────────────────────────────
export const collectionsStats = {
  atRisk: '₹3,365 Cr',
  delinquentAccounts: '6,998',
  nplRatio: '2.14%',
  recoveredToday: '₹4.8 Cr',
  agentEfficiency: '82.4%',
  avgDPD: '34 days',
};

export const collectionsList = [
  { id: 'COL-9821', borrower: 'Suresh Babu', account: 'A/C-99421', amount: '₹9,50,000', dpd: 87, bucket: 'NPA', agent: 'Rohan M.', lastContact: 'Jun 14', status: 'Legal Notice', risk: 'Critical' },
  { id: 'COL-9820', borrower: 'Mohan Das', account: 'A/C-88312', amount: '₹4,25,000', dpd: 64, bucket: '60+', agent: 'Kavya P.', lastContact: 'Jun 15', status: 'Promise to Pay', risk: 'High' },
  { id: 'COL-9819', borrower: 'Arjun Nair', account: 'A/C-77203', amount: '₹8,00,000', dpd: 45, bucket: '30+', agent: 'Sanjay T.', lastContact: 'Jun 16', status: 'In Progress', risk: 'High' },
  { id: 'COL-9818', borrower: 'Ravi Kumar', account: 'A/C-66094', amount: '₹2,75,000', dpd: 34, bucket: '30+', agent: 'Rohan M.', lastContact: 'Jun 16', status: 'Contacted', risk: 'Medium' },
  { id: 'COL-9817', borrower: 'Geeta Singh', account: 'A/C-54985', amount: '₹1,20,000', dpd: 18, bucket: '1-29', agent: 'Kavya P.', lastContact: 'Jun 15', status: 'Reminder Sent', risk: 'Medium' },
  { id: 'COL-9816', borrower: 'Vijay Pillai', account: 'A/C-43876', amount: '₹3,60,000', dpd: 92, bucket: 'NPA', agent: 'Sanjay T.', lastContact: 'Jun 10', status: 'Legal Notice', risk: 'Critical' },
  { id: 'COL-9815', borrower: 'Meera Nair', account: 'A/C-32767', amount: '₹5,50,000', dpd: 71, bucket: '60+', agent: 'Rohan M.', lastContact: 'Jun 14', status: 'Escalated', risk: 'High' },
  { id: 'COL-9814', borrower: 'Anand Rao', account: 'A/C-21658', amount: '₹80,000', dpd: 22, bucket: '1-29', agent: 'Kavya P.', lastContact: 'Jun 16', status: 'Contacted', risk: 'Low' },
];

// ─── Platform Config ──────────────────────────────────────────────────────────
export const platformConfig = {
  policyVersion: 'v7.3.1',
  lastPublishedBy: 'Aanya K.',
  lastPublishedOn: 'Jun 1, 2026',
  pendingChanges: 3,

  underwritingRules: {
    minCreditScore: 620,
    maxLoanAmount: 1000000,
    minLoanAmount: 50000,
    maxDTIRatio: 45,
    autoApprovalScore: 750,
    autoRejectionScore: 580,
    maxTenureMonths: 60,
    processingFeePct: 2.5,
  },

  riskThresholds: {
    lowRiskMax: 740,
    mediumRiskMax: 680,
    highRiskMax: 620,
    nplTrigger: 3.0,
    slaBreach: 24,
    slaWarning: 20,
    maxExposurePerBorrower: 2500000,
  },

  rateCards: [
    { segment: 'Prime (750+)', rate: '12.5%', tenure: '12-60 months', processing: '1.5%' },
    { segment: 'Near-Prime (700-749)', rate: '15.75%', tenure: '12-48 months', processing: '2.0%' },
    { segment: 'Sub-Prime (650-699)', rate: '19.5%', tenure: '12-36 months', processing: '2.5%' },
    { segment: 'Deep Sub-Prime (<650)', rate: '24.0%', tenure: '12-24 months', processing: '3.0%' },
  ],

  kycSettings: {
    tier1Required: ['PAN', 'Aadhaar', 'Selfie'],
    tier2Required: ['PAN', 'Aadhaar', 'Selfie', 'Bank Statement', 'Income Proof'],
    videoKYC: true,
    autoApproveKYC: false,
    kycExpiryDays: 365,
  },

  features: {
    autoUnderwriting: true,
    instantDisbursement: true,
    dynamicPricing: false,
    collectionAutomation: true,
    emailAlerts: true,
    smsAlerts: true,
    whatsappAlerts: false,
  },
};
