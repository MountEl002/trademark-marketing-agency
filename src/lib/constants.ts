export const FIREBASE_COLLECTIONS = {
  USERS: "users",
  BALANCES: "balances",
  ORDER_NUMBERS: "orderNumbers",
  UNREGISTERED_USERNAMES: "unregisteredUsernames",
  UNREGISTERED_USER_NUMBERS: "unregisteredUserNumbers",
  USER_NUMBERS: "userNumbers",
  ORDERS: "orders",
  TRANSACTIONS: "transactions",
  TRANSACTION_NUMBERS: "transactionNumbers",
  COUNTERS: "counters",
  ORDER_FILES: "orderFiles",
  PUBLIC_FILES: "publicFiles",
  CHAT_FILES: "chatFiles",
  REGISTERED_USERS_CHATS: "registeredUsersChats",
  UNREGISTERED_USERS_CHATS: "unregisteredUsersChats",
  CHAT_MESSAGES: "messages",
} as const;

export type FirestoreCollection =
  (typeof FIREBASE_COLLECTIONS)[keyof typeof FIREBASE_COLLECTIONS];

export const DB_NAMES = {
  CHAT_FILES: "chat-files",
  ORDER_FILES: "order-files",
  AUTHENTICATED_CHAT: "authenticated-chat-messages",
  AUTHENTICATED_CHAT_FILES: "authenticated-chat-files",
  UNAUTHENTICATED_CHAT: "unauthenticated-chat-messages",
  UNAUTHENTICATED_CHAT_FILES: "unauthenticated-chat-files",
  ADMIN_CHATS_AND_MESSAGES: "admin-chats-and-messges",
  ADMIN_CHAT_FILES: "admin-chat-files",
  USER_DOCS: "user-docs",
  TEMP_FILES: "temp-files",
  MEDIA_CACHE: "media-cache",
} as const;

export type DatabaseName = (typeof DB_NAMES)[keyof typeof DB_NAMES];

export const COMMON_CONSTANTS = {
  FILE: "file",
  USER_ID: "userId",
  FIREBASE_COLLECTION: "firebaseCollection",
  ORDER_NUMBER: "orderNumber",
  UPLOAD_PROGRESS: "uploadProgress",
  BALANCES: "balances",
  ORDER_FILES: "orderFiles",
  SUBMISSION_FILES: "submissionFiles",
  FILES_FIELD: "filesField",
} as const;

export type CommonConstant =
  (typeof COMMON_CONSTANTS)[keyof typeof COMMON_CONSTANTS];

export const COMMON_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  REGISTER: "/register",
  CODE_OF_CONDUCT: "/code-of-conduct",
  CONFIDENTIALITY_POLICY: "/confidentiality-policy",
  COOKIE_POLICY: "/cookie-policy",
  DELETE_MY_DATA: "/delete-my-data",
  FORGOT_PASSWORD: "/forgot-password",
  TERMS_AND_CONDITIONS: "/terms-and-conditions",
  PRIVACY_POLICY: "/privacy-policy",
  DISCOUNT_POLICY: "/discount-policy",
  REFUND_POLICY: "/refund-policy",
  CONTACT_US: "/contact-us",
  ABOUT_US: "/about-us",
  FAQ: "/#homepage-faq",
  REVIEWS: "/reviews",
  HOW_TO_ORDER: "/how-to-order",
  MONEY_BACK_GUARANTEE: "/money-back-guarantee",
  REFERRAL_PROGRAM: "/referral-program",
  FREE_PAPERS: "/resources/free-papers",
  BLOG: "/resources/blog",
  WRITING_RESOURCES: "/resources/writing-resources",
  WHY_CHOOSE_US: "why-choose-us",
  ALL_ORDERS: "/customer/orders",
  NEW_ORDER: "/customer/orders/new",
  ACTIVE_ORDERS: "/customer/orders/active",
  DRAFT_ORDERS: "/customer/orders/drafts",
  COMPLETED_ORDERS: "/customer/orders/completed",
  CANCELLED_ORDERS: "/customer/orders/cancelled",
  CLOSED_ORDERS: "/customer/orders/closed",
  DISPUTED_ORDERS: "/customer/orders/disputed",
  REFUNDED_ORDERS: "/customer/orders/refunded",
  NOTIFICATIONS: "/customer/notifications",
} as const;

export type CommonRoute = (typeof COMMON_ROUTES)[keyof typeof COMMON_ROUTES];

export const ORDER_STATUSES = {
  DRAFT: "Draft",
  ACTIVE: "Active",
  COMPLETED: "Completed",
  CLOSED: "Closed",
  NEW: "New",
  CANCELLED: "Cancelled",
  DISPUTED: "Disputed",
  REFUNDED: "Refunded",
  ALL: "All",
} as const;
export type OrderStatus = (typeof ORDER_STATUSES)[keyof typeof ORDER_STATUSES];

export const CUSTOMER_TRANSACTION_TYPES = {
  DEPOSIT: "Deposit",
  WITHDRAWAL: "Withdrawal",
  ORDER_PAYMENT: "Order Payment",
  REFUND: "Refund",
  REGISTRATION_BONUS: "Registration Bonus",
  DISCOUNT: "Discount",
  Bonus: "Bonus",
} as const;

export type CustomerTransactionType =
  (typeof CUSTOMER_TRANSACTION_TYPES)[keyof typeof CUSTOMER_TRANSACTION_TYPES];

export const FILE_UPLOAD_STATUSES = {
  PENDING: "pending",
  UPLOADING: "uploading",
  COMPLETED: "completed",
  ERROR: "error",
} as const;

export type FileUploadStatus =
  (typeof FILE_UPLOAD_STATUSES)[keyof typeof FILE_UPLOAD_STATUSES];

