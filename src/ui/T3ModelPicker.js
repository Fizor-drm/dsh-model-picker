/**
 * T3-inspired model picker.
 *
 * The layout is a two-column popover: models and favorites on the left,
 * reasoning effort for the active model on the right. It deliberately reuses
 * the shipped session directory (`modelDirectories`) through the same props the
 * upstream picker receives, so `/model` and the composer stay in sync.
 */

import { rankByName } from '../core/rank.js'
import { Chevron } from './Chevron.js'
import { createProviderLogo } from './providerLogos.js'
import { createAnchoredPanel } from './anchor.js'
import { dictionaryFor } from './dict.js'

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
.t3mp-logo { display: block; width: 20px; height: 20px; flex: none; object-fit: contain; }
.t3mp-logo-mask { background-color: currentColor; -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat; -webkit-mask-position: center; mask-position: center; -webkit-mask-size: contain; mask-size: contain; }
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

export function createT3ModelPicker(React) {
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
