const DIALOG = window.DIALOG
const Backbone = window.Backbone
const SYS = window.SYS
const BODY = window.BODY
const $ = window.$
const _ = window._
export default {
  fix: function () {
    DIALOG.ajaxDialog = function (repo, buttons) {
      this.set(repo)
      var _prevent_default = false,
        text = repo.ajax_msg,
        opt = {
          width: 400
        }
      buttons = _.reduce(
        repo.list || [],
        function (res, item) {
          res.push({
            text: item.text.substr(0, 25),
            click: function () {
              // BODY.open(item.url)
              Backbone.history.navigate('#!' + item.url.substring(1), {
                trigger: true,
                replace: true
              })
              _prevent_default = true
              $(this).dialog('close')
            }
          })
          return res
        },
        buttons || []
      )
      if (!_.isEmpty(buttons)) {
        text += ',' + SYS.code.COM_REDIRECT
        opt['buttons'] = buttons
      }
      if (repo['default']) {
        opt['close'] = function () {
          if (!_prevent_default) {
            _prevent_default = true
            // BODY.open(repo['default'])
            if (location.hash.split('/').some((s) => s === 'post'))
              history.back()
            else
              BODY.refresh()
          }
        }
        setTimeout(function () {
          !_prevent_default && DIALOG.getTop().dialog('close')
        }, SYS.redirect * 1000)
      }
      return this.alertDialog(text, this.ajaxOK() ? this.ICO_INFO : this.ICO_ALERT, opt)
    }
    window.BODY.jump = function (path, nocache) {
      var self = this,
        handler = function (repo) {
          repo = _.isString(repo) ? repo : repo.responseText
          if (repo.match(/^location:.*$/i)) {
            // window.location.hash = '!' + repo.replace(/^location:\/?/i, '');
            Backbone.history.navigate('#!' + repo.replace(/^location:\/?/i, ''), {
              trigger: true,
              replace: true
            })
          } else {
            self.set(
              {
                html: repo,
                path: path
              },
              {
                silent: true
              }
            )
            self.change()
            self.trigger('jumped')
          }
        }
      this.trigger('jump')
      var path_a
      if (path.match(/\?/)) {
        path_a = path.replace(/\?/, '?ajax&')
      } else if (path.match(/#/)) {
        path_a = path.replace(/#/, '?ajax#')
      } else {
        path_a = path + '?ajax'
      }
      $.get(
        path_a,
        typeof nocache !== 'undefined'
          ? {
            _t: $.random()
          }
          : {}
      )
        .success(handler)
        .error(handler)
    }
  }
}