export const FILE_DELETE_STATUSES = {
  PENDING: "pending",
  UPLOADING: "deleting",
  COMPLETED: "completed",
  ERROR: "error",
} as const;

export type FileDeleteStatus =
  (typeof FILE_DELETE_STATUSES)[keyof typeof FILE_DELETE_STATUSES];

export const FILE_DELETE_STRATEGIES = {
  DELETE_DOCUMENT: "deleteDocument",
  REVOVE_FROM_ARRAY: "removeFromArray",
} as const;

export type FileDeleteStrategy =
  (typeof FILE_DELETE_STRATEGIES)[keyof typeof FILE_DELETE_STRATEGIES];

export const CHAT_TYPES = {
  REGISTERED_USERS_CHATS: "registeredUsersChats",
  UNREGISTERED_USERS_CHATS: "unregisteredUsersChats",
} as const;

export type ChatType = (typeof CHAT_TYPES)[keyof typeof CHAT_TYPES];

export const BALANCE_TYPES = {
  BONUS_BALANCE: "bonus",
  CURRENT_BALANCE: "current",
};

export type BalanceType = (typeof BALANCE_TYPES)[keyof typeof BALANCE_TYPES];

export const OTHER_ROUTES = {
  USER_PROFILE: "/customer/user-profile",
  ANALYTICAL_ESSAY: "/services/analytical-essay-writing-service",
  ANNOTATED_BIBLIOGRAPHY: "/services/annotated-bibliography-writing-service",
  APA_PAPER: "/services/apa-paper-writing-service",
  ARGUMENTATIVE_ESSAY: "/services/argumentative-essay-writing-service",
  CASE_STUDY: "/services/case-study-writing-service",
  CAPSTONE_PROJECT: "/services/capstone-project-writing-service",
  ARTICLE_REVIEW: "/services/article-review-writing-service",
  ASSIGNMENT: "/services/assignment-writing-service",
  BOOK_REVIEW: "/services/book-review-writing-service",
  COLLEGE_ESSAY: "/services/college-essay-writing-service",
  CUSTOM_ESSAY: "/services/custom-essay-writing-service",
  COURSEWORK: "/services/coursework-writing-service",
  DISSERTATION: "/services/dissertation-writing-service",
  EXPOSITORY_ESSAY: "/services/expository-essay-writing-service",
  GRADUATE_SCHOOL_ESSAY: "/services/graduate-school-essay-writing-service",
  LAB_REPORT: "/services/lab-report-writing-service",
  LITERATURE_REVIEW: "/services/literature-review-writing-service",
  MEDICAL_SCHOOL_ESSAY: "/services/medical-school-essay-writing-service",
  MBA_ESSAY: "/services/mba-essay-writing-service",
  NARRATIVE_ESSAY: "/services/narrative-essay-writing-service",
  PERSUASIVE_ESSAY: "/services/persuasive-essay-writing-service",
  REPORT_WRITING: "/services/report-writing-service",
  SCHOLARSHIP_ESSAY: "/services/scholarship-essay-writing-service",
  SPEECH_WRITING: "/services/speech-writing-service",
  DESCRIPTIVE_ESSAY: "/services/descriptive-essay-writing-service",
  NURSING_ASSIGNMENT_HELP: "/services/nursing-assignment-help",
  BIOLOGY_HOMEWORK_HELP: "/services/biology-homework-help",
  HISTORY_HOMEWORK_HELP: "/services/history-homework-help",
  SCIENCE_ASSIGNMENT_HELP: "/services/science-assignment-help",
  LAW_ASSIGNMENT_HELP: "/services/law-assignment-help",
  MEDICAL_ASSIGNMENT_HELP: "/services/medical-assignment-help",
  POWERPOINT_PRESENTATION: "/services/powerpoint-presentation-writing-service",
  ART_ESSSAY: "/services/art-essay-writing-service",
  BIOLOGY_ESSAY: "/services/biology-essay-writing-service",
  BUSINESS_ESSAY: "/services/business-essay-writing-service",
  BUSINESS_MANAGEMENT_ASSIGNMENT_HELP:
    "/services/business-management-assignment-help",
  BOOK_REPORT: "/services/book-report-writing-service",
  ECONOMICS_ESSAY: "/services/economics-essay-writing-service",
  HISTORY_ESSAY: "/services/history-essay-writing-service",
  LAW_ESSAY: "/services/law-essay-writing-service",
  NURSING_ESSAY: "/services/nursing-essay-writing-service",
  PHILOSOPHY_ESSAY: "/services/philosophy-essay-writing-service",
  POLITICAL_SCIENCE_ESSAY: "/services/political-science-essay-writing-service",
  PSYCHOLOGY_ESSAY: "/services/psychology-essay-writing-service",
  SOCIOLOGY_ESSAY: "/services/sociology-essay-writing-service",
  BUSINESS_ASSIGNMENT_HELP: "/services/business-assignment-help",
  TERM_PAPER_WRITING: "/services/term-paper-writing-service",
  THESIS_WRITING: "/services/thesis-writing-service",
  RESEARCH_PAPER_WRITING: "/services/research-paper-writing-service",
  ADMISSION_ESSAY_WRITING: "/services/admission-essay-writing-service",
  ACADEMIC_ESSAY_WRITING: "/services/academic-essay-writing-service",
  DO_MY_HOME_WORK: "/services/do-my-homework",
  URGENT_PAPER_WRITING: "/services/urgent-paper-writing-service",
  PERSONAL_STATEMENT_WRITING: "/services/personal-statement-writing-service",
  FINANCE_ESSAY: "/services/finance-essay-writing-service",
  ENGLISH_ASSIGNMENT_HELP: "/services/english-assignment-help",
  ACCOUNTING_HOMEWOKR_HELP: "/services/accounting-homework-help",
  JAVA_ASSIGNMENT_HELP: "/services/java-assignment-help",
  //* Buy or pay or take group
  BUY_ESSAY: "/services/buy-essay",
  BUY_COLLEGE_PAPERS: "/services/buy-college-papers",
  BUY_RESEARCH_PAPERS: "/services/buy-research-papers",
  BUY_THESIS_PAPER: "/services/buy-thesis-paper",
  BUY_PERSONAL_STATEMENT: "/services/buy-personal-statement",
  BUY_BOOK_REPORT: "/services/buy-book-report",
  BUY_CAPSTONE_PROJECT: "/services/buy-capstone-project",
  BUY_COURSEWROK: "/services/buy-coursework",
  BUY_SPEECH: "/services/buy-speech",
  PAY_FOR_HOMEWORK: "/services/pay-for-homework",
  BUY_ASSIGNMENT: "/services/buy-assignment",
  BUY_COLLEGE_ESSAY: "/services/buy-college-essay",
  BUY_DISSERTATION: "/services/buy-dissertation",
  BUY_TERM_PAPER: "/services/buy-term-paper",
  WRITE_ESSAYS_FOR_MONEY: "/services/write-essays-for-money",
  TAKE_MY_ONLINE_CLASS: "/services/take-my-online-class",
  //*Do or write group
  CHEAP_RESEARCH_PAPERS: "/services/cheap-research-papers",
  DO_MY_COMPUTER_SCIENCE_HOMEWORK: "/services/do-my-computer-science-homework",
  DO_MY_STATISTICS_HOMEWORK: "/services/do-my-statistics-homework",
  FINANCE_ASSIGNMENT_HELP: "/services/finance-assignment-help",
  PHYSICS_HELP: "/services/physics-help",
  TERM_PAPER_HELP: "/services/term-paper-help",
  WRITE_MY_COURSEWORK: "/services/write-my-coursework",
  WRITE_MY_PARAGRAPH: "/services/write-my-paragraph",
  DO_MY_PROGRAMMING_HOMEWORK: "/services/do-my-programming-homework",
  DISSERTATION_PROPOSAL_WRITING_HELP:
    "/services/dissertation-proposal-writing-help",
  DO_MY_MATH_HOMEWORK: "/services/do-my-math-homework",
  DO_MY_CHEMISTRY_HOMEWORK: "/services/do-my-chemistry-homework",
  ESSAYS_FOR_SALE: "/services/essays-for-sale",
  MBA_ASSIGNMENT_HELP: "/services/mba-assignment-help",
  RESEARCH_PAPERS_FOR_SALE: "/services/research-papers-for-sale",
  TERM_PAPER_FOR_SALE: "/services/term-paper-for-sale",
  WRITE_MY_LITERATURE_REVIEW: "/services/write-my-literature-review",
  WRITE_MY_PERSONAL_STATEMENT: "/services/write-my-personal-statement",
  DO_MY_ASSIGNMENT: "/services/do-my-assignment",
  DO_MY_EXEL_HOMEWORK: "/services/do-my-exel-homework",
  DO_MY_PROJECT: "/services/do-my-project",
  ESSAY_EDITING_SERVICE: "/services/essay-editing-service",
  PAY_FOR_RESEARCH_PAPER: "/services/pay-for-research-paper",
  PROJECT_MANAGEMENT_ASSIGNMENT_HELP:
    "/services/project-management-assignment-help",
  REWRITE_MY_ESSAY: "/services/rewrite-my-essay",
  WRITE_MY_CASE_STUDY: "/services/write-my-case-study",
  MARKETING_ASSIGNMENT_HELP: "/services/marketing-assignment-help",
} as const;

