"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Field: () => Field,
  Section: () => Section,
  SegmentedControl: () => SegmentedControl,
  SelectControl: () => SelectControl,
  SliderControl: () => SliderControl,
  TogglesPanel: () => TogglesPanel,
  TogglesPanelBody: () => TogglesPanelBody,
  TogglesPanelShell: () => TogglesPanelShell,
  TogglesProvider: () => TogglesProvider,
  useToggles: () => useToggles,
  useVariant: () => useVariant
});
module.exports = __toCommonJS(index_exports);

// src/TogglesContext.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var STYLE_ID = "toggletation-styles";
var LS_KEY = "toggletation-state";
var INJECTED_CSS = `
.st-toggle:hover { background: #252525 !important; }
.st-seg-btn:hover { color: rgba(255, 255, 255, 0.7) !important; }
.st-select:focus { outline: none; }
.st-toggle { transition: background 180ms ease, color 180ms ease; }
.st-seg-btn { transition: background 120ms ease, color 120ms ease; }
.st-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 8px; border-radius: 9999px; outline: none; cursor: pointer; background: linear-gradient(to right, #c8c8c8 var(--st-pct, 50%), #e8e8e8 var(--st-pct, 50%)); }
.st-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 0; height: 0; }
.st-slider::-moz-range-thumb { width: 0; height: 0; border: none; }
`;
var TogglesContext = (0, import_react.createContext)({
  toggles: [],
  fields: [],
  setToggle: () => {
  },
  getValue: () => "",
  getDefaultValue: () => ""
});
function getDefaultForField(field, defaults) {
  var _a;
  if (defaults && defaults[field.fieldId] !== void 0) {
    return String(defaults[field.fieldId]);
  }
  const current = (_a = field.options.find((o) => o.current)) != null ? _a : field.options[0];
  return String(current.value);
}
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}
function saveToStorage(toggles) {
  try {
    const map = {};
    for (const t of toggles) map[t.fieldId] = t.value;
    localStorage.setItem(LS_KEY, JSON.stringify(map));
  } catch (e) {
  }
}
function TogglesProvider({
  fields,
  defaults,
  children
}) {
  const [toggles, setToggles] = (0, import_react.useState)(
    () => fields.map((f) => ({
      fieldId: f.fieldId,
      value: getDefaultForField(f, defaults)
    }))
  );
  (0, import_react.useEffect)(() => {
    const stored = loadFromStorage();
    setToggles((prev) => {
      const next = prev.map((t) => {
        var _a;
        return __spreadProps(__spreadValues({}, t), {
          value: (_a = stored[t.fieldId]) != null ? _a : t.value
        });
      });
      const changed = next.some((t, i) => {
        var _a;
        return t.value !== ((_a = prev[i]) == null ? void 0 : _a.value);
      });
      return changed ? next : prev;
    });
  }, []);
  (0, import_react.useEffect)(() => {
    setToggles((prev) => {
      const stored = loadFromStorage();
      const existing = new Set(prev.map((t) => t.fieldId));
      const newEntries = fields.filter((f) => !existing.has(f.fieldId)).map((f) => {
        var _a;
        return {
          fieldId: f.fieldId,
          value: (_a = stored[f.fieldId]) != null ? _a : getDefaultForField(f, defaults)
        };
      });
      return newEntries.length === 0 ? prev : [...prev, ...newEntries];
    });
  }, [fields]);
  (0, import_react.useEffect)(() => {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = INJECTED_CSS;
    document.head.appendChild(style);
    return () => {
      var _a;
      (_a = document.getElementById(STYLE_ID)) == null ? void 0 : _a.remove();
    };
  }, []);
  function setToggle(fieldId, value) {
    setToggles((prev) => {
      const next = prev.map(
        (t) => t.fieldId === fieldId ? __spreadProps(__spreadValues({}, t), { value }) : t
      );
      saveToStorage(next);
      return next;
    });
  }
  function getValue(fieldId) {
    var _a, _b;
    return (_b = (_a = toggles.find((t) => t.fieldId === fieldId)) == null ? void 0 : _a.value) != null ? _b : "";
  }
  function getDefaultValue(fieldId) {
    const field = fields.find((f) => f.fieldId === fieldId);
    if (!field) return "";
    return getDefaultForField(field, defaults);
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    TogglesContext.Provider,
    {
      value: { toggles, fields, setToggle, getValue, getDefaultValue },
      children
    }
  );
}
function useToggles() {
  return (0, import_react.useContext)(TogglesContext);
}

