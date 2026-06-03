import './style.css'
import { configs, type AppConfig, type AppKey, type Environment } from './data.ts'

const el = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Partial<Record<string, string>> = {},
  ...children: (Node | string)[]
): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag)
  for (const [k, v] of Object.entries(attrs)) {
    if (v !== undefined) node.setAttribute(k, v)
  }
  node.append(...children)
  return node
}

const a = (href: string, cls: string, ...children: (Node | string)[]) =>
  el('a', { href, class: cls, target: '_blank', rel: 'noopener noreferrer' }, ...children)

const icon = (name: string, style = '') =>
  el('i', { class: `ti ti-${name}`, ...(style ? { style } : {}) })

const APP_ICON: Record<AppKey, string> = {
  ppm: 'clipboard-list',
  scout: 'binoculars',
}

function copyBtn(value: string): HTMLButtonElement {
  const btn = el('button', { class: 'copy-btn', title: 'Copy' })
  btn.append(icon('copy', 'font-size:14px'))
  btn.addEventListener('click', () => {
    navigator.clipboard.writeText(value).then(() => {
      btn.classList.add('copied')
      btn.innerHTML = ''
      btn.append(icon('check', 'font-size:14px'))
      setTimeout(() => {
        btn.classList.remove('copied')
        btn.innerHTML = ''
        btn.append(icon('copy', 'font-size:14px'))
      }, 1500)
    })
  })
  return btn
}

function urlRow(label: string, url: string): HTMLElement {
  const display = url.replace(/^https?:\/\//, '').replace(/\/$/, '')
  const row = el('div', { class: 'row' })
  row.append(
    el('span', { class: 'row-label' }, label),
    a(url, 'url-link', display),
    copyBtn(url),
  )
  return row
}

function buildCard(cfg: AppConfig): HTMLElement {
  const card = el('div', { class: 'card' })

  // Header
  const head = el('div', { class: 'card-head' })
  const appIcon = el('div', { class: 'app-icon', 'data-key': cfg.key })
  appIcon.append(icon(APP_ICON[cfg.key]))
  const title = el('div', { class: 'card-title' })
  title.append(
    el('div', { class: 'card-name' }, cfg.name),
    el('div', { class: 'app-id' }, cfg.appId),
  )
  head.append(appIcon, title, a(cfg.doUrl, 'do-link', 'DO', icon('external-link', 'font-size:11px')))
  card.append(head)

  // URLs
  card.append(urlRow('Custom', cfg.customUrl))
  card.append(urlRow('Internal', cfg.internalUrl))

  // IP row
  const ipRow = el('div', { class: 'row' })
  const ipPills = el('div', { class: 'ip-pills' })
  for (const ip of cfg.ips) ipPills.append(el('span', { class: 'ip-pill' }, ip))
  ipRow.append(el('span', { class: 'row-label' }, 'IP'), ipPills)
  card.append(ipRow)

  // Branch row
  const branchRow = el('div', { class: 'row' })
  const chip = el('span', { class: 'branch-chip', title: cfg.branch })
  chip.append(icon('git-branch', 'font-size:11px'), cfg.branch)
  branchRow.append(el('span', { class: 'row-label' }, 'Branch'), chip)
  card.append(branchRow)

  return card
}

function buildSection(env: Environment): HTMLElement {
  const section = el('section', {})
  section.append(el('div', { class: 'env-label' }, env === 'dev' ? 'Dev' : 'Demo'))
  const grid = el('div', { class: 'cards' })
  for (const cfg of configs.filter(c => c.env === env)) grid.append(buildCard(cfg))
  section.append(grid)
  return section
}

document.body.append(
  el('header', {},
    el('span', { class: 'logo' }, 'palisaid'),
    el('span', { class: 'header-divider' }),
    el('span', {}, 'App Config'),
  ),
  el('main', {}, buildSection('dev'), buildSection('demo')),
)
