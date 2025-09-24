// LCA Assessment Types
export interface LCARequest {
  material: string;
  process: string;
  location?: string;
  production_volume?: number;
  energy_source?: string;
  emissions?: {
    [key: string]: number | string;
  };
}

export interface ImpactMetrics {
  carbon: number | string;
  water: number | string;
  energy: number | string;
  waste: number | string;
}

export interface LifecycleStage {
  stage: string;
  impact: ImpactMetrics;
  main_cause: string;
  alternative_methods: string[];
  reduction_suggestions: string[];
  circularity_opportunities: string[];
}

export interface LCAResponse {
  stages: LifecycleStage[];
  processing_time?: number;
  request_id?: string;
  total_impact?: ImpactMetrics;
}

// API Response Types
export interface SupportedMaterialsResponse {
  materials: string[];
  processes: string[];
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  version?: string;
}

// Component Props
export interface FormData extends LCARequest {}

export interface ResultsProps {
  results: LCAResponse;
  isLoading: boolean;
  error: string | null;
}

// Animation States
export interface AnimationState {
  isVisible: boolean;
  hasAnimated: boolean;
}

// API Error
export interface APIError {
  message: string;
  status?: number;
  code?: string;
}
