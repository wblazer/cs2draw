import {
  DefaultMainMenu,
  EditSubmenu,
  ExportFileContentSubMenu,
  ExtrasGroup,
  KeyboardShortcutsMenuItem,
  LanguageMenu,
  TldrawUiMenuGroup,
  TldrawUiMenuItem,
  TldrawUiMenuSubmenu,
  ToggleEdgeScrollingItem,
  ToggleFocusModeItem,
  ToggleGridItem,
  ToggleReduceMotionItem,
  ToggleSnapModeItem,
  ToggleToolLockItem,
  ToggleWrapModeItem,
  ViewSubmenu,
} from "tldraw";

export function CustomMainMenu() {
  return (
    <DefaultMainMenu>
      <EditSubmenu />
      <ViewSubmenu />
      <ExportFileContentSubMenu />
      <ExtrasGroup />
      <CustomPreferencesGroup />
      <div>
        <TldrawUiMenuGroup id="example">
          <TldrawUiMenuItem
            id="about"
            label="About CS2Draw"
            icon="external-link"
            readonlyOk
            onSelect={() => {
              window.open("https://github.com/wblazer/cs2draw", "_blank");
            }}
          />
        </TldrawUiMenuGroup>
      </div>
    </DefaultMainMenu>
  );
}

function CustomPreferencesGroup() {
  return (
    <TldrawUiMenuGroup id="preferences">
      <TldrawUiMenuSubmenu id="preferences" label="menu.preferences">
        <TldrawUiMenuGroup id="preferences-actions">
          <ToggleSnapModeItem />
          <ToggleToolLockItem />
          <ToggleGridItem />
          <ToggleWrapModeItem />
          <ToggleFocusModeItem />
          <ToggleEdgeScrollingItem />
          <ToggleReduceMotionItem />
        </TldrawUiMenuGroup>
      </TldrawUiMenuSubmenu>
      <LanguageMenu />
      <KeyboardShortcutsMenuItem />
    </TldrawUiMenuGroup>
  );
}
