/* Regology prototype — realistic data (financial-compliance domain) */

const SEARCH_QUERY = '7 CFR 1786.151';

/* search-box autocomplete suggestions */
const AUTOCOMPLETE = [
  { no:'7 CFR 1786.151', d:'RUS guaranteed loan prepayment — borrower <b>eligibility</b>' },
  { no:'12 CFR 1026.18', d:'Truth in Lending — content of required <b>disclosures</b>' },
  { no:'Regulation Z',    d:'Truth in Lending Act implementing regulation (12 CFR 1026)' },
  { no:'15 USC 1601',     d:'Truth in Lending Act — congressional findings & purpose' },
  { no:'12 CFR 1005.11',  d:'Electronic Fund Transfers — error resolution procedures' },
];

/* result rows grouped into chapters. unread + hi (highlighted) flags mirror the spec. */
const RESULTS = [
  { chapter:'7 CFR Part 1786 — Prepayment of RUS Guaranteed & Insured Loans', note:'3 Results matching keyword' },
  { no:'7 CFR 1786.151', title:'Eligibility', desc:'Identifies which RUS electric and telephone borrowers may prepay loans at the <b>reasonable-value</b> discount.', type:'CFR', unread:true,  hi:true },
  { no:'7 CFR 1786.152', title:'Discounted present value', desc:'Prescribes the method for computing the discounted present value of qualifying loans.', type:'CFR', unread:false, hi:false },
  { no:'7 CFR 1786.158', title:'Application and certifications', desc:'Documentation a borrower must file to obtain a prepayment determination.', type:'CFR', unread:false, hi:false },

  { chapter:'12 CFR Part 1026 — Truth in Lending (Regulation Z)', note:'17 Results matching keyword' },
  { no:'12 CFR 1026.18', title:'Content of disclosures', desc:'Creditors must disclose the finance charge, APR, amount financed and payment schedule before consummation.', type:'CFR', unread:false, hi:false },
  { no:'12 CFR 1026.19', title:'Residential mortgage & variable-rate transactions', desc:'Timing and content of early and revised loan-estimate disclosures for home-secured credit.', type:'CFR', unread:false, hi:false },
  { no:'12 CFR 1026.23', title:'Right of rescission', desc:'A borrower&rsquo;s three-business-day right to rescind certain credit secured by a principal dwelling.', type:'CFR', unread:true,  hi:true },
  { no:'15 USC 1601',    title:'Congressional findings & declaration of purpose', desc:'Statutory basis of the Truth in Lending Act and informed use of consumer credit.', type:'USC', unread:false, hi:false },
  { no:'12 CFR 1026.40', title:'Requirements for home-equity plans', desc:'Disclosure and substantive limits applicable to open-end home-equity lines of credit.', type:'CFR', unread:true,  hi:true },
  { no:'12 CFR 1026.43', title:'Minimum standards for transactions', desc:'Ability-to-repay determination and qualified-mortgage standards for covered loans.', type:'CFR', unread:true,  hi:true },
  { no:'CA Fin §4970',   title:'Covered loans — consumer disclosures', desc:'California disclosures for high-cost, covered consumer mortgage loans.', type:'CA',  unread:false, hi:false },
  { no:'12 CFR 1026.55', title:'Limitations on increasing APRs', desc:'Restricts a card issuer from raising the annual percentage rate on an existing balance.', type:'CFR', unread:false, hi:false },
  { no:'15 USC 1640',    title:'Civil liability', desc:'Damages and statutory penalties available for Truth in Lending violations.', type:'USC', unread:false, hi:false },
];

