var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
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

// src/TweaksContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect
} from "react";
import { jsx } from "react/jsx-runtime";
var STYLE_ID = "scaffold-tweaks-styles";
var INJECTED_CSS = `
.st-toggle:hover { background: #404040 !important; }
.st-seg-btn:hover { color: #404040 !important; }
.st-select:focus { outline: none; box-shadow: 0 0 0 2px #e5e5e5; }
.st-toggle, .st-seg-btn { transition: background 120ms ease, color 120ms ease; }
.st-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 8px; border-radius: 9999px; outline: none; cursor: pointer; background: linear-gradient(to right, #c8c8c8 var(--st-pct, 50%), #e8e8e8 var(--st-pct, 50%)); }
.st-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 0; height: 0; }
.st-slider::-moz-range-thumb { width: 0; height: 0; border: none; }
`;
var TweaksContext = createContext({
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
  const [tweaks, setTweaks] = useState(
    () => fields.map((f) => {
      var _a;
      const current = (_a = f.options.find((o) => o.current)) != null ? _a : f.options[0];
      return { fieldId: f.fieldId, value: String(current.value) };
    })
  );
  useEffect(() => {
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
  useEffect(() => {
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
  return /* @__PURE__ */ jsx(TweaksContext.Provider, { value: { tweaks, fields, setTweak, getValue }, children });
}
function useTweaks() {
  return useContext(TweaksContext);
}

// src/TweaksPrimitives.tsx
import React2, {
  useEffect as useEffect2,
  useRef
} from "react";
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
function DialsIcon() {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      width: "16",
      height: "16",
      viewBox: "0 0 16 16",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ jsx2(
          "line",
          {
            x1: "1",
            y1: "4",
            x2: "15",
            y2: "4",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round"
          }
        ),
        /* @__PURE__ */ jsx2(
          "circle",
          {
            cx: "5",
            cy: "4",
            r: "2",
            fill: "white",
            stroke: "currentColor",
            strokeWidth: "1.5"
          }
        ),
        /* @__PURE__ */ jsx2(
          "line",
          {
            x1: "1",
            y1: "8",
            x2: "15",
            y2: "8",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round"
          }
        ),
        /* @__PURE__ */ jsx2(
          "circle",
          {
            cx: "11",
            cy: "8",
            r: "2",
            fill: "white",
            stroke: "currentColor",
            strokeWidth: "1.5"
          }
        ),
        /* @__PURE__ */ jsx2(
          "line",
          {
            x1: "1",
            y1: "12",
            x2: "15",
            y2: "12",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round"
          }
        ),
        /* @__PURE__ */ jsx2(
          "circle",
          {
            cx: "7",
            cy: "12",
            r: "2",
            fill: "white",
            stroke: "currentColor",
            strokeWidth: "1.5"
          }
        )
      ]
    }
  );
}
var panelShell = {
  position: "fixed",
  bottom: 24,
  right: 24,
  zIndex: 50,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: 12
};
var panelCard = {
  width: 288,
  background: "white",
  borderRadius: 16,
  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.05)",
  border: "1px solid #f5f5f5",
  overflow: "hidden"
};
var panelBody = {
  padding: 16,
  display: "flex",
  flexDirection: "column",
  gap: 20,
  maxHeight: 448,
  overflowY: "auto"
};
var toggleBtn = {
  width: 36,
  height: 36,
  background: "#171717",
  color: "white",
  borderRadius: 9999,
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  userSelect: "none",
  border: "none",
  flexShrink: 0
};
function TweaksPanelShell({ children }) {
  const [open, setOpen] = React2.useState(false);
  const ref = useRef(null);
  useEffect2(() => {
    if (!open) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);
  return /* @__PURE__ */ jsxs("div", { ref, style: panelShell, children: [
    open && /* @__PURE__ */ jsx2("div", { style: panelCard, children: /* @__PURE__ */ jsx2("div", { style: panelBody, children }) }),
    /* @__PURE__ */ jsx2(
      "button",
      {
        className: "st-toggle",
        onClick: () => setOpen((o) => !o),
        style: toggleBtn,
        "aria-label": "Toggle design panel",
        children: /* @__PURE__ */ jsx2(DialsIcon, {})
      }
    )
  ] });
}
function Section({
  label,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 12 }, children: [
    /* @__PURE__ */ jsx2(
      "p",
      {
        style: {
          fontSize: 10,
          fontWeight: 600,
          color: "#a3a3a3",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          margin: 0
        },
        children: label
      }
    ),
    /* @__PURE__ */ jsx2("div", { style: { display: "flex", flexDirection: "column", gap: 16 }, children })
  ] });
}
function Field({
  label,
  blurb,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
    /* @__PURE__ */ jsx2("p", { style: { fontSize: 14, fontWeight: 500, color: "#404040", margin: 0 }, children: label }),
    children,
    /* @__PURE__ */ jsx2(
      "p",
      {
        style: {
          fontSize: 12,
          color: "#a3a3a3",
          lineHeight: 1.625,
          margin: 0
        },
        children: blurb
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
  const pct = selectedIndex === -1 ? 0 : selectedIndex / options.length * 100;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        position: "relative",
        display: "flex",
        padding: 4,
        background: "#f5f5f5",
        borderRadius: 8
      },
      children: [
        selectedIndex !== -1 && /* @__PURE__ */ jsx2(
          "div",
          {
            style: {
              position: "absolute",
              top: 4,
              bottom: 4,
              left: `calc(${pct}% + 4px)`,
              width: `calc(${100 / options.length}% - 8px)`,
              background: "white",
              borderRadius: 6,
              boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.08)",
              transition: "left 160ms cubic-bezier(0.4, 0, 0.2, 1)",
              pointerEvents: "none"
            }
          }
        ),
        options.map((opt) => /* @__PURE__ */ jsx2(
          "button",
          {
            className: "st-seg-btn",
            onClick: () => onChange(opt.value),
            style: {
              flex: 1,
              fontSize: 12,
              padding: "6px 0",
              borderRadius: 6,
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
              background: "transparent",
              color: value === opt.value ? "#171717" : "#737373",
              position: "relative",
              zIndex: 1,
              transition: "color 160ms ease"
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
  return /* @__PURE__ */ jsx2(
    "svg",
    {
      width: "12",
      height: "12",
      viewBox: "0 0 12 12",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      "aria-hidden": "true",
      style: { pointerEvents: "none" },
      children: /* @__PURE__ */ jsx2(
        "path",
        {
          d: "M2 4.5L6 8L10 4.5",
          stroke: "#a3a3a3",
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
  return /* @__PURE__ */ jsxs("div", { style: { position: "relative", width: "100%" }, children: [
    /* @__PURE__ */ jsx2(
      "select",
      {
        className: "st-select",
        value,
        onChange: (e) => onChange(e.target.value),
        style: {
          width: "100%",
          fontSize: 13,
          border: "1px solid #e5e5e5",
          borderRadius: 8,
          padding: "8px 32px 8px 12px",
          background: "white",
          color: "#171717",
          appearance: "none",
          boxSizing: "border-box",
          cursor: "pointer"
        },
        children: options.map((opt) => /* @__PURE__ */ jsx2("option", { value: opt.value, children: opt.label }, opt.value))
      }
    ),
    /* @__PURE__ */ jsx2(
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
        children: /* @__PURE__ */ jsx2(ChevronDown, {})
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
  const pct = (value - min) / (max - min) * 100;
  const display = formatValue ? formatValue(value) : String(value);
  return /* @__PURE__ */ jsxs("div", { style: { position: "relative", borderRadius: 8, overflow: "hidden", height: 34, cursor: "pointer" }, children: [
    /* @__PURE__ */ jsx2("div", { style: { position: "absolute", inset: 0, background: "#e9e9eb" } }),
    /* @__PURE__ */ jsx2("div", { style: { position: "absolute", top: 0, left: 0, bottom: 0, width: `${pct}%`, background: "#d1d1d6" } }),
    /* @__PURE__ */ jsxs("div", { style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      padding: "0 12px",
      pointerEvents: "none"
    }, children: [
      /* @__PURE__ */ jsx2("span", { style: { flex: 1 } }),
      /* @__PURE__ */ jsx2("span", { style: { fontSize: 13, color: "#3c3c43" }, children: display })
    ] }),
    /* @__PURE__ */ jsx2(
      "input",
      {
        type: "range",
        min,
        max,
        step,
        value,
        onChange: (e) => onChange(Number(e.target.value)),
        style: {
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          appearance: "none",
          WebkitAppearance: "none",
          background: "transparent",
          cursor: "pointer",
          margin: 0,
          padding: 0,
          opacity: 0
        }
      }
    )
  ] });
}

// src/TweaksPanel.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
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
  const selectedOption = (_a = field.options.find((o) => String(o.value) === value)) != null ? _a : field.options[0];
  const blurb = selectedOption.explanation;
  const stringOptions = field.options.map((o) => {
    var _a2;
    return {
      label: (_a2 = o.label) != null ? _a2 : String(o.value),
      value: String(o.value)
    };
  });
  let control;
  if (field.type === "segmented") {
    control = /* @__PURE__ */ jsx3(
      SegmentedControl,
      {
        options: stringOptions,
        value,
        onChange: (v) => setTweak(field.fieldId, v)
      }
    );
  } else if (field.type === "select") {
    control = /* @__PURE__ */ jsx3(
      SelectControl,
      {
        options: stringOptions,
        value,
        onChange: (v) => setTweak(field.fieldId, v)
      }
    );
  } else {
    control = /* @__PURE__ */ jsx3(
      SliderControl,
      {
        min: field.min,
        max: field.max,
        step: field.step,
        value: Number(value),
        onChange: (v) => setTweak(field.fieldId, String(v))
      }
    );
  }
  return /* @__PURE__ */ jsx3(Field, { label: field.name, blurb, children: control });
}
function TweaksPanel() {
  const { fields } = useTweaks();
  const grouped = groupByCategory(fields);
  return /* @__PURE__ */ jsx3(TweaksPanelShell, { children: Array.from(grouped.entries()).map(([category, categoryFields]) => /* @__PURE__ */ jsx3(Section, { label: category, children: categoryFields.map((field) => /* @__PURE__ */ jsx3(FieldControl, { field }, field.fieldId)) }, category)) });
}

// src/hooks.ts
function useVariant(fieldId, variantMap) {
  var _a;
  const { getValue } = useTweaks();
  const value = getValue(fieldId);
  const keys = Object.keys(variantMap);
  return (_a = variantMap[value]) != null ? _a : variantMap[keys[0]];
}
export {
  Field,
  Section,
  SegmentedControl,
  SelectControl,
  SliderControl,
  TweaksPanel,
  TweaksPanelShell,
  TweaksProvider,
  useTweaks,
  useVariant
};
//# sourceMappingURL=index.mjs.map