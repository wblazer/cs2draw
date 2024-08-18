import { useState, useEffect } from 'react'
import {
  Tldraw,
  Editor,
  TLPage,
  TLComponents,
} from 'tldraw'
import { Minimap } from './Minimap'
import { MapSelector } from './MapSelector'

export function MapEditor() {
  const [editor, setEditor] = useState<Editor | null>(null)

  function onMount(editor: Editor) {
    setEditor(editor)

    editor.updateInstanceState({ isDebugMode: false })
    editor.user.updateUserPreferences({ colorScheme: 'dark' })
  }

  useEffect(() => {
    if (!editor) return

    const handlePageCreate = (page: TLPage) => {
      const map = editor.getCurrentPage().meta.currentMap as string || 'de_mirage'
      editor.run(
        () => {
          Minimap.addToPage(editor, page.id, map)
        }, { history: 'ignore' }
      )
      // TODO: Find better way to ensure camera gets reset once minimap is loaded
      setTimeout(() => {
        resetCamera(editor)
      }, 10)
    }

    // Attach handlers to page create events
    editor.sideEffects.registerAfterCreateHandler('page', (page) => {
      handlePageCreate(page)
    })

    // Run manually for first page
    handlePageCreate(editor.getCurrentPage())
  }, [editor])

  function resetCamera(editor: Editor) {
    if (!editor) return

    editor.setCameraOptions({
      constraints: {
        initialZoom: 'fit-max',
        baseZoom: 'default',
        bounds: { w: 2048, h: 2048, x: 0, y: 0 },
        padding: { x: 64, y: 64 },
        origin: { x: 0.5, y: 0.5 },
        behavior: 'free',
      },
      zoomSteps: [0.25, 0.5, 1, 2, 4, 8],
      zoomSpeed: 1,
      panSpeed: 1,
      isLocked: false,
    })
    editor.setCamera(editor.getCamera(), { reset: true })
  }

  const components: TLComponents = {
    TopPanel: MapSelector,
  }

  return (
    <Tldraw
      onMount={onMount}
      persistenceKey="my-persistence-key"
      components={components}
    />
  )
}
