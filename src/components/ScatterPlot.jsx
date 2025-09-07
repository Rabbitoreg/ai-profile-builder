import React from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const ScatterPlot = ({ data, currentUser, width = 400, height = 400 }) => {
  // Transform data for scatter plot
  const scatterData = data.map((profile, index) => {
    // Calculate Technical Depth (X-axis): Average of Coding + Web Integration + Tech Wiz
    const technicalDepth = Math.round((profile.attr1 + profile.attr2 + profile.attr5) / 3)
    
    // Calculate User-Centered Design (Y-axis): Average of UX Design + AI-Assisted Development
    const userCenteredDesign = Math.round((profile.attr3 + profile.attr4) / 2)
    
    return {
      x: technicalDepth,
      y: userCenteredDesign,
      id: profile.user_id,
      isCurrentUser: profile.user_id === currentUser,
      // Store individual values for tooltip
      coding: profile.attr1,
      webIntegration: profile.attr2,
      uxDesign: profile.attr3,
      aiAssisted: profile.attr4,
      techWiz: profile.attr5
    }
  })

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-cod-gray mb-2">
            {data.isCurrentUser ? 'You' : 'Participant'}
          </p>
          <div className="text-xs text-storm-gray space-y-1">
            <p>Technical Depth: {data.x}</p>
            <p>User-Centered Design: {data.y}</p>
            <hr className="my-2" />
            <p>Coding: {data.coding}</p>
            <p>Web Integration: {data.webIntegration}</p>
            <p>UX Design: {data.uxDesign}</p>
            <p>AI-Assisted: {data.aiAssisted}</p>
            <p>Tech Wiz: {data.techWiz}</p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="scatter-plot border border-gray-300 rounded-lg" style={{ width: width, height: height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 40, right: 40, bottom: 80, left: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            type="number" 
            dataKey="x" 
            domain={[0, 100]}
            tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }}
            label={{ value: 'Technical Depth', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fontSize: '14px', fill: '#1f2937', fontWeight: '600' } }}
          />
          <YAxis 
            type="number" 
            dataKey="y" 
            domain={[0, 100]}
            tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }}
            label={{ value: 'User-Centered Design', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '14px', fill: '#1f2937', fontWeight: '600' } }}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Other participants */}
          <Scatter
            data={scatterData.filter(d => !d.isCurrentUser)}
            fill="#9CA3AF"
            fillOpacity={0.6}
            stroke="#6B7280"
            strokeWidth={1}
            r={6}
          />
          
          {/* Current user - highlighted */}
          <Scatter
            data={scatterData.filter(d => d.isCurrentUser)}
            fill="#22c55e"
            stroke="#16a34a"
            strokeWidth={2}
            r={8}
          />
        </ScatterChart>
      </ResponsiveContainer>
      
    </div>
  )
}

export default ScatterPlot
