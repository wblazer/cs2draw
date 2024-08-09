import {
  useEditor,
  TldrawUiDropdownMenuRoot,
  TldrawUiDropdownMenuTrigger,
  TldrawUiDropdownMenuContent,
  TldrawUiDropdownMenuGroup,
  TldrawUiDropdownMenuItem,
  TldrawUiButton,
  TldrawUiButtonIcon,
} from 'tldraw';
import { Minimap } from './Minimap';

const MAP_OPTIONS = [
  { value: 'de_dust2', label: 'Dust II' },
  { value: 'de_mirage', label: 'Mirage' },
  { value: 'de_ancient', label: 'Ancient' },
  { value: 'de_anubis', label: 'Anubis' },
  { value: 'de_vertigo', label: 'Vertigo' },
  { value: 'de_inferno', label: 'Inferno' },
  { value: 'de_nuke', label: 'Nuke' },
  { value: 'de_overpass', label: 'Overpass' },
];

export function MapSelector() {
  const editor = useEditor();

  const handleMapChange = (newMapName: string) => {
    const currentPageId = editor.getCurrentPageId();
    Minimap.updateOnPage(editor, currentPageId, newMapName);
  };

  return (
    <div className="map-selector tlui-menu-zone">
      <TldrawUiDropdownMenuRoot id="map-selector">
        < TldrawUiDropdownMenuTrigger >
          <TldrawUiButton
            type="icon"
            className="tlui-map-selector__trigger tlui-menu__trigger flex-none"
          >
            <div className="tlui-page-menu__name">Select Map</div>
            <TldrawUiButtonIcon icon="chevron-down" />
          </TldrawUiButton>
        </TldrawUiDropdownMenuTrigger >
        <TldrawUiDropdownMenuContent align="start" sideOffset={4}>
          <TldrawUiDropdownMenuGroup>
            {MAP_OPTIONS.map((option) => (
              <TldrawUiDropdownMenuItem key={option.value}>
                <TldrawUiButton
                  type="menu"
                  onClick={() => handleMapChange(option.value)}
                >
                  <span className="tlui-button__label">{option.label}</span>
                </TldrawUiButton>
              </TldrawUiDropdownMenuItem>
            ))}
          </TldrawUiDropdownMenuGroup>
        </TldrawUiDropdownMenuContent>
      </TldrawUiDropdownMenuRoot >
    </div >
  );
}
