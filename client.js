/**
 * GENERATED FILE — do not edit.
 *
 * Source of truth: the modules under src/. Rebuild with `node scripts/build.mjs`.
 * This bundle is what the Client module loader serves; it is the only browser
 * entry the loader knows about for this package.
 *
 * The modules below are wrapped in one IIFE. The loader executes this file as a
 * CLASSIC script, so without the wrapper every top-level binding would land in
 * the page's global lexical scope: another plugin bundle declaring the same
 * name would fail to parse, and executing this bundle twice in one page would
 * throw "Identifier '…' has already been declared" before a single line ran.
 * The wrapper keeps that scope private. It does not make a second execution
 * harmless — the loader already rejects a duplicate `load()` for the same id —
 * it just confines the damage to this bundle.
 */
(() => {
//# module: src/core/rank.js
/**
 * Fuzzy ranking for the model search box.
 *
 * This is the shipped `rankByName` from `@deepseek-ai/dsh-client-ui-primitives`
 * (the `/` menu's own search), vendored verbatim rather than required: the
 * Client module table only carries `react`, and pulling a host package into the
 * offline unit test would make it impossible to run without DSH installed. The
 * algorithm is self-contained — no imports, no state — so copying it keeps the
 * picker's results identical to the shipped menus while the source tree stays
 * dependency-free.
 *
 * What it does, per the original doc comment: the query must be a
 * case-insensitive ORDERED SUBSEQUENCE of the candidate's name (or its `label`
 * when it carries one). Prefix hits rank first, then the strongest alignment
 * score over either key, then the source order of the input.
 *
 * Upstream: `packages/client/ui-primitives/src/rank-by-name.ts`.
 */

/** Extra weight for name starts and separator boundaries. */
function boundaryBonus(name, index) {
  return index === 0 || name.charAt(index - 1) === '-' || name.charAt(index - 1) === '_' ? 8 : 0
}

/**
 * Score the strongest ordered-subsequence alignment in O(name × query).
 *
 * Boundary and adjacent matches earn weight; skipped and leading characters
 * cost weight.
 *
 * @param name - the lowercased candidate name.
 * @param query - the lowercased query.
 * @returns the score, or undefined when the query is not a subsequence.
 */
function alignmentScore(name, query) {
  if (query.length > name.length) return undefined
  const noMatch = Number.NEGATIVE_INFINITY
  let previous = Array(name.length).fill(noMatch)
  for (let index = 0; index < name.length; index += 1) {
    if (name.charAt(index) === query.charAt(0)) previous[index] = 1 + boundaryBonus(name, index) - index
  }
  for (let queryIndex = 1; queryIndex < query.length; queryIndex += 1) {
    const current = Array(name.length).fill(noMatch)
    let left = noMatch
    let leftLeft = noMatch
    let bestGapped = noMatch
    for (const [index, prior] of previous.entries()) {
      if (leftLeft !== noMatch) bestGapped = Math.max(bestGapped, leftLeft + index - 2)
      if (name.charAt(index) === query.charAt(queryIndex)) {
        const bonus = 1 + boundaryBonus(name, index)
        let score = noMatch
        if (left !== noMatch) score = left + bonus + 4
        if (bestGapped !== noMatch) score = Math.max(score, bestGapped + bonus + 1 - index)
        current[index] = score
      }
      leftLeft = left
      left = prior
    }
    previous = current
  }
  let best = noMatch
  for (const score of previous) best = Math.max(best, score)
  return best === noMatch ? undefined : best
}

/**
 * Rank named items by a search query.
 *
 * @param items - candidates in source order; an item's optional `label` is a
 *   second search key beside its `name`.
 * @param rawQuery - the text typed into the search box, matched case-insensitively.
 * @returns the matching items: prefix hits first, then by alignment score, then
 *   in source order. The input list itself for an empty query.
 */
function rankByName(items, rawQuery) {
  const query = String(rawQuery ?? '').toLowerCase()
  if (query === '') return items
  const ranked = []
  items.forEach((item, index) => {
    const name = String(item?.name ?? item?.id ?? '')
    const keys = item?.label === undefined ? [name] : [name, String(item.label)]
    let prefix = false
    let score
    for (const key of keys) {
      const lower = key.toLowerCase()
      const keyScore = alignmentScore(lower, query)
      if (keyScore === undefined) continue
      prefix ||= lower.startsWith(query)
      score = score === undefined ? keyScore : Math.max(score, keyScore)
    }
    if (score !== undefined) ranked.push({ item, index, prefix, score })
  })
  ranked.sort((left, right) => Number(right.prefix) - Number(left.prefix) ||
    right.score - left.score ||
    left.index - right.index)
  return ranked.map((match) => match.item)
}

//# module: src/ui/Chevron.js
/**
 * The chevron that turns when its panel is open.
 *
 * @param props - `{ h, open }`: the createElement function and the open flag.
 * @returns the svg element.
 */
function Chevron({ h, open }) {
  return h('svg', {
    className: `dmp-chevron${open ? ' dmp-chevron-open' : ''}`,
    viewBox: '0 0 16 16', width: 14, height: 14, 'aria-hidden': true
  }, h('path', {
    d: 'M4 6.5L8 10.5L12 6.5', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.6,
    'stroke-linecap': 'round', 'stroke-linejoin': 'round'
  }))
}

//# module: src/ui/providerLogos.js
/**
 * Official provider marks for the picker rail and rows.
 *
 * The monochrome paths are from Simple Icons (CC0). The Qoder mark is the
 * official icon used by the Qoder OAuth plugin. Brand names and marks remain
 * the property of their owners; this file only identifies a provider.
 */

const PROVIDER_LOGOS = {
  "claude": {
    "path": "m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z",
    "color": "#D97757"
  },
  "gemini": {
    "path": "M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81",
    "color": "#4285F4"
  },
  "x": {
    "path": "M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z",
    "color": "currentColor"
  },
  "deepseek": {
    "path": "M23.748 4.651c-.254-.124-.364.113-.512.233-.051.04-.094.09-.137.137-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.155-.708-.311-.955-.65-.172-.24-.219-.509-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434 1.202-.422 1.84.027 1.436.633 2.58 1.838 3.393.137.094.172.187.129.323-.082.28-.18.553-.266.833-.055.179-.137.218-.328.14a5.5 5.5 0 0 1-1.737-1.179c-.857-.828-1.631-1.743-2.597-2.46a12 12 0 0 0-.689-.47c-.985-.957.13-1.743.387-1.836.27-.098.094-.433-.778-.428-.872.003-1.67.295-2.687.685a3 3 0 0 1-.465.136 9.6 9.6 0 0 0-2.883-.101c-1.885.21-3.39 1.1-4.497 2.622C.082 8.776-.231 10.854.152 13.02c.403 2.284 1.568 4.175 3.36 5.653 1.857 1.533 3.997 2.284 6.438 2.14 1.482-.085 3.132-.284 4.994-1.86.47.234.962.328 1.78.398.629.058 1.235-.031 1.705-.129.735-.155.684-.836.418-.961-2.155-1.004-1.682-.595-2.112-.926 1.095-1.295 2.768-3.598 3.284-6.733.05-.346.115-.834.108-1.114-.004-.171.035-.238.23-.257a4.2 4.2 0 0 0 1.545-.475c1.397-.763 1.96-2.016 2.093-3.517.02-.23-.004-.467-.247-.588M11.58 18.168c-2.088-1.642-3.101-2.183-3.52-2.16-.39.024-.32.472-.234.763.09.288.207.487.371.74.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.168-1.361-.801-2.5-1.86-3.301-3.306-.775-1.393-1.225-2.888-1.299-4.482-.02-.385.094-.522.477-.592a4.7 4.7 0 0 1 1.53-.038c2.131.311 3.946 1.264 5.467 2.774.868.86 1.525 1.887 2.202 2.89.72 1.066 1.494 2.082 2.48 2.915.348.291.626.513.892.677-.802.09-2.14.109-3.055-.615zm1.001-6.44a.306.306 0 0 1 .415-.287.3.3 0 0 1 .113.074.3.3 0 0 1 .086.214c0 .17-.136.307-.308.307a.303.303 0 0 1-.306-.307m3.11 1.596c-.2.081-.4.151-.591.16a1.25 1.25 0 0 1-.798-.254c-.274-.23-.47-.358-.551-.758a1.7 1.7 0 0 1 .015-.588c.07-.327-.007-.537-.238-.727-.188-.156-.426-.199-.689-.199a.6.6 0 0 1-.254-.078.253.253 0 0 1-.114-.358 1 1 0 0 1 .192-.21c.356-.202.767-.136 1.146.016.352.144.618.408 1.001.782.392.451.462.576.685.915.176.264.336.536.446.848.066.194-.02.353-.25.45",
    "color": "#4D6BFE"
  },
  "openai": {
    "path": "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z",
    "color": "currentColor"
  },
  "copilot": {
    "path": "M23.922 16.997C23.061 18.492 18.063 22.02 12 22.02 5.937 22.02.939 18.492.078 16.997A.641.641 0 0 1 0 16.741v-2.869a.883.883 0 0 1 .053-.22c.372-.935 1.347-2.292 2.605-2.656.167-.429.414-1.055.644-1.517a10.098 10.098 0 0 1-.052-1.086c0-1.331.282-2.499 1.132-3.368.397-.406.89-.717 1.474-.952C7.255 2.937 9.248 1.98 11.978 1.98c2.731 0 4.767.957 6.166 2.093.584.235 1.077.546 1.474.952.85.869 1.132 2.037 1.132 3.368 0 .368-.014.733-.052 1.086.23.462.477 1.088.644 1.517 1.258.364 2.233 1.721 2.605 2.656a.841.841 0 0 1 .053.22v2.869a.641.641 0 0 1-.078.256Zm-11.75-5.992h-.344a4.359 4.359 0 0 1-.355.508c-.77.947-1.918 1.492-3.508 1.492-1.725 0-2.989-.359-3.782-1.259a2.137 2.137 0 0 1-.085-.104L4 11.746v6.585c1.435.779 4.514 2.179 8 2.179 3.486 0 6.565-1.4 8-2.179v-6.585l-.098-.104s-.033.045-.085.104c-.793.9-2.057 1.259-3.782 1.259-1.59 0-2.738-.545-3.508-1.492a4.359 4.359 0 0 1-.355-.508Zm2.328 3.25c.549 0 1 .451 1 1v2c0 .549-.451 1-1 1-.549 0-1-.451-1-1v-2c0-.549.451-1 1-1Zm-5 0c.549 0 1 .451 1 1v2c0 .549-.451 1-1 1-.549 0-1-.451-1-1v-2c0-.549.451-1 1-1Zm3.313-6.185c.136 1.057.403 1.913.878 2.497.442.544 1.134.938 2.344.938 1.573 0 2.292-.337 2.657-.751.384-.435.558-1.15.558-2.361 0-1.14-.243-1.847-.705-2.319-.477-.488-1.319-.862-2.824-1.025-1.487-.161-2.192.138-2.533.529-.269.307-.437.808-.438 1.578v.021c0 .265.021.562.063.893Zm-1.626 0c.042-.331.063-.628.063-.894v-.02c-.001-.77-.169-1.271-.438-1.578-.341-.391-1.046-.69-2.533-.529-1.505.163-2.347.537-2.824 1.025-.462.472-.705 1.179-.705 2.319 0 1.211.175 1.926.558 2.361.365.414 1.084.751 2.657.751 1.21 0 1.902-.394 2.344-.938.475-.584.742-1.44.878-2.497Z",
    "color": "currentColor"
  }
}

const QODER_LOGO = 'data:image/png;base64,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'

function textOf(value) {
  return `${value?.id ?? ''} ${value?.name ?? ''} ${value?.label ?? ''}`.toLowerCase()
}

function logoKeyForGroup(group) {
  const text = textOf(group)
  if (text.includes('claude') || text.includes('anthropic')) return 'claude'
  if (text.includes('gemini') || text.includes('google') || text.includes('antigravity') || text.includes('agy')) return 'gemini'
  if (text.includes('grok') || text.includes('xai')) return 'x'
  if (text.includes('deepseek')) return 'deepseek'
  if (text.includes('qoder')) return 'qoder'
  if (text.includes('codex') || text.includes('openai')) return 'openai'
  if (text.includes('copilot')) return 'copilot'
  return undefined
}

function logoKeyForModel(model, group) {
  const text = textOf(model)
  if (text.includes('claude') || text.includes('opus') || text.includes('sonnet') || text.includes('haiku')) return 'claude'
  if (text.includes('gemini')) return 'gemini'
  if (text.includes('grok')) return 'x'
  if (text.includes('deepseek')) return 'deepseek'
  if (text.includes('gpt') || text.includes('codex')) return 'openai'
  return logoKeyForGroup(group)
}

function fallbackGlyph(value) {
  const text = textOf(value)
  if (text.includes('qwen')) return 'Q'
  if (text.includes('kimi')) return 'K'
  if (text.includes('glm')) return 'G'
  const name = String(value?.name ?? value?.id ?? '?').trim()
  return name.length > 0 ? name.slice(0, 1).toUpperCase() : '?'
}

function createProviderLogo(React) {
  const h = React.createElement
  return function ProviderLogo({ group, model, className }) {
    const key = logoKeyForModel(model, group)
    const logo = key === 'qoder' ? undefined : PROVIDER_LOGOS[key]
    const label = group?.name ?? model?.name ?? key ?? 'provider'
    if (key === 'qoder') {
      return h('img', {
        src: QODER_LOGO,
        alt: label,
        className: `t3mp-logo ${className ?? ''}`.trim(),
      })
    }
    if (logo === undefined) {
      return h('span', { className: `t3mp-logo-fallback ${className ?? ''}`.trim() }, fallbackGlyph(group ?? model))
    }
    return h('svg', {
      viewBox: '0 0 24 24',
      role: 'img',
      'aria-label': label,
      className: `t3mp-logo ${className ?? ''}`.trim(),
    }, h('path', { d: logo.path, fill: logo.color }))
  }
}

//# module: src/ui/anchor.js
/**
 * The nearest ancestor that scrolls vertically.
 *
 * The popover is rendered inside the conversation's scroll container. Anything
 * that pokes past that container's right edge becomes horizontal overflow, and
 * because the container declares overflow-y: auto the other axis computes to
 * auto as well — the browser then paints a horizontal scrollbar, the container
 * loses exactly that much height, and the whole chat jumps upward for a frame.
 * Clamping to the container keeps the panel inside it.
 *
 * @param node - the trigger element.
 * @returns the scrolling ancestor, or `null` when there is none.
 */
function scrollParentOf(node) {
  if (node === null || node === undefined || typeof getComputedStyle !== 'function') return null
  let current = node.parentElement
  while (current !== null && current !== undefined) {
    const overflow = getComputedStyle(current).overflowY
    if ((overflow === 'auto' || overflow === 'scroll' || overflow === 'overlay')
      && current.clientHeight > 0) return current
    current = current.parentElement
  }
  return null
}

/**
 * Anchor a popover to the centre of its trigger, clamped to the viewport.
 *
 * Both popovers in this picker open ABOVE their button, and both are wider than
 * the button they belong to. Anchoring by a fixed side (`left: 0` or `right: 0`)
 * makes the panel drift away from the control the user just pressed, and near
 * either screen edge it runs off the window entirely.
 *
 * The hook measures the trigger, centres the panel on it, then shifts the result
 * so the panel stays inside the viewport with a small margin. It returns:
 *
 *  - `ref`     — attach to the trigger element,
 *  - `panelRef`— attach to the panel element (its width depends on content),
 *  - `style`   — spread onto the panel: centring transform, clamp offset, and
 *                `visibility` gated on the first measurement so the panel never
 *                paints at the wrong place for a frame.
 *
 * @param React - the React runtime.
 * @param options - `{ open, fallbackWidth, deps }`.
 * @returns `{ ref, panelRef, style }`.
 */
function createAnchoredPanel(React, options) {
  const { useState, useEffect, useLayoutEffect, useRef } = React
  const { open, fallbackWidth = 280, margin = 8, deps = [] } = options

  /**
   * Park the panel OFF-SCREEN LEFT until it has been measured.
   *
   * It used to start at `left: 0`, and the very first frame — before the effect
   * had measured anything — was already inside the conversation's scroll
   * container and poking out of its right edge. That frame is enough for the
   * browser to add a horizontal scrollbar, which steals height from the scroll
   * container and lifts the whole chat for a moment; the next frame moves the
   * panel back and the scrollbar disappears. Users read that as "the panel makes
   * the chat jump". Negative overflow is clipped and never scrollable, so a panel
   * parked on the left cannot produce a scrollbar at all.
   */
  const PARKED = -9999
  const [anchor, setAnchor] = useState({ left: PARKED, ready: false })
  const triggerRef = useRef(null)
  const panelRef = useRef(null)

  // Layout effect where available: measure BEFORE the frame is painted, so the
  // panel is never seen (nor measured by the scroll container) at the parked spot.
  const useCommitEffect = typeof useLayoutEffect === 'function' ? useLayoutEffect : useEffect

  useCommitEffect(() => {
    if (!open) {
      setAnchor({ left: PARKED, ready: false })
      return undefined
    }
    const measure = () => {
      const trigger = triggerRef.current
      if (trigger === null || typeof trigger.getBoundingClientRect !== 'function') return
      const rect = trigger.getBoundingClientRect()
      const viewport = (typeof window !== 'undefined' && window.innerWidth)
        || (typeof document !== 'undefined' && document.documentElement?.clientWidth)
        || 0
      if (viewport === 0) return

      // Read the panel's real width: it depends on content (a five-level slider is
      // wider than a three-level one). `visibility: hidden` does not affect
      // `getBoundingClientRect`, so the width is available before the first paint.
      // The ref is attached in the same commit the panel is rendered in, so it is
      // set by the time this effect runs.
      const panel = panelRef.current
      const measured = panel !== null && panel !== undefined
        && typeof panel.getBoundingClientRect === 'function'
        ? panel.getBoundingClientRect().width
        : 0
      const width = measured > 0 ? measured : Math.min(fallbackWidth, viewport - 32)

      const centre = rect.left + rect.width / 2
      const centred = centre - width / 2
      // Stay inside the scrolling ancestor as well as the viewport: overflowing
      // it costs a horizontal scrollbar, and that scrollbar is what made the
      // chat jump when a panel opened.
      const scroller = scrollParentOf(trigger)
      const bounds = scroller !== null && typeof scroller.getBoundingClientRect === 'function'
        ? scroller.getBoundingClientRect()
        : null
      const floor = Math.max(margin, bounds === null ? margin : bounds.left + margin)
      const ceiling = Math.min(viewport - width - margin,
        bounds === null ? viewport - width - margin : bounds.right - width - margin)
      const clamped = Math.max(floor, Math.min(centred, Math.max(floor, ceiling)))
      // Anchor in PIXELS from the panel's containing block, not with `left: 50%`.
      // The containing block is the control row, whose width follows the label on
      // the buttons: a percentage anchor slid the panel sideways whenever that
      // label changed (a model switch, a level name), which reads as a flicker
      // even though nothing re-rendered. Measuring once per open keeps it still.
      const parent = panel !== null && panel !== undefined ? panel.offsetParent : null
      const origin = parent !== null && parent !== undefined
        && typeof parent.getBoundingClientRect === 'function'
        ? parent.getBoundingClientRect().left
        : rect.left
      setAnchor({ left: Math.round(clamped - origin), ready: true })
    }

    measure()
    // Second pass after layout: the first can see the min-width instead of the
    // real width when the content is wider than the minimum.
    const raf = typeof requestAnimationFrame === 'function'
      ? requestAnimationFrame(measure)
      : undefined
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('resize', measure)
      return () => {
        window.removeEventListener('resize', measure)
        if (raf !== undefined && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(raf)
      }
    }
    return undefined
    // `deps` carries content-dependent values (level count, model count) that
    // change the panel's width without changing `open`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, ...deps])

  return {
    ref: triggerRef,
    panelRef,
    style: {
      left: `${anchor.left}px`,
      right: 'auto',
      visibility: anchor.ready ? 'visible' : 'hidden'
    }
  }
}

//# module: src/ui/dict.js
/**
 * The picker's two dictionaries.
 *
 * Kept as a plain object rather than the Client locale service because the
 * strings are this component's own copy, not a namespace other plugins
 * translate. Adding a language is one more entry here.
 *
 * Only keys the component actually reads belong here: an entry nobody looks up
 * is a string that silently rots, and a reviewer cannot tell it is dead.
 */
const DICT = {
  'zh-CN': {
    placeholder: '搜索模型',
    empty: '没有匹配的模型',
    loading: '正在读取模型列表…',
    retry: '重试',
    noCatalog: '当前没有可用模型',
    trigger: (name) => `${name}（点此切换模型）`,
    effortTitle: (name) => `思考档位：${name}（点此调整）`,
    effortHeading: '思考强度',
    effortHint: '更高的强度通常需要更多思考时间。',
    switchFailed: '切换失败',
    expand: '展开',
    collapse: '收起',
    rateFree: '免费',
    rateUnknown: '未知',
    busyIdle: '空闲',
    busyBusy: '繁忙',
    busyCongested: '拥堵',
    /* The wording a tooltip uses: the two-character labels drop the degree that
       the dot's colour already carries, a tooltip can afford to say it. */
    busyBusyDetail: '轻微拥堵',
    busyCongestedDetail: '极度拥堵',
    /**
     * Deployment names for a card whose providers are regions of one product.
     *
     * The provider publishes `region` ('cn' / 'intl') plus an English display
     * name; the picker's own language decides how those are written, so the tab
     * never reads "Mainland" inside an otherwise Chinese panel.
     */
    regionCn: '大陆版',
    regionIntl: '海外版',
    credits: '积分',
    creditsUnknown: '—',
    creditsLoading: '加载中…',
    noModels: '暂无可用模型',
    chooseModel: '选择模型',
    noEfforts: '该模型没有公开思考档位',
    favoritesOnly: '只看收藏',
    allProviders: '全部提供商',
    favoritesEmpty: '还没有收藏的模型',
    addFavorite: '收藏模型',
    removeFavorite: '取消收藏',
    refreshCredits: '刷新积分',
    renew: '续期',
    renewing: '续期中…',
    login: '登录',
    loginPending: '登录中…',
    /**
     * The published verdict tokens, in the picker's own words.
     *
     * The provider plugin publishes stable English tokens and never its UI copy,
     * so a consumer can translate them itself; this is that translation. An
     * unknown token falls through and is printed as-is rather than being forced
     * into 可用 — a new verdict should look odd, not lie.
     */
    verdict: {
      available: '可用',
      unusable: '不可用',
      'no permission': '无权限',
      'credentials rejected': '凭据失效',
      'out of credits': '积分不足',
      'rate limited': '限流',
      unknown: '未知'
    }
  },
  en: {
    placeholder: 'Search models',
    empty: 'No matching model',
    loading: 'Loading models…',
    retry: 'Retry',
    noCatalog: 'No model is currently available',
    trigger: (name) => `${name} (click to switch model)`,
    effortTitle: (name) => `Reasoning level: ${name} (click to change)`,
    effortHeading: 'Reasoning effort',
    effortHint: 'Higher effort usually takes more time to think.',
    switchFailed: 'Switch failed',
    expand: 'Expand',
    collapse: 'Collapse',
    rateFree: 'Free',
    rateUnknown: 'Unknown',
    busyIdle: 'Idle',
    busyBusy: 'Busy',
    busyCongested: 'Congested',
    busyBusyDetail: 'Slightly congested',
    busyCongestedDetail: 'Heavily congested',
    regionCn: 'Mainland',
    regionIntl: 'Overseas',
    credits: 'Credits',
    creditsUnknown: '—',
    creditsLoading: 'Loading…',
    noModels: 'No models yet',
    chooseModel: 'Choose a model',
    noEfforts: 'This model does not expose reasoning levels',
    favoritesOnly: 'Favorites only',
    allProviders: 'All providers',
    favoritesEmpty: 'No favorite models yet',
    addFavorite: 'Add to favorites',
    removeFavorite: 'Remove from favorites',
    refreshCredits: 'Refresh credits',
    renew: 'Renew',
    renewing: 'Renewing…',
    login: 'Sign in',
    loginPending: 'Signing in…',
    verdict: {
      available: 'Available',
      unusable: 'Unusable',
      'no permission': 'No permission',
      'credentials rejected': 'Credentials rejected',
      'out of credits': 'Out of credits',
      'rate limited': 'Rate limited',
      unknown: 'Unknown'
    }
  }
}

DICT.ja = {
  placeholder: 'モデルを検索',
  empty: '一致するモデルがありません',
  loading: 'モデル一覧を読み込み中…',
  retry: '再試行',
  noCatalog: '利用可能なモデルがありません',
  trigger: (name) => `${name}（クリックでモデルを切り替え）`,
  effortTitle: (name) => `推論レベル：${name}（クリックで変更）`,
  effortHeading: '推論の強さ',
  effortHint: '強くするほど思考時間が長くなります。',
  switchFailed: '切り替えに失敗しました',
  expand: '展開',
  collapse: '折りたたむ',
  rateFree: '無料',
  rateUnknown: '不明',
  busyIdle: '空き',
  busyBusy: '混雑',
  busyCongested: '渋滞',
  busyBusyDetail: 'やや混雑',
  busyCongestedDetail: 'かなり渋滞',
  regionCn: '中国本土版',
  regionIntl: 'グローバル版',
  credits: 'クレジット',
  creditsUnknown: '—',
  creditsLoading: '読み込み中…',
  noModels: '利用可能なモデルはありません',
  chooseModel: 'モデルを選択',
  noEfforts: 'このモデルは推論レベルを公開していません',
  refreshCredits: 'クレジットを更新',
  renew: '更新',
  renewing: '更新中…',
  login: 'ログイン',
  loginPending: 'ログイン中…',
  favoritesOnly: 'お気に入りのみ',
  allProviders: 'すべてのプロバイダー',
  favoritesEmpty: 'お気に入りのモデルはまだありません',
  addFavorite: 'お気に入りに追加',
  removeFavorite: 'お気に入りから削除',
  verdict: {
    available: '利用可能',
    unusable: '利用不可',
    'no permission': '権限なし',
    'credentials rejected': '認証情報が無効',
    'out of credits': 'クレジット不足',
    'rate limited': 'レート制限',
    unknown: '不明',
  },
}

/**
 * Resolve a dictionary from a locale id.
 *
 * @param localeId - the active locale, e.g. `zh-CN` or `en-US`.
 * @returns the matching dictionary, English when the language is unknown.
 */
function dictionaryFor(localeId) {
  const id = String(localeId ?? '').toLowerCase()
  if (id.startsWith('ja')) return DICT.ja
  return DICT[id.startsWith('zh') ? 'zh-CN' : 'en']
}

//# module: src/ui/T3ModelPicker.js
/**
 * T3-inspired model picker.
 *
 * The layout is a two-column popover: models and favorites on the left,
 * reasoning effort for the active model on the right. It deliberately reuses
 * the shipped session directory (`modelDirectories`) through the same props the
 * upstream picker receives, so `/model` and the composer stay in sync.
 */





const T3_CSS = `
.t3mp-root { position: relative; display: inline-flex; min-width: 0; }
.t3mp-trigger { display: inline-flex; align-items: center; gap: 6px; min-width: 0; max-width: 200px;
  padding: 4px 8px; border: 0; border-radius: 6px; background: transparent;
  color: var(--dsw-alias-label-primary); font: inherit; font-size: 12.5px; cursor: pointer; }
.t3mp-trigger:hover { background: var(--dsw-alias-interactive-bg-hover); }
.t3mp-trigger:disabled { opacity: .55; cursor: default; }
.t3mp-trigger-icon, .t3mp-row-icon { display: inline-flex; align-items: center; justify-content: center;
  flex: none; width: 18px; height: 18px; border-radius: 5px;
  background: transparent; color: var(--dsw-alias-label-secondary);
  font-size: 11px; font-weight: 600; }
.t3mp-trigger-text { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.t3mp-trigger-chevron { display: inline-flex; flex: none; opacity: .65; }
.dmp-chevron { transition: transform .15s; }
.dmp-chevron-open { transform: rotate(180deg); }
.t3mp-logo { display: block; width: 20px; height: 20px; flex: none; }
.t3mp-logo-fallback { display: inline-flex; align-items: center; justify-content: center;
  width: 20px; height: 20px; font-size: 11px; font-weight: 600; }
.t3mp-rail-btn .t3mp-logo, .t3mp-rail-btn .t3mp-logo-fallback { width: 22px; height: 22px; }
.t3mp-row-icon .t3mp-logo, .t3mp-row-icon .t3mp-logo-fallback { width: 18px; height: 18px; }
.t3mp-trigger-icon .t3mp-logo, .t3mp-trigger-icon .t3mp-logo-fallback { width: 18px; height: 18px; }
.t3mp-panel { position: absolute; bottom: calc(100% + 8px); z-index: 1100;
  width: 420px; height: 320px; max-width: calc(100vw - 20px);
  border: 1px solid var(--dsw-alias-border-l2); border-radius: 10px;
  background: var(--dsw-alias-bg-layer-1);
  box-shadow: var(--dsw-elevation-panel, var(--dsw-shadow-lv2));
  color: var(--dsw-alias-label-primary); overflow: hidden; }
.t3mp-columns { display: grid; grid-template-columns: 40px minmax(0, 1.15fr) minmax(150px, .85fr);
  height: 100%; min-height: 0; }
.t3mp-rail { display: flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 7px 3px; border-right: 1px solid var(--dsw-alias-border-l1);
  overflow-y: auto; }
.t3mp-rail-btn { flex: none; display: inline-flex; align-items: center; justify-content: center;
  width: 30px; height: 30px; padding: 0; border: 1px solid transparent; border-radius: 6px;
  background: transparent; color: var(--dsw-alias-label-secondary);
  font: inherit; font-size: 22px; font-weight: 500; line-height: 1; cursor: pointer; }
.t3mp-rail-btn:hover { background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary); }
.t3mp-rail-btn-active { border-color: var(--dsw-alias-border-l2);
  background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.t3mp-rail-sep { flex: none; width: 16px; height: 1px; margin: 2px 0;
  background: var(--dsw-alias-border-l1); }
.t3mp-left { display: flex; flex-direction: column; min-width: 0; min-height: 0;
  border-right: 1px solid var(--dsw-alias-border-l1); }
.t3mp-top { display: flex; align-items: center; gap: 6px; padding: 8px 10px 4px; }
.t3mp-fav-toggle { flex: none; width: 28px; height: 28px; padding: 0;
  border: 1px solid var(--dsw-alias-border-l2); border-radius: 6px;
  background: transparent; color: var(--dsw-alias-label-secondary);
  font: inherit; font-size: 15px; line-height: 1; cursor: pointer; }
.t3mp-fav-toggle:hover { background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary); }
.t3mp-fav-toggle-active { color: var(--dsw-alias-state-warn-primary);
  border-color: var(--dsw-alias-state-warn-primary); }
.t3mp-search { flex: 1 1 auto; min-width: 0; box-sizing: border-box; padding: 5px 7px;
  font: inherit; font-size: 12.5px; color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-bg-layer-1); border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px; outline: none; }
.t3mp-search:focus-visible { border-color: var(--dsw-alias-brand-primary); }
.t3mp-list { min-height: 0; overflow: auto; padding: 4px 8px 8px; }
.t3mp-row { display: flex; align-items: center; gap: 7px; min-height: 34px;
  padding: 5px 7px; border-radius: 6px; cursor: pointer; font-size: 12.5px;
  color: var(--dsw-alias-label-primary); outline: none; }
.t3mp-row:hover, .t3mp-row:focus-visible { background: var(--dsw-alias-interactive-bg-hover); }
.t3mp-row-current { color: var(--dsw-static-deepseek-450, var(--dsw-alias-brand-primary));
  font-weight: 600; }
.t3mp-row-name { flex: 1 1 auto; min-width: 0; overflow: hidden;
  text-overflow: ellipsis; white-space: nowrap; }
.t3mp-check { flex: none; color: var(--dsw-alias-brand-primary); font-weight: 700; }
.t3mp-star { flex: none; width: 18px; text-align: center; font-size: 15px;
  color: var(--dsw-alias-label-secondary); opacity: .5; cursor: pointer; }
.t3mp-star-active { color: var(--dsw-alias-state-warn-primary); opacity: 1; }
.t3mp-star:focus-visible { outline: 2px solid var(--dsw-alias-border-l2);
  outline-offset: 1px; border-radius: 3px; }
.t3mp-empty { padding: 18px 8px; text-align: center; color: var(--dsw-alias-label-secondary);
  font-size: 12px; }
.t3mp-right { display: flex; flex-direction: column; min-width: 0; gap: 8px;
  padding: 12px; overflow: auto; }
.t3mp-right-title { color: var(--dsw-alias-label-secondary); font-size: 11px;
  font-weight: 600; letter-spacing: .04em; text-transform: uppercase; }
.t3mp-right-model { font-size: 13px; font-weight: 600; overflow: hidden;
  text-overflow: ellipsis; white-space: nowrap; }
.t3mp-efforts { display: flex; flex-direction: column; gap: 3px; }
.t3mp-effort { display: flex; align-items: center; justify-content: space-between; gap: 8px;
  min-height: 32px; padding: 5px 8px; border: 1px solid transparent; border-radius: 6px;
  background: transparent; color: var(--dsw-alias-label-primary); font: inherit;
  font-size: 12.5px; text-align: left; cursor: pointer; }
.t3mp-effort:hover { background: var(--dsw-alias-interactive-bg-hover); }
.t3mp-effort-active { border-color: var(--dsw-alias-brand-primary);
  color: var(--dsw-alias-brand-primary); font-weight: 600; }
.t3mp-note { color: var(--dsw-alias-label-secondary); font-size: 12px; line-height: 1.5; }
.t3mp-hint { margin-top: auto; color: var(--dsw-alias-label-secondary);
  font-size: 11px; line-height: 1.5; }
.t3mp-error { color: var(--dsw-alias-state-error-primary); font-size: 11px;
  overflow-wrap: anywhere; }
`

const FAVORITES_KEY = 'dsh-model-picker.favorites'

function favoriteKeyOf(providerId, modelId) {
  return `${providerId}:${modelId}`
}

function readFavorites() {
  try {
    if (typeof localStorage === 'undefined') return []
    const raw = localStorage.getItem(FAVORITES_KEY)
    if (raw === null) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed)
      ? parsed.filter((id) => typeof id === 'string').slice(0, 512)
      : []
  } catch {
    return []
  }
}

function writeFavorites(ids) {
  try {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids))
  } catch {
    // Persistence is a convenience.
  }
}

/** A small, dependency-free provider mark for the row and trigger. */
function providerGlyph(group) {
  const text = `${group?.id ?? ''} ${group?.name ?? ''}`.toLowerCase()
  if (text.includes('grok') || text.includes('xai')) return '𝕏'
  if (text.includes('gemini') || text.includes('antigravity') || text.includes('google')) return '✦'
  if (text.includes('deepseek')) return 'D'
  if (text.includes('qoder')) return 'Q'
  if (text.includes('codex') || text.includes('openai')) return '◎'
  if (text.includes('claude') || text.includes('anthropic')) return 'A'
  if (text.includes('copilot')) return 'C'
  return String(group?.name ?? '?').trim().slice(0, 1).toUpperCase()
}

function modelNameOf(model) {
  return model?.name ?? model?.label ?? model?.id ?? 'Model'
}

function createT3ModelPicker(React) {
  const h = React.createElement
  const ProviderLogo = createProviderLogo(React)
  const { useCallback, useEffect, useMemo, useRef, useState } = React

  const useSnapshot = (source) => {
    const [value, setValue] = useState(() => source?.getSnapshot?.())
    useEffect(() => {
      if (source === undefined || source === null) return undefined
      const update = () => setValue(source.getSnapshot())
      update()
      return source.subscribe(update)
    }, [source])
    return value
  }

  return function T3ModelPicker(props) {
    const { available, directory, load, select: submit, locked, localeSource, localeId } = props
    const localeState = useSnapshot(localeSource)
    const activeLocale = typeof localeState?.active === 'string' && localeState.active.length > 0
      ? localeState.active
      : typeof localeId === 'string' ? localeId : 'en'
    const t = dictionaryFor(activeLocale)
    const state = useSnapshot(directory) ?? {}
    const groups = Array.isArray(state.groups) ? state.groups : []
    const current = state.current ?? null
    const pending = state.pending ?? null
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [favorites, setFavorites] = useState(readFavorites)
    const [favoritesOnly, setFavoritesOnly] = useState(false)
    const [providerFilter, setProviderFilter] = useState(null)
    const [failure, setFailure] = useState(null)
    const rootRef = useRef(null)

    useEffect(() => {
      if (typeof load === 'function') load()
    }, [load])

    useEffect(() => {
      if (!open) return undefined
      const onPointer = (event) => {
        if (rootRef.current !== null && !rootRef.current.contains(event.target)) setOpen(false)
      }
      window.addEventListener('pointerdown', onPointer)
      return () => window.removeEventListener('pointerdown', onPointer)
    }, [open])

    const currentGroup = useMemo(
      () => groups.find((group) => group.id === current?.provider) ?? null,
      [groups, current?.provider],
    )
    const currentModel = useMemo(
      () => currentGroup?.models?.find((model) => model.id === current?.model) ?? null,
      [currentGroup, current?.model],
    )
    const currentName = currentModel === null ? t.chooseModel : modelNameOf(currentModel)
    const efforts = Array.isArray(currentModel?.reasoning?.efforts) ? currentModel.reasoning.efforts : []
    const declaredEffort = current?.reasoningEffort
    const activeEffortId = efforts.some((effort) => effort.id === declaredEffort)
      ? declaredEffort
      : efforts.some((effort) => effort.id === currentModel?.reasoning?.defaultEffort)
        ? currentModel.reasoning.defaultEffort
        : efforts[0]?.id

    const rows = useMemo(() => groups.flatMap((group) => (Array.isArray(group.models) ? group.models : [])
      .map((model) => ({ group, model }))), [groups])

    const filteredRows = useMemo(() => {
      const text = query.trim()
      let list = text.length > 0
        ? rankByName(rows.map((row) => ({
          ...row,
          name: modelNameOf(row.model),
          label: String(row.model?.id ?? ''),
        })), text)
        : [...rows].sort((left, right) => modelNameOf(left.model).localeCompare(modelNameOf(right.model), undefined, {
          numeric: true,
          sensitivity: 'base',
        }))
      if (providerFilter !== null) {
        list = list.filter((row) => row.group.id === providerFilter)
      }
      if (favoritesOnly) {
        list = list.filter((row) => favorites.includes(favoriteKeyOf(row.group.id, row.model.id)))
      }
      return list
    }, [rows, query, favoritesOnly, favorites, providerFilter])

    const toggleFavorites = () => {
      setFavoritesOnly((value) => !value)
      setProviderFilter(null)
    }

    const chooseProvider = (providerId) => {
      setProviderFilter((current) => current === providerId ? null : providerId)
      setFavoritesOnly(false)
    }

    const toggleFavorite = useCallback((group, model) => {
      const key = favoriteKeyOf(group.id, model.id)
      setFavorites((currentFavorites) => {
        const next = currentFavorites.includes(key)
          ? currentFavorites.filter((entry) => entry !== key)
          : [...currentFavorites, key]
        writeFavorites(next)
        return next
      })
    }, [])

    const chooseModel = useCallback(async (group, model) => {
      if (typeof submit !== 'function') return
      setFailure(null)
      const effort = model?.reasoning?.defaultEffort
      try {
        const result = await submit({
          provider: group.id,
          model: model.id,
          ...effort === undefined ? {} : { reasoningEffort: effort },
        })
        if (result?.ok === false) setFailure(result.error?.message ?? t.switchFailed)
      } catch (error) {
        setFailure(error?.message ?? t.switchFailed)
      }
    }, [submit, t.switchFailed])

    const chooseEffort = useCallback(async (effortId) => {
      if (currentGroup === null || currentModel === null || typeof submit !== 'function') return
      setFailure(null)
      try {
        const result = await submit({
          provider: currentGroup.id,
          model: currentModel.id,
          reasoningEffort: effortId,
        })
        if (result?.ok === false) setFailure(result.error?.message ?? t.switchFailed)
      } catch (error) {
        setFailure(error?.message ?? t.switchFailed)
      }
    }, [currentGroup, currentModel, submit, t.switchFailed])

    useEffect(() => {
      if (!open) return undefined
      const onKey = (event) => {
        if (event.key === 'Escape') setOpen(false)
      }
      window.addEventListener('keydown', onKey)
      return () => window.removeEventListener('keydown', onKey)
    }, [open])

    const anchor = createAnchoredPanel(React, {
      open,
      fallbackWidth: 420,
      deps: [groups.length, filteredRows.length],
    })

    if (available === false) return null

    const trigger = h('button', {
      type: 'button',
      ref: anchor.ref,
      className: `t3mp-trigger${pending !== null ? ' t3mp-trigger-pending' : ''}`,
      disabled: locked === true,
      title: t.trigger(currentName),
      'aria-haspopup': 'dialog',
      'aria-expanded': open,
      onClick: () => {
        setFailure(null)
        setQuery('')
        setOpen((value) => !value)
      },
    },
      h('span', { className: 't3mp-trigger-icon' }, h(ProviderLogo, { group: currentGroup, model: currentModel })),
      h('span', { className: 't3mp-trigger-text' }, currentName),
      h('span', { className: 't3mp-trigger-chevron' }, h(Chevron, { h, open })))

    const renderRow = (row, index) => {
      const key = favoriteKeyOf(row.group.id, row.model.id)
      const isCurrent = current !== null
        && current.provider === row.group.id && current.model === row.model.id
      const favorite = favorites.includes(key)
      return h('div', {
        key,
        className: `t3mp-row${isCurrent ? ' t3mp-row-current' : ''}`,
        role: 'option',
        'aria-selected': isCurrent,
        tabIndex: 0,
        onClick: () => void chooseModel(row.group, row.model),
        onKeyDown: (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            void chooseModel(row.group, row.model)
          }
        },
      },
        h('span', { className: 't3mp-row-icon' }, h(ProviderLogo, { group: row.group, model: row.model })),
        h('span', { className: 't3mp-row-name' }, modelNameOf(row.model)),
        isCurrent ? h('span', { className: 't3mp-check' }, '✓') : null,
        h('span', {
          className: `t3mp-star${favorite ? ' t3mp-star-active' : ''}`,
          role: 'button',
          tabIndex: 0,
          title: favorite ? t.removeFavorite : t.addFavorite,
          'aria-label': favorite ? t.removeFavorite : t.addFavorite,
          'aria-pressed': favorite,
          onClick: (event) => {
            event.stopPropagation()
            toggleFavorite(row.group, row.model)
          },
          onKeyDown: (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return
            event.preventDefault()
            event.stopPropagation()
            toggleFavorite(row.group, row.model)
          },
        }, favorite ? '★' : '☆'))
    }

    const renderEffort = (effort) => {
      const active = effort.id === activeEffortId
      return h('button', {
        key: effort.id,
        type: 'button',
        className: `t3mp-effort${active ? ' t3mp-effort-active' : ''}`,
        'aria-pressed': active,
        onClick: () => void chooseEffort(effort.id),
      }, effort.name ?? effort.id, active ? h('span', { className: 't3mp-check' }, '✓') : null)
    }

    const panel = open
      ? h('div', {
        className: 't3mp-panel',
        role: 'dialog',
        'aria-label': t.trigger(currentName),
        ref: anchor.panelRef,
        style: anchor.style,
      },
        h('div', { className: 't3mp-columns' },
          h('div', { className: 't3mp-rail' },
            h('button', {
              type: 'button',
              className: `t3mp-rail-btn${favoritesOnly ? ' t3mp-rail-btn-active' : ''}`,
              title: t.favoritesOnly,
              'aria-label': t.favoritesOnly,
              'aria-pressed': favoritesOnly,
              onClick: toggleFavorites,
            }, '★'),
            h('div', { className: 't3mp-rail-sep' }),
            h('button', {
              type: 'button',
              className: `t3mp-rail-btn${providerFilter === null && !favoritesOnly ? ' t3mp-rail-btn-active' : ''}`,
              title: t.allProviders,
              'aria-label': t.allProviders,
              onClick: () => {
                setProviderFilter(null)
                setFavoritesOnly(false)
              },
            }, '≡'),
            groups.map((group) => h('button', {
              key: group.id,
              type: 'button',
              className: `t3mp-rail-btn${providerFilter === group.id ? ' t3mp-rail-btn-active' : ''}`,
              title: group.name ?? group.id,
              'aria-label': group.name ?? group.id,
              'aria-pressed': providerFilter === group.id,
              onClick: () => chooseProvider(group.id),
            }, h(ProviderLogo, { group })))),
          h('div', { className: 't3mp-left' },
            h('div', { className: 't3mp-top' },
              h('input', {
                className: 't3mp-search',
                type: 'search',
                value: query,
                placeholder: t.placeholder,
                'aria-label': t.placeholder,
                autoFocus: true,
                onChange: (event) => setQuery(event.target.value),
              })),
            h('div', { className: 't3mp-list' },
              filteredRows.length === 0
                ? h('div', { className: 't3mp-empty' }, favoritesOnly ? t.favoritesEmpty : t.empty)
                : filteredRows.map(renderRow))),
          h('div', { className: 't3mp-right' },
            h('div', { className: 't3mp-right-title' }, t.effortHeading),
            h('div', { className: 't3mp-right-model' }, currentName),
            efforts.length === 0
              ? h('div', { className: 't3mp-note' }, t.noEfforts)
              : h('div', { className: 't3mp-efforts' }, efforts.map(renderEffort)),
            h('div', { className: 't3mp-hint' }, t.effortHint),
            failure === null ? null : h('div', { className: 't3mp-error' }, failure))))
      : null

    return h('div', { className: 't3mp-root', ref: rootRef }, h('style', null, T3_CSS), trigger, panel)
  }
}

