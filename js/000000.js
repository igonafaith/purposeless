(() => {
  const shortcuts = new Map();

  function addShortcut(combo, handler, { target = document, disableInInput = false } = {}) {
    const parts = combo.toLowerCase().split("+");
    const need = {
      ctrl: parts.includes("ctrl") || parts.includes("control"),
      shift: parts.includes("shift"),
      alt: parts.includes("alt"),
      meta: parts.includes("meta"),
      key: parts.find(k => !["ctrl","control","shift","alt","meta"].includes(k))
    };

    function listener(e) {
      if (disableInInput) {
        const el = e.target;
        const tag = el && el.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || el?.isContentEditable) return;
      }
      const match =
        (!!e.ctrlKey === need.ctrl) &&
        (!!e.shiftKey === need.shift) &&
        (!!e.altKey === need.alt) &&
        (!!e.metaKey === need.meta) &&
        (e.key.toLowerCase() === (need.key || ""));

      if (match) {
        handler(e);
        e.stopPropagation();
        e.preventDefault();
      }
    }

    target.addEventListener("keydown", listener, false);
    shortcuts.set(combo.toLowerCase(), { target, listener });
  }

  function removeShortcut(combo) {
    const rec = shortcuts.get(combo.toLowerCase());
    if (rec) {
      rec.target.removeEventListener("keydown", rec.listener, false);
      shortcuts.delete(combo.toLowerCase());
    }
  }

  addShortcut("ctrl+u", () => {
    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
      position: "fixed", inset: "0", zIndex: "999999",
      background: "#000"
    });
    const img = document.createElement("img");
    img.src = "https://media.tenor.com/x8v1oNUOmg4AAAAM/rickroll-roll.gif";
    Object.assign(img.style, { width: "100%", height: "100%", objectFit: "cover" });
    overlay.appendChild(img);
    document.body.appendChild(overlay);
  }, { disableInInput: true });

  window._shortcut = { addShortcut, removeShortcut };
})();
