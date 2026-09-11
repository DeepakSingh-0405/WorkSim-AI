export interface SkillScores {
  debugging: number;
  problemSolving: number;
  communication: number;
  technicalReasoning: number;
  prioritization: number;
}

export interface EvaluationRecord {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  company: string;
  resolvedAt: string;
  duration: string;
  score: number;
  status: 'Resolved' | 'Failed';
  testsPassed: string;
  skillScores: SkillScores;
  strengths?: string[];
  improvements?: string[];
}

export interface ScoreMetrics {
  latestScore: number;
  averageScore: number;
  totalRuns: number;
  skillScores: SkillScores;
  history: EvaluationRecord[];
}

const STORAGE_KEY = 'worksim_evaluations_history';
const SCORE_UPDATE_EVENT = 'worksim_score_updated';

export const DEFAULT_HISTORY: EvaluationRecord[] = [
  {
    id: 'demo-session',
    scenarioId: 'production-incident-payment-api',
    scenarioTitle: 'Payment API Failure Under Load',
    company: 'TechFlow Inc.',
    resolvedAt: 'Today, 2:34 PM',
    duration: '18 mins',
    score: 88,
    status: 'Resolved',
    testsPassed: '3/3 Tests',
    skillScores: {
      debugging: 92,
      technicalReasoning: 90,
      problemSolving: 88,
      communication: 85,
      prioritization: 84,
    },
  },
];

export function getEvaluationHistory(): EvaluationRecord[] {
  if (typeof window === 'undefined') return DEFAULT_HISTORY;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_HISTORY;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_HISTORY;
  } catch {
    return DEFAULT_HISTORY;
  }
}

export function saveEvaluationRecord(record: EvaluationRecord): ScoreMetrics {
  if (typeof window === 'undefined') return getScoreMetrics();

  try {
    const history = getEvaluationHistory();
    // Prepend latest evaluation
    const updated = [record, ...history.filter((item) => item.id !== record.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Also cache explicit score tokens
    localStorage.setItem('worksim_latest_score', String(record.score));

    const metrics = computeMetrics(updated);
    localStorage.setItem('worksim_average_score', String(metrics.averageScore));

    // Dispatch event so any open/hydrated dashboard components react instantly
    window.dispatchEvent(new CustomEvent(SCORE_UPDATE_EVENT, { detail: metrics }));

    return metrics;
  } catch (err) {
    console.error('Failed to save evaluation record:', err);
    return getScoreMetrics();
  }
}

function computeMetrics(history: EvaluationRecord[]): ScoreMetrics {
  if (!history || history.length === 0) {
    return {
      latestScore: 88,
      averageScore: 88,
      totalRuns: 1,
      skillScores: DEFAULT_HISTORY[0].skillScores,
      history: DEFAULT_HISTORY,
    };
  }

  const latestScore = history[0].score;
  const totalScore = history.reduce((sum, item) => sum + item.score, 0);
  const averageScore = Math.round(totalScore / history.length);

  // Compute skill averages
  const skillSums: SkillScores = {
    debugging: 0,
    problemSolving: 0,
    communication: 0,
    technicalReasoning: 0,
    prioritization: 0,
  };

  history.forEach((h) => {
    skillSums.debugging += h.skillScores?.debugging ?? 85;
    skillSums.problemSolving += h.skillScores?.problemSolving ?? 85;
    skillSums.communication += h.skillScores?.communication ?? 80;
    skillSums.technicalReasoning += h.skillScores?.technicalReasoning ?? 85;
    skillSums.prioritization += h.skillScores?.prioritization ?? 80;
  });

  const count = history.length;
  const avgSkills: SkillScores = {
    debugging: Math.round(skillSums.debugging / count),
    problemSolving: Math.round(skillSums.problemSolving / count),
    communication: Math.round(skillSums.communication / count),
    technicalReasoning: Math.round(skillSums.technicalReasoning / count),
    prioritization: Math.round(skillSums.prioritization / count),
  };

  return {
    latestScore,
    averageScore,
    totalRuns: count,
    skillScores: avgSkills,
    history,
  };
}

export function getScoreMetrics(): ScoreMetrics {
  const history = getEvaluationHistory();
  return computeMetrics(history);
}

export function subscribeScoreUpdates(callback: (metrics: ScoreMetrics) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<ScoreMetrics>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    } else {
      callback(getScoreMetrics());
    }
  };

  window.addEventListener(SCORE_UPDATE_EVENT, handler);
  window.addEventListener('storage', handler);

  return () => {
    window.removeEventListener(SCORE_UPDATE_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}
