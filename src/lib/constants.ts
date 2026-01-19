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

export const PACKAGE_PRICES = {
  BASIC_PACKAGE: 599,
  SILVER_PACKAGE: 1599,
  GOLD_PACKAGE: 2999,
  PREMIUM_CODE: 1999,
  EARLY_PAYMENT: 999,
} as const;

export type PackagePrice = (typeof PACKAGE_PRICES)[keyof typeof PACKAGE_PRICES];

export const ADMIN_ROUTES = {
  CUSTOMERS: "/admin/customers",
  CUSTOMER: "/admin/customers/",
  ACTIVE_ORDERS: "/orders/active-orders",
  DRAFT_ORDERS: "/orders/draft-orders",
  ALL_ORDERS: "/orders/all-orders",
} as const;

export type AdminRoute = (typeof ADMIN_ROUTES)[keyof typeof ADMIN_ROUTES];

export interface PopularButtons {
  id: number;
  name: string;
  hours?: number;
}

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
