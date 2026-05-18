// Jotform Builder DS Transfer
// Creates a Figma representation of the app-builder Build page using DS token variables.

const VIEWPORT = {
  width: 1728,
  height: 978,
  topbarMain: 64,
  topbarNav: 44,
  leftPanel: 318,
  rightPanel: 420,
};

const TOKENS = {
  colors: [
    ["--core-white", "#FFFFFF"],
    ["--core-black", "#000000"],
    ["--blue-100", "#EDF8FF"],
    ["--blue-200", "#77CFFF"],
    ["--blue-300", "#4DBEFC"],
    ["--blue-400", "#0099FF"],
    ["--blue-500", "#0075E3"],
    ["--blue-600", "#0066C3"],
    ["--green-200", "#CBFB7B"],
    ["--purple-100", "#F3E2FF"],
    ["--purple-200", "#E0B7FD"],
    ["--purple-500", "#892DCA"],
    ["--orange-500", "#FF6100"],
    ["--navy-25", "#F3F3FE"],
    ["--navy-50", "#E3E5F5"],
    ["--navy-75", "#DADEF3"],
    ["--navy-100", "#C8CEED"],
    ["--navy-300", "#6C73A8"],
    ["--navy-500", "#343C6A"],
    ["--navy-700", "#0A1551"],
    ["--gray-25", "#F1F1F4"],
    ["--gray-50", "#E2E3E9"],
    ["--gray-100", "#BFC3CE"],
    ["--gray-200", "#A0A6B6"],
    ["--gray-300", "#7F859C"],
    ["--gray-400", "#4C536F"],
    ["--gray-500", "#434A60"],
    ["--gray-600", "#33384A"],
    ["--gray-700", "#292D3C"],
    ["--gray-800", "#131620"],
    ["--gray-900", "#08090B"],
    ["--brand-blue", "#0099FF"],
    ["--text-darkest", "#0A1551"],
    ["--text-medium", "#6C73A8"],
    ["--background-white", "#FFFFFF"],
    ["--background-lightest", "#F3F3FE"],
    ["--border-light", "#E3E5F5"],
    ["--border-medium", "#C8CEED"],
    ["--secondary-text-white", "#FFFFFF"],
    ["--secondary-text-lightest", "#BFC3CE"],
    ["--secondary-text-light", "#A0A6B6"],
    ["--secondary-text-medium", "#4C536F"],
    ["--secondary-text-darkest", "#292D3C"],
    ["--secondary-background-white", "#FFFFFF"],
    ["--secondary-background-light", "#434A60"],
    ["--secondary-background-medium", "#33384A"],
    ["--secondary-background-dark", "#292D3C"],
    ["--secondary-background-darkest", "#131620"],
    ["--secondary-border-dark", "#292D3C"],
    ["--product-apps-light", "#B686E7"],
    ["--product-apps-default", "#8D4FCC"],
    ["--product-apps-dark", "#892DCA"],
    ["--product-forms-default", "#FF6100"],
    ["--product-sign-default", "#7BB60F"],
    ["--product-ai-default", "#7923DD"],
    ["--ds-bg-primary", "#292D3C"],
    ["--ds-bg-secondary", "#434A60"],
    ["--ds-bg-surface", "#FFFFFF"],
    ["--ds-bg-surface-dark", "#33384A"],
    ["--ds-bg-page", "#F3F3FE"],
    ["--ds-text-primary", "#FFFFFF"],
    ["--ds-text-secondary", "#BFC3CE"],
    ["--ds-text-tertiary", "#A0A6B6"],
    ["--ds-text-dark", "#0A1551"],
    ["--ds-text-medium", "#4C536F"],
    ["--ds-accent", "#8D4FCC"],
    ["--ds-accent-hover", "#892DCA"],
    ["--ds-border", "#E3E5F5"],
    ["--ds-border-dark", "#292D3C"],
    ["--app-bg", "#F3F3FE"],
    ["--app-surface", "#FFFFFF"],
    ["--app-text", "#0A1551"],
    ["--app-primary", "#6C5CE7"],
    ["--app-border", "#E0E0E0"],
    ["--fg-primary", "#0A1551"],
    ["--fg-secondary", "#343C6A"],
    ["--fg-tertiary", "#6C73A8"],
    ["--fg-disabled", "#A0A6B6"],
    ["--fg-inverse", "#FFFFFF"],
    ["--fg-brand", "#6C5CE7"],
    ["--bg-page", "#F3F3FE"],
    ["--bg-surface", "#FFFFFF"],
    ["--bg-fill", "#FFFFFF"],
    ["--bg-fill-brand", "#6C5CE7"],
    ["--bg-fill-brand-hover", "#5649C9"],
    ["--bg-surface-brand", "#F3F3FE"],
    ["--border", "#E3E5F5"],
    ["--border-info", "#0099FF"],
    ["--btn-primary-bg", "#33384A"],
    ["--btn-primary-fg", "#FFFFFF"],
    ["--btn-brand", "#6C5CE7"],
    ["--tooltip-fg", "#FFFFFF"],
  ],
  floats: [
    ["--spacing-3xs", 2],
    ["--spacing-2xs", 4],
    ["--spacing-xs", 8],
    ["--spacing-sm", 12],
    ["--spacing-md", 16],
    ["--spacing-lg", 20],
    ["--spacing-xl", 24],
    ["--spacing-2xl", 32],
    ["--spacing-3xl", 40],
    ["--spacing-4xl", 64],
    ["--ds-space-2xs", 4],
    ["--ds-space-xs", 8],
    ["--ds-space-sm", 12],
    ["--ds-space-md", 16],
    ["--ds-space-lg", 20],
    ["--ds-space-xl", 24],
    ["--ds-space-2xl", 32],
    ["--radius-sm", 4],
    ["--radius-md", 8],
    ["--radius-lg", 12],
    ["--radius-xl", 16],
    ["--radius-xxl", 24],
    ["--radius-rounded", 9999],
    ["--ds-radius-sm", 4],
    ["--ds-radius-md", 8],
    ["--ds-radius-lg", 12],
    ["--font-size-xs", 12],
    ["--font-size-sm", 14],
    ["--font-size-md", 16],
    ["--font-size-lg", 18],
    ["--font-size-xl", 20],
    ["--ds-font-size-xs", 12],
    ["--ds-font-size-sm", 14],
    ["--ds-font-size-md", 16],
    ["--ds-font-size-lg", 18],
    ["--line-height-xs", 16],
    ["--line-height-sm", 20],
    ["--line-height-md", 24],
    ["--ds-line-height-xs", 16],
    ["--ds-line-height-sm", 20],
    ["--ds-line-height-md", 24],
  ],
};