// src/TogglesPrimitives.tsx
var import_react2 = __toESM(require("react"));
var import_jsx_runtime2 = require("react/jsx-runtime");
var MODIFIED_BLUE = "#60a5fa";
function DialsIcon() {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M10 5H3" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M12 19H3" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M14 3v4" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M16 17v4" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M21 12h-9" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M21 19h-5" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M21 5h-7" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M8 10v4" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M8 12H3" })
      ]
    }
  );
}
function CopyIcon() {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "15",
      height: "15",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("rect", { x: "9", y: "9", width: "13", height: "13", rx: "2", ry: "2" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })
      ]
    }
  );
}
function CheckIcon() {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "15",
      height: "15",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2.5",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("polyline", { points: "20 6 9 17 4 12" })
    }
  );
}
function XIcon() {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "14",
      height: "14",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2.5",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
      ]
    }
  );
}
var MARGIN = 24;
var BTN_SIZE = 42;
var PANEL_GAP = 12;
function cornerBtnPos(c) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  return {
    x: c.endsWith("right") ? w - MARGIN - BTN_SIZE : MARGIN,
    y: c.startsWith("top") ? MARGIN : h - MARGIN - BTN_SIZE
  };
}
function nearestCorner(mx, my) {
  const left = mx < window.innerWidth / 2;
  const top = my < window.innerHeight / 2;
  return `${top ? "top" : "bottom"}-${left ? "left" : "right"}`;
}
function panelFixedStyle(c) {
  const offset = MARGIN + BTN_SIZE + PANEL_GAP;
  switch (c) {
    case "bottom-right":
      return { position: "fixed", bottom: offset, right: MARGIN, zIndex: 50 };
    case "bottom-left":
      return { position: "fixed", bottom: offset, left: MARGIN, zIndex: 50 };
    case "top-right":
      return { position: "fixed", top: offset, right: MARGIN, zIndex: 50 };
    case "top-left":
      return { position: "fixed", top: offset, left: MARGIN, zIndex: 50 };
  }
}
var panelCard = {
  width: 288,
  background: "#1c1c1c",
  borderRadius: 16,
  border: "1px solid rgb(255 255 255 / 0.12)",
  overflow: "hidden",
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  lineHeight: "normal"
};
var panelBody = {
  padding: "18px 16px 16px 16px",
  display: "flex",
  flexDirection: "column",
  gap: 20,
  maxHeight: 448,
  overflowY: "auto",
  scrollbarWidth: "none"
};
var toggleBtn = {
  width: 42,
  height: 42,
  background: "#1c1c1c",
  color: "white",
  borderRadius: 9999,
  border: "1px solid rgb(255 255 255 / 0.12)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  userSelect: "none",
  flexShrink: 0
};
function TogglesPanelShell({
  children,
  hasChanges,
  onSave
}) {
  const [open, setOpen] = import_react2.default.useState(false);
  const [corner, setCorner] = import_react2.default.useState("bottom-right");
  const [btnPos, setBtnPos] = import_react2.default.useState(
    null
  );
  const [animating, setAnimating] = import_react2.default.useState(false);
  const [dragging, setDragging] = import_react2.default.useState(false);
  const [copied, setCopied] = import_react2.default.useState(false);
  const panelRef = (0, import_react2.useRef)(null);
  const btnRef = (0, import_react2.useRef)(null);
  const dragRef = (0, import_react2.useRef)(null);
  const snapTimer = (0, import_react2.useRef)(null);
  const copiedTimer = (0, import_react2.useRef)(null);
  (0, import_react2.useEffect)(() => {
    var _a;
    const saved = (_a = localStorage.getItem("toggles-corner")) != null ? _a : "bottom-right";
    setCorner(saved);
    setBtnPos(cornerBtnPos(saved));
  }, []);
  (0, import_react2.useEffect)(() => {
    function onResize() {
      setBtnPos(cornerBtnPos(corner));
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [corner]);
  (0, import_react2.useEffect)(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  function snapToCorner(c) {
    setCorner(c);
    setAnimating(true);
    setBtnPos(cornerBtnPos(c));
    localStorage.setItem("toggles-corner", c);
    if (snapTimer.current) clearTimeout(snapTimer.current);
    snapTimer.current = setTimeout(() => setAnimating(false), 300);
  }
  function handleButtonMouseDown(e) {
    if (!btnPos) return;
    e.preventDefault();
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startBtnX: btnPos.x,
      startBtnY: btnPos.y,
      moved: false
    };
    function onMove(me) {
      if (!dragRef.current) return;
      const dx = me.clientX - dragRef.current.startX;
      const dy = me.clientY - dragRef.current.startY;
      if (!dragRef.current.moved && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
        dragRef.current.moved = true;
        setDragging(true);
        setOpen(false);
      }
      if (dragRef.current.moved) {
        setBtnPos({
          x: dragRef.current.startBtnX + dx,
          y: dragRef.current.startBtnY + dy
        });
      }
    }
    function onUp(me) {
      var _a;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      if (!((_a = dragRef.current) == null ? void 0 : _a.moved)) {
        setOpen((o) => !o);
      } else {
        snapToCorner(nearestCorner(me.clientX, me.clientY));
      }
      setDragging(false);
      dragRef.current = null;
    }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }
  function handleSaveClick() {
    onSave == null ? void 0 : onSave();
    setCopied(true);
    if (copiedTimer.current) clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setCopied(false), 1800);
  }
  if (!btnPos) return null;
  const isBottom = corner.startsWith("bottom");
  const isRight = corner.endsWith("right");
  const panelTransformOrigin = `${isBottom ? "bottom" : "top"} ${isRight ? "right" : "left"}`;
  const panelTranslate = isBottom ? "translateY(4px)" : "translateY(-4px)";
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("style", { children: `.st-panel-body::-webkit-scrollbar{width:0;height:0;background:transparent}` }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "div",
      {
        ref: panelRef,
        style: __spreadProps(__spreadValues({}, panelFixedStyle(corner)), {
          opacity: open ? 1 : 0,
          transform: open ? "scale(1) translateY(0)" : `scale(0.98) ${panelTranslate}`,
          transformOrigin: panelTransformOrigin,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 80ms ease, transform 180ms cubic-bezier(0.25, 0, 0, 1)"
        }),
        children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { position: "relative" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: panelCard, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "st-panel-body", style: panelBody, children }) }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
            "div",
            {
              style: {
                position: "absolute",
                top: 0,
                right: 0,
                display: "flex",
                alignItems: "center",
                gap: 4,
                background: "#252525",
                border: "1px solid rgb(255 255 255 / 0.14)",
                borderRadius: "0 16px 0 10px",
                padding: "4px 6px 4px 8px",
                zIndex: 1,
                boxShadow: "0 2px 6px rgb(0 0 0 / 0.35)"
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                  "button",
                  {
                    onClick: handleSaveClick,
                    onMouseEnter: (e) => {
                      if (hasChanges) e.currentTarget.style.background = "rgb(96 165 250 / 0.12)";
                    },
                    onMouseLeave: (e) => {
                      e.currentTarget.style.background = "none";
                    },
                    style: {
                      background: "none",
                      border: "none",
                      cursor: hasChanges ? "pointer" : "default",
                      color: hasChanges ? MODIFIED_BLUE : "rgb(255 255 255 / 0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 20,
                      height: 20,
                      borderRadius: 999,
                      padding: 0,
                      pointerEvents: hasChanges ? "auto" : "none",
                      transition: "color 180ms ease, background 120ms ease"
                    },
                    "aria-label": "Copy defaults snippet",
                    children: copied ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(CheckIcon, {}) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(CopyIcon, {})
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                  "button",
                  {
                    onClick: () => setOpen(false),
                    onMouseEnter: (e) => {
                      e.currentTarget.style.background = "rgb(255 255 255 / 0.1)";
                    },
                    onMouseLeave: (e) => {
                      e.currentTarget.style.background = "none";
                    },
                    style: {
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "rgb(255 255 255 / 0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 20,
                      height: 20,
                      borderRadius: 999,
                      padding: 0,
                      transition: "color 120ms ease, background 120ms ease"
                    },
                    "aria-label": "Close panel",
                    children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(XIcon, {})
                  }
                )
              ]
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "button",
      {
        ref: btnRef,
        className: "st-toggle",
        onMouseDown: handleButtonMouseDown,
        style: __spreadProps(__spreadValues({}, toggleBtn), {
          position: "fixed",
          left: btnPos.x,
          top: btnPos.y,
          cursor: dragging ? "grabbing" : "pointer",
          transition: animating ? "left 300ms cubic-bezier(0.25, 0, 0, 1), top 300ms cubic-bezier(0.25, 0, 0, 1)" : "none",
          zIndex: 51
        }),
        "aria-label": "Toggle design panel",
        children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(DialsIcon, {})
      }
    )
  ] });
}
function Section({
  label,
  children
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 12 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "p",
      {
        style: {
          fontSize: 10,
          fontWeight: 600,
          color: "rgb(255 255 255 / 0.35)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          margin: 0
        },
        children: label
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { display: "flex", flexDirection: "column", gap: 16 }, children })
  ] });
}
function Field({
  label,
  blurb,
  children
}) {
  const [expanded, setExpanded] = import_react2.default.useState(false);
  const blurbParagraphs = blurb.split("\n\n");
  const blurbText = /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { display: "flex", flexDirection: "column", gap: 6 }, children: blurbParagraphs.map((para, i) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "p",
    {
      style: {
        fontSize: 12,
        color: "rgb(255 255 255 / 0.6)",
        lineHeight: 1.625,
        margin: 0
      },
      children: para
    },
    i
  )) });
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "p",
            {
              style: {
                fontSize: 14,
                fontWeight: 500,
                color: "rgb(255 255 255 / 0.88)",
                margin: 0
              },
              children: label
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "button",
            {
              onClick: () => setExpanded((e) => !e),
              style: {
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "rgb(255 255 255 / 0.35)",
                padding: "2px 0",
                display: "flex",
                alignItems: "center"
              },
              children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                "svg",
                {
                  width: "12",
                  height: "12",
                  viewBox: "0 0 12 12",
                  fill: "none",
                  "aria-hidden": "true",
                  style: {
                    transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 150ms ease"
                  },
                  children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                    "path",
                    {
                      d: "M2 4.5L6 8L10 4.5",
                      stroke: "currentColor",
                      strokeWidth: "1.5",
                      strokeLinecap: "round",
                      strokeLinejoin: "round"
                    }
                  )
                }
              )
            }
          )
        ]
      }
    ),
    children,
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "div",
      {
        style: {
          overflow: "hidden",
          maxHeight: expanded ? "120px" : "0px",
          opacity: expanded ? 1 : 0,
          transition: "max-height 200ms ease, opacity 200ms ease"
        },
        children: blurbText
      }
    )
  ] });
}
function SegmentedControl({
  options,
  value,
  onChange,
  isModified
}) {
  const selectedIndex = options.findIndex((o) => o.value === value);
  const btnRefs = (0, import_react2.useRef)([]);
  const containerRef = (0, import_react2.useRef)(null);
  const [pillGeom, setPillGeom] = import_react2.default.useState(null);
  (0, import_react2.useEffect)(() => {
    const btn = btnRefs.current[selectedIndex];
    const container = containerRef.current;
    if (!btn || !container) return;
    const bRect = btn.getBoundingClientRect();
    const cRect = container.getBoundingClientRect();
    setPillGeom({ left: bRect.left - cRect.left, width: bRect.width });
  }, [selectedIndex, options]);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
    "div",
    {
      ref: containerRef,
      style: {
        position: "relative",
        display: "flex",
        padding: 4,
        background: "rgb(255 255 255 / 0.08)",
        borderRadius: 8
      },
      children: [
        pillGeom && selectedIndex !== -1 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "div",
          {
            style: {
              position: "absolute",
              top: 4,
              bottom: 4,
              left: pillGeom.left,
              width: pillGeom.width,
              background: isModified ? "rgb(96 165 250 / 0.15)" : "rgb(255 255 255 / 0.14)",
              borderRadius: 6,
              boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.4)",
              transition: "left 160ms cubic-bezier(0.4, 0, 0.2, 1), width 160ms cubic-bezier(0.4, 0, 0.2, 1), background 200ms ease",
              pointerEvents: "none"
            }
          }
        ),
        options.map((opt, i) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "button",
          {
            ref: (el) => {
              btnRefs.current[i] = el;
            },
            className: "st-seg-btn",
            onClick: () => onChange(opt.value),
            style: {
              fontSize: 12,
              padding: "6px 10px",
              borderRadius: 6,
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
              background: "transparent",
              color: value === opt.value ? isModified ? MODIFIED_BLUE : "rgb(255 255 255 / 0.9)" : "rgb(255 255 255 / 0.4)",
              position: "relative",
              zIndex: 1,
              transition: "color 160ms ease",
              whiteSpace: "nowrap"
            },
            children: opt.label
          },
          opt.value
        ))
      ]
    }
  );
}
function ChevronDown() {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "svg",
    {
      width: "12",
      height: "12",
      viewBox: "0 0 12 12",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      "aria-hidden": "true",
      style: { pointerEvents: "none" },
      children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "path",
        {
          d: "M2 4.5L6 8L10 4.5",
          stroke: "rgb(255 255 255 / 0.4)",
          strokeWidth: "1.5",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }
      )
    }
  );
}
function SelectControl({
  options,
  value,
  onChange,
  isModified
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { position: "relative", width: "100%" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "select",
      {
        className: "st-select",
        value,
        onChange: (e) => onChange(e.target.value),
        style: {
          width: "100%",
          fontSize: 13,
          border: `1px solid ${isModified ? "rgb(96 165 250 / 0.3)" : "rgb(255 255 255 / 0.1)"}`,
          borderRadius: 8,
          padding: "8px 32px 8px 12px",
          background: isModified ? "rgb(96 165 250 / 0.06)" : "rgb(255 255 255 / 0.08)",
          color: isModified ? MODIFIED_BLUE : "rgb(255 255 255 / 0.88)",
          appearance: "none",
          boxSizing: "border-box",
          cursor: "pointer",
          colorScheme: "dark",
          outline: "none",
          transition: "color 200ms ease, background 200ms ease, border-color 200ms ease"
        },
        children: options.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: opt.value, children: opt.label }, opt.value))
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "div",
      {
        style: {
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          display: "flex",
          alignItems: "center"
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(ChevronDown, {})
      }
    )
  ] });
}
function SliderControl({
  value,
  min,
  max,
  step = 1,
  onChange,
  formatValue,
  isModified
}) {
  const [isDragging, setIsDragging] = import_react2.default.useState(false);
  const [isHovered, setIsHovered] = import_react2.default.useState(false);
  const trackRef = (0, import_react2.useRef)(null);
  const dragStartRef = (0, import_react2.useRef)(null);
  const pct = (value - min) / (max - min) * 100;
  const display = formatValue ? formatValue(value) : String(value);
  const KNOB_W = 2;
  const KNOB_PAD = 8;
  const OUTER_R = 10;
  const INNER_PAD = 4;
  const INNER_R = OUTER_R - INNER_PAD + 1;
  const active = isDragging || isHovered;
  const knobInset = active ? 6 : KNOB_PAD;
  const knobW = KNOB_W;
  const knobLeft = `clamp(4px, calc(${pct}% - ${knobW + KNOB_PAD}px), calc(100% - 4px - ${knobW}px))`;
  function handlePointerDown(e) {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const rawLeft = pct / 100 * rect.width - (knobW + KNOB_PAD);
    const clampedLeft = Math.min(Math.max(rawLeft, 4), rect.width - 4 - knobW);
    const knobX = rect.left + clampedLeft;
    const HIT = 10;
    if (e.clientX < knobX - HIT || e.clientX > knobX + knobW + HIT) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartRef.current = { x: e.clientX, value };
    setIsDragging(true);
  }
  function handlePointerMove(e) {
    const track = trackRef.current;
    if (!dragStartRef.current || !track) return;
    const rect = track.getBoundingClientRect();
    const dx = e.clientX - dragStartRef.current.x;
    const raw = dragStartRef.current.value + dx / rect.width * (max - min);
    const stepped = Math.round(raw / step) * step;
    const decimals = step.toString().includes(".") ? step.toString().split(".")[1].length : 0;
    const clean = parseFloat(stepped.toFixed(decimals));
    onChange(Math.min(max, Math.max(min, clean)));
  }
  function handlePointerUp(e) {
    if (!dragStartRef.current) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);
    dragStartRef.current = null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "div",
    {
      ref: trackRef,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      style: {
        position: "relative",
        borderRadius: OUTER_R,
        height: 36,
        cursor: isDragging ? "grabbing" : "grab",
        background: isModified ? "rgb(96 165 250 / 0.08)" : "rgb(255 255 255 / 0.08)",
        padding: INNER_PAD,
        boxSizing: "border-box",
        userSelect: "none",
        transition: "background 200ms ease"
      },
      children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
        "div",
        {
          style: {
            position: "relative",
            height: "100%",
            borderRadius: INNER_R,
            overflow: "hidden"
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              "div",
              {
                style: {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: `${pct}%`,
                  background: isModified ? "rgb(96 165 250 / 0.25)" : "rgb(255 255 255 / 0.13)",
                  borderRadius: `${INNER_R}px`,
                  boxShadow: "inset 0 1px 2px 0 rgb(0 0 0 / 0.4)",
                  transition: "background 200ms ease"
                }
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              "div",
              {
                style: {
                  position: "absolute",
                  top: knobInset,
                  bottom: knobInset,
                  left: knobLeft,
                  width: knobW,
                  background: active ? isModified ? MODIFIED_BLUE : "rgb(255 255 255 / 0.7)" : isModified ? "rgb(96 165 250 / 0.8)" : "rgb(255 255 255 / 0.55)",
                  borderRadius: 2,
                  transition: "top 120ms ease, bottom 120ms ease, width 120ms ease, background 120ms ease"
                }
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
              "div",
              {
                style: {
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 10px",
                  pointerEvents: "none"
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { flex: 1 } }),
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                    "span",
                    {
                      style: {
                        fontSize: 13,
                        color: isModified ? MODIFIED_BLUE : "rgb(255 255 255 / 0.65)",
                        transition: "color 200ms ease"
                      },
                      children: display
                    }
                  )
                ]
              }
            )
          ]
        }
      )
    }
  );
}

// src/TogglesPanel.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
function groupByCategory(fields) {
  var _a;
  const map = /* @__PURE__ */ new Map();
  for (const field of fields) {
    const group = (_a = map.get(field.category)) != null ? _a : [];
    group.push(field);
    map.set(field.category, group);
  }
  return map;
}
function FieldControl({ field }) {
  var _a;
  const { getValue, setToggle, getDefaultValue } = useToggles();
  const value = getValue(field.fieldId);
  const defaultValue = getDefaultValue(field.fieldId);
  const isModified = value !== defaultValue;
  const selectedOption = field.type === "slider" ? field.options.reduce(
    (best, opt) => Math.abs(Number(opt.value) - Number(value)) < Math.abs(Number(best.value) - Number(value)) ? opt : best
  ) : (_a = field.options.find((o) => String(o.value) === value)) != null ? _a : field.options[0];
  const blurb = selectedOption.explanation;
  function handleChange(v) {
    setToggle(field.fieldId, v);
  }
  const stringOptions = field.options.map((o) => {
    var _a2;
    return {
      label: (_a2 = o.label) != null ? _a2 : String(o.value),
      value: String(o.value)
    };
  });
  let control;
  if (field.type === "segmented") {
    control = /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      SegmentedControl,
      {
        options: stringOptions,
        value,
        onChange: handleChange,
        isModified
      }
    );
  } else if (field.type === "select") {
    control = /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      SelectControl,
      {
        options: stringOptions,
        value,
        onChange: handleChange,
        isModified
      }
    );
  } else {
    control = /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      SliderControl,
      {
        min: field.min,
        max: field.max,
        step: field.step,
        value: Number(value),
        onChange: (v) => handleChange(String(v)),
        isModified
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Field, { label: field.name, blurb, children: control });
}
function TogglesPanelBody() {
  const { fields } = useToggles();
  const grouped = groupByCategory(fields);
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_jsx_runtime3.Fragment, { children: Array.from(grouped.entries()).map(([category, categoryFields]) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Section, { label: category, children: categoryFields.map((field) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(FieldControl, { field }, field.fieldId)) }, category)) });
}
function TogglesPanel() {
  const { toggles, fields, getDefaultValue } = useToggles();
  const changedToggles = toggles.filter(
    (t) => t.value !== getDefaultValue(t.fieldId)
  );
  const hasChanges = changedToggles.length > 0;
  function buildSnippet() {
    if (changedToggles.length === 0) return "";
    const entries = changedToggles.map(({ fieldId, value }) => {
      const field = fields.find((f) => f.fieldId === fieldId);
      const isSlider = (field == null ? void 0 : field.type) === "slider";
      const serialised = isSlider ? value : JSON.stringify(value);
      return `  ${fieldId}: ${serialised}`;
    });
    const defaultsProp = `defaults={{
${entries.join(",\n")}
}}`;
    return `Update the defaults prop on TogglesProvider to reflect these selected design options:

${defaultsProp}`;
  }
  function handleSave() {
    const snippet = buildSnippet();
    if (!snippet) return;
    navigator.clipboard.writeText(snippet).catch(() => {
      window.prompt("Copy this snippet and paste it into TogglesProvider:", snippet);
    });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(TogglesPanelShell, { hasChanges, onSave: handleSave, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(TogglesPanelBody, {}) });
}

// src/hooks.ts
function useVariant(fieldId, variantMap) {
  var _a;
  const { getValue } = useToggles();
  const value = getValue(fieldId);
  const keys = Object.keys(variantMap);
  return (_a = variantMap[value]) != null ? _a : variantMap[keys[0]];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Field,
  Section,
  SegmentedControl,
  SelectControl,
  SliderControl,
  TogglesPanel,
  TogglesPanelBody,
  TogglesPanelShell,
  TogglesProvider,
  useToggles,
  useVariant
});
//# sourceMappingURL=index.js.map