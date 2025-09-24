import React from 'react';
import {
  Leaf,
  Droplets,
  Zap,
  Trash2,
  TrendingDown,
  Lightbulb,
  Recycle,
  AlertTriangle,
} from 'lucide-react';
import type { LCAResponse, LifecycleStage, ImpactMetrics } from '../types/lca';
import { useCounterAnimation } from '../hooks/useAnimations';

interface LCAResultsProps {
  results: LCAResponse;
  onNewAssessment: () => void;
}

// Counter display component for animated numbers
const CounterDisplay: React.FC<{ value: number; delay?: number; unit?: string }> = ({ value, unit = "" }) => {
  const counterRef = useCounterAnimation(value, 2, undefined);
  
  React.useEffect(() => {
    if (counterRef.current) {
      counterRef.current.textContent = '0';
    }
  }, []);

  // Format large numbers with appropriate units
  const formatValue = (num: number): string => {
    if (num === 0) return '0';
    if (num < 1) return num.toFixed(2);
    if (num < 1000) return num.toFixed(1);
    if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
    return (num / 1000000).toFixed(1) + 'M';
  };

  return (
    <span className="flex items-baseline gap-1">
      <span ref={counterRef}>{formatValue(value)}</span>
      {unit && <span className="text-xs opacity-80">{unit}</span>}
    </span>
  );
};