const SHADOWS = {
  sm: [
    {
      type: "DROP_SHADOW",
      color: { r: 37 / 255, g: 45 / 255, b: 91 / 255, a: 0.04 },
      offset: { x: 0, y: 0 },
      radius: 2,
      spread: 0,
      visible: true,
      blendMode: "NORMAL",
    },
    {
      type: "DROP_SHADOW",
      color: { r: 84 / 255, g: 95 / 255, b: 111 / 255, a: 0.16 },
      offset: { x: 0, y: 4 },
      radius: 8,
      spread: 0,
      visible: true,
      blendMode: "NORMAL",
    },
  ],
  panelLeft: [
    {
      type: "DROP_SHADOW",
      color: { r: 0, g: 0, b: 0, a: 0.15 },
      offset: { x: 4, y: 0 },
      radius: 12,
      spread: 0,
      visible: true,
      blendMode: "NORMAL",
    },
  ],
  panelRight: [
    {
      type: "DROP_SHADOW",
      color: { r: 0, g: 0, b: 0, a: 0.15 },
      offset: { x: -4, y: 0 },
      radius: 12,
      spread: 0,
      visible: true,
      blendMode: "NORMAL",
    },
  ],
  phone: [
    {
      type: "DROP_SHADOW",
      color: { r: 0, g: 0, b: 0, a: 0.24 },
      offset: { x: 0, y: 4 },
      radius: 22,
      spread: 0,
      visible: true,
      blendMode: "NORMAL",
    },
  ],
};

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const n = parseInt(clean, 16);
  return {
    r: ((n >> 16) & 255) / 255,
    g: ((n >> 8) & 255) / 255,
    b: (n & 255) / 255,
  };
}

function rgba(hex, opacity = 1) {
  return { type: "SOLID", color: hexToRgb(hex), opacity };
}

function rgbToRgba(rgb, opacity) {
  return { r: rgb.r, g: rgb.g, b: rgb.b, a: opacity };
}

function gradientPaint(leftHex, rightHex) {
  return {
    type: "GRADIENT_LINEAR",
    gradientTransform: [
      [1, 0, 0],
      [0, 1, 0],
    ],
    gradientStops: [
      { position: 0, color: rgbToRgba(hexToRgb(leftHex), 1) },
      { position: 1, color: rgbToRgba(hexToRgb(rightHex), 1) },
    ],
  };
}

async function findFont(families, styles) {
  const fonts = await figma.listAvailableFontsAsync();
  for (const family of families) {
    for (const style of styles) {
      const found = fonts.find((font) => font.fontName.family === family && font.fontName.style === style);
      if (found) return found.fontName;
    }
  }
  return { family: "Inter", style: styles.includes("Medium") ? "Medium" : "Regular" };
}

async function loadFonts() {
  const regular = await findFont(["Circular", "Circular Std", "Inter"], ["Book", "Regular"]);
  const medium = await findFont(["Circular", "Circular Std", "Inter"], ["Medium", "Regular"]);
  const bold = await findFont(["Circular", "Circular Std", "Inter"], ["Bold", "Medium"]);
  try {
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  } catch (_err) {
    // Some enterprise files only expose local brand fonts; the selected fonts below are the real dependency.
  }
  await figma.loadFontAsync(regular);
  await figma.loadFontAsync(medium);
  await figma.loadFontAsync(bold);
  return { regular, medium, bold };
}

