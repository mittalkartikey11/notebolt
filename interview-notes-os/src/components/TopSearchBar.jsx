import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, Moon, Sun, Shield, ShieldCheck, Palette, 
  Upload, FileJson, Settings, Zap, Brain
} from 'lucide-react'
import { useAppStore } from '../stores/appStore'
import { parseTelegramExport } from '../utils/helpers'

export default function TopSearchBar({ 
  showThemeMenu, setShowThemeMenu,
  darkMode, setDarkMode,
  accentPalette, setAccentPalette,
  adminMode, toggleAdminMode
}) {
  const [searchFocused, setSearchFocused] = useState(false)
  const [showImportMenu, setShowImportMenu] = useState(false)

  const handleFileImport = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const result = await parseTelegramExport(file)
        console.log('Import result:', result)
        // Handle import result - update store
      } catch (error) {
        console.error('Import failed:', error)
      }
    }
  }

  return (
    <div className="h-16 border-b border-[var(--border-color)] px-4 flex items-center justify-between gap-4 bg-[var(--bg-primary)]">
      {/* Global Search */}
      <div className={`relative flex-1 max-w-xl transition-all ${searchFocused ? 'max-w-2xl' : ''}`}>
        <div className={`flex items-center gap-3 px-4 py-2.5 bg-[var(--bg-secondary)] border rounded-xl transition-all ${
          searchFocused 
            ? 'border-[var(--accent-primary)] ring-2 ring-[var(--accent-primary)]/20' 
            : 'border-[var(--border-color)]'
        }`}>
          <Search className="w-5 h-5 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search notes, topics, tags... (Ctrl+K)"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="flex-1 bg-transparent focus:outline-none text-sm"
          />
          <div className="flex items-center gap-2">
            <kbd className="hidden sm:inline-flex px-2 py-1 text-xs bg-[var(--bg-tertiary)] rounded text-[var(--text-muted)]">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Import Button */}
        <div className="relative">
          <button
            onClick={() => setShowImportMenu(!showImportMenu)}
            className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors relative"
            title="Import Telegram Export"
          >
            <Upload className="w-5 h-5" />
            <Zap className="w-3 h-3 absolute -top-0.5 -right-0.5 text-yellow-500 fill-yellow-500" />
          </button>
          
          {showImportMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 top-full mt-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-xl py-2 w-56 z-50"
            >
              <label className="flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--bg-tertiary)] cursor-pointer">
                <FileJson className="w-4 h-4 text-[var(--accent-primary)]" />
                <span className="text-sm">Import result.json</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </label>
              <div className="border-t border-[var(--border-color)] my-1" />
              <div className="px-4 py-2 text-xs text-[var(--text-muted)]">
                Select your Telegram export JSON file to import notes
              </div>
            </motion.div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
          title={darkMode ? 'Light Mode' : 'Dark Mode'}
        >
          {darkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Accent Palette */}
        <button
          onClick={() => setShowThemeMenu(!showThemeMenu)}
          className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
          title="Change Accent Color"
        >
          <Palette className="w-5 h-5" />
        </button>

        {/* Admin Mode Toggle */}
        <button
          onClick={toggleAdminMode}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
            adminMode 
              ? 'bg-[var(--accent-light)] ring-1 ring-[var(--accent-primary)]' 
              : 'hover:bg-[var(--bg-secondary)]'
          }`}
          title={adminMode ? 'Disable Admin Mode' : 'Enable Admin Mode'}
        >
          {adminMode ? (
            <ShieldCheck className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
          ) : (
            <Shield className="w-5 h-5 text-[var(--text-muted)]" />
          )}
        </button>
      </div>
    </div>
  )
}
