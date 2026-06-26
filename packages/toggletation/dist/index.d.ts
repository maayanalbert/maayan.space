import { ReactNode, ComponentType } from 'react';

type FieldType = 'segmented' | 'select' | 'slider';
type Option = {
    value: string | number;
    label?: string;
    explanation: string;
    current: boolean;
};
type BaseField = {
    fieldId: string;
    name: string;
    category: string;
    options: Option[];
};
type SegmentedField = BaseField & {
    type: 'segmented';
};
type SelectField = BaseField & {
    type: 'select';
};
type SliderField = BaseField & {
    type: 'slider';
    min: number;
    max: number;
    step?: number;
};
type FieldDef = SegmentedField | SelectField | SliderField;
type ToggleState = {
    fieldId: string;
    value: string;
};
type TogglesContextValue = {
    toggles: ToggleState[];
    fields: FieldDef[];
    setToggle: (fieldId: string, value: string) => void;
    getValue: (fieldId: string) => string;
    getDefaultValue: (fieldId: string) => string;
};

declare function TogglesProvider({ fields, defaults, children, }: {
    fields: FieldDef[];
    defaults?: Record<string, string | number>;
    children: ReactNode;
}): JSX.Element;
declare function useToggles(): TogglesContextValue;

declare function TogglesPanelBody(): JSX.Element;
declare function TogglesPanel(): JSX.Element;

declare function TogglesPanelShell({ children, hasChanges, onSave, }: {
    children: ReactNode;
    hasChanges?: boolean;
    onSave?: () => void;
}): JSX.Element | null;
declare function Section({ label, children, }: {
    label: string;
    children: ReactNode;
}): JSX.Element;
declare function Field({ label, blurb, children, }: {
    label: string;
    blurb: string;
    children: ReactNode;
}): JSX.Element;
declare function SegmentedControl({ options, value, onChange, isModified, }: {
    options: {
        label: string;
        value: string;
    }[];
    value: string;
    onChange: (v: string) => void;
    isModified?: boolean;
}): JSX.Element;
declare function SelectControl({ options, value, onChange, isModified, }: {
    options: {
        label: string;
        value: string;
    }[];
    value: string;
    onChange: (v: string) => void;
    isModified?: boolean;
}): JSX.Element;
declare function SliderControl({ value, min, max, step, onChange, formatValue, isModified, }: {
    value: number;
    min: number;
    max: number;
    step?: number;
    onChange: (v: number) => void;
    formatValue?: (v: number) => string;
    isModified?: boolean;
}): JSX.Element;

declare function useVariant<T extends ComponentType<any>>(fieldId: string, variantMap: Record<string, T>): T;

export { Field, type FieldDef, type FieldType, type Option, Section, SegmentedControl, type SegmentedField, SelectControl, type SelectField, SliderControl, type SliderField, type ToggleState, type TogglesContextValue, TogglesPanel, TogglesPanelBody, TogglesPanelShell, TogglesProvider, useToggles, useVariant };