async function upsertCollection(name) {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const existing = collections.find((collection) => collection.name === name);
  return existing || figma.variables.createVariableCollection(name);
}

async function upsertVariable(collection, name, type, value, scopes) {
  const vars = await Promise.all(collection.variableIds.map((id) => figma.variables.getVariableByIdAsync(id)));
  let variable = vars.filter(Boolean).find((v) => v.name === name && v.resolvedType === type);
  if (!variable) variable = figma.variables.createVariable(name, collection, type);
  const modeId = collection.defaultModeId;
  if (type === "COLOR") variable.setValueForMode(modeId, rgbToRgba(hexToRgb(value), 1));
  else variable.setValueForMode(modeId, value);
  variable.scopes = scopes;
  if (typeof variable.setVariableCodeSyntax === "function") {
    variable.setVariableCodeSyntax("WEB", `var(${name})`);
  }
  return variable;
}

async function createVariables() {
  const collection = await upsertCollection("Jotform DS Tokens");
  const vars = new Map();
  for (const [name, value] of TOKENS.colors) {
    const variable = await upsertVariable(collection, name, "COLOR", value, [
      "FRAME_FILL",
      "SHAPE_FILL",
      "TEXT_FILL",
      "STROKE_COLOR",
      "EFFECT_COLOR",
    ]);
    vars.set(name, variable);
  }
  for (const [name, value] of TOKENS.floats) {
    const variable = await upsertVariable(collection, name, "FLOAT", value, [
      "GAP",
      "WIDTH_HEIGHT",
      "CORNER_RADIUS",
      "FONT_SIZE",
      "LINE_HEIGHT",
    ]);
    vars.set(name, variable);
  }
  return vars;
}

function tokenValue(name) {
  const color = TOKENS.colors.find(([key]) => key === name);
  if (color) return color[1];
  const float = TOKENS.floats.find(([key]) => key === name);
  return float ? float[1] : undefined;
}

function bindPaint(vars, cssName) {
  const variable = vars.get(cssName);
  const fallback = tokenValue(cssName) || "#FF00FF";
  const paint = rgba(fallback);
  return variable ? figma.variables.setBoundVariableForPaint(paint, "color", variable) : paint;
}

function setFill(node, vars, cssName) {
  node.fills = [bindPaint(vars, cssName)];
}

function setStroke(node, vars, cssName, weight = 1) {
  node.strokes = [bindPaint(vars, cssName)];
  node.strokeWeight = weight;
}

function bindFloat(node, vars, prop, cssName, fallback) {
  const tokenFallback = tokenValue(cssName);
  node[prop] = fallback !== undefined ? fallback : tokenFallback !== undefined ? tokenFallback : node[prop];
  const variable = vars.get(cssName);
  if (variable && typeof node.setBoundVariable === "function") {
    try {
      node.setBoundVariable(prop, variable);
    } catch (_err) {
      // Some layout/text properties do not support variable binding in every editor version.
    }
  }
}

function frame(name, x, y, width, height) {
  const node = figma.createFrame();
  node.name = name;
  node.x = x;
  node.y = y;
  node.resize(width, height);
  node.clipsContent = true;
  node.fills = [];
  return node;
}

function rect(name, x, y, width, height, radius = 0) {
  const node = figma.createRectangle();
  node.name = name;
  node.x = x;
  node.y = y;
  node.resize(width, height);
  node.cornerRadius = radius;
  node.fills = [];
  return node;
}

function roundedFrame(name, x, y, width, height, radius) {
  const node = frame(name, x, y, width, height);
  node.cornerRadius = radius;
  return node;
}

function ellipse(name, x, y, width, height) {
  const node = figma.createEllipse();
  node.name = name;
  node.x = x;
  node.y = y;
  node.resize(width, height);
  node.fills = [];
  return node;
}

function append(parent, child) {
  parent.appendChild(child);
  return child;
}

function text(name, content, x, y, width, options, vars, fonts) {
  const node = figma.createText();
  node.fontName = options.weight === "bold" ? fonts.bold : options.weight === "medium" ? fonts.medium : fonts.regular;
  node.name = name;
  node.x = x;
  node.y = y;
  node.resize(width, options.height || 24);
  node.textAutoResize = "HEIGHT";
  node.characters = content;
  node.fontSize = options.size;
  node.lineHeight = { unit: "PIXELS", value: options.lineHeight };
  node.letterSpacing = { unit: "PERCENT", value: 0 };
  node.textAlignHorizontal = options.align || "LEFT";
  setFill(node, vars, options.color || "--ds-text-dark");
  const fontToken = sizeToToken(options.size);
  if (fontToken) bindFloat(node, vars, "fontSize", fontToken, options.size);
  return node;
}

