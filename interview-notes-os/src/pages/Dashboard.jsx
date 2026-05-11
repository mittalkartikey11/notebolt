import { motion } from 'framer-motion'
import { 
  BookOpen, Clock, Star, CheckCircle, TrendingUp, Calendar,
  Target, Award, Zap, Brain, ChevronRight
} from 'lucide-react'
import { useAppStore } from '../stores/appStore'
import { formatDate } from '../utils/helpers'

export default function Dashboard() {
  const { categories, topics, notes } = useAppStore()

  const stats = {
    totalNotes: notes.length,
    completedNotes: notes.filter(n => n.is_completed).length,
    starredNotes: notes.filter(n => n.is_starred).length,
    totalCategories: categories.length,
    totalTopics: topics.length,
    streak: 7 // Demo data
  }

  const recentNotes = [...notes]
    .sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at))
    .slice(0, 5)

  const categoryProgress = categories.map(cat => ({
    ...cat,
    topicCount: topics.filter(t => t.category_id === cat.id).length,
    noteCount: notes.filter(n => {
      const topic = topics.find(t => t.id === n.topic_id)
      return topic?.category_id === cat.id
    }).length
  }))

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-primary)] p-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
        <p className="text-[var(--text-secondary)]">Track your interview preparation progress</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <StatCard 
          icon={BookOpen}
          label="Total Notes"
          value={stats.totalNotes}
          color="blue"
        />
        <StatCard 
          icon={CheckCircle}
          label="Completed"
          value={stats.completedNotes}
          color="green"
        />
        <StatCard 
          icon={Star}
          label="Starred"
          value={stats.starredNotes}
          color="yellow"
        />
        <StatCard 
          icon={Target}
          label="Categories"
          value={stats.totalCategories}
          color="purple"
        />
        <StatCard 
          icon={BookOpen}
          label="Topics"
          value={stats.totalTopics}
          color="cyan"
        />
        <StatCard 
          icon={Zap}
          label="Day Streak"
          value={stats.streak}
          color="orange"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Learning */}
        <div className="lg:col-span-2 space-y-6">
          <SectionHeader 
            icon={Clock}
            title="Continue Learning"
            action="View All"
          />
          
          <div className="space-y-3">
            {recentNotes.map((note) => {
              const topic = topics.find(t => t.id === note.topic_id)
              const category = categories.find(c => c.id === topic?.category_id)
              
              return (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-4 p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl hover:border-[var(--accent-primary)]/50 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent-light)] flex items-center justify-center">
                    <BookOpen className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{note.title}</h4>
                    <p className="text-sm text-[var(--text-muted)]">
                      {topic?.title} • {category?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[var(--text-muted)]">
                      {formatDate(note.updated_at || note.created_at)}
                    </p>
                    {note.is_completed && (
                      <CheckCircle className="w-4 h-4 text-green-500 ml-auto mt-1" />
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              )
            })}
          </div>

          {/* Progress by Category */}
          <SectionHeader 
            icon={TrendingUp}
            title="Progress by Category"
            action="View Analytics"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryProgress.slice(0, 4).map((cat) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{cat.name}</h4>
                  <span className="text-xs text-[var(--text-muted)]">
                    {cat.noteCount} notes
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        width: `${Math.min(100, (cat.noteCount / 50) * 100)}%`,
                        backgroundColor: 'var(--accent-primary)'
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium">
                    {Math.min(100, Math.round((cat.noteCount / 50) * 100))}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="p-4 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-xl text-white">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6" />
              <h3 className="font-semibold">Weekly Progress</h3>
            </div>
            <div className="text-3xl font-bold mb-1">
              {stats.completedNotes}/{stats.totalNotes}
            </div>
            <p className="text-sm opacity-80">notes completed this week</p>
            
            <div className="mt-4 flex gap-1">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-8 rounded-md bg-white/20"
                  style={{
                    backgroundColor: i < 5 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Popular Tags */}
          <SectionHeader 
            icon={Brain}
            title="Popular Tags"
          />
          
          <div className="flex flex-wrap gap-2">
            {['arrays', 'dynamic-programming', 'trees', 'graphs', 'system-design', 'dbms', 'oops'].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-sm hover:border-[var(--accent-primary)] transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Revision Reminders */}
          <SectionHeader 
            icon={Calendar}
            title="Revision Due"
          />
          
          <div className="space-y-2">
            {[
              { topic: 'Arrays', due: 'Today' },
              { topic: 'Linked List', due: 'Tomorrow' },
              { topic: 'DBMS Keys', due: 'In 3 days' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg"
              >
                <span className="text-sm">{item.topic}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  item.due === 'Today' ? 'bg-red-500/20 text-red-500' :
                  item.due === 'Tomorrow' ? 'bg-yellow-500/20 text-yellow-500' :
                  'bg-green-500/20 text-green-500'
                }`}>
                  {item.due}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl"
    >
      <Icon className="w-5 h-5 mb-2" style={{ color: `var(--${color}-500)` }} />
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-[var(--text-muted)]">{label}</div>
    </motion.div>
  )
}

function SectionHeader({ icon: Icon, title, action }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
        <h3 className="font-semibold">{title}</h3>
      </div>
      {action && (
        <button className="text-sm text-[var(--accent-primary)] hover:underline">
          {action}
        </button>
      )}
    </div>
  )
}