export type OtherRoute = (typeof OTHER_ROUTES)[keyof typeof OTHER_ROUTES];

export const ADMIN_ROUTES = {
  CUSTOMERS: "/admin/customers",
  CUSTOMER: "/admin/customers/",
  ACTIVE_ORDERS: "/orders/active-orders",
  DRAFT_ORDERS: "/orders/draft-orders",
  ALL_ORDERS: "/orders/all-orders",
} as const;

export type AdminRoute = (typeof ADMIN_ROUTES)[keyof typeof ADMIN_ROUTES];

export const academicLevels = [
  { id: "1", name: "Middle School" },
  { id: "2", name: "High School" },
  { id: "3", name: "College" },
  { id: "4", name: "Bachelor's" },
  { id: "5", name: "Master's" },
  { id: "6", name: "PhD" },
];

export const addOns = [
  { id: "1", name: "1-Page abstract", price: 3.3 },
  { id: "2", name: "Graphics & tables", price: 2.3 },
  { id: "3", name: "Printable sources", price: 2.0 },
  { id: "4", name: "Detailed outline", price: 2.5 },
  { id: "5", name: "Plagiarism & AI report", price: 0 },
];

export const mandatoryAddOns = [
  { id: "1", name: "Unlimited revisions", price: 0 },
  { id: "2", name: "Unlimited sources", price: 0 },
  { id: "3", name: "Title page and formatting", price: 0 },
  { id: "4", name: "Unlimited progress updates", price: 0 },
  { id: "5", name: "Premium service", price: 0 },
];

export interface AssignmentOption {
  id: string;
  name: string;
  category: "Popular" | "Assignment" | "HomeWork" | "Questions" | "";
}

export const popularAssignmentButtons: PopularButtons[] = [
  { id: 1, name: "Essay (any type)" },
  { id: 2, name: "Research paper" },
  { id: 3, name: "Discussion post" },
  { id: 4, name: "Homework (any type)" },
  { id: 5, name: "Case study" },
  { id: 6, name: "PowerPoint presentation with speaker notes" },
];