function sizeToToken(size) {
  const match = TOKENS.floats.find(([key, value]) => key.startsWith("--ds-font-size") && value === size);
  return match ? match[0] : undefined;
}

function autoFrame(name, x, y, width, height, layoutMode, vars) {
  const node = frame(name, x, y, width, height);
  node.layoutMode = layoutMode;
  node.primaryAxisSizingMode = "FIXED";
  node.counterAxisSizingMode = "FIXED";
  node.primaryAxisAlignItems = "CENTER";
  node.counterAxisAlignItems = "CENTER";
  bindFloat(node, vars, "itemSpacing", "--ds-space-sm", 12);
  return node;
}

function icon(name, x, y, size, vars, colorToken = "--ds-text-primary") {
  const group = frame(`Icon / ${name}`, x, y, size, size);
  group.clipsContent = false;
  const box = rect(`${name} glyph`, 0, 0, size, size, Math.max(2, size * 0.18));
  setStroke(box, vars, colorToken, Math.max(1, size / 14));
  box.fills = [];
  group.appendChild(box);
  return group;
}

function dsButton(name, x, y, width, height, label, vars, fonts, options = {}) {
  const node = frame(name, x, y, width, height);
  node.cornerRadius = options.radius || tokenValue("--ds-radius-sm");
  bindFloat(node, vars, "cornerRadius", options.radiusToken || "--ds-radius-sm", node.cornerRadius);
  setFill(node, vars, options.fill || "--ds-accent");
  if (options.stroke) setStroke(node, vars, options.stroke);
  if (options.icon) {
    const iconSize = options.iconOnly || !label ? 16 : 16;
    const iconX = label ? 12 : (width - iconSize) / 2;
    append(node, icon(options.icon, iconX, (height - iconSize) / 2, iconSize, vars, options.textColor || "--ds-text-primary"));
  }
  if (label) {
    append(node, text(`${name} / Label`, label, options.icon ? 36 : 0, (height - 20) / 2, options.icon ? width - 48 : width, {
      size: 14,
      lineHeight: 20,
      color: options.textColor || "--ds-text-primary",
      weight: "medium",
      align: "CENTER",
      height: 20,
    }, vars, fonts));
  }
  return node;
}

function surfaceLabel(name, parent, label, x, y, w, vars, fonts) {
  return append(parent, text(name, label, x, y, w, {
    size: 12,
    lineHeight: 16,
    color: "--ds-text-secondary",
    weight: "regular",
    height: 16,
  }, vars, fonts));
}

