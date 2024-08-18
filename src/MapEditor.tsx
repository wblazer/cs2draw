import { useState, useEffect } from 'react'
import {
  Tldraw,
  Editor,
  TLPage,
  TLShapeId,
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
      const mapName = editor.getCurrentPage().meta.currentMap as string || 'de_mirage'
      editor.run(
        () => {
          Minimap.addToPage(editor, page.id, mapName)
          setTimeout(() => {
            resetCamera(editor)
          }, 10)
        }, { history: 'ignore' }
      )
    }

    // Attach handlers to page create events
    editor.sideEffects.registerAfterCreateHandler('page', (page) => {
      handlePageCreate(page)
    })

    // Lock maps on existing pages and add if missing
    editor.run(
      () => {
        lockExistingMaps(editor)
        resetCamera(editor)
      }
    )
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
      wheelBehavior: 'zoom',
      isLocked: false,
    })
    editor.setCamera(editor.getCamera(), { reset: true })
  }

  function lockExistingMaps(editor: Editor) {
    if (!editor) return

    const pages: TLPage[] = editor.getPages()
    pages.forEach((page) => {
      const existingMapShapeId = page.meta.mapShapeId as TLShapeId | undefined
      if (!existingMapShapeId) {
        // Add to page
        const mapName = page.meta.currentMap as string || 'de_mirage'
        Minimap.addToPage(editor, page.id, mapName)
        return
      }
      // Lock existing map
      Minimap.ensureMapStaysLocked(editor, existingMapShapeId)
    })
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
