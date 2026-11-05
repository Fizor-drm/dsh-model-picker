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
export const DICT = {
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
export function dictionaryFor(localeId) {
  const id = String(localeId ?? '').toLowerCase()
  if (id.startsWith('ja')) return DICT.ja
  return DICT[id.startsWith('zh') ? 'zh-CN' : 'en']
}