export const assignmentOptions: AssignmentOption[] = [
  // Popular category
  { id: "1", name: "Essay (any type)", category: "Popular" },
  { id: "2", name: "Research paper", category: "Popular" },
  { id: "3", name: "Discussion post", category: "Popular" },
  {
    id: "4",
    name: "PowerPoint presentation with speaker notes",
    category: "Popular",
  },
  { id: "5", name: "Homework (any type)", category: "Popular" },
  { id: "6", name: "Case study", category: "Popular" },

  // Assignment category
  { id: "7", name: "Essay (any type)", category: "Assignment" },
  { id: "8", name: "Admission essay", category: "Assignment" },
  { id: "9", name: "Analyisis (any type)", category: "Assignment" },
  { id: "10", name: "Annotated bibliography", category: "Assignment" },
  { id: "11", name: "Article (written)", category: "Assignment" },
  { id: "12", name: "Book/movie review", category: "Assignment" },
  { id: "13", name: "Business plan", category: "Assignment" },
  { id: "14", name: "Business proposal", category: "Assignment" },
  { id: "15", name: "Case study", category: "Assignment" },
  { id: "16", name: "Coursework", category: "Assignment" },
  { id: "17", name: "Capstone project", category: "Assignment" },
  { id: "18", name: "Creative writing", category: "Assignment" },
  { id: "19", name: "Critical thinking", category: "Assignment" },
  { id: "20", name: "Discussion post", category: "Assignment" },
  { id: "21", name: "Lab report", category: "Assignment" },
  { id: "22", name: "Letter/Memos", category: "Assignment" },
  { id: "23", name: "Literature review", category: "Assignment" },
  { id: "24", name: "Outline", category: "Assignment" },
  { id: "25", name: "Personal narrative", category: "Assignment" },
  { id: "26", name: "Presentation or speech", category: "Assignment" },
  { id: "27", name: "Reaction paper", category: "Assignment" },
  { id: "28", name: "Reflective writing", category: "Assignment" },
  { id: "29", name: "Report", category: "Assignment" },
  { id: "30", name: "Research paper", category: "Assignment" },
  { id: "31", name: "Research proposal", category: "Assignment" },
  { id: "32", name: "Systematic review", category: "Assignment" },
  { id: "33", name: "Term paper", category: "Assignment" },
  { id: "34", name: "Thesis / Dissertation", category: "Assignment" },
  { id: "35", name: "PowerPoint presentation", category: "Assignment" },
  {
    id: "36",
    name: "PowerPoint presentaion with speaker notes",
    category: "Assignment",
  },

  // Homework category
  { id: "37", name: "Homework (any type)", category: "HomeWork" },
  { id: "38", name: "Biology", category: "HomeWork" },
  { id: "39", name: "Chemistry", category: "HomeWork" },
  { id: "40", name: "Engineering", category: "HomeWork" },
  { id: "41", name: "Geography", category: "HomeWork" },
  { id: "42", name: "Mathematics", category: "HomeWork" },
  { id: "43", name: "Physics", category: "HomeWork" },
  { id: "44", name: "Statistics", category: "HomeWork" },
  { id: "45", name: "Marketing", category: "HomeWork" },
  { id: "46", name: "Programming", category: "HomeWork" },
  { id: "47", name: "Excel", category: "HomeWork" },
  { id: "48", name: "Economics", category: "HomeWork" },
  { id: "49", name: "Accounting", category: "HomeWork" },

  // Questions category
  { id: "50", name: "Multiple choice questions", category: "Questions" },
  { id: "51", name: "Short answer questions", category: "Questions" },

  // Other category
  { id: "52", name: "Other", category: "" },
  { id: "53", name: "Let's Talk", category: "" },
];

export interface PopularButtons {
  id: number;
  name: string;
  hours?: number;
}

export const popularDeadlineButtons: PopularButtons[] = [
  { id: 1, name: "3 hours", hours: 3 },
  { id: 2, name: "6 hours", hours: 6 },
  { id: 3, name: "12 hours", hours: 12 },
  { id: 4, name: "1 day", hours: 24 },
  { id: 5, name: "2 days", hours: 48 },
  { id: 6, name: "3 days", hours: 72 },
  { id: 7, name: "4 days", hours: 96 },
  { id: 8, name: "5 days", hours: 120 },
  { id: 9, name: "6 days", hours: 144 },
  { id: 10, name: "7 days", hours: 168 },
  { id: 11, name: "8 days", hours: 192 },
  { id: 12, name: "9 days", hours: 216 },
  { id: 13, name: "10 days", hours: 240 },
  { id: 14, name: "12 days", hours: 288 },
  { id: 15, name: "15 days", hours: 360 },
  { id: 16, name: "18 days", hours: 432 },
  { id: 17, name: "25 days", hours: 600 },
  { id: 18, name: "30 days", hours: 720 },
  { id: 19, name: "45 days", hours: 1080 },
];

export const languages = [
  { id: "1", name: "English (US)" },
  { id: "2", name: "English (UK)" },
];

export const services = [
  { id: "1", name: "Writing" },
  { id: "2", name: "Rewriting" },
  { id: "3", name: "Editing" },
  { id: "4", name: "Proofreading" },
];

// Parse the initial value string to extract pages/words
export const parseValueString = (
  value: string
): {
  pages: string;
  words: string;
  spacing: LineSpacingType;
} | null => {
  if (!value) return null;

  const match = value.match(
    /^(\d+) words, \(~ (\d+\.?\d*) page(?:s)?\), (Single|Double) spacing$/
  );
  if (!match) return null;

  return {
    pages: match[2],
    words: match[1],
    spacing: match[3] as LineSpacingType,
  };
};

