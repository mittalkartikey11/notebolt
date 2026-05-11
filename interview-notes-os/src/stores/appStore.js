import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAppStore = create(
  persist(
    (set, get) => ({
      // Theme state
      darkMode: true,
      accentPalette: 'orange-ember',
      
      // Admin mode
      adminMode: false,
      
      // Data state
      categories: [],
      topics: [],
      notes: [],
      tags: [],
      attachments: [],
      
      // UI state
      selectedCategory: null,
      selectedTopic: null,
      searchQuery: '',
      sidebarCollapsed: false,
      
      // Actions
      setDarkMode: (darkMode) => set({ darkMode }),
      setAccentPalette: (accentPalette) => set({ accentPalette }),
      toggleAdminMode: () => set((state) => ({ adminMode: !state.adminMode })),
      
      setCategories: (categories) => set({ categories }),
      setTopics: (topics) => set({ topics }),
      setNotes: (notes) => set({ notes }),
      setTags: (tags) => set({ tags }),
      
      setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
      setSelectedTopic: (selectedTopic) => set({ selectedTopic }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      
      // Category actions
      addCategory: (category) => set((state) => ({ 
        categories: [...state.categories, category] 
      })),
      updateCategory: (id, updates) => set((state) => ({
        categories: state.categories.map(c => c.id === id ? { ...c, ...updates } : c)
      })),
      deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter(c => c.id !== id)
      })),
      
      // Topic actions
      addTopic: (topic) => set((state) => ({ 
        topics: [...state.topics, topic] 
      })),
      updateTopic: (id, updates) => set((state) => ({
        topics: state.topics.map(t => t.id === id ? { ...t, ...updates } : t)
      })),
      deleteTopic: (id) => set((state) => ({
        topics: state.topics.filter(t => t.id !== id)
      })),
      
      // Note actions
      addNote: (note) => set((state) => ({ 
        notes: [...state.notes, note] 
      })),
      updateNote: (id, updates) => set((state) => ({
        notes: state.notes.map(n => n.id === id ? { ...n, ...updates } : n)
      })),
      deleteNote: (id) => set((state) => ({
        notes: state.notes.filter(n => n.id !== id)
      })),
    }),
    {
      name: 'interview-notes-os-storage',
      partialize: (state) => ({ 
        darkMode: state.darkMode, 
        accentPalette: state.accentPalette,
        adminMode: state.adminMode 
      }),
    }
  )
)
