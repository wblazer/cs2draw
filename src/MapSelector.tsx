import {
  useEditor,
  TldrawUiDropdownMenuRoot,
  TldrawUiDropdownMenuTrigger,
  TldrawUiDropdownMenuContent,
  TldrawUiDropdownMenuGroup,
  TldrawUiDropdownMenuItem,
  TldrawUiButton,
  TldrawUiButtonIcon,
  useValue,
} from 'tldraw';
import { Minimap } from './Minimap';

const MAPS: Record<string, string> = {
  'de_mirage': 'Mirage',
  'de_ancient': 'Ancient',
  'de_anubis': 'Anubis',
  'de_vertigo': 'Vertigo',
  'de_inferno': 'Inferno',
  'de_nuke': 'Nuke',
  'de_dust2': 'Dust II',
  'de_overpass': 'Overpass',
  'blank': 'Blank',
};

export function MapSelector() {
  const editor = useEditor();

  const currentMap = useValue('current map', () => {
    const currentPage = editor.getCurrentPage();
    return currentPage.meta.currentMap as string | undefined;
  }, [editor]);

  const handleMapChange = (newMapName: string) => {
    editor.run(
      () => {
        const currentPageId = editor.getCurrentPageId();
        Minimap.updateOnPage(editor, currentPageId, newMapName);
      }, { ignoreShapeLock: true, history: 'ignore' }
    )
  };

  return (
    <div className="map-selector tlui-menu-zone">
      <TldrawUiDropdownMenuRoot id="map-selector">
        < TldrawUiDropdownMenuTrigger >
          <TldrawUiButton
            type="icon"
            className="tlui-map-selector__trigger tlui-menu__trigger flex-none"
          >
            <div className="tlui-page-menu__name">
              {currentMap ? MAPS[currentMap] : 'Select Map'}
            </div>
            <TldrawUiButtonIcon icon="chevron-down" />
          </TldrawUiButton>
        </TldrawUiDropdownMenuTrigger >
        <TldrawUiDropdownMenuContent align="start" sideOffset={4}>
          <TldrawUiDropdownMenuGroup>
            {Object.keys(MAPS).map((map) => (
              <TldrawUiDropdownMenuItem key={map}>
                <TldrawUiButton
                  type="menu"
                  onClick={() => handleMapChange(map)}
                >
                  <span className="tlui-button__label">{MAPS[map]}</span>
                  {currentMap === map && <TldrawUiButtonIcon icon="check" />}
                </TldrawUiButton>
              </TldrawUiDropdownMenuItem>
            ))}
          </TldrawUiDropdownMenuGroup>
        </TldrawUiDropdownMenuContent>
      </TldrawUiDropdownMenuRoot >
    </div >
  );
}
