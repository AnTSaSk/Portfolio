module.exports = {
  extends: ['stylelint-config-prettier'],
  plugins: ['stylelint-order'],
  overrides: [
    {
      files: ['**/*.scss'],
      customSyntax: require('postcss-scss'),
    },
  ],
  rules: {
    'max-empty-lines': [1, { severity: 'warning' }],
    'order/order': [
      'custom-properties',
      'dollar-variables',
      'at-variables',
      'declarations',
      'at-rules',
      'rules',
    ],
    'order/properties-order': [
      'position',
      'top',
      'right',
      'bottom',
      'left',

      'display',
      'flex',
      'flex-basis',
      'flex-direction',
      'flex-flow',
      'flex-grow',
      'flex-shrink',
      'flex-wrap',
      'grid',
      'grid-area',
      'grid-auto-rows',
      'grid-auto-columns',
      'grid-auto-flow',
      'grid-gap',
      'grid-row',
      'grid-row-start',
      'grid-row-end',
      'grid-row-gap',
      'grid-columns',
      'grid-columns-start',
      'grid-columns-end',
      'grid-columns-gap',
      'grid-template',
      'grid-template-areas',
      'grid-template-rows',
      'grid-template-columns',
      'gap',
      'align-content',
      'align-items',
      'align-self',
      'justify-content',
      'justify-items',
      'justify-self',
      'order',
      'float',
      'clear',
      'box-sizing',
      'padding',
      'padding-top',
      'padding-right',
      'padding-bottom',
      'padding-left',
      'margin',
      'margin-top',
      'margin-right',
      'margin-bottom',
      'margin-left',
      'width',
      'min-width',
      'max-width',
      'height',
      'min-height',
      'max-height',
      'overflow',
      'overflow-x',
      'overflow-y',
      'object-fit',
      'object-position',

      'color',
      'font',
      'font-family',
      'font-size',
      'font-style',
      'font-size-adjust',
      'font-stretch',
      'font-effect',
      'font-emphasize',
      'font-emphasize-position',
      'font-emphasize-style',
      'font-smooth',
      'font-variant',
      'font-weight',
      'direction',
      'line-height',
      'letter-spacing',
      'white-space',
      'text-align',
      'text-align-last',
      'text-decoration',
      'text-emphasis',
      'text-emphasis-color',
      'text-emphasis-style',
      'text-emphasis-position',
      'text-indent',
      'text-justify',
      'text-outline',
      'text-transform',
      'text-wrap',
      'text-overflow',
      'text-overflow-ellipsis',
      'text-overflow-mode',
      'text-orientation',
      'text-shadow',
      'vertical-align',
      'word-wrap',
      'word-break',
      'word-spacing',
      'overflow-wrap',
      'tab-size',
      'hyphens',
      'unicode-bidi',
      'columns',
      'column-count',
      'column-fill',
      'column-gap',
      'column-rule',
      'column-rule-color',
      'column-rule-style',
      'column-rule-width',
      'column-span',
      'column-width',
      'page-break-after',
      'page-break-before',
      'page-break-inside',
      'src',

      'list-style',
      'list-style-position',
      'list-style-type',
      'list-style-image',
      'table-layout',
      'empty-cells',
      'caption-side',
      'background',
      'background-color',
      'background-image',
      'background-repeat',
      'background-position',
      'background-position-x',
      'background-position-y',
      'background-size',
      'background-clip',
      'background-origin',
      'background-attachment',
      'background-blend-mode',

      'border',
      'border-color',
      'border-style',
      'border-width',
      'border-top',
      'border-top-color',
      'border-top-style',
      'border-top-width',
      'border-right',
      'border-right-color',
      'border-right-style',
      'border-right-width',
      'border-bottom',
      'border-bottom-color',
      'border-bottom-style',
      'border-bottom-width',
      'border-left',
      'border-left-color',
      'border-left-style',
      'border-left-width',
      'border-radius',
      'border-top-left-radius',
      'border-top-right-radius',
      'border-bottom-right-radius',
      'border-bottom-left-radius',
      'border-image',
      'border-image-source',
      'border-image-slice',
      'border-image-width',
      'border-image-outset',
      'border-image-repeat',
      'border-collapse',
      'border-spacing',

      'outline',
      'outline-width',
      'outline-style',
      'outline-color',
      'outline-offset',
      'box-shadow',
      'box-decoration-break',
      'transform',
      'transform-box',
      'transform-origin',
      'transform-style',
      'backface-visibility',
      'perspective',
      'perspective-origin',
      'visibility',
      'cursor',
      'opacity',
      'filter',
      'isolation',
      'backdrop-filter',
      'mix-blend-mode',

      'transition',
      'transition-delay',
      'transition-timing-function',
      'transition-duration',
      'transition-property',
      'animation',
      'animation-name',
      'animation-duration',
      'animation-play-state',
      'animation-timing-function',
      'animation-delay',
      'animation-iteration-count',
      'animation-direction',
      'animation-fill-mode',

      'appareance',
      'content',
      'clip',
      'clip-path',
      'counter-reset',
      'counter-increment',
      'resize',
      'user-select',
      'nav-index',
      'nav-up',
      'nav-right',
      'nav-down',
      'nav-left',
      'pointer-events',
      'quotes',
      'touch-action',
      'will-change',
      'zoom',
      'fill',
      'fill-rule',
      'clip-rule',
      'stroke',
      'z-index',
    ],
  },
};
