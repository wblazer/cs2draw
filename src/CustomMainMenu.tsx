import {
  DefaultMainMenu,
  DefaultMainMenuContent,
  TldrawUiMenuGroup,
  TldrawUiMenuItem,
} from "tldraw";

export function CustomMainMenu() {
  return (
    <DefaultMainMenu>
      <DefaultMainMenuContent />
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
