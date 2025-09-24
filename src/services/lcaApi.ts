import type {
  LCARequest,
  LCAResponse,
  SupportedMaterialsResponse,
  HealthResponse,
  LifecycleStage,
  ImpactMetrics,
} from "../types/lca";

const BASE_URL = "https://sih-back-pearl.vercel.app/";
const API_BASE_URL = `${BASE_URL}/api/lca`;

// Custom error class for API errors
class LCAAPIError extends Error {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = "LCAAPIError";
    this.status = status;
    this.code = code;
  }
}

// Transform backend response to frontend format
function transformBackendResponse(backendResponse: any): LCAResponse {
  // Handle the new backend response structure: {success: true, data: [...], metadata: {...}}
  const stagesData = backendResponse.data || backendResponse; // Fallback for old format
  const metadata = backendResponse.metadata || {};

  // Extract numeric value from string with units (e.g., "Estimated 1-5 tCO2e/tonne steel" -> average of range)
  const extractNumericValue = (value: string | number): number => {
    if (typeof value === "number") return value;
    if (typeof value !== "string") return 0;

    // Handle special cases
    if (
      value.toLowerCase().includes("negligible") ||
      value.toLowerCase().includes("minimal") ||
      value.toLowerCase().includes("varies greatly") ||
      value.toLowerCase().includes("difficult to estimate") ||
      value.toLowerCase().includes("depends on application") ||
      value.toLowerCase().includes("highly variable")
    ) {
      return 0;
    }

    // Enhanced regex patterns to handle backend response formats
    const patterns = [
      // Range patterns like "1-5 tCO2e", "10-50 m³", "5-15 MJ"
      /(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*(?:tco2e?|m[³3]|mj|kwh|kg|tonne)/i,
      // Single values with units like "1000 kg CO2e", "5000 m³", "1000 kWh"
      /(\d+(?:\.\d+)?)\s*(?:tco2e?|kg\s*co2e?|m[³3]|mj|kwh|kg|tonne)/i,
      // Generic number extraction as fallback
      /(\d+(?:\.\d+)?)/,
    ];

    for (const pattern of patterns) {
      const match = value.match(pattern);
      if (match) {
        if (match[2]) {
          // It's a range, return the average
          const min = parseFloat(match[1]);
          const max = parseFloat(match[2]);
          return (min + max) / 2;
        } else {
          // Single value
          return parseFloat(match[1]);
        }
      }
    }

    return 0;
  };

  // Filter out N/A values and clean up suggestions
  const filterNAValues = (arr: string[]): string[] => {
    return arr.filter(
      (item) =>
        (item &&
          item.trim() !== "" &&
          item.trim() !== "N/A" &&
          !item.toLowerCase().includes("limited direct circularity") &&
          !item.toLowerCase().includes("hypothetical")) ||
        (item.toLowerCase().includes("hypothetical") && item.length > 30) // Keep hypothetical if it's detailed
    );
  };

  // Transform impact metrics
  const transformImpact = (impact: any): ImpactMetrics => ({
    carbon: extractNumericValue(impact.carbon_emission || impact.carbon || 0),
    water: extractNumericValue(impact.water_usage || impact.water || 0),
    energy: extractNumericValue(
      impact.energy_consumption || impact.energy || 0
    ),
    waste: extractNumericValue(impact.waste || 0),
  });

  // Transform each lifecycle stage
  const stages: LifecycleStage[] = stagesData.map((stage: any) => ({
    stage: stage.stage || "Unknown Stage",
    impact: transformImpact(stage.impact || {}),
    main_cause: stage.main_cause || "No information available",
    alternative_methods: filterNAValues(stage.alternative_methods || []),
    reduction_suggestions: filterNAValues(stage.reduction_suggestions || []),
    circularity_opportunities: filterNAValues(
      stage.circularity_opportunities || []
    ),
  }));

  // Calculate total impact from all stages
  const total_impact: ImpactMetrics = {
    carbon: stages.reduce(
      (sum, stage) => sum + Number(stage.impact.carbon || 0),
      0
    ),
    water: stages.reduce(
      (sum, stage) => sum + Number(stage.impact.water || 0),
      0
    ),
    energy: stages.reduce(
      (sum, stage) => sum + Number(stage.impact.energy || 0),
      0
    ),
    waste: stages.reduce(
      (sum, stage) => sum + Number(stage.impact.waste || 0),
      0
    ),
  };

  return {
    stages,
    total_impact,
    processing_time: metadata.processing_time_ms || Date.now(),
    request_id: metadata.request_id || `lca_${Date.now()}`,
  };
}

// Generic fetch wrapper with error handling
async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;

      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        // If we can't parse error response, use default message
      }

      throw new LCAAPIError(errorMessage, response.status);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof LCAAPIError) {
      throw error;
    }

    // Network or other errors
    throw new LCAAPIError(
      error instanceof Error ? error.message : "An unexpected error occurred",
      0,
      "NETWORK_ERROR"
    );
  }
}

