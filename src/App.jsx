import React, { useState, useEffect, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import toast, { Toaster } from 'react-hot-toast'
import RadarChart from './components/RadarChart'
import { supabase, saveProfile, getGroupAverages, subscribeToProfiles, getContent } from './lib/supabase'
import { downloadRadarChart } from './utils/imageExport'

const ConferenceProfileBuilder = () => {
  const [userId] = useState(() => uuidv4())
  const [skills, setSkills] = useState({
    attr1: 50,
    attr2: 50,
    attr3: 50,
    attr4: 50,
    attr5: 50
  })
  const [groupAverages, setGroupAverages] = useState(null)
  const [showComparison, setShowComparison] = useState(false)
  const [participantCount, setParticipantCount] = useState(0)
  const [content, setContent] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const skillConfig = [
    {
      key: 'attr1',
      label: 'Attribute 1',
      description: 'First skill attribute',
      color: '#F54900'
    },
    {
      key: 'attr2',
      label: 'Attribute 2',
      description: 'Second skill attribute',
      color: '#009689'
    },
    {
      key: 'attr3',
      label: 'Attribute 3',
      description: 'Third skill attribute',
      color: '#104E64'
    },
    {
      key: 'attr4',
      label: 'Attribute 4',
      description: 'Fourth skill attribute',
      color: '#FE9A00'
    },
    {
      key: 'attr5',
      label: 'Attribute 5',
      description: 'Fifth skill attribute',
      color: '#8E44AD'
    }
  ]

  // Load content and setup real-time subscriptions
  useEffect(() => {
    loadContent()
    loadGroupAverages()
    
    // Subscribe to profile changes for real-time updates
    const profileSubscription = subscribeToProfiles(() => {
      loadGroupAverages()
    })

    return () => {
      if (profileSubscription) {
        supabase.removeChannel(profileSubscription)
      }
    }
  }, [])

  const loadContent = async () => {
    const { data, error } = await getContent()
    console.log('Content data from Supabase:', data)
    console.log('Content error:', error)
    if (data) {
      const contentMap = {}
      data.forEach(item => {
        contentMap[item.key] = item.value
      })
      console.log('Content map:', contentMap)
      setContent(contentMap)
    }
  }

  const loadGroupAverages = async () => {
    const { data, error } = await getGroupAverages()
    if (data) {
      setGroupAverages(data)
      setParticipantCount(data.count)
    }
  }

  const handleSliderChange = async (skillKey, value) => {
    const newSkills = {
      ...skills,
      [skillKey]: value
    }
    setSkills(newSkills)

    // Debounced save to database
    clearTimeout(window.saveTimeout)
    window.saveTimeout = setTimeout(async () => {
      await saveProfileToDatabase(newSkills)
    }, 500)
  }

  const saveProfileToDatabase = async (skillsData) => {
    setIsLoading(true)
    const profileData = {
      id: userId,
      ...skillsData
    }
    
    const { data, error } = await saveProfile(profileData)
    
    if (error) {
      toast.error('Failed to save profile')
      console.error('Save error:', error)
      console.error('Profile data being saved:', profileData)
    } else {
      toast.success('Profile saved!')
      console.log('Profile saved successfully:', data)
    }
    setIsLoading(false)
  }

  const handleDownloadChart = async () => {
    const success = await downloadRadarChart('radar-chart-container', `profile-${userId}`)
    if (success) {
      toast.success('Chart downloaded!')
    } else {
      toast.error('Failed to download chart')
    }
  }

  const getSkillLevel = (value) => {
    if (value >= 80) return 'Expert'
    if (value >= 60) return 'Advanced'
    if (value >= 40) return 'Proficient'
    if (value >= 20) return 'Beginner'
    return 'Novice'
  }

  const radarData = useMemo(() => {
    return skillConfig.map(skill => ({
      skill: content[`skill_${skill.key}_chart_label`] || skill.label,
      key: skill.key,
      value: skills[skill.key] || 0,
      fullMark: 100
    }))
  }, [skills, skillConfig, content])

  const overallScore = Math.round(Object.values(skills).reduce((sum, val) => sum + val, 0) / 5)
  const totalPoints = Object.values(skills).reduce((sum, val) => sum + val, 0)
  
  const highestSkill = skillConfig.reduce((max, skill) => 
    skills[skill.key] > skills[max.key] ? skill : max
  )
  
  const lowestSkill = skillConfig.reduce((min, skill) => 
    skills[skill.key] < skills[min.key] ? skill : min
  )

  return (
    <div className="min-h-screen bg-white font-inter">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-xl sm:text-2xl font-normal text-cod-gray mb-2">
            {content.title || 'Conference Profile Builder'}
          </h1>
          <p className="text-storm-gray text-sm px-4">
            {content.subtitle || 'Adjust the sliders to create your professional profile and see it visualized in real-time'}
          </p>
          {participantCount > 0 && (
            <p className="text-xs text-storm-gray mt-2">
              {participantCount} participants have joined
            </p>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-7">
          {/* Profile Attributes Panel */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
            <h2 className="text-sm font-normal text-cod-gray mb-6">
              {content.attributes_title || 'Profile Attributes'}
            </h2>
            
            <div className="space-y-6">
              {skillConfig.map((skill) => (
                <div key={skill.key} className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: skill.color }}
                        />
                        <span className="text-sm font-normal text-cod-gray truncate">
                          {content[`skill_${skill.key}_label`] || skill.label}
                        </span>
                      </div>
                      <p className="text-xs text-storm-gray">
                        {content[`skill_${skill.key}_description`] || skill.description}
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-1 ml-4 flex-shrink-0">
                      <span className="text-sm font-normal text-cod-gray">{skills[skill.key]}</span>
                      <div className="bg-jaguar text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                        {getSkillLevel(skills[skill.key])}
                      </div>
                    </div>
                  </div>
                  
                  {/* Custom Slider */}
                  <div className="relative">
                    <div className="w-full h-3.5 bg-athens-gray rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-jaguar transition-all duration-200 ease-out"
                        style={{ width: `${skills[skill.key]}%` }}
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={skills[skill.key]}
                      onChange={(e) => handleSliderChange(skill.key, parseInt(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div 
                      className="absolute top-0 w-3.5 h-3.5 bg-white border-2 border-jaguar rounded-full shadow-sm transition-all duration-200 ease-out pointer-events-none"
                      style={{ left: `calc(${skills[skill.key]}% - 7px)` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Visualization Panel */}
          <div id="visualization-panel" className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-normal text-cod-gray">
                {content.visualization_title || 'Profile Visualization'}
              </h2>
              <div className="flex gap-2">
                {participantCount > 0 && (
                  <button
                    onClick={() => setShowComparison(!showComparison)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded transition-colors"
                    disabled={!groupAverages || participantCount < 2}
                  >
                    {showComparison ? 'Hide' : 'Show'} Group Avg {participantCount < 2 ? '(Need 2+ users)' : ''}
                  </button>
                )}
                <button
                  onClick={() => downloadRadarChart('radar-chart-container', `profile-${userId}`)}
                  className="text-xs bg-jaguar hover:bg-opacity-80 text-white px-3 py-1 rounded transition-colors"
                  disabled={isLoading}
                >
                  Download
                </button>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-cod-gray">{overallScore}</div>
                <div className="text-xs text-storm-gray">Overall Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cod-gray">{totalPoints}</div>
                <div className="text-xs text-storm-gray">Total Points</div>
              </div>
              {showComparison && groupAverages && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-500">
                    {Math.round((groupAverages.attr1 + groupAverages.attr2 + groupAverages.attr3 + groupAverages.attr4 + groupAverages.attr5) / 5)}
                  </div>
                  <div className="text-xs text-storm-gray">Group Avg</div>
                </div>
              )}
            </div>
            {/* Radar Chart */}
            <div id="radar-chart-container" className="mb-6 p-8 bg-white rounded-lg" style={{minWidth: '500px', minHeight: '500px'}}>
              <RadarChart 
                data={radarData} 
                averageData={groupAverages}
                showAverage={showComparison && participantCount > 1}
                size={420}
              />
            </div>

            {/* Summary */}
            <div className="bg-athens-gray bg-opacity-50 rounded-lg p-4">
              <div className="flex flex-col sm:flex-row gap-2 text-xs">
                <div className="flex-1">
                  <span className="text-storm-gray">Highest: </span>
                  <span className="text-cod-gray font-medium">
                    {content[`skill_${highestSkill.key}_label`] || highestSkill.label} ({skills[highestSkill.key]})
                  </span>
                </div>
                <div className="flex-1">
                  <span className="text-storm-gray">Lowest: </span>
                  <span className="text-cod-gray font-medium">
                    {content[`skill_${lowestSkill.key}_label`] || lowestSkill.label} ({skills[lowestSkill.key]})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConferenceProfileBuilder
