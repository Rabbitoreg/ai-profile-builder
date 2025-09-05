import React from 'react'
import { RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts'

const RadarChart = ({ data, averageData = null, size = 280, showAverage = false }) => {
  // Transform data for Recharts format
  const chartData = data.map(item => ({
    skill: item.skill,
    user: item.value,
    average: showAverage && averageData ? (averageData[item.key] || 50) : 0
  }))

  return (
    <div className="radar-chart" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadar data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis 
            dataKey="skill" 
            tick={{ fontSize: 10, fill: '#000' }}
            className="text-xs"
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]} 
            tick={{ fontSize: 8, fill: '#666' }}
            tickCount={5}
          />
          
          {/* Average radar (behind user data) */}
          {showAverage && (
            <Radar
              name="Group Average"
              dataKey="average"
              stroke="#9CA3AF"
              fill="rgba(156, 163, 175, 0.2)"
              strokeWidth={2}
              strokeDasharray="5,5"
              dot={{ fill: '#9CA3AF', strokeWidth: 1, stroke: '#ffffff', r: 3 }}
            />
          )}
          
          {/* User radar */}
          <Radar
            name="Your Profile"
            dataKey="user"
            stroke="#22c55e"
            fill="rgba(34, 197, 94, 0.1)"
            strokeWidth={2}
            dot={{ fill: '#22c55e', strokeWidth: 2, stroke: '#ffffff', r: 4 }}
          />
          
          {showAverage && (
            <Legend 
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              iconType="line"
            />
          )}
        </RechartsRadar>
      </ResponsiveContainer>
    </div>
  )
}

export default RadarChart