//# module: src/client.js
/**
 * Client entry: the module-loader registration and the plugin object.
 *
 * This plugin replaces ONLY the composer's model-selection UI. Everything behind
 * it — the per-session directory, the catalogue cache, the invalidation events,
 * the selection RPC — is the shipped `ui-model-selection` implementation, reached
 * through its `modelDirectories` service.
 *
 * That split works because the shipped plugin keeps its slot registration and its
 * component apart: the registration's `inject` hands the component a plain props
 * bundle (`available`, a `directory` store, `load`, `select`), and the component
 * may render however it likes. This entry registers the same slot with the same
 * `inject` contract and substitutes its own component.
 *
 * Why not copy the shipped bundle instead: a copy registers a second
 * `ModelDirectoryResolver` under the same service name, the two fight over it,
 * and the shipped plugin parks in `loading` — which fails the whole renderer
 * boot. Reusing the service avoids that, and keeps tracking upstream fixes.
 */

const PLUGIN = 'dsh-model-picker'
const SLOT = 'conversation.input.model'
/** The service the shipped picker exposes for per-session model directories. */
const MODEL_DIRECTORIES = 'modelDirectories'
/**
 * A provider plugin's published per-model state, if that plugin is installed.
 *
 * Not a dependency: it is read through `scope.get()` and every consumer tolerates
 * `undefined`. The name is scoped by its package so two plugins can never fight
 * over a bare `state`.
 */
