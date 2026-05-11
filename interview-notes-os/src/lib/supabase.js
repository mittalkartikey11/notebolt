import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
})

// Database helper functions
export const db = {
  // Categories
  categories: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    create: async (category) => {
      const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select()
      if (error) throw error
      return data[0]
    },
    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
      if (error) throw error
      return data[0]
    },
    delete: async (id) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
      if (error) throw error
    }
  },

  // Topics
  topics: {
    getAll: async (categoryId = null) => {
      let query = supabase.from('topics').select('*')
      if (categoryId) {
        query = query.eq('category_id', categoryId)
      }
      const { data, error } = await query.order('last_activity_at', { ascending: false })
      if (error) throw error
      return data
    },
    create: async (topic) => {
      const { data, error } = await supabase
        .from('topics')
        .insert([topic])
        .select()
      if (error) throw error
      return data[0]
    },
    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('topics')
        .update({ ...updates, last_activity_at: new Date().toISOString() })
        .eq('id', id)
        .select()
      if (error) throw error
      return data[0]
    },
    delete: async (id) => {
      const { error } = await supabase
        .from('topics')
        .delete()
        .eq('id', id)
      if (error) throw error
    }
  },

  // Notes
  notes: {
    getAll: async (topicId = null) => {
      let query = supabase.from('notes').select('*')
      if (topicId) {
        query = query.eq('topic_id', topicId)
      }
      const { data, error } = await query.order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    create: async (note) => {
      const { data, error } = await supabase
        .from('notes')
        .insert([note])
        .select()
      if (error) throw error
      return data[0]
    },
    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('notes')
        .update(updates)
        .eq('id', id)
        .select()
      if (error) throw error
      return data[0]
    },
    delete: async (id) => {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)
      if (error) throw error
    }
  },

  // Tags
  tags: {
    getAll: async () => {
      const { data, error } = await supabase.from('tags').select('*')
      if (error) throw error
      return data
    },
    create: async (tag) => {
      const { data, error } = await supabase
        .from('tags')
        .insert([tag])
        .select()
      if (error) throw error
      return data[0]
    }
  }
}
