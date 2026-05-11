import { useEffect } from 'react'
import { useAppStore } from './stores/appStore'
import Layout from './components/Layout'
import { themePalettes } from './utils/helpers'

function App() {
  const { darkMode, accentPalette } = useAppStore()

  useEffect(() => {
    // Apply theme to document
    const html = document.documentElement
    
    if (darkMode) {
      html.removeAttribute('data-theme')
    } else {
      html.setAttribute('data-theme', 'light')
    }
    
    // Convert palette id to data attribute format
    const paletteAttr = accentPalette.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
    const dataAccent = accentPalette.includes('-') 
      ? accentPalette.replace(/-([a-z])/g, (m, c) => '-' + c)
      : accentPalette
      
    // Set accent palette
    const accentMap = {
      'orange-ember': 'orange-ember',
      'blue-ocean': 'blue-ocean',
      'purple-neon': 'purple-neon',
      'green-matrix': 'green-matrix',
      'red-ruby': 'red-ruby',
      'cyan-tech': 'cyan-tech',
      'yellow-focus': 'yellow-focus',
      'monochrome-gray': 'monochrome-gray'
    }
    
    html.setAttribute('data-accent', accentMap[accentPalette] || 'orange-ember')
  }, [darkMode, accentPalette])

  return (
    <div className="app h-screen w-screen overflow-hidden">
      <Layout />
    </div>
  )
}

export default App