export type LineSpacingType = "Single" | "Double";
export type ModeType = "Pages" | "Words";

export const WORDS_INCREMENT = 25;
export const PAGES_INCREMENT = 1;

export interface SourcesOption {
  id: number;
  name: string;
  category: "Popular" | "All options";
}

export const popularSourcesButtons: PopularButtons[] = [
  { id: 0, name: "Not specified" },
  { id: 1, name: "1 source required" },
  { id: 2, name: "2 sources required" },
  { id: 3, name: "3 sources required" },
  { id: 4, name: "4 sources required" },
  { id: 5, name: "5 sources required" },
  { id: 6, name: "6 sources required" },
  { id: 7, name: "10 sources required" },
  { id: 8, name: "15 sources required" },
];

export const sourcesOptions: SourcesOption[] = [
  // Popular category
  { id: 0, name: "Not specified", category: "Popular" },
  { id: 1, name: "1 source required", category: "Popular" },
  { id: 2, name: "2 sources required", category: "Popular" },
  { id: 3, name: "3 sources required", category: "Popular" },
  { id: 4, name: "4 sources required", category: "Popular" },
  { id: 5, name: "5 sources required", category: "Popular" },
  { id: 6, name: "6 sources required", category: "Popular" },
  { id: 7, name: "10 sources required", category: "Popular" },
  { id: 8, name: "15 sources required", category: "Popular" },

  // All options category
  { id: 0, name: "Not specified", category: "All options" },
  { id: 1, name: "1 source required", category: "All options" },
  { id: 2, name: "2 sources required", category: "All options" },
  { id: 3, name: "3 sources required", category: "All options" },
  { id: 4, name: "4 sources required", category: "All options" },
  { id: 5, name: "5 sources required", category: "All options" },
  { id: 6, name: "6 sources required", category: "All options" },
  { id: 7, name: "7 sources required", category: "All options" },
  { id: 8, name: "8 sources required", category: "All options" },
  { id: 9, name: "9 sources required", category: "All options" },
  { id: 10, name: "10 sources required", category: "All options" },
  { id: 11, name: "11 sources required", category: "All options" },
  { id: 12, name: "12 sources required", category: "All options" },
  { id: 13, name: "13 sources required", category: "All options" },
  { id: 14, name: "14 sources required", category: "All options" },
  { id: 15, name: "15 sources required", category: "All options" },
  { id: 16, name: "16 sources required", category: "All options" },
  { id: 17, name: "17 sources required", category: "All options" },
  { id: 18, name: "18 sources required", category: "All options" },
  { id: 19, name: "19 sources required", category: "All options" },
  { id: 20, name: "20 sources required", category: "All options" },
  { id: 21, name: "21 sources required", category: "All options" },
  { id: 22, name: "22 sources required", category: "All options" },
  { id: 23, name: "23 sources required", category: "All options" },
  { id: 24, name: "24 sources required", category: "All options" },
  { id: 25, name: "25 sources required", category: "All options" },
  { id: 26, name: "26 sources required", category: "All options" },
  { id: 27, name: "27 sources required", category: "All options" },
  { id: 28, name: "28 sources required", category: "All options" },
  { id: 29, name: "29 sources required", category: "All options" },
  { id: 30, name: "30 sources required", category: "All options" },
  { id: 31, name: "31 sources required", category: "All options" },
  { id: 32, name: "32 sources required", category: "All options" },
  { id: 33, name: "33 sources required", category: "All options" },
  { id: 34, name: "34 sources required", category: "All options" },
  { id: 35, name: "35 sources required", category: "All options" },
  { id: 36, name: "36 sources required", category: "All options" },
  { id: 37, name: "37 sources required", category: "All options" },
  { id: 38, name: "38 sources required", category: "All options" },
  { id: 39, name: "39 sources required", category: "All options" },
  { id: 40, name: "40 sources required", category: "All options" },
  { id: 41, name: "41 sources required", category: "All options" },
  { id: 42, name: "42 sources required", category: "All options" },
  { id: 43, name: "43 sources required", category: "All options" },
  { id: 44, name: "44 sources required", category: "All options" },
  { id: 45, name: "45 sources required", category: "All options" },
  { id: 46, name: "46 sources required", category: "All options" },
  { id: 47, name: "47 sources required", category: "All options" },
  { id: 48, name: "48 sources required", category: "All options" },
  { id: 49, name: "49 sources required", category: "All options" },
  { id: 50, name: "50 sources required", category: "All options" },
  { id: 51, name: "51 sources required", category: "All options" },
  { id: 52, name: "52 sources required", category: "All options" },
  { id: 53, name: "53 sources required", category: "All options" },
  { id: 54, name: "54 sources required", category: "All options" },
  { id: 55, name: "55 sources required", category: "All options" },
  { id: 56, name: "56 sources required", category: "All options" },
  { id: 57, name: "57 sources required", category: "All options" },
  { id: 58, name: "58 sources required", category: "All options" },
  { id: 59, name: "59 sources required", category: "All options" },
  { id: 60, name: "60 sources required", category: "All options" },
  { id: 61, name: "61 sources required", category: "All options" },
  { id: 62, name: "62 sources required", category: "All options" },
  { id: 63, name: "63 sources required", category: "All options" },
  { id: 64, name: "64 sources required", category: "All options" },
  { id: 65, name: "65 sources required", category: "All options" },
  { id: 66, name: "66 sources required", category: "All options" },
  { id: 67, name: "67 sources required", category: "All options" },
  { id: 68, name: "68 sources required", category: "All options" },
  { id: 69, name: "69 sources required", category: "All options" },
  { id: 70, name: "70 sources required", category: "All options" },
  { id: 71, name: "71 sources required", category: "All options" },
  { id: 72, name: "72 sources required", category: "All options" },
  { id: 73, name: "73 sources required", category: "All options" },
  { id: 74, name: "74 sources required", category: "All options" },
  { id: 75, name: "75 sources required", category: "All options" },
  { id: 76, name: "76 sources required", category: "All options" },
  { id: 77, name: "77 sources required", category: "All options" },
  { id: 78, name: "78 sources required", category: "All options" },
  { id: 79, name: "79 sources required", category: "All options" },
  { id: 80, name: "80 sources required", category: "All options" },
  { id: 81, name: "81 sources required", category: "All options" },
  { id: 82, name: "82 sources required", category: "All options" },
  { id: 83, name: "83 sources required", category: "All options" },
  { id: 84, name: "84 sources required", category: "All options" },
  { id: 85, name: "85 sources required", category: "All options" },
  { id: 86, name: "86 sources required", category: "All options" },
  { id: 87, name: "87 sources required", category: "All options" },
  { id: 88, name: "88 sources required", category: "All options" },
  { id: 89, name: "89 sources required", category: "All options" },
  { id: 90, name: "90 sources required", category: "All options" },
  { id: 91, name: "91 sources required", category: "All options" },
  { id: 92, name: "92 sources required", category: "All options" },
  { id: 93, name: "93 sources required", category: "All options" },
  { id: 94, name: "94 sources required", category: "All options" },
  { id: 95, name: "95 sources required", category: "All options" },
  { id: 96, name: "96 sources required", category: "All options" },
  { id: 97, name: "97 sources required", category: "All options" },
  { id: 98, name: "98 sources required", category: "All options" },
  { id: 99, name: "99 sources required", category: "All options" },
  { id: 100, name: "100 sources required", category: "All options" },
];

