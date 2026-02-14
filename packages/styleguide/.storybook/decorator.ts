export const SideBySide = () => ({
  template: `<div style="position: absolute; top: 0; left: 0; bottom: 0; right: 0;">
      <div style="display: grid; grid-template-columns: 1fr 1fr; height: 100%;">
        <div data-theme="light" style="padding: 20px; background: #ffffff;">
          <story />
        </div>
        <div data-theme="dark" style="padding: 20px; background: #111315;">
          <story />
        </div>
      </div>
    </div>`,
});
