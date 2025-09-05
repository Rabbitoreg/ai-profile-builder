import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database schema setup functions
export const setupDatabase = async () => {
  // Create profiles table
  const { error: profilesError } = await supabase.rpc('create_profiles_table')
  if (profilesError) console.error('Error creating profiles table:', profilesError)

  // Create content table
  const { error: contentError } = await supabase.rpc('create_content_table')
  if (contentError) console.error('Error creating content table:', contentError)
}

// Profile operations
export const saveProfile = async (profileData) => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: profileData.id,
      creativity: profileData.creativity,
      technical: profileData.technical,
      leadership: profileData.leadership,
      coding: profileData.coding,
      problem_solving: profileData.problemSolving,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()

  return { data, error }
}

export const getGroupAverages = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('creativity, technical, leadership, coding, problem_solving')

  if (error) return { data: null, error }

  if (!data || data.length === 0) {
    return { 
      data: {
        creativity: 50,
        technical: 50,
        leadership: 50,
        coding: 50,
        problemSolving: 50,
        count: 0
      }, 
      error: null 
    }
  }

  const averages = {
    creativity: Math.round(data.reduce((sum, p) => sum + p.creativity, 0) / data.length),
    technical: Math.round(data.reduce((sum, p) => sum + p.technical, 0) / data.length),
    leadership: Math.round(data.reduce((sum, p) => sum + p.leadership, 0) / data.length),
    coding: Math.round(data.reduce((sum, p) => sum + p.coding, 0) / data.length),
    problemSolving: Math.round(data.reduce((sum, p) => sum + p.problem_solving, 0) / data.length),
    count: data.length
  }

  return { data: averages, error: null }
}

// Content management
export const getContent = async () => {
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .order('key')

  return { data, error }
}

export const updateContent = async (key, value) => {
  const { data, error } = await supabase
    .from('content')
    .upsert({
      key,
      value,
      updated_at: new Date().toISOString()
    })
    .select()

  return { data, error }
}

// Real-time subscriptions
export const subscribeToProfiles = (callback) => {
  return supabase
    .channel('profiles')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'profiles' }, 
      callback
    )
    .subscribe()
}

export const subscribeToContent = (callback) => {
  return supabase
    .channel('content')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'content' }, 
      callback
    )
    .subscribe()
}
