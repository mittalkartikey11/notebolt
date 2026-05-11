import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Folder, Plus, MoreHorizontal, Edit2, Trash2, Copy, Move, 
  Pin, Archive, ChevronRight, Star
} from 'lucide-react'
import { useAppStore } from '../stores/appStore'
import { formatDate } from '../utils/helpers'

const topicIcons = {
  list: '📋',
  type: '🔤',
  link: '🔗',
  grid: '⊞',
  key: '🔑',
  repeat: '🔄',
  'layout-template': '🪟',
  columns: '🏛️',
  default: '📁'
}

export default function TopicsPanel({ category, selectedTopic, onSelectTopic }) {
  const { adminMode, topics } = useAppStore()
  const [showMenu, setShowMenu] = useState(null)

  const categoryTopics = topics
    .filter(t => t.category_id === category?.id)
    .sort((a, b) => new Date(b.last_activity_at) - new Date(a.last_activity_at))

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-72 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-[var(--border-color)]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-lg">{category?.name}</h2>
            <p className="text-xs text-[var(--text-muted)]">
              {categoryTopics.length} topics
            </p>
          </div>
          {adminMode && (
            <button className="p-2 hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Topics List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {categoryTopics.map((topic) => (
          <motion.div
            key={topic.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`group relative rounded-xl border transition-all cursor-pointer ${
              selectedTopic?.id === topic.id
                ? 'bg-[var(--accent-light)] border-[var(--accent-primary)] ring-1 ring-[var(--accent-primary)]'
                : 'bg-[var(--bg-tertiary)] border-transparent hover:border-[var(--border-color)]'
            }`}
            onClick={() => onSelectTopic(topic)}
          >
            <div className="p-3">
              <div className="flex items-start gap-3">
                <span className="text-xl">{topicIcons[topic.icon] || topicIcons.default}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{topic.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-[var(--text-muted)]">
                      {topic.note_count} notes
                    </span>
                    {topic.progress > 0 && (
                      <div className="flex items-center gap-1">
                        <div className="w-16 h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full"
                            style={{ 
                              width: `${topic.progress}%`,
                              backgroundColor: 'var(--accent-primary)'
                            }}
                          />
                        </div>
                        <span className="text-xs text-[var(--text-muted)]">
                          {topic.progress}%
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Updated {formatDate(topic.last_activity_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Admin Actions Menu */}
            {adminMode && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowMenu(showMenu === topic.id ? null : topic.id)
                  }}
                  className="p-1 hover:bg-[var(--bg-secondary)] rounded"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Dropdown Menu */}
            {showMenu === topic.id && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-2 top-8 z-10 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg shadow-xl py-1 w-40"
              >
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--bg-tertiary)]">
                  <Edit2 className="w-4 h-4" />
                  Edit Topic
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--bg-tertiary)]">
                  <Copy className="w-4 h-4" />
                  Duplicate
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--bg-tertiary)]">
                  <Move className="w-4 h-4" />
                  Move To
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--bg-tertiary)]">
                  <Pin className="w-4 h-4" />
                  Pin Topic
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--bg-tertiary)]">
                  <Archive className="w-4 h-4" />
                  Archive
                </button>
                <div className="border-t border-[var(--border-color)] my-1" />
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