const PROVIDER_STATE = '@huai_xin/dsh-workbuddy/state'
/**
 * Wrap a possibly-late service in the `{ getSnapshot, subscribe }` pair the
 * component expects.
 *
 * The lookup is deferred to call time rather than captured once: provider plugins
 * are separate bundles, and load order is not something this plugin may assume.
 * When the service is absent both members degrade to "no data" instead of
 * throwing, which is what keeps the decoration optional.
 *
 * @param scope - the ctx that owns the registration.
 * @param name - the service name to resolve on each call.
 * @returns an observable the component can subscribe to.
 */
function createProviderStateSource(scope, name) {
  /**
   * The last non-empty snapshot seen.
   *
   * `getSnapshot` is asked again on every render, and the service answers with an
   * empty map until its own (asynchronous, several-round-trip) load settles — on a
   * fresh page that is a visible second of undecorated rows. Keeping the last real
   * answer means a list opened a second time paints complete immediately, and the
   * refresh that follows only updates numbers in place.
   */
  let cached
  const resolve = () => {
    try {
      return scope.get(name)
    } catch {
      return undefined
    }
  }
  const read = () => {
    const snapshot = resolve()?.getSnapshot?.()
    if (snapshot === null || snapshot === undefined) return cached
    const providers = snapshot.providers
    if (providers !== null && providers !== undefined && Object.keys(providers).length > 0) {
      cached = snapshot
      return snapshot
    }
    // Empty is "not loaded yet" rather than "everything logged out": a real
    // signed-out deployment still appears, with loggedIn false.
    return cached ?? snapshot
  }
  return {
    getSnapshot: read,
    subscribe: (listener) => resolve()?.subscribe?.(listener) ?? (() => {}),
    // Side actions the provider publishes for a selector to offer: re-read a
    // balance, start a sign-in. Both degrade to a resolved promise when the
    // plugin is absent, so a caller never has to branch on its presence.
    refresh: () => resolve()?.refresh?.() ?? Promise.resolve(),
    renew: (region) => resolve()?.renew?.(region) ?? Promise.resolve(),
    refreshCredits: (region) => resolve()?.refreshCredits?.(region) ?? Promise.resolve(),
    login: (region) => resolve()?.login?.(region) ?? Promise.resolve()
  }
}
/**
 * BELOW the shipped occupant's `priority: 0`.
 *
 * For a `single` slot the LOWEST priority renders — the registry says so in its
 * own error text ("register at a different priority to shadow it (lowest
 * renders)"). A larger number would lose to the shipped picker instead of
 * shadowing it.
 */
