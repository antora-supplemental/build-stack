'use strict'

const { describe, it } = require('node:test')
const assert = require('node:assert/strict')
const { publishBuildStack, shouldListExtension } = require('../lib/publish-build-stack')

describe('shouldListExtension', () => {
  it('skips relative local requires and excluded ids', () => {
    assert.equal(shouldListExtension('./lib/local.js', []), false)
    assert.equal(shouldListExtension('@antora-supplemental/build-stack', ['@antora-supplemental/build-stack']), false)
    assert.equal(shouldListExtension('@antora/lunr-extension', []), true)
  })
})

describe('publishBuildStack', () => {
  it('publishes linked stack HTML and UI bundle keys', () => {
    const playbook = {
      site: { keys: {} },
      antora: {
        extensions: [
          '@antora/lunr-extension',
          { require: '@antora-supplemental/site-nav-tree' },
          '@antora-supplemental/build-stack',
        ],
      },
      asciidoc: {
        extensions: ['asciidoctor-kroki', '@antora-supplemental/page-context'],
      },
      ui: {
        bundle: {
          url: 'https://github.com/antora-supplemental/valentus-theme/releases/download/v2/ui-bundle.zip',
        },
      },
    }

    publishBuildStack(playbook)

    assert.match(playbook.site.keys.build_stack_antora_html, /lunr-extension/)
    assert.match(playbook.site.keys.build_stack_antora_html, /site-nav-tree/)
    assert.doesNotMatch(playbook.site.keys.build_stack_antora_html, /build-stack/)
    assert.match(playbook.site.keys.build_stack_asciidoc_html, /asciidoctor-kroki/)
    assert.match(playbook.site.keys.build_stack_asciidoc_html, /page-context/)
    assert.equal(playbook.site.keys.ui_bundle_name, 'valentus-theme')
    assert.equal(playbook.site.keys.ui_bundle_url, 'https://github.com/antora-supplemental/valentus-theme')
  })

  it('merges config package_home and respects manual ui bundle keys', () => {
    const playbook = {
      site: { keys: { ui_bundle_name: 'custom-theme', ui_bundle_url: 'https://example.test/theme' } },
      antora: { extensions: ['@acme/custom-ext'] },
      asciidoc: { extensions: [] },
      ui: { bundle: { url: 'https://github.com/antora-supplemental/valentus-theme/releases/download/v2/ui-bundle.zip' } },
    }

    publishBuildStack(playbook, {
      package_home: {
        '@acme/custom-ext': 'https://example.test/custom-ext',
      },
    })

    assert.match(playbook.site.keys.build_stack_antora_html, /custom-ext/)
    assert.equal(playbook.site.keys.ui_bundle_name, 'custom-theme')
  })
})
