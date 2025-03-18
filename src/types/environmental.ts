export interface EnvironmentalData {
  dataType: string;
  location: string;
  value: number;
  reporter: string;
  timestamp?: number;
}

export interface EnvironmentalDataResponse {
  success: boolean;
  data?: EnvironmentalData;
  error?: string;
}

export interface EnvironmentalDataSubmission {
  success: boolean;
  txHash?: string;
  error?: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  radius?: number; // in kilometers
}

export interface DataType {
  id: string;
  name: string;
  description: string;
  unit: string;
  validationRules: ValidationRule[];
}

export interface ValidationRule {
  type: 'range' | 'format' | 'required';
  value?: any;
  message: string;
}

export interface DataVerification {
  dataId: string;
  verifier: string;
  timestamp: number;
  status: 'verified' | 'disputed';
  comment?: string;
} 