export const styles = [
  { id: "1", name: "APA 6th edition" },
  { id: "2", name: "APA 7th edition" },
  { id: "3", name: "ASA" },
  { id: "4", name: "Bluebook" },
  { id: "5", name: "Chicago/Turabian" },
  { id: "6", name: "Harvard" },
  { id: "7", name: "IEE" },
  { id: "8", name: "MLA" },
  { id: "9", name: "OSCOLA" },
  { id: "10", name: "Vancouver" },
  { id: "11", name: "Other" },
  { id: "12", name: "Not applicable" },
];

export interface SubjectOption {
  id: string;
  name: string;
  category:
    | "Arts"
    | "Business administration"
    | "Computer science"
    | "Economics"
    | "Education"
    | "Engineering"
    | "English and Literature"
    | "Health and life sciences"
    | "History"
    | "Humanities"
    | "Legal"
    | "Marketing"
    | "Mathematics and statistics"
    | "Natural sciences"
    | "Philosophy"
    | "Political sciences"
    | "Social sciences";
}

export const SubjectOptions: SubjectOption[] = [
  // Arts category
  { id: "1", name: "Art", category: "Arts" },
  { id: "2", name: "Dance", category: "Arts" },
  { id: "3", name: "Design and modelling", category: "Arts" },
  {
    id: "4",
    name: "Drama and theater",
    category: "Arts",
  },
  { id: "5", name: "Fashion", category: "Arts" },
  { id: "6", name: "Music", category: "Arts" },
  { id: "7", name: "Painting", category: "Arts" },
  { id: "8", name: "Photography", category: "Arts" },
  { id: "9", name: "Visual arts", category: "Arts" },

  // Business administration category
  {
    id: "10",
    name: "Accounting",
    category: "Business administration",
  },
  {
    id: "11",
    name: "Business and management",
    category: "Business administration",
  },
  {
    id: "12",
    name: "Employee welfare",
    category: "Business administration",
  },
  { id: "13", name: "Entrepreneurship", category: "Business administration" },
  {
    id: "14",
    name: "Hospitality managment",
    category: "Business administration",
  },
  {
    id: "15",
    name: "Leadership",
    category: "Business administration",
  },
  {
    id: "16",
    name: "Logistics",
    category: "Business administration",
  },
  {
    id: "17",
    name: "Occupational safety and health administration",
    category: "Business administration",
  },

  // Computer science category
  {
    id: "18",
    name: "C#",
    category: "Computer science",
  },
  {
    id: "19",
    name: "C++",
    category: "Computer science",
  },
  {
    id: "20",
    name: "Code",
    category: "Computer science",
  },
  {
    id: "21",
    name: "Computer science",
    category: "Computer science",
  },
  {
    id: "22",
    name: "Cryptography",
    category: "Computer science",
  },
  {
    id: "23",
    name: "Cybersecurity",
    category: "Computer science",
  },
  {
    id: "24",
    name: "Digital science",
    category: "Computer science",
  },
  {
    id: "25",
    name: "Information technology (IT)",
    category: "Computer science",
  },
  {
    id: "26",
    name: "Java",
    category: "Computer science",
  },
  {
    id: "27",
    name: "JavaScript",
    category: "Computer science",
  },
  {
    id: "28",
    name: "PHP",
    category: "Computer science",
  },
  {
    id: "29",
    name: "Programming",
    category: "Computer science",
  },
  {
    id: "30",
    name: "Python",
    category: "Computer science",
  },
  {
    id: "31",
    name: "Sofware and applications",
    category: "Computer science",
  },
  {
    id: "32",
    name: "SQL",
    category: "Computer science",
  },
  {
    id: "33",
    name: "Web design",
    category: "Computer science",
  },

  // Economics category
  {
    id: "34",
    name: "Agriculture",
    category: "Economics",
  },
  {
    id: "35",
    name: "Economics",
    category: "Economics",
  },
  {
    id: "36",
    name: "Finance",
    category: "Economics",
  },
  {
    id: "37",
    name: "Investing and financial markets",
    category: "Economics",
  },

  // Education category
  {
    id: "38",
    name: "Apllication writing",
    category: "Education",
  },
  {
    id: "39",
    name: "Application and forms",
    category: "Education",
  },
  {
    id: "40",
    name: "Creative writing",
    category: "Education",
  },
  {
    id: "41",
    name: "Education",
    category: "Education",
  },
  {
    id: "42",
    name: "Research methods",
    category: "Education",
  },
  {
    id: "43",
    name: "Scholarship writing",
    category: "Education",
  },
  {
    id: "44",
    name: "Sex education",
    category: "Education",
  },
  {
    id: "45",
    name: "Special education",
    category: "Education",
  },
  {
    id: "46",
    name: "Study design",
    category: "Education",
  },
  {
    id: "47",
    name: "Writing",
    category: "Education",
  },

  // Engineering category
  {
    id: "48",
    name: "Architecture",
    category: "Engineering",
  },
  {
    id: "49",
    name: "Aviation",
    category: "Engineering",
  },
  {
    id: "50",
    name: "Engineering",
    category: "Engineering",
  },
  {
    id: "51",
    name: "Innovation and technology",
    category: "Engineering",
  },
  {
    id: "52",
    name: "Technology",
    category: "Engineering",
  },
  {
    id: "53",
    name: "Telecommunications",
    category: "Engineering",
  },
  {
    id: "54",
    name: "Urban and environmental planning",
    category: "Engineering",
  },

  // English and Literature category
  {
    id: "55",
    name: "American literature",
    category: "English and Literature",
  },
  {
    id: "56",
    name: "Ancient Literature",
    category: "English and Literature",
  },
  {
    id: "57",
    name: "English",
    category: "English and Literature",
  },
  {
    id: "58",
    name: "Language studies",
    category: "English and Literature",
  },
  {
    id: "59",
    name: "Literature",
    category: "English and Literature",
  },
  {
    id: "60",
    name: "Shakespeare literature",
    category: "English and Literature",
  },

  // Health and life sciences caterogy
  {
    id: "61",
    name: "Anatomy",
    category: "Health and life sciences",
  },
  {
    id: "62",
    name: "Biology",
    category: "Health and life sciences",
  },
  {
    id: "63",
    name: "Dentistry",
    category: "Health and life sciences",
  },
  {
    id: "64",
    name: "Food and culinary studies",
    category: "Health and life sciences",
  },
  {
    id: "65",
    name: "Healthcare",
    category: "Health and life sciences",
  },
  {
    id: "66",
    name: "Medicine and health",
    category: "Health and life sciences",
  },
  {
    id: "67",
    name: "Nursing",
    category: "Health and life sciences",
  },
  {
    id: "68",
    name: "Nutrition",
    category: "Health and life sciences",
  },
  {
    id: "69",
    name: "Pharmacology",
    category: "Health and life sciences",
  },
  {
    id: "70",
    name: "Physical education",
    category: "Health and life sciences",
  },
  {
    id: "71",
    name: "Psychiatry",
    category: "Health and life sciences",
  },
  {
    id: "72",
    name: "Sports and athletics",
    category: "Health and life sciences",
  },
  {
    id: "73",
    name: "Veterinary science",
    category: "Health and life sciences",
  },

  // History category
  {
    id: "74",
    name: "Amarican history",
    category: "History",
  },
  {
    id: "75",
    name: "Anthropology",
    category: "History",
  },
  {
    id: "76",
    name: "History",
    category: "History",
  },

  // Humanities category
  {
    id: "77",
    name: "Canadian studies",
    category: "Humanities",
  },
  {
    id: "78",
    name: "Gender studies",
    category: "Humanities",
  },
  {
    id: "79",
    name: "Globalization",
    category: "Humanities",
  },
  {
    id: "80",
    name: "Information Ethics",
    category: "Humanities",
  },
  {
    id: "81",
    name: "Journalism",
    category: "Humanities",
  },
  {
    id: "82",
    name: "Linguistics",
    category: "Humanities",
  },
  {
    id: "83",
    name: "Mythology",
    category: "Humanities",
  },
  {
    id: "84",
    name: "Tourism",
    category: "Humanities",
  },

  // Legal category
  {
    id: "85",
    name: "Criminal justice",
    category: "Legal",
  },
  {
    id: "86",
    name: "Criminology",
    category: "Legal",
  },
  {
    id: "87",
    name: "Forensic science",
    category: "Legal",
  },
  {
    id: "88",
    name: "Law",
    category: "Legal",
  },
  {
    id: "89",
    name: "Public administration",
    category: "Legal",
  },

  // Marketing category
  {
    id: "90",
    name: "Advertising",
    category: "Marketing",
  },
  {
    id: "91",
    name: "Digital marketing",
    category: "Marketing",
  },
  {
    id: "92",
    name: "Marketing",
    category: "Marketing",
  },
  {
    id: "93",
    name: "Public relations",
    category: "Marketing",
  },

  // Mathematics and statistics category
  {
    id: "94",
    name: "Algebra",
    category: "Mathematics and statistics",
  },
  {
    id: "95",
    name: "Analytics",
    category: "Mathematics and statistics",
  },
  {
    id: "96",
    name: "Calculus",
    category: "Mathematics and statistics",
  },
  {
    id: "97",
    name: "Data science",
    category: "Mathematics and statistics",
  },
  {
    id: "98",
    name: "Excel",
    category: "Mathematics and statistics",
  },
  {
    id: "99",
    name: "Geometry",
    category: "Mathematics and statistics",
  },
  {
    id: "100",
    name: "Geometry",
    category: "Mathematics and statistics",
  },
  {
    id: "101",
    name: "Mathematics",
    category: "Mathematics and statistics",
  },
  {
    id: "102",
    name: "Statistics",
    category: "Mathematics and statistics",
  },
  {
    id: "103",
    name: "Trigonometry",
    category: "Mathematics and statistics",
  },

  // Natural sciences category
  {
    id: "104",
    name: "Animal science",
    category: "Natural sciences",
  },
  {
    id: "105",
    name: "Astronomy",
    category: "Natural sciences",
  },
  {
    id: "106",
    name: "Atmospheric science",
    category: "Natural sciences",
  },
  {
    id: "107",
    name: "Chemistry",
    category: "Natural sciences",
  },
  {
    id: "108",
    name: "Environmental science",
    category: "Natural sciences",
  },
  {
    id: "109",
    name: "Geography",
    category: "Natural sciences",
  },
  {
    id: "110",
    name: "Geology",
    category: "Natural sciences",
  },
  {
    id: "111",
    name: "Natural science",
    category: "Natural sciences",
  },
  {
    id: "112",
    name: "Physics",
    category: "Natural sciences",
  },

  // Philosophy category
  {
    id: "113",
    name: "Ethics",
    category: "Philosophy",
  },
  {
    id: "114",
    name: "Philosophy",
    category: "Philosophy",
  },
  {
    id: "115",
    name: "Religion and theology",
    category: "Philosophy",
  },

  // Political sciences category
  {
    id: "116",
    name: "Emergency management",
    category: "Political sciences",
  },
  {
    id: "117",
    name: "Global issues & disaster and crisis management",
    category: "Political sciences",
  },
  {
    id: "118",
    name: "Global studies",
    category: "Political sciences",
  },
  {
    id: "119",
    name: "Immigration and citizenship",
    category: "Political sciences",
  },
  {
    id: "120",
    name: "International affairs / relations",
    category: "Political sciences",
  },
  {
    id: "121",
    name: "Military science",
    category: "Political sciences",
  },
  {
    id: "122",
    name: "Political science",
    category: "Political sciences",
  },
  {
    id: "123",
    name: "",
    category: "Political sciences",
  },

  // Social sciences category
  {
    id: "124",
    name: "Behavioral science and human development",
    category: "Social sciences",
  },
  {
    id: "125",
    name: "Career and professional development",
    category: "Social sciences",
  },
  {
    id: "126",
    name: "Communication and media",
    category: "Social sciences",
  },
  {
    id: "127",
    name: "Community and society",
    category: "Social sciences",
  },
  {
    id: "128",
    name: "Cultural studies",
    category: "Social sciences",
  },
  {
    id: "129",
    name: "Family and child studies",
    category: "Social sciences",
  },
  {
    id: "130",
    name: "Feminism",
    category: "Social sciences",
  },
  {
    id: "131",
    name: "Human relations",
    category: "Social sciences",
  },
  {
    id: "132",
    name: "Psychology",
    category: "Social sciences",
  },
  {
    id: "133",
    name: "Social science",
    category: "Social sciences",
  },
  {
    id: "134",
    name: "Social work",
    category: "Social sciences",
  },
  {
    id: "135",
    name: "Sociology",
    category: "Social sciences",
  },
  {
    id: "136",
    name: "Student activities",
    category: "Social sciences",
  },
];

