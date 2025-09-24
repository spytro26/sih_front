import { useState, useEffect, useCallback } from "react";
import type {
  FormData,
  LCAResponse,
  SupportedMaterialsResponse,
} from "../types/lca";
import {
  assessLCA,
  getSupportedMaterials,
  validateLCARequest,
  retryRequest,
} from "../services/lcaApi";

interface UseLCAFormReturn {
  // Form data
  formData: FormData;
  updateFormData: (field: keyof FormData, value: any) => void;
  resetForm: () => void;

  // Supported options
  supportedMaterials: string[];
  supportedProcesses: string[];

  // Assessment state
  results: LCAResponse | null;
  isLoading: boolean;
  error: string | null;

  // Form validation
  validationErrors: string[];
  isFormValid: boolean;

  // Actions
  submitAssessment: () => Promise<void>;
  retryAssessment: () => Promise<void>;
  clearError: () => void;
}

const initialFormData: FormData = {
  material: "",
  process: "",
  location: "",
  production_volume: undefined,
  energy_source: "",
  emissions: {},
};

export const useLCAForm = (): UseLCAFormReturn => {
  // Form state
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [supportedOptions, setSupportedOptions] =
    useState<SupportedMaterialsResponse>({
      materials: [],
      processes: [],
    });

  // Assessment state
  const [results, setResults] = useState<LCAResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validation state
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Load supported materials on mount
  useEffect(() => {
    const loadSupportedOptions = async () => {
      try {
        const options = await getSupportedMaterials();
        setSupportedOptions(options);
      } catch (err) {
        console.warn("Failed to load supported options:", err);
      }
    };

    loadSupportedOptions();
  }, []);

  // Validate form data whenever it changes
  useEffect(() => {
    const errors = validateLCARequest(formData);
    setValidationErrors(errors);
  }, [formData]);

  // Update form data
  const updateFormData = useCallback((field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setResults(null);
    setError(null);
    setValidationErrors([]);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Submit assessment
  const submitAssessment = useCallback(async () => {
    // Validate form first
    const errors = validateLCARequest(formData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      setError("Please fix the validation errors before submitting.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await retryRequest(() => assessLCA(formData), 3, 2000);
      setResults(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  // Retry assessment with same data
  const retryAssessment = useCallback(async () => {
    await submitAssessment();
  }, [submitAssessment]);

  return {
    // Form data
    formData,
    updateFormData,
    resetForm,

    // Supported options
    supportedMaterials: supportedOptions.materials,
    supportedProcesses: supportedOptions.processes,

    // Assessment state
    results,
    isLoading,
    error,

    // Form validation
    validationErrors,
    isFormValid:
      validationErrors.length === 0 &&
      !!formData.material &&
      !!formData.process,

    // Actions
    submitAssessment,
    retryAssessment,
    clearError,
  };
};
