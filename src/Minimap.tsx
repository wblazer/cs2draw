// Minimap.tsx
import {
  Editor,
  AssetRecordType,
  TLAssetId,
  createShapeId,
  TLImageShape,
  TLShapeId,
  TLPageId,
} from 'tldraw'

import de_dust2 from './assets/maps/de_dust2.png';
import de_mirage from './assets/maps/de_mirage.png';
import de_ancient from './assets/maps/de_ancient.png';
import de_anubis from './assets/maps/de_anubis.png';
import de_vertigo from './assets/maps/de_vertigo.png';
import de_inferno from './assets/maps/de_inferno.png';
import de_nuke from './assets/maps/de_nuke.png';
import de_overpass from './assets/maps/de_overpass.png';

const MAP_ASSETS: Record<string, string> = {
  de_dust2,
  de_mirage,
  de_ancient,
  de_anubis,
  de_vertigo,
  de_inferno,
  de_nuke,
  de_overpass,
};

export const Minimap = {
  addToPage: (editor: Editor, pageId: TLPageId, mapName: string) => {
    const assetId = Minimap.createMapAsset(editor, mapName)
    const mapShapeId = Minimap.createMapShape(editor, pageId, assetId)
    Minimap.ensureMapStaysLocked(editor, mapShapeId)

    return mapShapeId
  },

  updateOnPage: (editor: Editor, pageId: TLPageId, newMapName: string) => {
    const page = editor.getPage(pageId)
    if (!page) return

    const mapShapeId = page.meta.mapShapeId as TLShapeId | undefined

    if (mapShapeId) {
      const newAssetId = Minimap.createMapAsset(editor, newMapName)
      editor.updateShape<TLImageShape>({
        id: mapShapeId,
        type: 'image',
        props: { assetId: newAssetId }
      })

      editor.updatePage({
        id: pageId,
        meta: { currentMap: newMapName, mapShapeId: mapShapeId }
      })
    } else {
      console.warn('No map found on page, creating new one')
      Minimap.addToPage(editor, pageId, newMapName)
    }
  },

  createMapAsset: (editor: Editor, mapName: string): TLAssetId => {
    const assetId = AssetRecordType.createId()
    editor.createAssets([
      {
        id: assetId,
        type: 'image',
        typeName: 'asset',
        meta: {},
        props: {
          name: mapName,
          src: MAP_ASSETS[mapName],
          mimeType: 'image/png',
          w: 2048,
          h: 2048,
          isAnimated: false,
        },
      },
    ])
    console.log("Created map asset with src:", MAP_ASSETS[mapName], "and id:", assetId)
    return assetId
  },

  createMapShape: (editor: Editor, pageId: TLPageId, assetId: TLAssetId): TLShapeId => {
    const shapeId = createShapeId()
    editor.createShape<TLImageShape>({
      id: shapeId,
      type: 'image',
      x: 0,
      y: 0,
      isLocked: true,
      parentId: pageId,
      props: {
        assetId,
        w: 2048,
        h: 2048,
      },
    })
    editor.sendToBack([shapeId])
    console.log("Created map shape")
    return shapeId
  },

  ensureMapStaysLocked: (editor: Editor, shapeId: TLShapeId) => {
    editor.sideEffects.registerBeforeChangeHandler(
      'shape',
      (prev, next) => {
        if (next.id !== shapeId) return next
        if (next.isLocked) return next
        return { ...prev, isLocked: true }
      }
    )
  },
}