// Impact metrics component
const ImpactMetricsCard: React.FC<{ impact: ImpactMetrics; stage: string }> = ({ impact }) => {
  const metricStyles: Record<string, { icon: React.ComponentType<any>; color: string }> = {
    carbon: { icon: Leaf, color: 'text-emerald-300' },
    water: { icon: Droplets, color: 'text-blue-300' },
    energy: { icon: Zap, color: 'text-amber-300' },
    waste: { icon: Trash2, color: 'text-rose-300' },
  };

  const metrics = [
    { key: 'carbon', label: 'Carbon Footprint', value: impact.carbon, unit: 'tCO₂eq' },
    { key: 'water', label: 'Water Usage', value: impact.water, unit: 'm³' },
    { key: 'energy', label: 'Energy Consumption', value: impact.energy, unit: 'MJ' },
    { key: 'waste', label: 'Waste Generation', value: impact.waste, unit: 'tonnes' },
  ];

  return (
    <div className="metric-card shadow-xl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {metrics.map(({ key, label, value, unit }) => {
          const style = metricStyles[key as keyof typeof metricStyles] || {
            icon: Leaf,
            color: 'text-slate-300',
          };
          const Icon = style.icon as any;
          const numericValue = typeof value === 'number' ? value : 0;
          return (
            <div key={key} className="group text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 grid place-items-center group-hover:scale-110 transition-transform duration-300">
                  <Icon className={`w-6 h-6 ${style.color}`} />
                </div>
                <div>
                  <div className="text-slate-100 text-2xl font-bold mb-1">
                    <CounterDisplay value={numericValue} unit={unit} />
                  </div>
                  <p className="text-slate-400 text-xs uppercase tracking-wider font-medium">{label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Recommendations component
const RecommendationsCard: React.FC<{ 
  title: string; 
  items: string[]; 
  icon: React.ComponentType<any>; 
  color: string;
}> = ({ title, items, icon: Icon, color }) => {
  // Ensure items is an array and has content
  const safeItems = Array.isArray(items) ? items : [];
  if (safeItems.length === 0) return null;

  const getCardColors = (colorName: string) => {
    switch (colorName) {
      case 'blue':
        return {
          bg: 'from-blue-900/20 to-cyan-900/20',
          border: 'border-blue-400/30',
          headerBg: 'from-blue-600/40 to-cyan-600/40',
          iconColor: 'text-blue-300',
          dotColor: 'bg-blue-400',
          textColor: 'text-blue-200',
          accentColor: 'bg-blue-500/10'
        };
      case 'green':
        return {
          bg: 'from-green-900/20 to-emerald-900/20',
          border: 'border-green-400/30',
          headerBg: 'from-green-600/40 to-emerald-600/40',
          iconColor: 'text-green-300',
          dotColor: 'bg-green-400',
          textColor: 'text-green-200',
          accentColor: 'bg-green-500/10'
        };
      case 'purple':
        return {
          bg: 'from-purple-900/20 to-violet-900/20',
          border: 'border-purple-400/30',
          headerBg: 'from-purple-600/40 to-violet-600/40',
          iconColor: 'text-purple-300',
          dotColor: 'bg-purple-400',
          textColor: 'text-purple-200',
          accentColor: 'bg-purple-500/10'
        };
      default:
        return {
          bg: 'from-slate-900/20 to-gray-900/20',
          border: 'border-slate-400/30',
          headerBg: 'from-slate-600/40 to-gray-600/40',
          iconColor: 'text-slate-300',
          dotColor: 'bg-slate-400',
          textColor: 'text-slate-200',
          accentColor: 'bg-slate-500/10'
        };
    }
  };

  const colors = getCardColors(color);

  return (
    <div className="group h-full">
      <div className={`glass-card h-full hover:scale-105 transition-all duration-500 ${colors.border} backdrop-blur-sm bg-gradient-to-br ${colors.bg}`}>
        {/* Header */}
  <div className={`bg-gradient-to-r ${colors.headerBg} p-5 mb-8 relative overflow-hidden backdrop-blur-sm border border-white/20 rounded-lg`}>
          <div className="flex items-center gap-4 ml-3">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
              <Icon className={`w-5 h-5 ${colors.iconColor}`} />
            </div>
            <h4 className="text-lg font-bold text-white">{title}</h4>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 pt-2">
          {safeItems.length > 0 ? (
            <ul className="space-y-3 mt-1">
              {safeItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 group/item px-3 py-2 ml-2 rounded-lg hover:bg-white/5 transition-colors">
                      <div className={`w-1.5 h-1.5 rounded-full ${colors.dotColor} mt-2 flex-shrink-0`}></div>
                      <span className={`${colors.textColor} leading-relaxed text-sm flex-1 mt-0.5`}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center justify-center h-32 text-gray-400">
              <p className="text-sm italic">No recommendations available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Individual lifecycle stage component
const LifecycleStageCard: React.FC<{ stage: LifecycleStage; index: number; isFirst?: boolean }> = ({ stage, index, isFirst = false }) => {
  // Stage-specific colors (not used in dark timeline variant)

  return (
    <div className={`relative pl-16 ml-2 ${isFirst ? 'mt-6' : ''}`}>
      <div className="timeline-dot" style={{ top: '2rem', left: '-4.5rem' }}>
        <span className="text-sm font-bold text-white/90">{index + 1}</span>
      </div>
      <div className="stage-panel p-8 lg:p-10 shadow-2xl">
        <div className="mb-8">
          <h3 className="text-3xl lg:text-4xl font-bold text-slate-100 mb-4 text-center">{stage.stage || 'Unknown Stage'}</h3>
          <div className="flex items-start gap-4 text-slate-300 ml-6">
            <AlertTriangle className="w-6 h-6 text-amber-300 mt-1 flex-shrink-0" />
            <p className="leading-relaxed text-lg">{stage.main_cause || 'No detailed cause information available for this stage.'}</p>
          </div>
        </div>

        <div className="space-y-16">
          {stage.impact ? (
            <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm ml-6">
              <ImpactMetricsCard impact={stage.impact} stage={stage.stage || 'Unknown'} />
            </div>
          ) : (
            <div className="metric-card p-8 ml-6">
              <p className="text-slate-300 text-lg">No impact metrics available for this stage.</p>
            </div>
          )}

          <div className="ml-6">
            <h4 className="text-xl font-semibold text-slate-100 mb-8 ml-6">Recommendations & Strategies</h4>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <RecommendationsCard
                title="Alternative Methods"
                items={stage.alternative_methods || []}
                icon={Lightbulb}
                color="blue"
              />
              <RecommendationsCard
                title="Reduction Strategies"
                items={stage.reduction_suggestions || []}
                icon={TrendingDown}
                color="green"
              />
              <RecommendationsCard
                title="Circularity Opportunities"
                items={stage.circularity_opportunities || []}
                icon={Recycle}
                color="purple"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LCAResults: React.FC<LCAResultsProps> = ({ results, onNewAssessment }) => {
  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 pointer-events-none" />
      <div className="relative w-full max-w-6xl mx-auto px-6 py-14 mt-6 space-y-14">
        <div className="dark-card glow-border overflow-hidden">
          <div className="p-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold hero-title">Lifecycle Assessment Results</h1>
              </div>
              <div className="flex-shrink-0">
                <button onClick={onNewAssessment} className="btn-primary px-6 py-3 rounded-xl">
                  New Assessment
                </button>
              </div>
            </div>

            {results.total_impact && (
              <div className="mt-12 pt-8 border-t border-white/10">
                <h2 className="text-2xl font-semibold text-slate-100 mb-6 flex items-center gap-3">
                  <Leaf className="w-6 h-6 text-emerald-300" />
                  Total Environmental Impact
                </h2>
                <ImpactMetricsCard impact={results.total_impact} stage="total" />
              </div>
            )}
          </div>
        </div>

         <div className="timeline space-y-12 mt-10">
          {results.stages && results.stages.length > 0 ? (
            <div className="space-y-12">
              {results.stages.map((stage, i) => (
                <LifecycleStageCard key={i} stage={stage} index={i} isFirst={i === 0} />
              ))}
            </div>
          ) : (
            <div className="stage-panel p-12">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-amber-300" />
                <div>
                  <h3 className="text-slate-100 text-2xl font-semibold mb-3">No Lifecycle Stages Available</h3>
                  <p className="text-slate-300 text-lg">The assessment did not return detailed lifecycle stages. Try submitting again with different parameters.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};