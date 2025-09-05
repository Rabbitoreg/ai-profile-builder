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
  console.log('Saving profile data:', profileData)
  
  const profileRecord = {
    id: profileData.id,
    attr1: profileData.attr1,
    attr2: profileData.attr2,
    attr3: profileData.attr3,
    attr4: profileData.attr4,
    attr5: profileData.attr5,
    updated_at: new Date().toISOString()
  }
  
  console.log('Profile record to save:', profileRecord)
  
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profileRecord)
    .select()

  console.log('Supabase response:', { data, error })
  return { data, error }
}

export const getGroupAverages = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('attr1, attr2, attr3, attr4, attr5')

  if (error) return { data: null, error }

  if (!data || data.length === 0) {
    return { 
      data: {
        attr1: 50,
        attr2: 50,
        attr3: 50,
        attr4: 50,
        attr5: 50,
        count: 0
      }, 
      error: null 
    }
  }

  const averages = {
    attr1: Math.round(data.reduce((sum, p) => sum + p.attr1, 0) / data.length),
    attr2: Math.round(data.reduce((sum, p) => sum + p.attr2, 0) / data.length),
    attr3: Math.round(data.reduce((sum, p) => sum + p.attr3, 0) / data.length),
    attr4: Math.round(data.reduce((sum, p) => sum + p.attr4, 0) / data.length),
    attr5: Math.round(data.reduce((sum, p) => sum + p.attr5, 0) / data.length),
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