function buildTopBar(root, vars, fonts) {
  const header = frame("Builder Chrome / Top Header", 0, 0, VIEWPORT.width, VIEWPORT.topbarMain + VIEWPORT.topbarNav);
  append(root, header);

  const main = frame("TopBar / Main - fill var(--background-white)", 0, 0, VIEWPORT.width, VIEWPORT.topbarMain);
  setFill(main, vars, "--background-white");
  append(header, main);

  const logoMark = rect("Jotform Logo / product mark - fill var(--product-forms-default)", 20, 18, 28, 28, 7);
  setFill(logoMark, vars, "--product-forms-default");
  append(main, logoMark);
  append(main, text("Jotform Logo / wordmark", "Jotform", 56, 18, 104, {
    size: 20,
    lineHeight: 28,
    color: "--text-darkest",
    weight: "bold",
    height: 28,
  }, vars, fonts));
  const divider = rect("TopBar / Divider - stroke var(--border-medium)", 181, 22, 1, 20);
  setFill(divider, vars, "--border-medium");
  append(main, divider);
  append(main, text("TopBar / Product label", "App Builder", 202, 20, 96, {
    size: 16,
    lineHeight: 24,
    color: "--text-darkest",
    weight: "regular",
    height: 24,
  }, vars, fonts));
  const productChevron = ellipse("TopBar / Product chevron - fill var(--border-light)", 304, 24, 16, 16);
  setFill(productChevron, vars, "--border-light");
  append(main, productChevron);

  append(main, text("TopBar / App title", "App Title", 794, 11, 140, {
    size: 20,
    lineHeight: 28,
    color: "--text-darkest",
    weight: "medium",
    align: "CENTER",
    height: 28,
  }, vars, fonts));
  append(main, text("TopBar / Timestamp", "Last edited at 12:21 pm.", 764, 37, 200, {
    size: 12,
    lineHeight: 16,
    color: "--product-sign-default",
    weight: "regular",
    align: "CENTER",
    height: 16,
  }, vars, fonts));

  const help = dsButton("TopBar / Help Button", 1532, 16, 72, 32, "Help", vars, fonts, {
    fill: "--background-white",
    stroke: "--border-medium",
    textColor: "--text-darkest",
    radius: 9999,
    radiusToken: "--radius-rounded",
    icon: "question-circle-filled",
  });
  append(main, help);
  const avatarWrap = frame("TopBar / Avatar wrapper", 1624, 0, 104, 64);
  setStroke(avatarWrap, vars, "--border-light");
  avatarWrap.strokeLeftWeight = 1;
  avatarWrap.strokeRightWeight = 0;
  avatarWrap.strokeTopWeight = 0;
  avatarWrap.strokeBottomWeight = 0;
  append(main, avatarWrap);
  const avatar = ellipse("TopBar / User avatar", 30, 10, 44, 44);
  setFill(avatar, vars, "--background-lightest");
  setStroke(avatar, vars, "--product-forms-default", 2);
  append(avatarWrap, avatar);

  const nav = frame("TopBar / Nav - gradient var(--product-apps-light) to var(--product-apps-default)", 0, VIEWPORT.topbarMain, VIEWPORT.width, VIEWPORT.topbarNav);
  nav.fills = [gradientPaint(tokenValue("--product-apps-light"), tokenValue("--product-apps-default"))];
  append(header, nav);
  const tabX = 667;
  [["BUILD", 114, true], ["SETTINGS", 149, false], ["PUBLISH", 135, false]].reduce((x, item) => {
    const [label, width, active] = item;
    const tab = frame(`TopBar / Nav Item / ${label}${active ? " / Active" : ""}`, x, 0, width, 44);
    tab.fills = active ? [rgba("#FFFFFF", 0.2)] : [];
    append(tab, text(`TopBar / Nav Item / ${label} label`, label, 0, 10, width, {
      size: 16,
      lineHeight: 24,
      color: "--secondary-text-white",
      weight: "regular",
      align: "CENTER",
      height: 24,
    }, vars, fonts));
    append(nav, tab);
    return x + width;
  }, tabX);
  append(nav, text("TopBar / Preview App label", "Preview App", 1583, 12, 80, {
    size: 14,
    lineHeight: 20,
    color: "--secondary-text-white",
    weight: "regular",
    height: 20,
  }, vars, fonts));
  const toggle = frame("TopBar / Preview toggle", 1670, 10, 42, 24);
  append(nav, toggle);
  const track = rect("TopBar / Toggle track - tokenized translucent white", 0, 3, 42, 18, 9999);
  track.fills = [rgba("#FFFFFF", 0.3)];
  append(toggle, track);
  const thumb = ellipse("TopBar / Toggle thumb - fill var(--core-white)", 0, 0, 24, 24);
  setFill(thumb, vars, "--core-white");
  thumb.effects = SHADOWS.sm;
  append(toggle, thumb);
}

function buildLeftPanel(root, vars, fonts) {
  const left = frame("BuildPage / Left Elements Panel - fill var(--ds-bg-secondary)", 0, 108, VIEWPORT.leftPanel, VIEWPORT.height - 108);
  setFill(left, vars, "--ds-bg-secondary");
  left.effects = SHADOWS.panelLeft;
  append(root, left);

  const header = frame("Left Panel / Header - fill var(--ds-bg-surface-dark)", 0, 0, VIEWPORT.leftPanel, 56);
  setFill(header, vars, "--ds-bg-surface-dark");
  setStroke(header, vars, "--ds-border-dark");
  header.strokeTopWeight = 0;
  header.strokeLeftWeight = 0;
  header.strokeRightWeight = 0;
  append(left, header);
  append(header, text("Left Panel / Title", "App Elements", 16, 16, 180, {
    size: 18,
    lineHeight: 24,
    color: "--ds-text-primary",
    weight: "medium",
    height: 24,
  }, vars, fonts));
  append(header, icon("xmark", 278, 12, 32, vars));

  const tabs = frame("Left Panel / Tabs", 0, 56, VIEWPORT.leftPanel, 48);
  setFill(tabs, vars, "--ds-bg-surface-dark");
  append(left, tabs);
  append(tabs, dsButton("Left Panel / Tab / Basic / Active", 16, 8, 137, 32, "Basic", vars, fonts, {
    fill: "--ds-accent",
    textColor: "--ds-text-primary",
    radiusToken: "--ds-radius-sm",
  }));
  append(tabs, dsButton("Left Panel / Tab / Widgets", 165, 8, 137, 32, "Widgets", vars, fonts, {
    fill: "--ds-bg-primary",
    textColor: "--ds-text-secondary",
    radiusToken: "--ds-radius-sm",
  }));

  const elements = [
    ["form-filled", "Form"],
    ["heading-square-filled", "Heading"],
    ["list-bullet", "List"],
    ["text-image", "Paragraph"],
    ["grid-2-filled", "Card"],
    ["document-jf-sign-filled", "Sign Document"],
    ["file-filled", "Document"],
    ["image-line-filled", "Image"],
    ["images-filled", "Image Gallery"],
    ["label-button-filled", "Button"],
    ["spacer-vertical-filled", "Spacer"],
  ];
  let y = 104;
  for (let i = 0; i < elements.length; i += 1) {
    const [iconName, label] = elements[i];
    const row = frame(`Left Panel / Element Row / ${label}`, 0, y, VIEWPORT.leftPanel, 56);
    setFill(row, vars, "--ds-bg-secondary");
    append(left, row);
    const iconCell = frame(`Left Panel / Element Row / ${label} / Icon Cell`, 0, 0, 56, 56);
    setFill(iconCell, vars, "--ds-bg-surface-dark");
    append(row, iconCell);
    append(iconCell, icon(iconName, 16, 16, 24, vars));
    append(row, text(`Left Panel / Element Row / ${label} / Label`, label, 72, 16, 210, {
      size: 16,
      lineHeight: 24,
      color: "--ds-text-primary",
      weight: "regular",
      height: 24,
    }, vars, fonts));
    if (i < elements.length - 1) {
      const divider = rect(`Left Panel / Element Row / ${label} / Divider`, 56, 55, VIEWPORT.leftPanel - 56, 1);
      setFill(divider, vars, "--secondary-border-dark");
      append(row, divider);
    }
    y += 56;
  }

  const sep = frame("Left Panel / Separator / Payment Elements", 0, y, VIEWPORT.leftPanel, 32);
  setFill(sep, vars, "--ds-bg-primary");
  append(left, sep);
  append(sep, text("Left Panel / Separator Label / Payment Elements", "PAYMENT ELEMENTS", 16, 8, 240, {
    size: 12,
    lineHeight: 16,
    color: "--ds-text-secondary",
    weight: "regular",
    height: 16,
  }, vars, fonts));
}

