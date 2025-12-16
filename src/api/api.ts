// Import API configuration
import API_CONFIG from './config';

// Use centralized API configuration
const BASE_URL = API_CONFIG.BASE_URL;

// Old backend URL (kept for reference)
// const BASE_URL = "http://108.181.164.242:8085/labourms/v1/services/adapter";

/**
 * To connect from mobile app using your local IP:
 * 1. Edit src/api/config.ts
 * 2. Set USE_LOCAL_IP = true
 * 3. Update LOCAL_IP_ADDRESS with your actual IP (e.g., "192.168.1.100")
 * 4. Rebuild the mobile app
 */


export async function api<T>(
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  data?: any
): Promise<T> {

  const url = `${BASE_URL}${path}`;

  // Prepare options for fetch
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      // Add Authorization token if available in storage (mostly for non-SAML flows or if backend expects it)
      // "Authorization": `Bearer ${localStorage.getItem('token')}` 
    },
    // IMPORTANT: Include credentials to send/receive cookies (SAML session cookie)
    credentials: 'include',
    body: method !== "GET" ? JSON.stringify(data) : undefined,
  };

  const response = await fetch(url, options);

  const result = await response.json();

  if (!response.ok || result.error) {
    throw new Error(result.error?.message || "API request failed");
  }

  return result;
}

// === CARD SCAN & SAML AUTH ===

export const cardScanRedirect = (cardId: string) => {
  // This endpoint is expected to handle the redirect to SAML login on the backend
  // In a browser, we might need to do window.location.href = `${BASE_URL}/card-scan?cardId=${cardId}`
  // But if the requirement is to call an API that does the redirect logic, we can try that.
  // Using window.location is safer for full page redirects to IdPs.

  // However, the prompt says "On scan, automatically fetch: GET /card-scan?cardId=xxxx"
  // and "The backend will redirect to /saml/login automatically."
  // If we fetch with AJAX, we can't easily follow a SAML redirect chain (CORS, etc).
  // Usually, valid SAML flow requires the browser to navigate.
  // We will assume window.location is the way to trigger the full flow.
  window.location.href = `${BASE_URL}/card-scan?cardId=${cardId}`;
};

export const fetchAuthUser = async () => {
  // Fetch current logged-in user details from session
  // Backend returns: { authenticated: true, user: { nameID, role, ... } }
  const response = await api<{ authenticated: boolean; user: any }>("/auth/user", "GET");

  if (!response.authenticated || !response.user) {
    throw new Error("User not authenticated");
  }

  // Return the user object from the response
  return response.user;
};

export const logoutUser = async () => {
  // Call backend to clear session
  await api("/logout", "GET"); // Assuming GET /logout clears cookie
};

// === DYNAMIC WORKER DASHBOARD ===

export interface WorkerDashboardDetails {
  worker: {
    id: number;
    fullName: string;
    accessCardId: string;
    // ... other worker fields
  };
  establishment: {
    id: number;
    name: string;
    workLocation: string;
  };
  attendance: {
    lastCheckIn: string | null;
    lastCheckOut: string | null;
    status: 'checked-in' | 'checked-out' | 'none';
    currentAttendanceId?: number;
  };
}

export const getWorkerDashboardDetails = async () => {
  return api<{ data: WorkerDashboardDetails }>("/api/worker/details", "GET").then(res => res.data);
};

export const getLatestAttendance = async () => {
  return api<{ data: any }>("/api/attendance/latest", "GET").then(res => res.data);
};

// Re-using checkInOrOut but ensuring it matches new requirements if any



export const registerEstablishment = (payload: any) => {
  return api("/establishment/registration", "POST", payload);
};


export const registerWorker = (payload: any) => {
  return api("/worker/registration", "POST", payload);
};

export async function submitApiRequest(url: string, payload: any) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return { success: response.ok, data };
  } catch (err) {
    console.error(err);
    return { success: false, error: err };
  }
}


export interface loginPayload {
  mobileNumber: number;
  password: string;
}

export interface EstablishmentUser {
  establishmentId: string;
  establishmentName: string;
  mobileNumber: string;
  // Add other fields if needed
}

export const loginEstablishmentApi = async (payload: loginPayload) => {
  const res: any = await api<EstablishmentUser>("/establishment/login", "POST", payload);
  return res.data;
};

interface EstablishmentCategory {
  categoryId: number;
  categoryName: string;
  description: string;
}

interface EstablishmentCategoryResponse {
  data: EstablishmentCategory | EstablishmentCategory[]; // handle both single and list
}

export async function fetchEstablishmentCategories() {
  const res = await api<EstablishmentCategoryResponse>(
    "/establishmentcategory/details",
    "GET"
  );

  if (!res?.data) return [];

  const categories = Array.isArray(res.data) ? res.data : [res.data];

  return categories.map((cat) => ({
    value: String(cat.categoryId),
    label: cat.categoryName,
  }));
}


