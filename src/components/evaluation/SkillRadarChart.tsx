'use client';

import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface SkillScoreItem {
  skill: string;
  score: number;
  fullMark: number;
}

interface SkillRadarChartProps {
  scores: {
    debugging: number;
    problemSolving: number;
    communication: number;
    technicalReasoning: number;
    prioritization: number;
  };
}

export function SkillRadarChart({ scores }: SkillRadarChartProps) {
  const data: SkillScoreItem[] = [
    { skill: 'Debugging', score: scores.debugging ?? 90, fullMark: 100 },
    { skill: 'Tech Reasoning', score: scores.technicalReasoning ?? 88, fullMark: 100 },
    { skill: 'Problem Solving', score: scores.problemSolving ?? 88, fullMark: 100 },
    { skill: 'Communication', score: scores.communication ?? 85, fullMark: 100 },
    { skill: 'Prioritization', score: scores.prioritization ?? 84, fullMark: 100 },
  ];

  return (
    <div className="w-full h-72 sm:h-80 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#2e3240" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fill: '#a1a1a1', fontSize: 11, fontFamily: 'var(--font-sans)' }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            stroke="#4b5563"
            tick={{ fill: '#6b7280', fontSize: 9 }}
          />
          <Radar
            name="Readiness Score"
            dataKey="score"
            stroke="#c40505"
            strokeWidth={2}
            fill="#c40505"
            fillOpacity={0.4}
            isAnimationActive={true}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#111318',
              borderColor: '#2e3240',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#fafafa',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