/* card-view items (exploration result cards) */
const CARDS = [
  { no:'12 CFR 1026.18', regs:'5 Regulations', title:'Content of required Truth-in-Lending disclosures', src:'Code of Federal Regulations (Title 12)' },
  { no:'12 CFR 1005.11', regs:'4 Regulations', title:'Procedures for resolving electronic fund transfer errors', src:'Code of Federal Regulations (Title 12)' },
  { no:'31 CFR 1010.230',regs:'7 Regulations', title:'Beneficial ownership requirements for legal entity customers', src:'Bank Secrecy Act / FinCEN' },
  { no:'12 CFR 1026.23', regs:'3 Regulations', title:'Right of rescission for dwelling-secured credit', src:'Code of Federal Regulations (Title 12)' },
  { no:'15 USC 1681',    regs:'9 Regulations', title:'Fair Credit Reporting Act — permissible purposes', src:'United States Code (Title 15)' },
  { no:'12 CFR 217.10',  regs:'6 Regulations', title:'Minimum risk-based capital ratios for banking organizations', src:'Code of Federal Regulations (Title 12)' },
];

/* saved explorations (Task 9) */
const EXPLORATIONS = [
  { name:'Consumer Lending — APR Disclosures', kw:'APR, finance charge, disclosure', jur:'US Federal', corpus:'CFR', desc:'Reg Z disclosure obligations across closed- and open-end credit.' },
  { name:'BSA / AML Onboarding Controls',       kw:'CDD, beneficial ownership',      jur:'US Federal', corpus:'CFR', desc:'Customer due-diligence and beneficial-ownership rules for new accounts.' },
  { name:'Mortgage Servicing Standards',        kw:'RESPA, escrow, servicing',       jur:'US Federal', corpus:'CFR', desc:'Reg X servicing, loss-mitigation and escrow requirements.' },
  { name:'Fair Credit Reporting',               kw:'FCRA, permissible purpose',      jur:'US Federal', corpus:'USC', desc:'Permissible-purpose and adverse-action rules under the FCRA.' },
  { name:'Electronic Fund Transfers',           kw:'Reg E, error resolution',        jur:'US Federal', corpus:'CFR', desc:'Consumer protections and error-resolution timelines for EFTs.' },
  { name:'California Covered Loans',             kw:'covered loan, high cost',        jur:'California', corpus:'State', desc:'California-specific high-cost mortgage disclosure rules.' },
  { name:'Capital Adequacy — Reg Q',            kw:'risk-based capital, Tier 1',     jur:'US Federal', corpus:'CFR', desc:'Minimum risk-based and leverage capital ratios.' },
  { name:'NY DFS Cybersecurity',                kw:'Part 500, incident reporting',   jur:'New York',   corpus:'State', desc:'Cybersecurity program and 72-hour incident notification rules.' },
  { name:'Truth in Lending — Rescission',       kw:'rescission, 3-day right',        jur:'US Federal', corpus:'CFR', desc:'Rescission timing for dwelling-secured consumer credit.' },
  { name:'Securities Anti-Fraud (10b-5)',       kw:'manipulation, material misstatement', jur:'US Federal', corpus:'CFR', desc:'Prohibition on manipulative and deceptive devices.' },
];