function buildCanvas(root, vars, fonts) {
  const canvasX = VIEWPORT.leftPanel;
  const canvasW = VIEWPORT.width - VIEWPORT.leftPanel - VIEWPORT.rightPanel;
  const canvasH = VIEWPORT.height - 108;
  const canvas = frame("BuildPage / Canvas - fill var(--bg-page)", canvasX, 108, canvasW, canvasH);
  setFill(canvas, vars, "--bg-page");
  append(root, canvas);

  const addBtn = roundedFrame("Canvas Floating Button / Add Element - fill var(--btn-primary-bg)", 16, 24, 56, 56, 9999);
  setFill(addBtn, vars, "--btn-primary-bg");
  bindFloat(addBtn, vars, "cornerRadius", "--radius-rounded", 9999);
  addBtn.effects = SHADOWS.sm;
  append(canvas, addBtn);
  append(addBtn, icon("plus", 16, 16, 24, vars, "--btn-primary-fg"));

  const designBtn = roundedFrame("Canvas Floating Button / App Designer - fill var(--bg-fill-brand)", canvasW - 72, 24, 56, 56, 9999);
  setFill(designBtn, vars, "--bg-fill-brand");
  bindFloat(designBtn, vars, "cornerRadius", "--radius-rounded", 9999);
  designBtn.effects = SHADOWS.sm;
  append(canvas, designBtn);
  append(designBtn, icon("paint-roller-vertical-filled", 12, 12, 32, vars, "--fg-inverse"));

  const appColX = Math.round((canvasW - 644) / 2);
  const appHeader = frame("Canvas / AppHeader - app-scope tokens", appColX, 48, 644, 184);
  setFill(appHeader, vars, "--bg-fill-brand");
  append(canvas, appHeader);
  const appIcon = roundedFrame("Canvas / AppHeader / Icon - fill var(--bg-fill)", 282, 40, 80, 80, 18);
  setFill(appIcon, vars, "--bg-fill");
  append(appHeader, appIcon);
  append(appIcon, icon("leaf", 20, 20, 40, vars, "--fg-brand"));
  append(appHeader, text("Canvas / AppHeader / Title", "App Title", 0, 132, 644, {
    size: 24,
    lineHeight: 32,
    color: "--fg-inverse",
    weight: "bold",
    align: "CENTER",
    height: 32,
  }, vars, fonts));

  const page = frame("Canvas / Page Card - max-width 644, shadow var(--shadow-sm)", appColX, 216, 644, 330);
  setFill(page, vars, "--bg-surface");
  bindFloat(page, vars, "cornerRadius", "--radius-xl", 16);
  page.effects = SHADOWS.sm;
  append(canvas, page);

  const appArea = frame("Canvas / themes-view__app - gap var(--space-4), padding var(--space-6)", 0, 0, 644, 330);
  setFill(appArea, vars, "--bg-surface");
  append(page, appArea);
  const emptyIcon = roundedFrame("Canvas / Empty State / Icon Surface", 272, 78, 100, 100, 24);
  setFill(emptyIcon, vars, "--bg-surface-brand");
  append(appArea, emptyIcon);
  append(emptyIcon, icon("plus-circle-filled", 30, 30, 40, vars, "--fg-brand"));
  append(appArea, text("Canvas / Empty State / Title", "Drag your first element here", 0, 198, 644, {
    size: 18,
    lineHeight: 24,
    color: "--fg-primary",
    weight: "medium",
    align: "CENTER",
    height: 24,
  }, vars, fonts));
  append(appArea, text("Canvas / Empty State / Helper", "Use App Elements to build your app page.", 0, 226, 644, {
    size: 14,
    lineHeight: 20,
    color: "--fg-tertiary",
    weight: "regular",
    align: "CENTER",
    height: 20,
  }, vars, fonts));

  const divider = frame("Canvas / Add Page Divider", appColX, 570, 644, 24);
  append(canvas, divider);
  const lineA = rect("Canvas / Add Page Divider / left dashed line", 0, 12, 248, 1);
  lineA.fills = [rgba(tokenValue("--fg-disabled"), 0.4)];
  append(divider, lineA);
  append(divider, text("Canvas / Add Page Divider / Label", "+ Add a Page", 260, 2, 124, {
    size: 14,
    lineHeight: 20,
    color: "--fg-disabled",
    weight: "medium",
    align: "CENTER",
    height: 20,
  }, vars, fonts));
  const lineB = rect("Canvas / Add Page Divider / right dashed line", 396, 12, 248, 1);
  lineB.fills = [rgba(tokenValue("--fg-disabled"), 0.4)];
  append(divider, lineB);

  const attribution = frame("Canvas / Attribution Bar", appColX, 620, 644, 48);
  setFill(attribution, vars, "--bg-surface");
  bindFloat(attribution, vars, "cornerRadius", "--radius-lg", 12);
  setStroke(attribution, vars, "--border");
  append(canvas, attribution);
  append(attribution, text("Canvas / Attribution Bar / Text", "Built with Jotform", 0, 14, 644, {
    size: 14,
    lineHeight: 20,
    color: "--fg-secondary",
    weight: "medium",
    align: "CENTER",
    height: 20,
  }, vars, fonts));
}

