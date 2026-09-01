'use strict'

const {
  DEFAULT_EXCLUDE,
  DEFAULT_PACKAGE_HOME,
  DEFAULT_UI_BUNDLES,
  mergeMaps,
  normalizeList,
} = require('./package-home')

function normalizeExtensionId (entry) {
  if (typeof entry === 'string') return entry
  if (entry && typeof entry.require === 'string') return entry.require
  return null
}

function normalizeExtensionList (list) {
  if (!Array.isArray(list)) return []
  return list.map(normalizeExtensionId).filter(Boolean)
}

function shouldListExtension (id, exclude) {
  if (!id) return false
  if (id.startsWith('./') || id.startsWith('../')) return false
  return !exclude.includes(id)
}

function displayName (id) {
  if (id.startsWith('@antora-supplemental/')) return id.slice('@antora-supplemental/'.length)
  if (id.startsWith('@antora/')) return id.slice('@antora/'.length)
  return id
}

function packageHome (id, homeMap) {
  if (homeMap[id]) return homeMap[id]
  if (id.startsWith('@')) return `https://www.npmjs.com/package/${encodeURIComponent(id)}`
  return `https://www.npmjs.com/search?q=${encodeURIComponent(id)}`
}

function linksHtml (ids, homeMap) {
  return ids
    .map((id) => {
      const label = displayName(id)
      const href = packageHome(id, homeMap)
      return `<a href="${href}" target="_blank" rel="noopener">${label}</a>`
    })
    .join(' · ')
}

function inferUiBundle (bundleUrl, uiBundles) {
  const url = String(bundleUrl || '')
  for (const [name, home] of Object.entries(uiBundles)) {
    if (url.includes(name)) return { name, home }
  }
  return null
}

/**
 * Publish build-stack keys on playbook.site.keys for Handlebars footer templates.
 *
 * @param {object} playbook
 * @param {object} [config]
 */
function publishBuildStack (playbook, config = {}) {
  const keys = playbook.site.keys || (playbook.site.keys = {})
  const packageHomeMap = mergeMaps(DEFAULT_PACKAGE_HOME, config.package_home)
  const uiBundles = mergeMaps(DEFAULT_UI_BUNDLES, config.ui_bundles)
  const exclude = [...DEFAULT_EXCLUDE, ...normalizeList(config.exclude)]

  const antoraIds = normalizeExtensionList(playbook.antora && playbook.antora.extensions).filter((id) =>
    shouldListExtension(id, exclude)
  )
  const asciidocIds = normalizeExtensionList(playbook.asciidoc && playbook.asciidoc.extensions).filter((id) =>
    shouldListExtension(id, exclude)
  )

  if (antoraIds.length) keys.build_stack_antora_html = linksHtml(antoraIds, packageHomeMap)
  else delete keys.build_stack_antora_html

  if (asciidocIds.length) keys.build_stack_asciidoc_html = linksHtml(asciidocIds, packageHomeMap)
  else delete keys.build_stack_asciidoc_html

  if (!keys.ui_bundle_name) {
    const ui = inferUiBundle(playbook.ui && playbook.ui.bundle && playbook.ui.bundle.url, uiBundles)
    if (ui) {
      keys.ui_bundle_name = ui.name
      keys.ui_bundle_url = ui.home
    }
  }
}

module.exports = {
  displayName,
  inferUiBundle,
  linksHtml,
  normalizeExtensionId,
  normalizeExtensionList,
  publishBuildStack,
  shouldListExtension,
}
