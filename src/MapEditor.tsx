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

    editor.user.updateUserPreferences({ colorScheme: 'dark' })
    console.log("Running onMount")
  }

  useEffect(() => {
    if (!editor) return
    console.log("In useEffect() for editor")

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
    handlePageCreate(editor.getCurrentPage())
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

  const components: TLComponents = {
    TopPanel: MapSelector,
  }

  return (
    <Tldraw
      onMount={onMount}
      persistenceKey='test'
      components={components}
    />
  )
}
