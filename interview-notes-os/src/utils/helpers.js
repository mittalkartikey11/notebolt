import { v4 as uuidv4 } from 'uuid'

export const generateId = () => uuidv4()

export const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const now = new Date()
  const diffMs = now - d
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  return d.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}

export const formatRelativeDate = (date) => {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Telegram export parsing utilities
export const parseTelegramExport = async (jsonFile, photosFolder = null) => {
  try {
    const text = await jsonFile.text()
    const data = JSON.parse(text)
    
    const categories = []
    const topics = []
    const notes = []
    const telegramIdsMap = new Map()
    
    // Process each group/chat in the export
    if (data.groups || data.chats) {
      const items = data.groups || data.chats
      
      for (const group of items) {
        // Create category from group
        const categoryId = generateId()
        categories.push({
          id: categoryId,
          name: group.name || 'Untitled Category',
          icon: 'folder',
          color: 'orange',
          note_count: 0,
          created_at: new Date().toISOString(),
          telegram_id: group.id?.toString()
        })
        
        // Process messages to extract topics
        if (group.messages) {
          const topicMessages = {}
          
          for (const message of group.messages) {
            // Check if this is a topic creation message
            if (message.action === 'topic_created') {
              const topicId = generateId()
              topics.push({
                id: topicId,
                category_id: categoryId,
                title: message.text || 'Untitled Topic',
                icon: 'folder',
                note_count: 0,
                progress: 0,
                last_activity_at: new Date(message.date).toISOString(),
                telegram_id: message.id?.toString()
              })
              topicMessages[message.id] = []
            } else if (message.reply_to_message_id) {
              // Message belongs to a topic
              if (!topicMessages[message.reply_to_message_id]) {
                topicMessages[message.reply_to_message_id] = []
              }
              topicMessages[message.reply_to_message_id].push(message)
            } else {
              // Message without topic - create default topic if needed
              if (!topicMessages['default']) {
                const defaultTopicId = generateId()
                topics.push({
                  id: defaultTopicId,
                  category_id: categoryId,
                  title: 'General',
                  icon: 'message-square',
                  note_count: 0,
                  progress: 0,
                  last_activity_at: new Date().toISOString()
                })
                topicMessages['default'] = []
              }
              topicMessages['default'].push(message)
            }
          }
          
          // Convert messages to notes
          for (const [topicId, messages] of Object.entries(topicMessages)) {
            const targetTopic = topics.find(t => 
              (t.telegram_id === topicId) || 
              (topicId === 'default' && t.title === 'General')
            )
            
            if (targetTopic) {
              for (const msg of messages) {
                const noteId = generateId()
                const content = convertTelegramContent(msg)
                
                notes.push({
                  id: noteId,
                  topic_id: targetTopic.id,
                  title: content.title || 'Note',
                  content: content.html,
                  plain_text: content.plainText,
                  background_color: null,
                  is_pinned: false,
                  is_starred: false,
                  is_completed: false,
                  difficulty: null,
                  tags: [],
                  attachments: [],
                  telegram_id: msg.id?.toString(),
                  telegram_sender: msg.from,
                  created_at: new Date(msg.date).toISOString(),
                  updated_at: msg.edited ? new Date(msg.edited).toISOString() : null
                })
                
                telegramIdsMap.set(msg.id?.toString(), noteId)
                targetTopic.note_count++
              }
            }
          }
        }
        
        // Update category note count
        categories[categories.length - 1].note_count = 
          categories[categories.length - 1].note_count + 
          Object.values(topicMessages).reduce((sum, msgs) => sum + msgs.length, 0)
      }
    }
    
    return { categories, topics, notes, telegramIdsMap }
  } catch (error) {
    console.error('Error parsing Telegram export:', error)
    throw error
  }
}

const convertTelegramContent = (message) => {
  let html = ''
  let plainText = ''
  let title = ''
  
  const text = typeof message.text === 'string' 
    ? message.text 
    : (Array.isArray(message.text) 
        ? message.text.map(t => typeof t === 'string' ? t : t.text).join('')
        : '')
  
  plainText = text
  title = text.split('\n')[0].slice(0, 100)
  
  // Process entities for formatting
  if (message.entities || message.media_entities) {
    const entities = [...(message.entities || []), ...(message.media_entities || [])]
    entities.sort((a, b) => a.offset - b.offset)
    
    let lastIndex = 0
    let formattedText = ''
    
    for (const entity of entities) {
      const before = text.slice(lastIndex, entity.offset)
      const content = text.slice(entity.offset, entity.offset + entity.length)
      
      formattedText += before
      
      switch (entity.type) {
        case 'bold':
          formattedText += `<strong>${content}</strong>`
          break
        case 'italic':
          formattedText += `<em>${content}</em>`
          break
        case 'underline':
          formattedText += `<u>${content}</u>`
          break
        case 'strikethrough':
          formattedText += `<s>${content}</s>`
          break
        case 'code':
          formattedText += `<code>${content}</code>`
          break
        case 'pre':
          const language = entity.language || 'plaintext'
          formattedText += `<pre><code class="language-${language}">${escapeHtml(content)}</code></pre>`
          break
        case 'url':
          formattedText += `<a href="${content}" target="_blank" rel="noopener">${content}</a>`
          break
        case 'text_link':
          formattedText += `<a href="${entity.url}" target="_blank" rel="noopener">${content}</a>`
          break
        default:
          formattedText += content
      }
      
      lastIndex = entity.offset + entity.length
    }
    
    formattedText += text.slice(lastIndex)
    html = formattedText.replace(/\n/g, '<br>')
  } else {
    html = text.replace(/\n/g, '<br>')
  }
  
  // Handle photos/attachments
  if (message.photo) {
    const photoSizes = Array.isArray(message.photo) ? message.photo : [message.photo]
    const largestPhoto = photoSizes.reduce((prev, current) => 
      (prev.file_size > current.file_size) ? prev : current
    )
    html += `<img src="${largestPhoto.file_path || ''}" alt="Attachment" />`
  }
  
  if (message.document) {
    html += `<div class="attachment">📎 ${message.document.file_name}</div>`
  }
  
  return { html, plainText, title }
}

const escapeHtml = (text) => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

export const extractTopics = (messages) => {
  const topics = new Map()
  
  for (const message of messages) {
    if (message.action === 'topic_created') {
      topics.set(message.id, {
        id: message.id,
        title: message.text,
        date: message.date
      })
    }
  }
  
  return Array.from(topics.values())
}

export const mapMessagesToTopics = (messages, topics) => {
  const topicMessages = new Map()
  
  topics.forEach(topic => {
    topicMessages.set(topic.id, [])
  })
  topicMessages.set('default', [])
  
  for (const message of messages) {
    if (message.action === 'topic_created') continue
    
    if (message.reply_to_message_id) {
      const topicId = message.reply_to_message_id
      if (topicMessages.has(topicId)) {
        topicMessages.get(topicId).push(message)
      } else {
        topicMessages.get('default').push(message)
      }
    } else {
      topicMessages.get('default').push(message)
    }
  }
  
  return topicMessages
}

export const convertTelegramEntities = (text, entities) => {
  if (!entities || entities.length === 0) {
    return text
  }
  
  // Sort entities by offset
  const sortedEntities = [...entities].sort((a, b) => a.offset - b.offset)
  
  let result = ''
  let lastIndex = 0
  
  for (const entity of sortedEntities) {
    result += text.slice(lastIndex, entity.offset)
    
    const content = text.slice(entity.offset, entity.offset + entity.length)
    
    switch (entity.type) {
      case 'bold':
        result += `**${content}**`
        break
      case 'italic':
        result += `*${content}*`
        break
      case 'code':
        result += `\`${content}\``
        break
      case 'pre':
        result += `\`\`\`${entity.language || ''}\n${content}\n\`\`\``
        break
      default:
        result += content
    }
    
    lastIndex = entity.offset + entity.length
  }
  
  result += text.slice(lastIndex)
  return result
}

export const extractAttachments = (message) => {
  const attachments = []
  
  if (message.photo) {
    const photos = Array.isArray(message.photo) ? message.photo : [message.photo]
    photos.forEach((photo, index) => {
      attachments.push({
        type: 'image',
        url: photo.file_path || '',
        name: `Photo ${index + 1}`,
        size: photo.file_size
      })
    })
  }
  
  if (message.document) {
    attachments.push({
      type: 'document',
      url: message.document.file_path || '',
      name: message.document.file_name,
      size: message.document.file_size
    })
  }
  
  if (message.video) {
    attachments.push({
      type: 'video',
      url: message.video.file_path || '',
      name: message.video.file_name || 'Video',
      size: message.video.file_size
    })
  }
  
  return attachments
}

export const importToSupabase = async (supabase, data) => {
  const { categories, topics, notes } = data
  
  // Insert categories
  for (const category of categories) {
    await supabase.from('categories').insert([category])
  }
  
  // Insert topics
  for (const topic of topics) {
    await supabase.from('topics').insert([topic])
  }
  
  // Insert notes
  for (const note of notes) {
    await supabase.from('notes').insert([note])
  }
}

// Color presets for notes
export const noteBackgroundColors = [
  { id: 'golden', name: 'Golden', class: 'note-bg-golden' },
  { id: 'orange', name: 'Orange', class: 'note-bg-orange' },
  { id: 'blue', name: 'Blue', class: 'note-bg-blue' },
  { id: 'cyan', name: 'Cyan', class: 'note-bg-cyan' },
  { id: 'green', name: 'Green', class: 'note-bg-green' },
  { id: 'purple', name: 'Purple', class: 'note-bg-purple' },
  { id: 'pink', name: 'Pink', class: 'note-bg-pink' },
  { id: 'red', name: 'Red', class: 'note-bg-red' },
  { id: 'gray', name: 'Gray', class: 'note-bg-gray' }
]

// Theme palettes
export const themePalettes = [
  { id: 'orange-ember', name: 'Orange Ember', primary: '#f97316' },
  { id: 'blue-ocean', name: 'Blue Ocean', primary: '#3b82f6' },
  { id: 'purple-neon', name: 'Purple Neon', primary: '#a855f7' },
  { id: 'green-matrix', name: 'Green Matrix', primary: '#22c55e' },
  { id: 'red-ruby', name: 'Red Ruby', primary: '#ef4444' },
  { id: 'cyan-tech', name: 'Cyan Tech', primary: '#06b6d4' },
  { id: 'yellow-focus', name: 'Yellow Focus', primary: '#eab308' },
  { id: 'monochrome-gray', name: 'Monochrome Gray', primary: '#71717a' }
]
