import React, { useRef } from 'react';
import { Search, Factory, MapPin, Zap, BarChart3, Sparkles } from 'lucide-react';
import type { FormData } from '../types/lca';
import { useFormValidation } from '../hooks/useAnimations';
import { FlexibleInput } from './FlexibleInput';

interface LCAFormProps {
  formData: FormData;
  onUpdateFormData: (field: keyof FormData, value: any) => void;
  onSubmit: () => void;
  supportedMaterials: string[];
  supportedProcesses: string[];
  validationErrors: string[];
  isFormValid: boolean;
  isLoading: boolean;
}

export const LCAForm: React.FC<LCAFormProps> = ({
    formData,
    onUpdateFormData,
    onSubmit,
    supportedMaterials,
    supportedProcesses,
    validationErrors,
    isFormValid,
    isLoading,
  }) => {
    const formRef = useRef<HTMLFormElement>(null);
    const { shakeElement, highlightError } = useFormValidation();

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!isFormValid) {
        validationErrors.forEach((_, index) => {
          const field = formRef.current?.querySelector(`[data-error-index="${index}"]`);
          if (field) {
            shakeElement(field as HTMLElement);
            highlightError(field as HTMLElement);
          }
        });
        return;
      }
      onSubmit();
    };

    const handleFieldChange = (field: keyof FormData, value: any) => {
      onUpdateFormData(field, value);
    };

    return (
      <div className="glass-card">
        <div className="form-header">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-blue-600/40 to-purple-600/40 border border-white/20">
              <Sparkles className="w-8 h-8 text-slate-100" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">Life Cycle Assessment</h1>
              <p className="text-gray-300 mt-2">
                Analyze your product's environmental impact across its entire lifecycle journey
              </p>
            </div>
          </div>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
          {/* Required Fields Section */}
          <div className="form-section">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 bg-accent-primary rounded-full"></div>
              <h2 className="text-xl font-semibold text-slate-100">Core Information</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-accent-primary/50 to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="form-group">
                <FlexibleInput
                  label="Material"
                  value={formData.material}
                  onChange={(value) => handleFieldChange('material', value)}
                  suggestions={supportedMaterials}
                  placeholder="Select or type a material..."
                  icon={Search}
                  required
                  errorIndex={validationErrors.findIndex((e) => e.includes('Material'))}
                />
              </div>

              <div className="form-group">
                <FlexibleInput
                  label="Process"
                  value={formData.process}
                  onChange={(value) => handleFieldChange('process', value)}
                  suggestions={supportedProcesses}
                  placeholder="Select or type a process..."
                  icon={Factory}
                  required
                  errorIndex={validationErrors.findIndex((e) => e.includes('Process'))}
                />
              </div>
            </div>
          </div>

          {/* Additional Details Section */}
          <div className="form-section">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <h2 className="text-xl font-semibold text-slate-100">Additional Details</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-purple-400/50 to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="form-group">
                <label className="form-label">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Location/Region
                </label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => handleFieldChange('location', e.target.value)}
                  placeholder="e.g., Chile, Australia"
                  className="form-input h-12"
                />
                <p className="form-helper">Country or region for location-specific analysis</p>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <BarChart3 className="w-4 h-4 inline mr-2" />
                  Production Volume (tons)
                </label>
                <input
                  type="number"
                  value={formData.production_volume || ''}
                  onChange={(e) =>
                    handleFieldChange(
                      'production_volume',
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  placeholder="1000"
                  min={0}
                  className="form-input h-12"
                />
              </div>

              <div className="form-group">
                <FlexibleInput
                  label="Energy Source"
                  value={formData.energy_source || ''}
                  onChange={(value) => handleFieldChange('energy_source', value)}
                  suggestions={[
                    'Solar',
                    'Wind',
                    'Hydroelectric',
                    'Natural Gas',
                    'Coal',
                    'Nuclear',
                    'Mixed grid',
                    'Biomass',
                    'Geothermal',
                    'Oil/Diesel',
                  ]}
                  placeholder="Select energy source..."
                  icon={Zap}
                />
                <p className="form-helper">Primary energy source for production</p>
              </div>
            </div>
          </div>



          {/* Form Actions: Centered Submit */}
          <div className="form-actions flex items-center justify-center">
            <button
              type="submit"
              className="btn-primary w-full max-w-md"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="loading-spinner"></div>
                  <span>Analyzing... (8-15s)</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Assessment</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  };