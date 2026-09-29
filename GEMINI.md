# POI Website – Resource Protection Rules

## 1. Protected Resources (Presentation Slides & Branded Materials)
Whenever presentation slides (PowerPoint/PDF slide decks), branded curriculum, or core training materials are added:
- **Embedded Viewer Only**: Open inside the on-page embedded viewer modal (`#resource-viewer-modal`) with toolbar suppressed (`#toolbar=0&navpanes=0&scrollbar=1`).
- **No Download Buttons**: Do not include download links or buttons on the card or in the modal viewer header.
- **Protection Measures Active**:
  - Anti-screenshot / privacy shield blurs content on window blur or tab switch.
  - Disable text copying, text selection (`user-select: none`), right-click context menu, and dragging.
  - Block keyboard print and save shortcuts (`Cmd/Ctrl + P`, `Cmd/Ctrl + S`, `PrintScreen`).
  - Modal footer clearly notes read-only student material.
  - No watermarks (keep viewer clean per user preference).

## 2. Unrestricted Resources (Informal Notes & Motion Guides)
Whenever informal notes, motion walkthroughs, reading guides, or student study handouts are added:
- **Embedded Viewer with Full Access**: Still open inside the on-page embedded viewer modal, but marked with `data-viewer-unrestricted="true"`:
  - Viewer opens with native PDF toolbar enabled (`#toolbar=1&navpanes=0&scrollbar=1`).
  - Provide direct download button (circular icon button on card) and header download/new-tab actions in the viewer.
  - Text selection and copying enabled (`user-select: auto !important`).
  - Privacy shield is **disabled** on blur / tab switch so students can multitask and take notes seamlessly.
  - Right-click, print (`Cmd/Ctrl + P`), and save (`Cmd/Ctrl + S`) shortcuts are permitted.
  - Modal footer notes that the material is free to read, print, copy, and download.

## 3. Ambiguity Protocol
- **Always Ask If Unsure**: If it is ever unclear whether a newly provided resource constitutes official branded slides (protected) or informal notes/guides (unrestricted), **ALWAYS ASK the user** for clarification before publishing or applying protection settings.
