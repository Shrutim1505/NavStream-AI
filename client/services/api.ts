// API Service for Ship Route Optimization
// This connects to the backend API endpoints

const API_BASE_URL = 'http://localhost:3001/api'; // Backend API URL

export interface Port {
  id: number;
  name: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface OptimizationParams {
  fuelEfficiency: number;
  travelTime: number;
  routeSafety: number;
}

export interface RouteOptimizationRequest {
  departurePort: string; // Use port name for backend compatibility
  destinationPort: string; // Use port name for backend compatibility
  parameters: OptimizationParams;
}

export interface RouteOptimizationResponse {
  departurePort: string;
  destinationPort: string;
  parameters: OptimizationParams;
  route: Array<{ latitude: number; longitude: number }>;
  distance: number;
  estimatedTime: number;
  fuelConsumption: number;
}

export interface AnalyticsData {
  totalSavings: number;
  averageFuelEfficiency: number;
  onTimeDeliveries: number;
  routesOptimized: number;
  recentVoyages: Array<{
    id: number;
    route: string;
    savings: number;
    efficiency: number;
    status: string;
  }>;
}

export interface Voyage {
  _id?: string;
  departurePort: string;
  destinationPort: string;
  parameters: OptimizationParams;
  route: Array<{ latitude: number; longitude: number }>;
  distance: number;
  estimatedTime: number;
  fuelConsumption: number;
  createdAt?: string;
  status?: string;
  savings?: number;
  efficiency?: number;
}

// Real API call: Optimize Route
export const optimizeRoute = async (
  request: RouteOptimizationRequest
): Promise<RouteOptimizationResponse> => {
  const response = await fetch(`${API_BASE_URL}/optimize-route`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new Error('Failed to optimize route');
  return response.json();
};

// Real API call: Get Ports
export const getPorts = async (): Promise<Port[]> => {
  const response = await fetch(`${API_BASE_URL}/ports`);
  if (!response.ok) throw new Error('Failed to fetch ports');
  return response.json();
};

// Real API call: Get Analytics
export const getAnalytics = async (): Promise<AnalyticsData> => {
  const response = await fetch(`${API_BASE_URL}/analytics`);
  if (!response.ok) throw new Error('Failed to fetch analytics');
  return response.json();
};

// Create a new voyage (not usually needed, as optimizeRoute saves it)
export const createVoyage = async (voyage: Voyage): Promise<Voyage> => {
  const response = await fetch(`${API_BASE_URL}/voyages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(voyage),
  });
  if (!response.ok) throw new Error('Failed to create voyage');
  return response.json();
};

// Get all voyages
export const getVoyages = async (): Promise<Voyage[]> => {
  const response = await fetch(`${API_BASE_URL}/voyages`);
  if (!response.ok) throw new Error('Failed to fetch voyages');
  return response.json();
};

// Get voyage details by ID
export const getVoyageDetails = async (id: string): Promise<Voyage> => {
  const response = await fetch(`${API_BASE_URL}/voyages/${id}`);
  if (!response.ok) throw new Error('Failed to fetch voyage details');
  return response.json();
};

// Error handling wrapper
export const handleApiError = (error: any) => {
  console.error('API Error:', error);
  if (error.response) {
    return `Server Error: ${error.response.status} - ${error.response.data.message}`;
  } else if (error.request) {
    return 'Network Error: Unable to connect to server';
  } else {
    return `Error: ${error.message}`;
  }
};