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
  TweaksPanel: () => TweaksPanel,
  TweaksPanelBody: () => TweaksPanelBody,
  TweaksPanelShell: () => TweaksPanelShell,
  TweaksProvider: () => TweaksProvider,
  useTweaks: () => useTweaks,
  useVariant: () => useVariant
});
module.exports = __toCommonJS(index_exports);

// src/TweaksContext.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var STYLE_ID = "scaffold-tweaks-styles";
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
var TweaksContext = (0, import_react.createContext)({
  tweaks: [],
  fields: [],
  setTweak: () => {
  },
  getValue: () => ""
});
function TweaksProvider({
  fields,
  children
}) {
  const [tweaks, setTweaks] = (0, import_react.useState)(
    () => fields.map((f) => {
      var _a;
      const current = (_a = f.options.find((o) => o.current)) != null ? _a : f.options[0];
      return { fieldId: f.fieldId, value: String(current.value) };
    })
  );
  (0, import_react.useEffect)(() => {
    setTweaks((prev) => {
      const existing = new Set(prev.map((t) => t.fieldId));
      const newEntries = fields.filter((f) => !existing.has(f.fieldId)).map((f) => {
        var _a;
        const current = (_a = f.options.find((o) => o.current)) != null ? _a : f.options[0];
        return { fieldId: f.fieldId, value: String(current.value) };
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
  function setTweak(fieldId, value) {
    setTweaks(
      (prev) => prev.map((t) => t.fieldId === fieldId ? __spreadProps(__spreadValues({}, t), { value }) : t)
    );
  }
  function getValue(fieldId) {
    var _a, _b;
    return (_b = (_a = tweaks.find((t) => t.fieldId === fieldId)) == null ? void 0 : _a.value) != null ? _b : "";
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TweaksContext.Provider, { value: { tweaks, fields, setTweak, getValue }, children });
}
function useTweaks() {
  return (0, import_react.useContext)(TweaksContext);
}

// src/TweaksPrimitives.tsx
var import_react2 = __toESM(require("react"));
var import_jsx_runtime2 = require("react/jsx-runtime");
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
  boxShadow: "0 4px 12px -2px rgb(0 0 0 / 0.3), 0 0 0 0.5px rgb(255 255 255 / 0.08)",
  border: "1px solid rgb(255 255 255 / 0.08)",
  overflow: "hidden"
};
var panelBody = {
  padding: 16,
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
  boxShadow: "0 2px 8px -1px rgb(0 0 0 / 0.4), 0 0 0 0.5px rgb(255 255 255 / 0.08)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  userSelect: "none",
  border: "none",
  flexShrink: 0
};
function TweaksPanelShell({ children }) {
  const [open, setOpen] = import_react2.default.useState(false);
  const [corner, setCorner] = import_react2.default.useState("bottom-right");
  const [btnPos, setBtnPos] = import_react2.default.useState(
    null
  );
  const [animating, setAnimating] = import_react2.default.useState(false);
  const [dragging, setDragging] = import_react2.default.useState(false);
  const panelRef = (0, import_react2.useRef)(null);
  const btnRef = (0, import_react2.useRef)(null);
  const dragRef = (0, import_react2.useRef)(null);
  const snapTimer = (0, import_react2.useRef)(null);
  (0, import_react2.useEffect)(() => {
    var _a;
    const saved = (_a = localStorage.getItem("tweaks-corner")) != null ? _a : "bottom-right";
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
    function onOutside(e) {
      const t = e.target;
      if (panelRef.current && !panelRef.current.contains(t) && btnRef.current && !btnRef.current.contains(t))
        setOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);
  function snapToCorner(c) {
    setCorner(c);
    setAnimating(true);
    setBtnPos(cornerBtnPos(c));
    localStorage.setItem("tweaks-corner", c);
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
          transition: open ? "opacity 80ms ease, transform 180ms cubic-bezier(0.25, 0, 0, 1)" : "opacity 200ms ease, transform 200ms cubic-bezier(0.25, 0, 0, 1)"
        }),
        children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: panelCard, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "st-panel-body", style: panelBody, children }) })
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
          cursor: dragging ? "grabbing" : "grab",
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
        color: "rgb(255 255 255 / 0.4)",
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
  onChange
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
              background: "rgb(255 255 255 / 0.14)",
              borderRadius: 6,
              boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.4)",
              transition: "left 160ms cubic-bezier(0.4, 0, 0.2, 1), width 160ms cubic-bezier(0.4, 0, 0.2, 1)",
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
              color: value === opt.value ? "rgb(255 255 255 / 0.9)" : "rgb(255 255 255 / 0.4)",
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
  onChange
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
          border: "1px solid rgb(255 255 255 / 0.1)",
          borderRadius: 8,
          padding: "8px 32px 8px 12px",
          background: "rgb(255 255 255 / 0.08)",
          color: "rgb(255 255 255 / 0.88)",
          appearance: "none",
          boxSizing: "border-box",
          cursor: "pointer",
          colorScheme: "dark",
          outline: "none"
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
  formatValue
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
        background: "rgb(255 255 255 / 0.08)",
        padding: INNER_PAD,
        boxSizing: "border-box",
        userSelect: "none"
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
                  background: "rgb(255 255 255 / 0.13)",
                  borderRadius: `${INNER_R}px`,
                  boxShadow: "inset 0 1px 2px 0 rgb(0 0 0 / 0.4)"
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
                  background: active ? "rgb(255 255 255 / 0.7)" : "rgb(255 255 255 / 0.55)",
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
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 13, color: "rgb(255 255 255 / 0.65)" }, children: display })
                ]
              }
            )
          ]
        }
      )
    }
  );
}

// src/TweaksPanel.tsx
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
  const { getValue, setTweak } = useTweaks();
  const value = getValue(field.fieldId);
  const selectedOption = field.type === "slider" ? field.options.reduce(
    (best, opt) => Math.abs(Number(opt.value) - Number(value)) < Math.abs(Number(best.value) - Number(value)) ? opt : best
  ) : (_a = field.options.find((o) => String(o.value) === value)) != null ? _a : field.options[0];
  const blurb = selectedOption.explanation;
  function handleChange(v) {
    setTweak(field.fieldId, v);
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
        onChange: handleChange
      }
    );
  } else if (field.type === "select") {
    control = /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      SelectControl,
      {
        options: stringOptions,
        value,
        onChange: handleChange
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
        onChange: (v) => handleChange(String(v))
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Field, { label: field.name, blurb, children: control });
}
function TweaksPanelBody() {
  const { fields } = useTweaks();
  const grouped = groupByCategory(fields);
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_jsx_runtime3.Fragment, { children: Array.from(grouped.entries()).map(([category, categoryFields]) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Section, { label: category, children: categoryFields.map((field) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(FieldControl, { field }, field.fieldId)) }, category)) });
}
function TweaksPanel() {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(TweaksPanelShell, { children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(TweaksPanelBody, {}) });
}

// src/hooks.ts
function useVariant(fieldId, variantMap) {
  var _a;
  const { getValue } = useTweaks();
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
  TweaksPanel,
  TweaksPanelBody,
  TweaksPanelShell,
  TweaksProvider,
  useTweaks,
  useVariant
});
//# sourceMappingURL=index.js.map