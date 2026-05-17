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
type TweakState = {
    fieldId: string;
    value: string;
};
type TweaksContextValue = {
    tweaks: TweakState[];
    fields: FieldDef[];
    setTweak: (fieldId: string, value: string) => void;
    getValue: (fieldId: string) => string;
};

declare function TogglesProvider({ fields, children, }: {
    fields: FieldDef[];
    children: ReactNode;
}): JSX.Element;
declare function useToggles(): TweaksContextValue;

declare function TogglesPanelBody(): JSX.Element;
declare function TogglesPanel(): JSX.Element;

declare function TogglesPanelShell({ children }: {
    children: ReactNode;
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
declare function SegmentedControl({ options, value, onChange, }: {
    options: {
        label: string;
        value: string;
    }[];
    value: string;
    onChange: (v: string) => void;
}): JSX.Element;
declare function SelectControl({ options, value, onChange, }: {
    options: {
        label: string;
        value: string;
    }[];
    value: string;
    onChange: (v: string) => void;
}): JSX.Element;
declare function SliderControl({ value, min, max, step, onChange, formatValue, }: {
    value: number;
    min: number;
    max: number;
    step?: number;
    onChange: (v: number) => void;
    formatValue?: (v: number) => string;
}): JSX.Element;

declare function useVariant<T extends ComponentType<any>>(fieldId: string, variantMap: Record<string, T>): T;

export { Field, type FieldDef, type FieldType, type Option, Section, SegmentedControl, type SegmentedField, SelectControl, type SelectField, SliderControl, type SliderField, TogglesPanel, TogglesPanelBody, TogglesPanelShell, TogglesProvider, type TweakState, type TweaksContextValue, useToggles, useVariant };
