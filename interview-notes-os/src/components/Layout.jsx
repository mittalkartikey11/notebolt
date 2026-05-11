import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, FileText, Star, Clock, Tags, Trash2, Progress, Settings,
  Plus, FolderPlus, ChevronDown, ChevronUp, Search, Moon, Sun,
  Shield, ShieldCheck, MoreHorizontal, BookOpen
} from 'lucide-react'
import { useAppStore } from '../stores/appStore'
import Sidebar from './Sidebar'
import TopicsPanel from './TopicsPanel'
import NotesPanel from './NotesPanel'
import Dashboard from '../pages/Dashboard'
import TopSearchBar from './TopSearchBar'
import { themePalettes } from '../utils/helpers'

const defaultCategories = [
  { id: '1', name: 'DSA Sheets', icon: 'code', color: 'orange', note_count: 45 },
  { id: '2', name: 'Core CS Subjects', icon: 'book', color: 'blue', note_count: 32 },
  { id: '3', name: 'System Design', icon: 'layers', color: 'purple', note_count: 28 },
  { id: '4', name: 'Interview Experience', icon: 'users', color: 'green', note_count: 15 },
  { id: '5', name: 'Web Development', icon: 'globe', color: 'cyan', note_count: 52 },
  { id: '6', name: 'Aptitude', icon: 'calculator', color: 'yellow', note_count: 20 },
  { id: '7', name: 'DevOps', icon: 'server', color: 'red', note_count: 18 },
  { id: '8', name: 'Database', icon: 'database', color: 'pink', note_count: 25 },
]

const defaultTopics = [
  { id: '1', category_id: '1', title: 'Arrays', icon: 'list', note_count: 12, progress: 75, last_activity_at: new Date().toISOString() },
  { id: '2', category_id: '1', title: 'Strings', icon: 'type', note_count: 8, progress: 50, last_activity_at: new Date().toISOString() },
  { id: '3', category_id: '1', title: 'Linked List', icon: 'link', note_count: 10, progress: 30, last_activity_at: new Date().toISOString() },
  { id: '4', category_id: '1', title: 'Dynamic Programming', icon: 'grid', note_count: 15, progress: 20, last_activity_at: new Date().toISOString() },
  { id: '5', category_id: '2', title: 'DBMS Keys', icon: 'key', note_count: 6, progress: 100, last_activity_at: new Date().toISOString() },
  { id: '6', category_id: '2', title: 'Transactions', icon: 'repeat', note_count: 8, progress: 60, last_activity_at: new Date().toISOString() },
  { id: '7', category_id: '8', title: 'Window Functions', icon: 'layout-template', note_count: 5, progress: 40, last_activity_at: new Date().toISOString() },
  { id: '8', category_id: '2', title: 'OOPS Pillars', icon: 'columns', note_count: 7, progress: 80, last_activity_at: new Date().toISOString() },
]

const defaultNotes = [
  {
    id: '1',
    topic_id: '1',
    title: 'Array Basics',
    content: '<p>An <strong>array</strong> is a data structure that stores elements of the same type in contiguous memory locations.</p><h3>Key Points:</h3><ul><li>Random access in O(1)</li><li>Insertion/Deletion can be O(n)</li><li>Fixed size in most languages</li></ul><pre><code class="language-javascript">const arr = [1, 2, 3, 4, 5];\nconsole.log(arr[0]); // O(1) access</code></pre>',
    plain_text: 'An array is a data structure that stores elements of the same type in contiguous memory locations.',
    background_color: 'blue',
    is_pinned: true,
    is_starred: false,
    is_completed: true,
    difficulty: 'easy',
    tags: ['basics', 'arrays'],
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    topic_id: '1',
    title: 'Two Pointer Technique',
    content: '<p>The <strong>two pointer technique</strong> is useful for problems involving pairs or subarrays.</p><pre><code class="language-javascript">function twoSum(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left < right) {\n    const sum = arr[left] + arr[right];\n    if (sum === target) return [left, right];\n    if (sum < target) left++;\n    else right--;\n  }\n}</code></pre>',
    plain_text: 'The two pointer technique is useful for problems involving pairs or subarrays.',
    background_color: null,
    is_pinned: false,
    is_starred: true,
    is_completed: false,
    difficulty: 'medium',
    tags: ['techniques', 'arrays'],
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date().toISOString()
  }
]

export default function Layout() {
  const { 
    adminMode, toggleAdminMode, darkMode, setDarkMode,
    accentPalette, setAccentPalette,
    selectedCategory, setSelectedCategory,
    selectedTopic, setSelectedTopic,
    categories, setCategories,
    topics, setTopics,
    notes, setNotes
  } = useAppStore()

  const [showThemeMenu, setShowThemeMenu] = useState(false)

  useEffect(() => {
    // Initialize with sample data
    if (categories.length === 0) {
      setCategories(defaultCategories)
      setTopics(defaultTopics)
      setNotes(defaultNotes)
    }
  }, [])

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    setSelectedTopic(null)
  }

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Left Sidebar */}
      <Sidebar 
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Search Bar */}
        <TopSearchBar 
          showThemeMenu={showThemeMenu}
          setShowThemeMenu={setShowThemeMenu}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          accentPalette={accentPalette}
          setAccentPalette={setAccentPalette}
          adminMode={adminMode}
          toggleAdminMode={toggleAdminMode}
        />

        {/* Content Panels */}
        <div className="flex-1 flex overflow-hidden">
          {!selectedCategory ? (
            /* Dashboard View */
            <Dashboard />
          ) : (
            <>
              {/* Topics Panel */}
              <TopicsPanel
                category={selectedCategory}
                selectedTopic={selectedTopic}
                onSelectTopic={setSelectedTopic}
              />

              {/* Notes Panel */}
              <NotesPanel
                topic={selectedTopic}
                category={selectedCategory}
              />
            </>
          )}
        </div>
      </div>

      {/* Theme Palette Dropdown */}
      <AnimatePresence>
        {showThemeMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 right-4 z-50 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-2xl p-4 w-64"
          >
            <h3 className="text-sm font-semibold mb-3 text-[var(--text-secondary)]">Accent Palette</h3>
            <div className="space-y-2">
              {themePalettes.map((palette) => (
                <button
                  key={palette.id}
                  onClick={() => {
                    setAccentPalette(palette.id)
                    setShowThemeMenu(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                    accentPalette === palette.id 
                      ? 'bg-[var(--accent-light)] ring-1 ring-[var(--accent-primary)]' 
                      : 'hover:bg-[var(--bg-tertiary)]'
                  }`}
                >
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: palette.primary }}
                  />
                  <span className="text-sm">{palette.name}</span>
                  {accentPalette === palette.id && (
                    <ShieldCheck className="w-4 h-4 ml-auto" style={{ color: palette.primary }} />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
