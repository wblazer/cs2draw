import { useState, useEffect } from 'react'
import {
  Tldraw,
  Editor,
  TLPage,
} from 'tldraw'
import { Minimap } from './Minimap'

// const MAP_OPTIONS = [
//   { value: 'de_dust2', label: 'Dust II' },
//   { value: 'de_mirage', label: 'Mirage' },
//   { value: 'de_ancient', label: 'Ancient' },
//   { value: 'de_anubis', label: 'Anubis' },
//   { value: 'de_vertigo', label: 'Vertigo' },
//   { value: 'de_inferno', label: 'Inferno' },
//   { value: 'de_nuke', label: 'Nuke' },
//   { value: 'de_overpass', label: 'Overpass' },
// ]

export function MapEditor() {
  const [editor, setEditor] = useState<Editor | null>(null)

  function onMount(editor: Editor) {
    setEditor(editor)

    editor.user.updateUserPreferences({ colorScheme: 'dark' })
    console.log("Running onMount")
  }

  useEffect(() => {
    if (!editor) return

    const handlePageCreate = (page: TLPage) => {
      const defaultMap = 'de_mirage'
      Minimap.addToPage(editor, page.id, defaultMap)
      // TODO: Find better way to ensure camera gets reset once minimap is loaded
      setTimeout(() => {
        resetCamera(editor)
      }, 10)
    }

    // Attach handlers to page events
    editor.sideEffects.registerAfterCreateHandler('page', (page) => {
      console.log("Responding to page creation")
      handlePageCreate(page)
    })

    editor.updateInstanceState({ isDebugMode: false })

  }, [editor])

  const resetCamera = (editor: Editor) => {
    if (!editor) return

    editor.setCameraOptions({
      constraints: {
        initialZoom: 'fit-max',
        baseZoom: 'default',
        bounds: { w: 2048, h: 2048, x: 0, y: 0 },
        padding: { x: 64, y: 64 },
        origin: { x: 0.5, y: 0.5 },
        behavior: 'outside',
      },
      zoomSteps: [0.25, 0.5, 1, 2, 4, 8],
      zoomSpeed: 1,
      panSpeed: 1,
      isLocked: false,
    })
    editor.setCamera(editor.getCamera(), { reset: true })
  }

  return (
    <Tldraw
      onMount={onMount}
      persistenceKey='test'
    />
  )
}
