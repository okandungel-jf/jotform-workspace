import { useState } from 'react';
import logoLight from '../../assets/jf-design-system-logo-light.svg';
import logoDark from '../../assets/jf-design-system-logo.svg';
import { ColorsSection } from './sections/ColorsSection';
import { TypographySection } from './sections/TypographySection';
import { SpacingSection } from './sections/SpacingSection';
import { ShadowsSection } from './sections/ShadowsSection';
import { RadiusSection } from './sections/RadiusSection';
import { IconsSection } from './sections/IconsSection';
import { ButtonSection, ButtonPanel, defaultButtonState } from './sections/ButtonSection';
import type { ButtonPanelState } from './sections/ButtonSection';
import { InputSection, InputPanel, defaultSearchInputState } from './sections/InputSection';
import type { SearchInputPanelState } from './sections/InputSection';
import { BasicInputSection, BasicInputPanel, defaultBasicInputState } from './sections/BasicInputSection';
import type { BasicInputPanelState } from './sections/BasicInputSection';
import { DateInputSection, DateInputPanel, defaultDateInputState } from './sections/DateInputSection';
import type { DateInputPanelState } from './sections/DateInputSection';
import { UrlInputSection, UrlInputPanel, defaultUrlInputState } from './sections/UrlInputSection';
import type { UrlInputPanelState } from './sections/UrlInputSection';
import { NumberInputSection, NumberInputPanel, defaultNumberInputState } from './sections/NumberInputSection';
import type { NumberInputPanelState } from './sections/NumberInputSection';
import { ColorInputSection, ColorInputPanel, defaultColorInputState } from './sections/ColorInputSection';
import type { ColorInputPanelState } from './sections/ColorInputSection';
import { TextAreaSection, TextAreaPanel, defaultTextAreaState } from './sections/TextAreaSection';
import type { TextAreaPanelState } from './sections/TextAreaSection';
import { RadioButtonSection, RadioButtonPanel, defaultRadioButtonState } from './sections/RadioButtonSection';
import type { RadioButtonPanelState } from './sections/RadioButtonSection';
import { CheckboxSection, CheckboxPanel, defaultCheckboxState } from './sections/CheckboxSection';
import type { CheckboxPanelState } from './sections/CheckboxSection';
import './DesignLibrary.scss';

const FOUNDATIONS = [
  { id: 'colors', label: 'Colors' },
  { id: 'typography', label: 'Typography' },
  { id: 'spacing', label: 'Spacing' },
  { id: 'shadows', label: 'Shadows' },
  { id: 'radius', label: 'Border Radius' },
  { id: 'icons', label: 'Icons' },
] as const;

const COMPONENTS = [
  { id: 'button', label: 'Button' },
  { id: 'basic-input', label: 'Input' },
  { id: 'date-input', label: 'Date Input' },
  { id: 'color-input', label: 'Color Input' },
  { id: 'number-input', label: 'Number Input' },
  { id: 'textarea', label: 'Text Area' },
  { id: 'url-input', label: 'URL Input' },
  { id: 'search-input', label: 'Search Input' },
  { id: 'radio-button', label: 'Radio Button' },
  { id: 'checkbox', label: 'Checkbox' },
] as const;

const ALL_ITEMS = [...FOUNDATIONS, ...COMPONENTS] as const;
type SectionId = (typeof ALL_ITEMS)[number]['id'];

const COMPONENT_IDS = new Set<string>(COMPONENTS.map((c) => c.id));