const SHADOW_PRIORITY = -1

/**
 * Load-stage report.
 *
 * The packaged desktop app has no devtools, so a client half that fails to
 * register is indistinguishable from one that never loaded. Each stage is posted
 * to the Host half, which logs it beside its own line: the pair tells the two
 * cases apart immediately.
 *
 * @param stage - a short description of the load stage reached.
 */
let reportCount = 0
const report = (stage) => {
  if (reportCount >= 20) return
  reportCount += 1
  stage = String(stage ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').slice(0, 200)
  try {
    console.error(`[model-picker] ${stage}`)
  } catch {
    // no console in some hosts
  }
  try {
    void fetch('/model-picker/client-log', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ stage }),
      keepalive: true
    }).catch(() => {})
  } catch {
    // diagnostics must never break the picker
  }
}

/**
 * The failure worth capturing happens *outside* apply: the client composition
 * builds this plugin object, then never applies it, and whatever it threw on the
 * way is only visible in the page.
 *
 * @param value - the thrown value, in any shape.
 * @returns a short description safe to log.
 */
const describe = (value) => {
  if (value instanceof Error) return `${value.name}: ${value.message}`
  try {
    return typeof value === 'string' ? value : JSON.stringify(value)
  } catch {
    return String(value)
  }
}

const isBundleError = (value) => {
  const text = [
    value?.filename,
    value?.error?.stack,
    value?.reason?.stack,
    value?.error?.message,
    value?.reason?.message,
  ].filter((part) => typeof part === 'string').join('\n')
  return text.includes('dsh-model-picker') || text.includes('model-picker')
}

