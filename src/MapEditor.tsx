import { useState, useEffect } from 'react'
import {
  Tldraw,
  Editor,
  AssetRecordType,
  createShapeId,
  TLImageShape,
  TLShapeId,
} from 'tldraw'

import de_mirage from './assets/maps/de_mirage.png'

export function MapEditor() {
  const [editor, setEditor] = useState<Editor | null>(null)
  const [imageShapeId, setImageShapeId] = useState<TLShapeId | null>(null)

  function onMount(editor: Editor) {
    setEditor(editor)

    editor.user.updateUserPreferences({ colorScheme: 'dark' })
  }

  // Set map as background
  useEffect(() => {
    if (!editor) return

    editor.updateInstanceState({ isDebugMode: false })

    const assetId = AssetRecordType.createId()
    editor.createAssets([
      {
        id: assetId,
        type: 'image',
        typeName: 'asset',
        meta: {},
        props: {
          w: 2048,
          h: 2048,
          mimeType: 'image/png',
          src: de_mirage,
          name: 'de_mirage',
          isAnimated: false,
        }
      }
    ])
    const shapeId = createShapeId()
    editor.createShape<TLImageShape>({
      id: shapeId,
      type: 'image',
      x: 0,
      y: 0,
      isLocked: true,
      props: {
        w: 1024,
        h: 1024,
        assetId,
      }
    })

    const cleanupKeepShapeLocked = editor.sideEffects.registerBeforeChangeHandler(
      'shape',
      (prev, next) => {
        if (next.id !== shapeId) return next
        if (next.isLocked) return next
        return { ...prev, isLocked: true }
      }
    )

    editor.clearHistory()
    setImageShapeId(shapeId)

    return () => {
      cleanupKeepShapeLocked()
    }
  }, [de_mirage, editor])

  useEffect(() => {
    if (!editor) return
    if (!imageShapeId) return

    editor.setCameraOptions({
      constraints: {
        initialZoom: 'fit-max',
        baseZoom: 'default',
        bounds: { w: 1024, h: 1024, x: 0, y: 0 },
        padding: { x: 128, y: 128 },
        origin: { x: 0.5, y: 0.5 },
        behavior: 'outside',
      },
      zoomSteps: [0.25, 0.5, 1, 2, 4, 8],
      zoomSpeed: 1,
      panSpeed: 1,
      isLocked: false,
    })
    editor.setCamera(editor.getCamera(), { reset: true })
  }, [editor, imageShapeId, de_mirage])

  return (
    <Tldraw
      onMount={onMount}

    />
  )
}
