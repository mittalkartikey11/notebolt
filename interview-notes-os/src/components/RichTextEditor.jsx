import { useState, useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { common, createLowlight } from 'lowlight'
import { 
  Bold, Italic, Underline, Code, Image as ImageIcon, Link as LinkIcon,
  List, ListOrdered, Quote, Heading, Minus, Undo, Redo, X, Check
} from 'lucide-react'

const lowlight = createLowlight(common)

export default function RichTextEditor({ initialContent, initialTitle, onSave, onCancel }) {
  const [title, setTitle] = useState(initialTitle || '')
  const [isAutoResizing, setIsAutoResizing] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your note...',
      }),
    ],
    content: initialContent || '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[100px]',
      },
    },
  })

  const addImage = () => {
    const url = window.prompt('Enter image URL:')
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const addLink = () => {
    const url = window.prompt('Enter link URL:')
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const handleSave = () => {
    onSave(editor?.getHTML() || '', title)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault()
        editor?.chain().focus().toggleBold().run()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault()
        editor?.chain().focus().toggleItalic().run()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault()
        editor?.chain().focus().toggleUnderline?.().run()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault()
        // Could open shortcuts help
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [editor, title])

  if (!editor) {
    return null
  }

  return (
    <div className="space-y-3">
      {/* Title Input */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title..."
        className="w-full bg-transparent text-lg font-bold focus:outline-none border-b border-[var(--border-color)] pb-2"
      />

      {/* Toolbar */}
      <div className="flex items-center gap-1 flex-wrap p-2 bg-[var(--bg-tertiary)] rounded-lg">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive('bold') ? 'bg-[var(--accent-primary)] text-white' : 'hover:bg-[var(--bg-secondary)]'
          }`}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive('italic') ? 'bg-[var(--accent-primary)] text-white' : 'hover:bg-[var(--bg-secondary)]'
          }`}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline?.().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive('underline') ? 'bg-[var(--accent-primary)] text-white' : 'hover:bg-[var(--bg-secondary)]'
          }`}
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-[var(--accent-primary)] text-white' : 'hover:bg-[var(--bg-secondary)]'
          }`}
          title="Heading"
        >
          <Heading className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive('bulletList') ? 'bg-[var(--accent-primary)] text-white' : 'hover:bg-[var(--bg-secondary)]'
          }`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive('orderedList') ? 'bg-[var(--accent-primary)] text-white' : 'hover:bg-[var(--bg-secondary)]'
          }`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive('codeBlock') ? 'bg-[var(--accent-primary)] text-white' : 'hover:bg-[var(--bg-secondary)]'
          }`}
          title="Code Block"
        >
          <Code className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive('blockquote') ? 'bg-[var(--accent-primary)] text-white' : 'hover:bg-[var(--bg-secondary)]'
          }`}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          onClick={addImage}
          className="p-2 rounded hover:bg-[var(--bg-secondary)] transition-colors"
          title="Add Image"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
        <button
          onClick={addLink}
          className="p-2 rounded hover:bg-[var(--bg-secondary)] transition-colors"
          title="Add Link (Ctrl+K)"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <div className="border-l border-[var(--border-color)] h-6 mx-1" />
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-[var(--bg-secondary)] transition-colors disabled:opacity-50"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-[var(--bg-secondary)] transition-colors disabled:opacity-50"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content */}
      <div className="bg-[var(--bg-tertiary)] rounded-lg p-4 min-h-[200px]">
        <EditorContent editor={editor} />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-white rounded-lg text-sm font-medium transition-all"
        >
          <Check className="w-4 h-4" />
          Save Note
        </button>
      </div>
    </div>
  )
}