export function DesignLibrary() {
  const [activeSection, setActiveSection] = useState<SectionId>('colors');
  const [buttonState, setButtonState] = useState<ButtonPanelState>(defaultButtonState);
  const [basicInputState, setBasicInputState] = useState<BasicInputPanelState>(defaultBasicInputState);
  const [dateInputState, setDateInputState] = useState<DateInputPanelState>(defaultDateInputState);
  const [urlInputState, setUrlInputState] = useState<UrlInputPanelState>(defaultUrlInputState);
  const [colorInputState, setColorInputState] = useState<ColorInputPanelState>(defaultColorInputState);
  const [numberInputState, setNumberInputState] = useState<NumberInputPanelState>(defaultNumberInputState);
  const [textAreaState, setTextAreaState] = useState<TextAreaPanelState>(defaultTextAreaState);
  const [searchInputState, setSearchInputState] = useState<SearchInputPanelState>(defaultSearchInputState);
  const [radioButtonState, setRadioButtonState] = useState<RadioButtonPanelState>(defaultRadioButtonState);
  const [checkboxState, setCheckboxState] = useState<CheckboxPanelState>(defaultCheckboxState);

  const hasPanel = COMPONENT_IDS.has(activeSection as string);

  const renderSection = () => {
    switch (activeSection) {
      case 'colors':
        return <ColorsSection />;
      case 'typography':
        return <TypographySection />;
      case 'spacing':
        return <SpacingSection />;
      case 'shadows':
        return <ShadowsSection />;
      case 'radius':
        return <RadiusSection />;
      case 'icons':
        return <IconsSection />;
      case 'button':
        return <ButtonSection panelState={buttonState} />;
      case 'basic-input':
        return <BasicInputSection state={basicInputState} />;
      case 'date-input':
        return <DateInputSection state={dateInputState} />;
      case 'color-input':
        return <ColorInputSection state={colorInputState} />;
      case 'number-input':
        return <NumberInputSection state={numberInputState} />;
      case 'textarea':
        return <TextAreaSection state={textAreaState} />;
      case 'url-input':
        return <UrlInputSection state={urlInputState} />;
      case 'search-input':
        return <InputSection searchState={searchInputState} />;
      case 'radio-button':
        return <RadioButtonSection state={radioButtonState} />;
      case 'checkbox':
        return <CheckboxSection state={checkboxState} />;
    }
  };

  const renderPanel = () => {
    switch (activeSection) {
      case 'button':
        return <ButtonPanel state={buttonState} onChange={setButtonState} />;
      case 'basic-input':
        return <BasicInputPanel state={basicInputState} onChange={setBasicInputState} />;
      case 'date-input':
        return <DateInputPanel state={dateInputState} onChange={setDateInputState} />;
      case 'color-input':
        return <ColorInputPanel state={colorInputState} onChange={setColorInputState} />;
      case 'number-input':
        return <NumberInputPanel state={numberInputState} onChange={setNumberInputState} />;
      case 'textarea':
        return <TextAreaPanel state={textAreaState} onChange={setTextAreaState} />;
      case 'url-input':
        return <UrlInputPanel state={urlInputState} onChange={setUrlInputState} />;
      case 'search-input':
        return (
          <InputPanel
            searchState={searchInputState}
            onSearchStateChange={setSearchInputState}
          />
        );
      case 'radio-button':
        return <RadioButtonPanel state={radioButtonState} onChange={setRadioButtonState} />;
      case 'checkbox':
        return <CheckboxPanel state={checkboxState} onChange={setCheckboxState} />;
      default:
        return null;
    }
  };

  return (
    <div className={`dl ${hasPanel ? 'dl--has-panel' : ''}`}>
      <aside className="dl__sidebar">
        <div className="dl__logo">
          <img src={logoLight} alt="JotForm Design System" className="dl__logo-img dl__logo-img--light" />
          <img src={logoDark} alt="JotForm Design System" className="dl__logo-img dl__logo-img--dark" />
        </div>
        <nav className="dl__nav">
          <p className="dl__nav-title">Foundations</p>
          {FOUNDATIONS.map((item) => (
            <button
              key={item.id}
              className={`dl__nav-item ${activeSection === item.id ? 'dl__nav-item--active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              {item.label}
            </button>
          ))}
          <p className="dl__nav-title">Components</p>
          {COMPONENTS.map((item) => (
            <button
              key={item.id}
              className={`dl__nav-item ${activeSection === item.id ? 'dl__nav-item--active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="dl__content">
        {renderSection()}
      </main>

      {hasPanel && (
        <aside className="dl__panel">
          <h3 className="dl__panel-title">Properties</h3>
          {renderPanel()}
        </aside>
      )}
    </div>
  );
}
