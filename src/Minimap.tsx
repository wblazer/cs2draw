import {
  Editor,
  AssetRecordType,
  TLAsset,
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

const MAP_ASSETS: Record<string, string | null> = {
  de_mirage,
  de_ancient,
  de_anubis,
  de_vertigo,
  de_inferno,
  de_nuke,
  de_dust2,
  de_overpass,
  blank: null,
};

export const Minimap = {
  addToPage: (editor: Editor, pageId: TLPageId, mapName: string) => {
    const page = editor.getPage(pageId)
    if (!page) return

    // If there's a map already on the page, do nothing
    const existingMapShapeId = page.meta.mapShapeId as TLShapeId | undefined
    if (existingMapShapeId) {
      Minimap.ensureMapStaysLocked(editor, existingMapShapeId)
      return
    }

    editor.run(
      () => {
        const assetId = Minimap.createMapAsset(editor, mapName)
        const mapShapeId = Minimap.createMapShape(editor, pageId, assetId)
        Minimap.ensureMapStaysLocked(editor, mapShapeId)
        editor.updatePage({
          id: pageId,
          meta: { currentMap: mapName, mapShapeId: mapShapeId }
        })
      },
      { history: 'ignore' }
    )
  },

  updateOnPage: (editor: Editor, pageId: TLPageId, newMapName: string) => {
    const page = editor.getPage(pageId)
    if (!page) return

    const mapShapeId = page.meta.mapShapeId as TLShapeId | undefined

    if (mapShapeId) {
      const newAssetId = Minimap.createMapAsset(editor, newMapName)

      editor.run(() => {
        editor.updateShape<TLImageShape>({
          id: mapShapeId,
          type: 'image',
          props: { assetId: newAssetId }
        })
      }, { ignoreShapeLock: true, history: 'ignore' }
      )

      editor.updatePage({
        id: pageId,
        meta: { currentMap: newMapName, mapShapeId: mapShapeId }
      })
    } else {
      Minimap.addToPage(editor, pageId, newMapName)
    }
  },

  createMapAsset: (editor: Editor, mapName: string): TLAssetId => {
    // First check if the map asset is in the store so we can reuse it
    const editorAssets: TLAsset[] = editor.getAssets()
    const existingMapAsset: TLAsset | undefined = editorAssets.find(asset => asset.props?.src === MAP_ASSETS[mapName])
    if (existingMapAsset) {
      return existingMapAsset.id
    }

    // Else, create a new asset
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