report('client.js 已执行，开始注册 factory')

try {
  window.addEventListener('error', (event) => {
    if (!isBundleError(event)) return
    report(`页面 error：${describe(event?.error ?? event?.message)}`)
  })
  window.addEventListener('unhandledrejection', (event) => {
    if (!isBundleError(event)) return
    report(`页面 unhandledrejection：${describe(event?.reason)}`)
  })
} catch {
  // a missing window hook must never stop the plugin from registering
}

window.__ModuleLoader__.load({
  id: '@fizor-drm/dsh-model-picker',
  factory(require) {
    report('factory 已运行，正在装配插件对象')
    const React = require('react')
    const ModelPicker = createT3ModelPicker(React)

    return {
      name: PLUGIN,
      /**
       * The services this half reads, PLUS the ones the shipped directory service
       * reads on its own behalf.
       *
       * `remote` and `remote.session` look unused here — this file never mentions
       * them — but `models.directoryFor(sessionId)` calls into the shipped
       * resolver, and that call runs in THIS entry's fiber. Cordis only exposes a
       * service to a fiber that declares it, so dropping them makes every
       * `directoryFor` throw
       *
       *   cannot get property "remote.session" without inject
       *
       * from inside `inject`. The renderer catches that, retires the entry and
       * silently paints the shipped picker — the plugin "just disappears".
       * Declaring what the callee needs is part of calling it, so they stay.
       */
      inject: ['locale', 'sessions', 'slots', 'remote', 'remote.session'],
      apply(ctx) {
        report(`apply 已调用（slots=${ctx.get('slots') === undefined ? '尚未就绪' : '就绪'}）`)

        /**
         * Register the seat through the shipped directory service.
         *
         * `ctx.inject` runs this callback once the named services are visible, so
         * the registration lands at the same point the shipped one would. It is
         * also re-run if a service goes away and returns, which is what keeps the
         * seat from binding to `undefined` across a reconnect.
         */
        // `remote` / `remote.session` are declared here as well as on the plugin:
        // this callback runs in the fiber that `ctx.inject` creates, and the
        // directory resolver uses those two services through that context.
        ctx.inject(['slots', MODEL_DIRECTORIES, 'remote', 'remote.session'], (scope) => {
          const slots = scope.get('slots')
          const sessions = scope.get('sessions')
          /**
           * The locale SERVICE, handed to the component as an observable source.
           *
           * Its snapshot is `{ active, locales, revision }` — NOT `{ locale }`.
           * Reading the wrong field made every UI string fall back to Chinese no
           * matter which language the shell was set to.
           *
           * It is passed through as a `{ getSnapshot, subscribe }` pair rather
           * than resolved to a string here: `inject` is cached per session
           * binding, so a string captured now would never follow a language
           * switch made while the composer is on screen.
           */
          const locale = scope.get('locale')
          const localeSource = locale !== undefined &&
            typeof locale.getSnapshot === 'function' &&
            typeof locale.subscribe === 'function'
            ? locale
            : undefined
          const initialLocale = localeSource?.getSnapshot?.()?.active
          const localeId = typeof initialLocale === 'string' && initialLocale.length > 0
            ? initialLocale
            : 'zh-CN'

          if (slots === undefined) {
            report('槽位未注册：slots 缺失')
            return
          }

          /**
           * Register the seat.
           *
           * Two details matter:
           *
           *  - NO `children` table. The child slot `conversation.input.model.label`
           *    is declared by the shipped occupant, and a child declaration is
           *    EXCLUSIVE per slot key: `slots.register` throws
           *    `slot "…label" is already declared (by …)` the moment a second entry
           *    offers the same child. The throw escapes the slot callback and the
           *    picker stops rendering. Disposing first does not help either — the
           *    declaration belongs to the shipped entry, which never disposes.
           *
           *  - The service lookup happens INSIDE the callback. `models` may not be
           *    visible yet when `apply` runs; reading it here means the registration
           *    waits for it instead of binding to undefined.
           *
           * The cost of dropping the child declaration is that provider badges
           * mounted at `conversation.input.model.label` no longer render here. That
           * is the same trade the reference plugin makes, and it is what makes the
           * registration survive.
           */
          let disposeCurrent = null
          slots.inject(SLOT, () => {
            const models = scope.get(MODEL_DIRECTORIES)
            if (models === undefined) {
              report('modelDirectories 缺失，暂不注册')
              return () => {}
            }
            // The callback can fire more than once (a service re-appearing re-runs
            // it). Registering twice at the same priority throws
            // `single slot "…" already has a registration`, so the previous one is
            // released first. Without a children table this is safe — the child
            // declaration is what cannot be released.
            if (disposeCurrent !== null) {
              try {
                disposeCurrent()
              } catch {
                // Already gone.
              }
              disposeCurrent = null
            }
            report('槽位回调已运行，准备注册 occupant')
            disposeCurrent = slots.register({
              name: SLOT,
              priority: SHADOW_PRIORITY,
              inject: (sessionId) => {
                const directory = models.directoryFor(sessionId)
                const available = typeof sessions?.subagentAddress === 'function'
                  ? sessions.subagentAddress(sessionId) === undefined
                  : true
                return {
                  localeId,
                  localeSource,
                  available,
                  // Optional provider-published state (login, credits, per-model
                  // availability/busy/rate). Late-bound: the providing bundle may
                  // apply before or after this one, and it must never be listed in
                  // `inject` — a service that never appears would then keep this
                  // seat from registering at all. Absent ⇒ rows render as plain
                  // text, which is the supported fallback.
                  modelStateSource: createProviderStateSource(scope, PROVIDER_STATE),
                  // The shipped registration hands over the STORE, not the
                  // controller; the component subscribes to it directly.
                  directory: directory.store,
                  load: () => {
                    if (available) directory.load().catch(() => {})
                  },
                  /**
                   * Submit one triple.
                   *
                   * The RESULT IS PASSED THROUGH UNCHANGED. `ModelDirectory.select`
                   * resolves to `{ ok: true, value }` or `{ ok: false, error }`,
                   * and the component — like the shipped one — reads `ok` to
                   * decide whether to close the panel and which failure to show.
                   * Mapping it to a boolean here made every successful pick look
                   * like a failure: the model switched but the list stayed open,
                   * and a settled effort level dropped its optimistic draft.
                   */
                  select: (selection) => available
                    ? directory.select(selection)
                    : Promise.resolve(undefined)
                }
              }
            }, ModelPicker)
            return () => {
              if (disposeCurrent !== null) {
                try { disposeCurrent() } catch { /* already gone */ }
                disposeCurrent = null
              }
            }
          })
        })
      }
    }
  }
})
})()