// LCA Assessment API
export const assessLCA = async (request: LCARequest): Promise<LCAResponse> => {
  const startTime = Date.now();

  try {
    const response = await apiRequest<any>(`${API_BASE_URL}/assess`, {
      method: "POST",
      body: JSON.stringify(request),
    });

    // Transform the backend response to frontend format
    const transformedResponse = transformBackendResponse(response);

    // Use backend processing time if available, otherwise use client-side time
    if (
      !transformedResponse.processing_time ||
      transformedResponse.processing_time === startTime
    ) {
      transformedResponse.processing_time = Date.now() - startTime;
    }

    return transformedResponse;
  } catch (error) {
    if (error instanceof LCAAPIError) {
      // Add context for specific LCA errors
      if (error.status === 429) {
        throw new LCAAPIError(
          "Rate limit exceeded. Please wait 15 minutes before making another request.",
          error.status,
          "RATE_LIMIT_EXCEEDED"
        );
      }
      throw error;
    }
    throw new LCAAPIError("Failed to assess LCA. Please try again.");
  }
};

// Get supported materials and processes
export const getSupportedMaterials =
  async (): Promise<SupportedMaterialsResponse> => {
    try {
      return await apiRequest<SupportedMaterialsResponse>(
        `${API_BASE_URL}/supported-materials`
      );
    } catch (error) {
      // Fallback data if API fails - extensive list for mining and metallurgy
      console.warn("Failed to fetch supported materials, using fallback data");
      return {
        materials: [
          // Common Ores
          "Copper ore",
          "Iron ore",
          "Gold ore",
          "Silver ore",
          "Aluminum ore (Bauxite)",
          "Zinc ore",
          "Lead ore",
          "Nickel ore",
          "Platinum ore",
          "Uranium ore",
          "Tin ore",
          "Tungsten ore",
          "Molybdenum ore",
          "Cobalt ore",
          "Lithium ore",
          "Rare earth elements",

          // Coal and Energy
          "Bituminous coal",
          "Anthracite coal",
          "Lignite coal",
          "Coal tailings",

          // Industrial Minerals
          "Limestone",
          "Quartzite",
          "Sand and gravel",
          "Gypsum",
          "Salt",
          "Phosphate rock",
          "Potash",
          "Feldspar",
          "Mica",
          "Talc",
          "Asbestos",

          // Gemstones
          "Diamond",
          "Emerald",
          "Ruby",
          "Sapphire",

          // Others
          "Clay",
          "Bentonite",
          "Vermiculite",
          "Perlite",
        ],
        processes: [
          // Mining Methods
          "Open-pit mining",
          "Underground mining",
          "Strip mining",
          "Mountaintop removal",
          "In-situ leaching",
          "Placer mining",
          "Dredging",
          "Hydraulic mining",
          "Block caving",
          "Room and pillar",
          "Longwall mining",
          "Cut and fill",
          "Sublevel stoping",

          // Processing Methods
          "Crushing and grinding",
          "Magnetic separation",
          "Gravity separation",
          "Flotation",
          "Dense media separation",
          "Electrostatic separation",
          "Jigging",
          "Tabling",
          "Spiral concentration",
          "Cyclone separation",

          // Metallurgical Processes
          "Smelting",
          "Roasting",
          "Calcination",
          "Leaching",
          "Heap leaching",
          "Vat leaching",
          "Tank leaching",
          "Pressure leaching",
          "Bioleaching",
          "Electrowinning",
          "Electrorefining",
          "Pyrometallurgy",
          "Hydrometallurgy",
          "Solvent extraction",
          "Cementation",
          "Precipitation",
          "Crystallization",

          // Coal Processing
          "Coal washing",
          "Coal preparation",
          "Coking",
          "Gasification",
          "Liquefaction",

          // Environmental
          "Tailings management",
          "Waste rock handling",
          "Acid mine drainage treatment",
          "Water treatment",
          "Dust suppression",
          "Rehabilitation",
          "Land reclamation",
        ],
      };
    }
  };

// Health check endpoints
export const checkHealth = async (): Promise<HealthResponse> => {
  return await apiRequest<HealthResponse>(`${BASE_URL}/health`);
};

export const checkLCAHealth = async (): Promise<HealthResponse> => {
  return await apiRequest<HealthResponse>(`${API_BASE_URL}/health`);
};

// Retry mechanism for failed requests
export const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries) {
        break;
      }

      // Don't retry on rate limit or validation errors
      if (error instanceof LCAAPIError) {
        if (error.status === 429 || error.status === 400) {
          break;
        }
      }

      // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError!;
};

// Utility function to validate form data
export const validateLCARequest = (data: Partial<LCARequest>): string[] => {
  const errors: string[] = [];

  if (!data.material || data.material.trim().length === 0) {
    errors.push("Material is required");
  }

  if (!data.process || data.process.trim().length === 0) {
    errors.push("Process is required");
  }

  if (data.production_volume !== undefined && data.production_volume < 0) {
    errors.push("Production volume must be a positive number");
  }

  return errors;
};

export { LCAAPIError };
