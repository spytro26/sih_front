import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LCAForm } from './components/LCAForm';
import { LCAResults } from './components/LCAResults';
import { LoadingState, ErrorState, HealthCheck } from './components/StatusComponents';
import { useLCAForm } from './hooks/useLCAForm';
import { checkHealth } from './services/lcaApi';
import './App.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function App() {
  // LCA form state
  const {
    formData,
    updateFormData,
    resetForm,
    supportedMaterials,
    supportedProcesses,
    results,
    isLoading,
    error,
    validationErrors,
    isFormValid,
    submitAssessment,
    retryAssessment,
    clearError
  } = useLCAForm();

  // Health check state
  const [serverHealth, setServerHealth] = useState<boolean | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  // Check server health on mount
  useEffect(() => {
    const checkServerHealth = async () => {
      setIsCheckingHealth(true);
      try {
        await checkHealth();
        setServerHealth(true);
      } catch {
        setServerHealth(false);
      } finally {
        setIsCheckingHealth(false);
      }
    };

    checkServerHealth();
  }, []);

  // Handle retry with loading state
  const handleRetry = async () => {
    setIsRetrying(true);
    clearError();
    try {
      await retryAssessment();
    } finally {
      setIsRetrying(false);
    }
  };

  // Handle new assessment
  const handleNewAssessment = () => {
    resetForm();
    clearError();
    
    // Smooth scroll to form
    const formSection = document.getElementById('lca-form');
    if (formSection) {
      formSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  // Handle health check
  const handleHealthCheck = async () => {
    setIsCheckingHealth(true);
    try {
      await checkHealth();
      setServerHealth(true);
    } catch {
      setServerHealth(false);
    } finally {
      setIsCheckingHealth(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="app">
        <div className="hero-section">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                <span className="gradient-text">Life Cycle Assessment</span>
                <br />
                <span className="hero-subtitle">for Sustainable Mining</span>
              </h1>
              <p className="hero-description">
                Discover the environmental impact of your mining operations through 
                comprehensive lifecycle analysis. From extraction to end-of-life, 
                we map your journey towards sustainability.
              </p>
            </div>
            <div className="hero-visual">
              <div className="floating-elements">
                <div className="element carbon">CO₂</div>
                <div className="element water">H₂O</div>
                <div className="element energy">⚡</div>
              </div>
            </div>
          </div>
        </div>
        
        <main className="main-content">
          <section id="lca-form">
            <LCAForm
              formData={formData}
              onUpdateFormData={updateFormData}
              onSubmit={submitAssessment}
              supportedMaterials={supportedMaterials}
              supportedProcesses={supportedProcesses}
              validationErrors={validationErrors}
              isFormValid={isFormValid}
              isLoading={isLoading}
            />
          </section>

          {/* Loading State */}
          {isLoading && (
            <section className="flex justify-center items-center min-h-[50vh] px-4">
              <LoadingState />
            </section>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <section className="flex justify-center items-center min-h-[50vh] px-4">
              <ErrorState
                error={error}
                onRetry={handleRetry}
                onReset={handleNewAssessment}
                isRetrying={isRetrying}
              />
            </section>
          )}

          {/* Results Section */}
          {results && !isLoading && !error && (
            <section>
              <LCAResults
                results={results}
                onNewAssessment={handleNewAssessment}
              />
            </section>
          )}
        </main>
        
        <footer className="footer">
          <p>© 2025 LCA Assessment Tool - Building a Sustainable Future</p>
          
          {/* Server Status */}
          <div className="server-status">
            <span>Backend Status:</span>
            <div className={`status-indicator ${
              serverHealth === null 
                ? 'checking'
                : serverHealth 
                  ? 'online'
                  : 'offline'
            }`}>
              <div className="status-dot"></div>
              <span>
                {serverHealth === null ? 'Checking...' : serverHealth ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </footer>

        {/* Floating Health Check Button */}
        <HealthCheck
          onHealthCheck={handleHealthCheck}
          isChecking={isCheckingHealth}
          isHealthy={serverHealth}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;
