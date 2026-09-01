'use strict'

const { publishBuildStack } = require('./publish-build-stack')

/**
 * Antora extension: bridge playbook extension stacks into site.keys for footer UI.
 *
 * Antora only exposes site.keys to Handlebars — not antora.extensions or
 * asciidoc.extensions. This extension listens on playbookBuilt and publishes
 * pre-linked HTML for companion footer partials.
 *
 * Optional Valentus companion: copy ui/partials/footer-build-stack.hbs into
 * supplemental-ui/partials/ and {{> footer-build-stack}} from footer-content.hbs.
 */
module.exports.register = function ({ config = {} } = {}) {
  this.on('playbookBuilt', ({ playbook }) => {
    publishBuildStack(playbook, config)
  })
}
