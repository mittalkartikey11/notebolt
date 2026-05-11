import { motion } from 'framer-motion'
import { 
  Home, FileText, Star, Clock, Tags, Trash2, Progress as ProgressIcon, Settings,
  Plus, FolderPlus, ChevronDown, Shield, ShieldCheck, MoreHorizontal,
  Archive, Copy, Move, Palette, Edit2, X
} from 'lucide-react'
import { useAppStore } from '../stores/appStore'
import { formatDate } from '../utils/helpers'

const navItems = [
  { icon: Home, label: 'Home', id: 'home' },
  { icon: FileText, label: 'All Notes', id: 'all-notes' },
  { icon: Star, label: 'Starred', id: 'starred' },
  { icon: Clock, label: 'Recent', id: 'recent' },
  { icon: Tags, label: 'Tags', id: 'tags' },
  { icon: Trash2, label: 'Trash', id: 'trash' },
  { icon: ProgressIcon, label: 'Progress', id: 'progress' },
  { icon: Settings, label: 'Settings', id: 'settings' },
]

const categoryIcons = {
  code: '📝',
  book: '📚',
  layers: '🏗️',
  users: '👥',
  globe: '🌐',
  calculator: '🔢',
  server: '⚙️',
  database: '🗄️',
  folder: '📁',
  default: '📂'
}

export default function Sidebar() {
  const { 
    adminMode, selectedCategory, setSelectedCategory,
    categories, setCategories
  } = useAppStore()

  const handleNavClick = (id) => {
    if (id === 'home') {
      setSelectedCategory(null)
    }
  }

  return (
    <motion.aside 
      initial={{ x: -240, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] flex flex-col h-screen"
    >
      {/* App Branding */}
      <div className="p-4 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm">Interview Notes OS</h1>
            <p className="text-xs text-[var(--text-muted)]">Knowledge Dashboard</p>
          </div>
        </div>
        
        {adminMode && (
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-white rounded-lg text-sm font-medium transition-all"
          >
            <Plus className="w-4 h-4" />
            New Category
          </motion.button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1 mb-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                !selectedCategory && item.id === 'home'
                  ? 'bg-[var(--accent-light)] text-[var(--accent-primary)]'
                  : 'hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Categories Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Categories
            </span>
            {adminMode && (
              <button className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="space-y-1">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setSelectedCategory(category)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all group ${
                  selectedCategory?.id === category.id
                    ? 'bg-[var(--accent-light)] ring-1 ring-[var(--accent-primary)]'
                    : 'hover:bg-[var(--bg-tertiary)]'
                }`}
              >
                <span className="text-lg">{categoryIcons[category.icon] || categoryIcons.default}</span>
                <span className="flex-1 text-left truncate">{category.name}</span>
                <span className="text-xs text-[var(--text-muted)]">{category.note_count}</span>
                
                {adminMode && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="w-4 h-4 text-[var(--text-muted)] hover:text-[var(--text-primary)]" />
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </nav>

      {/* Admin Mode Toggle */}
      <div className="p-4 border-t border-[var(--border-color)]">
        <button
          onClick={adminMode ? null : () => {}}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
            adminMode 
              ? 'bg-[var(--accent-light)] ring-1 ring-[var(--accent-primary)]' 
              : 'bg-[var(--bg-tertiary)] hover:bg-[var(--border-color)]'
          }`}
        >
          <div className="flex items-center gap-2">
            {adminMode ? (
              <ShieldCheck className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
            ) : (
              <Shield className="w-4 h-4 text-[var(--text-muted)]" />
            )}
            <span className={adminMode ? 'font-medium' : 'text-[var(--text-secondary)]'}>
              {adminMode ? 'Admin Mode' : 'View Only'}
            </span>
          </div>
          <div 
            className={`w-8 h-4 rounded-full transition-colors relative ${
              adminMode ? 'bg-[var(--accent-primary)]' : 'bg-[var(--border-color)]'
            }`}
          >
            <motion.div
              layout
              className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${
                adminMode ? 'right-0.5' : 'left-0.5'
              }`}
            />
          </div>
        </button>
      </div>
    </motion.aside>
  )
}
