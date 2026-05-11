import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, MoreHorizontal, Edit2, Trash2, Copy, Move, Pin, Star,
  Download, Tag, Paperclip, CheckCircle, Circle, Bookmark,
  Bold, Italic, Underline, Code, Image as ImageIcon, Link as LinkIcon,
  List, ListOrdered, Quote, Heading, Minus, Smile
} from 'lucide-react'
import { useAppStore } from '../stores/appStore'
import { formatDate, noteBackgroundColors } from '../utils/helpers'
import RichTextEditor from './RichTextEditor'

export default function NotesPanel({ topic, category }) {
  const { adminMode, notes, addNote, updateNote, deleteNote } = useAppStore()
  const [selectedNote, setSelectedNote] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showMenu, setShowMenu] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const topicNotes = notes
    .filter(n => n.topic_id === topic?.id)
    .filter(n => !searchQuery || 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.plain_text.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (a.is_pinned !== b.is_pinned) return b.is_pinned - a.is_pinned
      return new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at)
    })

  const handleCreateNote = () => {
    const newNote = {
      id: crypto.randomUUID(),
      topic_id: topic.id,
      title: 'New Note',
      content: '',
      plain_text: '',
      background_color: null,
      is_pinned: false,
      is_starred: false,
      is_completed: false,
      difficulty: null,
      tags: [],
      attachments: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    addNote(newNote)
    setSelectedNote(newNote)
    setIsEditing(true)
  }

  const handleNoteClick = (note) => {
    setSelectedNote(note)
    setIsEditing(false)
  }

  const handleSaveEdit = (content, title) => {
    if (selectedNote) {
      updateNote(selectedNote.id, {
        content,
        title,
        plain_text: content.replace(/<[^>]*>/g, '').slice(0, 200),
        updated_at: new Date().toISOString()
      })
      setIsEditing(false)
    }
  }

  if (!topic) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="text-center">
          <Bookmark className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)]" />
          <h3 className="text-lg font-semibold mb-2">Select a Topic</h3>
          <p className="text-sm text-[var(--text-muted)]">Choose a topic from the left to view notes</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-[var(--bg-primary)] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border-color)]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl font-bold">{topic.title}</h2>
            <p className="text-sm text-[var(--text-muted)]">
              {topicNotes.length} notes • {category?.name}
            </p>
          </div>
          {adminMode && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreateNote}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-white rounded-lg font-medium transition-all"
            >
              <Plus className="w-4 h-4" />
              New Note
            </motion.button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/50"
          />
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {topicNotes.map((note) => (
          <motion.div
            key={note.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`group relative rounded-xl border p-4 cursor-pointer transition-all ${
              selectedNote?.id === note.id
                ? 'ring-2 ring-[var(--accent-primary)]'
                : 'hover:border-[var(--accent-primary)]/50'
            } ${note.background_color ? `note-bg-${note.background_color}` : 'bg-[var(--bg-secondary)] border-[var(--border-color)]'}`}
            onClick={() => handleNoteClick(note)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold truncate">{note.title}</h3>
                  {note.is_pinned && (
                    <Pin className="w-3 h-3 text-[var(--accent-primary)]" />
                  )}
                  {note.is_starred && (
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                  )}
                  {note.is_completed && (
                    <CheckCircle className="w-3 h-3 text-green-500" />
                  )}
                </div>
                
                <div 
                  className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-2"
                  dangerouslySetInnerHTML={{ __html: note.content || '<span class="text-[var(--text-muted)]">No content</span>' }}
                />

                <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                  <span>{formatDate(note.updated_at || note.created_at)}</span>
                  {note.difficulty && (
                    <span className={`px-2 py-0.5 rounded-full ${
                      note.difficulty === 'easy' ? 'bg-green-500/20 text-green-500' :
                      note.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                      'bg-red-500/20 text-red-500'
                    }`}>
                      {note.difficulty}
                    </span>
                  )}
                  {note.tags?.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      <span>{note.tags.slice(0, 2).join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Admin Actions */}
              {adminMode && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowMenu(showMenu === note.id ? null : note.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[var(--bg-tertiary)] rounded transition-opacity"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Dropdown Menu */}
            {showMenu === note.id && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-4 top-12 z-20 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg shadow-xl py-1 w-48"
              >
                <button 
                  onClick={() => { setIsEditing(true); setShowMenu(null) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--bg-tertiary)]"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--bg-tertiary)]">
                  <Copy className="w-4 h-4" />
                  Duplicate
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--bg-tertiary)]">
                  <Move className="w-4 h-4" />
                  Move To
                </button>
                <button 
                  onClick={() => {
                    updateNote(note.id, { is_pinned: !note.is_pinned })
                    setShowMenu(null)
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--bg-tertiary)]"
                >
                  <Pin className="w-4 h-4" />
                  {note.is_pinned ? 'Unpin' : 'Pin'}
                </button>
                <button 
                  onClick={() => {
                    updateNote(note.id, { is_completed: !note.is_completed })
                    setShowMenu(null)
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--bg-tertiary)]"
                >
                  <CheckCircle className="w-4 h-4" />
                  {note.is_completed ? 'Mark Incomplete' : 'Mark Complete'}
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

      {/* Editor Panel */}
      <AnimatePresence>
        {selectedNote && (
          <motion.div
            initial={{ y: 400 }}
            animate={{ y: 0 }}
            exit={{ y: 400 }}
            className="border-t border-[var(--border-color)] bg-[var(--bg-secondary)] p-4"
            style={{ maxHeight: '50vh', overflowY: 'auto' }}
          >
            {isEditing ? (
              <RichTextEditor
                initialContent={selectedNote.content}
                initialTitle={selectedNote.title}
                onSave={handleSaveEdit}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg">{selectedNote.title}</h3>
                  {adminMode && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-white rounded-lg text-sm font-medium transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                  )}
                </div>
                <div 
                  className="prose prose-invert max-w-none text-sm"
                  dangerouslySetInnerHTML={{ __html: selectedNote.content }}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
