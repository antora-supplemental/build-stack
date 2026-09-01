'use strict'

/** Known home pages for packages commonly listed in playbook extension stacks. */
const DEFAULT_PACKAGE_HOME = {
  '@antora/lunr-extension': 'https://gitlab.com/antora/antora-lunr-extension',
  '@antora-supplemental/build-stack': 'https://github.com/antora-supplemental/build-stack',
  '@antora-supplemental/nav-typology': 'https://github.com/antora-supplemental/nav-typology',
  '@antora-supplemental/nav-typology-diataxis':
    'https://github.com/antora-supplemental/nav-typology-diataxis',
  '@antora-supplemental/page-context': 'https://github.com/antora-supplemental/page-context',
  '@antora-supplemental/site-nav-tree': 'https://github.com/antora-supplemental/site-nav-tree',
  '@antora-supplemental/unversioned-component-urls':
    'https://github.com/antora-supplemental/antora-unversioned-component-urls',
  '@antora-supplemental/antora-search-chat': 'https://github.com/antora-supplemental/antora-search-chat',
  '@antora-supplemental/incremental': 'https://github.com/antora-supplemental/antora-incremental',
  'asciidoctor-kroki': 'https://github.com/Mogztter/asciidoctor-kroki',
  'asciidoctor-emoji': 'https://github.com/asciidoctor/asciidoctor-emoji',
}

const DEFAULT_UI_BUNDLES = {
  'architexture-theme': 'https://github.com/antora-supplemental/architexture-theme',
  'valentus-theme': 'https://github.com/antora-supplemental/valentus-theme',
}

const DEFAULT_EXCLUDE = ['@antora-supplemental/build-stack']

function mergeMaps (base, extra) {
  if (!extra || typeof extra !== 'object') return { ...base }
  return { ...base, ...extra }
}

function normalizeList (value) {
  if (value == null) return []
  if (Array.isArray(value)) return value.map(String).filter(Boolean)
  return String(value)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

module.exports = {
  DEFAULT_EXCLUDE,
  DEFAULT_PACKAGE_HOME,
  DEFAULT_UI_BUNDLES,
  mergeMaps,
  normalizeList,
}