export const popularSubjectButtons: PopularButtons[] = [
  { id: 1, name: "Nursing" },
  { id: 2, name: "Business and management" },
  { id: 3, name: "History" },
  { id: 4, name: "English" },
  { id: 5, name: "Marketing" },
  { id: 6, name: "Healthcare" },
  { id: 7, name: "Psychology" },
  { id: 8, name: "Entrepreneurship" },
  { id: 9, name: "Information Technology" },
  { id: 10, name: "Accounting" },
  { id: 11, name: "Finance" },
  { id: 12, name: "Mathematics" },
  { id: 13, name: "Economics" },
];

export type ButtonColor = "blue" | "red" | "green" | "yellowGradient";

export const colorClasses: Record<ButtonColor, string> = {
  blue: "bg-blue-500 hover:bg-blue-700",
  red: "bg-red-500 hover:bg-red-700",
  green: "bg-green-500 hover:bg-green-700",
  yellowGradient:
    "bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-500 hover:to-yellow-800",
};

export const iconColorClasses: Record<ButtonColor, string> = {
  blue: "bg-blue-400 group-hover:bg-blue-600",
  red: "bg-red-400 group-hover:bg-red-600",
  green: "bg-green-400 group-hover:bg-green-600",
  yellowGradient: "bg-yellow-400 group-hover:bg-yellow-500",
};

export interface CookiePrefModLink {
  id: number;
  browser: string;
  linkTo: string;
}

export const CookiePrefModLinks: CookiePrefModLink[] = [
  {
    id: 1,
    browser: "chrome",
    linkTo: "https://help.opera.com/en/latest/web-preferences/",
  },
  {
    id: 10,
    browser: "Edge",
    linkTo:
      "https://support.microsoft.com/en-us/windows/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd",
  },
  {
    id: 20,
    browser: "Firefox",
    linkTo:
      "https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop?redirectslug=enable-and-disable-cookies-website-preferences&redirectlocale=en-US",
  },
  {
    id: 30,
    browser: "Internet Explorer",
    linkTo:
      "https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d",
  },
  {
    id: 40,
    browser: "Opera",
    linkTo: "https://help.opera.com/en/latest/web-preferences/",
  },
  {
    id: 50,
    browser: "Safari",
    linkTo: "https://support.apple.com/en-ie/guide/safari/sfri11471/mac",
  },
];