export const fetchNatureOfWorkByCategory = async (categoryId: number) => {
  const res: any = await api(
    `/establishmentworknature/details?categoryId=${categoryId}`,
    "GET"
  );

  const natureData = Array.isArray(res?.data) ? res.data : [res?.data];

  return natureData.map((item: any) => ({
    value: String(item.workNatureId),
    label: item.workNatureName,
  }));
};


export const fetchEstablishmentCardDetails = async (establishmentId: number) => {
  const res: any = await api(
    `/establishment/dashboard/carddetails?establishmentId=${establishmentId}`,
    "GET"
  );
  return res?.data || {};
};


interface WorkerUser {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  fullName: string;
  mobileNumber: number;
  emailId?: string;
  lastLoggedIn: string;

  establishmentId?: number;
  estmtWorkerId?: number;
  workLocation?: string;
  status?: string;

  type?: "worker";
}

export const loginWorker = async (payload: loginPayload): Promise<WorkerUser> => {
  const res = await api<{ data: WorkerUser }>("/worker/login", "POST", payload);
  return res.data;
};

interface AadhaarCardDetail {
  workerId: number;
  aadhaarCardNumber: string;
  workerName: string;
}

interface AadhaarCardDetailsResponse {
  correlationId: string;
  data: AadhaarCardDetail[];
  error: any;
}


export const fetchAvailableAadhaarCardDetails = async () => {
  const res = await api<AadhaarCardDetailsResponse>(
    "/establishment/availableaadhaarcarddetails",
    "GET"
  );

  const aadhaarList = Array.isArray(res.data) ? res.data : [];

  return aadhaarList.map((item) => ({
    id: item.workerId,
    label: `${item.aadhaarCardNumber} - ${item.workerName}`,
    aadhaarNumber: item.aadhaarCardNumber,
    workerName: item.workerName,
  }));
};

export const persistWorkerDetails = async (payload: {
  estmtWorkerId: number | null; // can be null if not updating existing worker
  establishmentId: number;
  workerId: number;
  aadhaarCardNumber: string;
  workingFromDate: string; // yyyy-MM-dd
  workingToDate: string; // yyyy-MM-dd
  status: string;
}) => {
  try {
    const response = await api(
      '/establishment/persistworkerdetailsbyestablishment',
      'POST',
      payload
    );
    return response;
  } catch (error: any) {
    throw new Error(`Failed to persist worker details: ${error.message}`);
  }
};


interface WorkerDetailsResponse {
  correlationId: string;
  data: any; // you can replace `any` with the actual worker object type
  error: {
    code?: string;
    message?: string;
    target?: string;
    details?: string[];
  } | null;
}

export const fetchWorkerDetailsByEstablishment = (establishmentId: number) => {
  return api<WorkerDetailsResponse>(
    `/establishment/workerdetails?establishmentId=${establishmentId}`,
    "GET"
  ).then((res) => res.data);
};

export const fetchWorkerDetails = () => {
  return api<WorkerDetailsResponse>(
    `/establishment/workerdetails`,
    "GET"
  ).then((res) => res.data);
};

// types.ts
export interface DepartmentCardDetailsData {
  totalWorkers: number;
  presentWorkers: number;
  absentWorkers: number;
  loggedInWorkers: number;
  loggedOutWorkers: number;
  newEstablishmentWorkers: number;
  newRegistrationWorkers: number;
}

export interface DepartmentCardDetailsResponse {
  correlationId: string;
  data: DepartmentCardDetailsData;
  error?: {
    code: string;
    message: string;
    target: string;
    details: string[];
  };
}

export const fetchDepartmentCardDetails = async () => {
  const res = await api<DepartmentCardDetailsResponse>(
    "/department/dashboard/carddetails",
    "GET"
  );
  return res.data;
};

interface DepartmentLoginPayload {
  emailId: string;
  password: string;
}

interface DepartmentLoginResponse {
  correlationId: string;
  data: {
    departmentRoleId: number;
    roleName: string;
    roleDescription: string;
    departmentUserId: number;
    emailId: string;
    contactNumber: number;
    lastLoggedIn: string;
  };
  error?: {
    code: string;
    message: string;
    target: string;
    details: string[];
  };
}

export const departmentLogin = async (payload: DepartmentLoginPayload) => {
  const res = await api<DepartmentLoginResponse>(
    "/department/login",
    "POST",
    payload
  );
  return res.data;
};


export interface CheckInOutPayload {
  attendanceId: number | null;   // 0 if new, else update
  establishmentId: number;
  workerId: number;
  estmtWorkerId: number;
  workLocation: string;
  checkInDateTime?: string | null;
  checkOutDateTime?: string | null;
  status: "i" | "o"; // simplify instead of generic string
}

export interface CheckInOutResponse {
  correlationId: string;
  data: {
    statusCode: number;
    message: string;
  };
  error: {
    code: string;
    message: string;
    target: string;
    details: string[];
  } | null;
}

export const checkInOrOut = async (payload: CheckInOutPayload) => {
  return await api<CheckInOutResponse>(
    "/worker/checkinorout",
    "POST",
    payload
  );
};

