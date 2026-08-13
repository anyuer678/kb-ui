export default {
  extends: ['stylelint-config-standard'],
  rules: {
    'color-hex-length': 'short',
    'custom-property-empty-line-before': null,
    'selector-class-pattern': [
      '^kb-[a-z]+(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9-]+)?$',
      { message: 'class 必须符合 kb-<component>-<element> 语义化命名' },
    ],
  },
}