/* regulations hierarchy grouped by location */
const REGIONS = [
  { name:'Asia Pacific', open:false, states:[] },
  { name:'Europe',       open:false, states:[] },
  { name:'Latin America',open:false, states:[] },
  { name:'North America',open:true, states:[
    { name:'US Federal', docs:100, risks:20, ctrls:10, regs:[
      { no:'12 CFR 1026', txt:'Truth in Lending (Regulation Z) — disclosure of credit terms and consumer protections.', risks:4, ctrls:3, items:[
        { k:'Risk', t:'Inaccurate APR disclosure exposes the institution to TILA civil liability.', type:'risk' },
        { k:'Control', t:'Automated APR validation on every loan estimate prior to issuance.', type:'ctrl' },
        { k:'Risk', t:'Missed rescission window on dwelling-secured refinances.', type:'risk' },
      ]},
      { no:'31 CFR 1010', txt:'Bank Secrecy Act — recordkeeping, reporting and customer due-diligence rules.', risks:5, ctrls:4, items:[
        { k:'Control', t:'Beneficial-ownership collection workflow at account opening.', type:'ctrl' },
        { k:'Risk', t:'Failure to file SARs within the statutory 30-day window.', type:'risk' },
      ]},
    ]},
    { name:'California', docs:8, risks:3, ctrls:7, regs:[
      { no:'CA Fin §4970', txt:'Covered Loans — consumer disclosures for high-cost mortgage credit.', risks:1, ctrls:2, items:[
        { k:'Risk', t:'High-cost loan made without the required covered-loan disclosures.', type:'risk' },
        { k:'Control', t:'Pre-funding checklist enforcing California covered-loan notices.', type:'ctrl' },
      ]},
      { no:'CCPA §1798', txt:'California Consumer Privacy Act — consumer data rights and disclosures.', risks:2, ctrls:3, items:[
        { k:'Control', t:'Consumer data-access and deletion request handling within 45 days.', type:'ctrl' },
      ]},
    ]},
    { name:'New York', docs:10, risks:2, ctrls:5, regs:[
      { no:'23 NYCRR 500', txt:'DFS Cybersecurity Requirements for Financial Services Companies.', risks:2, ctrls:3, items:[
        { k:'Risk', t:'Cyber incident not reported to DFS within 72 hours.', type:'risk' },
        { k:'Control', t:'Automated 72-hour incident-notification routing to compliance.', type:'ctrl' },
      ]},
    ]},
    { name:'Texas', docs:6, risks:1, ctrls:4, regs:[] },
    { name:'Florida', docs:8, risks:7, ctrls:16, regs:[] },
    { name:'Illinois', docs:5, risks:2, ctrls:3, regs:[] },
    { name:'Washington', docs:4, risks:1, ctrls:3, regs:[] },
    { name:'Massachusetts', docs:7, risks:2, ctrls:5, regs:[] },
  ]},
];

/* dashboard favourites */
const FAVS = [
  { no:'12 CFR 1026.18', t:'Content of required disclosures' },
  { no:'31 CFR 1010.230',t:'Beneficial ownership — legal entity customers' },
  { no:'15 USC 1681',    t:'Fair Credit Reporting Act — purposes' },
  { no:'12 CFR 1005.11', t:'EFT error-resolution procedures' },
  { no:'23 NYCRR 500',   t:'DFS cybersecurity requirements' },
  { no:'12 CFR 217.10',  t:'Minimum risk-based capital ratios' },
  { no:'12 CFR 1024.41', t:'RESPA loss-mitigation procedures' },
  { no:'17 CFR 240.10b-5',t:'Manipulative & deceptive devices' },
];

/* ───────── View by: Law Type accordion ───────── */
const LAW_TYPES = [
  { code:'CFR', name:'Code of Federal Regulations', count:42, regs:[
    { no:'12 CFR 1026.18', title:'Content of disclosures', jur:'US Federal' },
    { no:'12 CFR 1005.11', title:'Procedures for resolving errors', jur:'US Federal' },
    { no:'31 CFR 1010.230',title:'Beneficial ownership requirements', jur:'US Federal' },
    { no:'12 CFR 217.10',  title:'Minimum capital requirements', jur:'US Federal' },
    { no:'17 CFR 240.10b-5',title:'Employment of manipulative devices', jur:'US Federal' },
  ]},
  { code:'USC', name:'United States Code', count:18, regs:[
    { no:'15 USC 1601', title:'Truth in Lending — findings & purpose', jur:'US Federal' },
    { no:'15 USC 1681', title:'Fair Credit Reporting Act', jur:'US Federal' },
    { no:'15 USC 1692', title:'Fair Debt Collection Practices Act', jur:'US Federal' },
    { no:'12 USC 1843', title:'Bank Holding Company Act — activities', jur:'US Federal' },
  ]},
  { code:'State', name:'State Statutes & Regulations', count:23, regs:[
    { no:'CA Fin §4970',  title:'Covered loans — consumer disclosures', jur:'California' },
    { no:'23 NYCRR 500',  title:'DFS cybersecurity requirements', jur:'New York' },
    { no:'TX Fin §342',   title:'Consumer loan rate & disclosure rules', jur:'Texas' },
  ]},
  { code:'Guidance', name:'Supervisory Guidance & Bulletins', count:11, regs:[
    { no:'CFPB Bull. 2013-07', title:'Responsible debt-collection practices', jur:'US Federal' },
    { no:'OCC 2011-12',        title:'Sound practices for model risk management', jur:'US Federal' },
  ]},
];