function buildLivePreview(root, vars, fonts) {
  const x = VIEWPORT.width - VIEWPORT.rightPanel;
  const y = 108;
  const panelH = VIEWPORT.height - 108;
  const panel = frame("BuildPage / Live Preview Panel - fill var(--secondary-background-medium)", x, y, VIEWPORT.rightPanel, panelH);
  setFill(panel, vars, "--secondary-background-medium");
  panel.effects = SHADOWS.panelRight;
  append(root, panel);

  const header = frame("Live Preview / Header", 0, 0, VIEWPORT.rightPanel, 48);
  setFill(header, vars, "--gray-600");
  append(panel, header);
  append(header, text("Live Preview / Header / Title", "Live Preview", 16, 12, 140, {
    size: 16,
    lineHeight: 24,
    color: "--secondary-text-white",
    weight: "medium",
    height: 24,
  }, vars, fonts));
  append(header, dsButton("Live Preview / Role Dropdown", 188, 8, 140, 32, "Anyone", vars, fonts, {
    fill: "--gray-500",
    textColor: "--secondary-text-white",
    radiusToken: "--ds-radius-sm",
    icon: "circle",
  }));
  append(header, dsButton("Live Preview / QR Button", 340, 8, 32, 32, "", vars, fonts, {
    fill: "--gray-500",
    textColor: "--fg-inverse",
    radiusToken: "--ds-radius-sm",
    icon: "qr",
  }));
  append(header, dsButton("Live Preview / Close Button", 380, 8, 32, 32, "", vars, fonts, {
    fill: "--gray-500",
    textColor: "--fg-inverse",
    radiusToken: "--ds-radius-sm",
    icon: "xmark",
  }));

  const body = frame("Live Preview / Body", 0, 48, VIEWPORT.rightPanel, panelH - 48);
  setFill(body, vars, "--secondary-background-medium");
  append(panel, body);

  const phoneW = 380;
  const phoneH = Math.round(phoneW * 965 / 461);
  const phoneX = 20;
  const phoneY = 20;
  const shell = frame("Live Preview / Phone Shell - fill var(--bg-fill-brand-hover)", phoneX, phoneY, phoneW, phoneH);
  setFill(shell, vars, "--bg-fill-brand-hover");
  shell.cornerRadius = 72;
  shell.effects = SHADOWS.phone;
  append(body, shell);

  const bezel = rect("Live Preview / Phone Bezel - fill var(--gray-900)", 4, 4, phoneW - 8, phoneH - 8, 68);
  setFill(bezel, vars, "--gray-900");
  append(shell, bezel);

  const screen = frame("Live Preview / Phone Screen - app-scope", 16, 16, phoneW - 32, phoneH - 32);
  setFill(screen, vars, "--bg-surface");
  screen.cornerRadius = 56;
  append(shell, screen);

  const status = frame("Live Preview / Status Bar - fill var(--bg-surface)", 0, 0, phoneW - 32, 54);
  setFill(status, vars, "--bg-surface");
  append(screen, status);
  append(status, text("Live Preview / Status Bar / Time", "9:41", 32, 18, 48, {
    size: 14,
    lineHeight: 18,
    color: "--fg-primary",
    weight: "medium",
    height: 18,
  }, vars, fonts));
  const island = rect("Live Preview / Status Bar / Dynamic Island", 128, 13, 92, 28, 9999);
  setFill(island, vars, "--core-black");
  append(status, island);
  append(status, icon("battery", 302, 18, 20, vars, "--fg-primary"));

  const topHeader = frame("Live Preview / Top Header - fill var(--bg-surface)", 0, 54, phoneW - 32, 48);
  setFill(topHeader, vars, "--bg-surface");
  append(screen, topHeader);
  append(topHeader, text("Live Preview / Top Header / Page Name", "Home", 16, 10, 228, {
    size: 18,
    lineHeight: 24,
    color: "--fg-primary",
    weight: "bold",
    height: 24,
  }, vars, fonts));
  append(topHeader, icon("circle-user-filled", 300, 8, 32, vars, "--fg-primary"));

  const content = frame("Live Preview / Content Scaler - scale 0.9 equivalent", 0, 102, phoneW - 32, phoneH - 32 - 102 - 21);
  setFill(content, vars, "--bg-surface");
  append(screen, content);
  const miniHeader = frame("Live Preview / AppHeader Preview", 0, 0, phoneW - 32, 170);
  setFill(miniHeader, vars, "--bg-fill-brand");
  append(content, miniHeader);
  const miniIcon = roundedFrame("Live Preview / AppHeader Preview / Icon", 142, 30, 64, 64, 14);
  setFill(miniIcon, vars, "--bg-fill");
  append(miniHeader, miniIcon);
  append(miniIcon, icon("leaf", 16, 16, 32, vars, "--fg-brand"));
  append(miniHeader, text("Live Preview / AppHeader Preview / Title", "App Title", 0, 110, phoneW - 32, {
    size: 20,
    lineHeight: 28,
    color: "--fg-inverse",
    weight: "bold",
    align: "CENTER",
    height: 28,
  }, vars, fonts));
  const miniPage = frame("Live Preview / Page Preview Card", 16, 154, phoneW - 64, 240);
  setFill(miniPage, vars, "--bg-surface");
  append(content, miniPage);
  append(miniPage, text("Live Preview / Page Preview / Empty", "Your app content appears here", 0, 96, phoneW - 64, {
    size: 14,
    lineHeight: 20,
    color: "--fg-tertiary",
    weight: "regular",
    align: "CENTER",
    height: 20,
  }, vars, fonts));

  const homeIndicator = rect("Live Preview / Home Indicator", 116, phoneH - 32 - 12, 116, 5, 9999);
  homeIndicator.fills = [rgba("#000000", 0.3)];
  append(screen, homeIndicator);
}

