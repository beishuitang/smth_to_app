import version from '@/version'
export default {
  version: 0,
  host: location.host,
  base: location.origin,
  onMobile: true,
  PROJECT_NAME: 'smth_to_app',
  PROJECT_CONFIG_STORAGE_KEY: 'newsmth_script_config',
  cssConfig: {
    fontSize: 13
  },
  frameConfig: {
    component: [
      { el: '#top_head', name: '顶部', show: true },
      { el: '#bot_foot', name: '底部', show: false }
    ]
  },
  mainpageConfig: {
    section: [
      { el: '#slider', name: '图片轮播', show: true },
      { el: '#top10', name: '十大热门', show: true },
      { el: '.b_recommend', name: '精彩原创', show: false },
      { el: '#tg_slider', name: '水木团购', show: false },
      { el: '.b_sectop10', name: '十大副本', show: false },
      { el: '#hotspot', name: '近期热帖', show: false },
      { el: '#pictures', name: '精彩贴图', show: true },
      { el: '.b_section.block', name: '分区十大', show: true },
      { el: '#ranking .boards.rec_boards', name: '推荐版面', show: true },
      { el: '#ranking .boards.hot_boards', name: '人气排行', show: true },
      { el: '#ranking .boards.new_boards', name: '新开版面', show: true },
      { el: '.w_section .boards', name: '分区热版', show: false },
      { el: '#about', name: 'about', show: false },
      { el: '#legal', name: 'legal', show: false }
    ]
  },
  simplifyConfig: {
    simplify: true,
    func: [
      {
        el: '#body>.b-head>span.n-right',
        name: '分享到微博',
        show: false
      },
      {
        el: '.simple-article .a-head .a-func li samp.ico-pos-reply, .simple-article .a-head .a-func li samp.ico-pos-reply ~ a',
        name: '回复',
        show: true
      },
      {
        el: '.simple-article .a-head .a-func li samp.ico-pos-template, .simple-article .a-head .a-func li samp.ico-pos-template ~ a',
        name: '模版回复',
        show: false
      },
      {
        el: '.simple-article .a-head .a-func li samp.ico-pos-forward, .simple-article .a-head .a-func li samp.ico-pos-forward ~ a',
        name: '转寄/转载',
        show: false
      },
      {
        el: '.simple-article .a-head .a-func li samp.ico-pos-friend, .simple-article .a-head .a-func li samp.ico-pos-friend ~ a',
        name: '关注',
        show: false
      },
      {
        el: '.simple-article .a-head .a-func li samp.ico-pos-search, .simple-article .a-head .a-func li samp.ico-pos-search ~ a',
        name: '搜索',
        show: false
      },
      {
        el: '.simple-article .a-head .a-func li samp.ico-pos-user, .simple-article .a-head .a-func li samp.ico-pos-user ~ a',
        name: '只看此ID',
        show: false
      },
      {
        el: '.simple-article .a-head .a-func li samp.ico-pos-edit, .simple-article .a-head .a-func li samp.ico-pos-edit ~ a',
        name: '编辑',
        show: false
      },
      {
        el: '.simple-article .a-head .a-func li samp.ico-pos-del, .simple-article .a-head .a-func li samp.ico-pos-del ~ a',
        name: '删除',
        show: false
      },
      {
        el: '.simple-article .a-head .a-func li samp.ico-pos-recomend, .simple-article .a-head .a-func li samp.ico-pos-recomend ~ a',
        name: '推荐',
        show: false
      },
      {
        el: '.simple-article .a-head .a-func li samp.ico-pos-switch, .simple-article .a-head .a-func li samp.ico-pos-switch ~ a',
        name: '标记',
        show: true
      }
    ]
  },
  customTags: <customTags>{
    民科: { score: -1, use: true },
    喷子: { score: -1, use: true },
    阴阳怪气: { score: -1, use: true },
    专业: { score: 1, use: true }
  },

  saveConfig() {
    localStorage.setItem(this.PROJECT_CONFIG_STORAGE_KEY, JSON.stringify(this))
  },
  init() {
    const str = localStorage.getItem(this.PROJECT_CONFIG_STORAGE_KEY)
    const config = str ? JSON.parse(str) : {}
    if (config.version === version.version) Object.assign(this, config)
    else {
      this.version = version.version
      this.saveConfig()
    }
  }
}
type customTags = {
  [name: string]: {
    score: 1 | -1
    use: boolean
  }
}