/* ───────── Jurisdiction: US tile-grid map + per-state laws ───────── */
const US_TILES = [
  ['AK',0,0],['ME',0,10],
  ['VT',1,9],['NH',1,10],
  ['WA',2,0],['ID',2,1],['MT',2,2],['ND',2,3],['MN',2,4],['IL',2,5],['WI',2,6],['MI',2,7],['NY',2,8],['RI',2,9],['MA',2,10],
  ['OR',3,0],['NV',3,1],['WY',3,2],['SD',3,3],['IA',3,4],['IN',3,5],['OH',3,6],['PA',3,7],['NJ',3,8],['CT',3,9],
  ['CA',4,0],['UT',4,1],['CO',4,2],['NE',4,3],['MO',4,4],['KY',4,5],['WV',4,6],['VA',4,7],['MD',4,8],['DE',4,9],
  ['AZ',5,1],['NM',5,2],['KS',5,3],['AR',5,4],['TN',5,5],['NC',5,6],['SC',5,7],['DC',5,8],
  ['OK',6,3],['LA',6,4],['MS',6,5],['AL',6,6],['GA',6,7],
  ['HI',7,0],['TX',7,3],['FL',7,8],
];
const STATE_NAMES = {AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',CO:'Colorado',CT:'Connecticut',DE:'Delaware',DC:'District of Columbia',FL:'Florida',GA:'Georgia',HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',KY:'Kentucky',LA:'Louisiana',ME:'Maine',MD:'Maryland',MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',MS:'Mississippi',MO:'Missouri',MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',NM:'New Mexico',NY:'New York',NC:'North Carolina',ND:'North Dakota',OH:'Ohio',OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',VA:'Virginia',WA:'Washington',WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming'};
const STATE_LAWS = {
  CA:[
    { no:'CA Fin §4970', title:'Covered Loans — high-cost mortgage disclosures', type:'State' },
    { no:'CCPA §1798.100', title:'California Consumer Privacy Act — right to know', type:'State' },
    { no:'CA Fin §22000', title:'California Financing Law — lender licensing', type:'State' },
    { no:'CA Civ §1788', title:'Rosenthal Fair Debt Collection Practices Act', type:'State' },
  ],
  NY:[
    { no:'23 NYCRR 500', title:'DFS Cybersecurity Requirements', type:'State' },
    { no:'NY Banking §340', title:'Licensed lenders — small-loan rate caps', type:'State' },
    { no:'23 NYCRR 419', title:'Mortgage servicing business conduct rules', type:'State' },
  ],
  TX:[
    { no:'TX Fin §342', title:'Consumer Loans — rate and disclosure rules', type:'State' },
    { no:'TX Fin §392', title:'Debt Collection Act', type:'State' },
  ],
  FL:[
    { no:'FL Stat §494', title:'Loan Originators and Mortgage Brokers', type:'State' },
    { no:'FL Stat §501.171', title:'Security of confidential personal information', type:'State' },
  ],
  IL:[
    { no:'815 ILCS 122', title:'Payday Loan Reform Act', type:'State' },
    { no:'815 ILCS 530', title:'Personal Information Protection Act', type:'State' },
  ],
  WA:[
    { no:'RCW 31.04', title:'Consumer Loan Act', type:'State' },
    { no:'RCW 19.255', title:'Personal information — notice of security breaches', type:'State' },
  ],
  MA:[
    { no:'209 CMR 32', title:'Disclosure of consumer credit costs', type:'State' },
    { no:'201 CMR 17', title:'Standards for protecting personal information', type:'State' },
  ],
};