function buildAnnotations(root, vars, fonts) {
  const note = frame("Transfer Notes / DS token usage", 32, VIEWPORT.height + 40, 620, 152);
  setFill(note, vars, "--background-white");
  setStroke(note, vars, "--border-light");
  bindFloat(note, vars, "cornerRadius", "--radius-lg", 12);
  append(root, note);
  append(note, text("Transfer Notes / Title", "DS token-bound transfer", 20, 18, 560, {
    size: 18,
    lineHeight: 24,
    color: "--text-darkest",
    weight: "medium",
    height: 24,
  }, vars, fonts));
  append(note, text("Transfer Notes / Body", "Builder chrome uses --ds-* and design-system semantic tokens. Canvas and phone content stay in the app-elements token scope. Gradient and shadow layers are named with their source tokens where Figma variable binding is not available.", 20, 52, 560, {
    size: 14,
    lineHeight: 20,
    color: "--text-medium",
    weight: "regular",
    height: 80,
  }, vars, fonts));
}

async function main() {
  const fonts = await loadFonts();
  const vars = await createVariables();

  let maxX = 0;
  for (const child of figma.currentPage.children) {
    maxX = Math.max(maxX, child.x + child.width);
  }

  const root = frame("Builder Page / Desktop - DS Token Bound", maxX + 240, 0, VIEWPORT.width, VIEWPORT.height + 232);
  root.clipsContent = false;
  setFill(root, vars, "--ds-bg-page");
  figma.currentPage.appendChild(root);

  const screen = frame("Builder Page / Desktop Viewport", 0, 0, VIEWPORT.width, VIEWPORT.height);
  setFill(screen, vars, "--ds-bg-page");
  append(root, screen);

  buildTopBar(screen, vars, fonts);
  buildLeftPanel(screen, vars, fonts);
  buildCanvas(screen, vars, fonts);
  buildLivePreview(screen, vars, fonts);
  buildAnnotations(root, vars, fonts);

  figma.viewport.scrollAndZoomIntoView([screen]);
  figma.currentPage.selection = [screen];
  figma.closePlugin("Builder page transferred with DS token variables.");
}

main().catch((error) => {
  figma.closePlugin(`Transfer failed: ${error && error.message ? error.message : String(error)}`);
});
