<template>
  <div class="vue-ace" :style="{
    width: calcWidth, 
    height: calcHeight
  }"></div>
</template>
<script>
  function makeParams () {
    return {
    // PARAM
      // : "line", line | text 边选择一行的时候是否右边没有文字的地方也高亮
      selectionStyle: {type: String, default: 'line'},
      // : true, 是否高亮当前行
      highlightActiveLine: {type: Boolean, default: true},
      // : false, 是否高亮选中的文字
      highlightSelectedWord: {type: Boolean, default: false},
      // : false, 是否只读
      readOnly: {type: Boolean, default: false},
      // : "ace",
      cursorStyle: {type: String, default: 'ace'},
      // : true,
      mergeUndoDeltas: {type: Boolean, default: true},
      // : true,
      behavioursEnabled: {type: Boolean, default: true},
      // : true,
      wrapBehavioursEnabled: {type: Boolean, default: true},
      // : false,是否自动滚动保持可见
      autoScrollEditorIntoView: {type: Boolean, default: false},
      // : false,是否始终显示水平滚动条
      hScrollBarAlwaysVisible: {type: Boolean, default: false},
      // : false,是否始终显示垂直滚动条
      vScrollBarAlwaysVisible: {type: Boolean, default: false},
      // : true,左边当前行是否也高亮
      highlightGutterLine: {type: Boolean, default: true},
      // : true,
      animatedScroll: {type: Boolean, default: true},
      // : false,是否显示不可见字符，如空格
      showInvisibles: {type: Boolean, default: false},
      // : false,是否显示打印线
      showPrintMargin: {type: Boolean, default: false},
      // : 80,默认打印线左边距
      printMarginColumn: {type: [Number, String], default: 80},
      // : 80,同上
      printMargin: {type: [Number, String], default: 80},
      // : false,是否自动隐藏折叠按钮
      fadeFoldWidgets: {type: Boolean, default: false},
      // : true,是否显示折叠按钮
      showFoldWidgets: {type: Boolean, default: true},
      // : true,是否显示行号
      showLineNumbers: {type: Boolean, default: true},
      // : true,是否显示左边
      showGutter: {type: Boolean, default: true},
      // : true,
      displayIndentGuides: {type: Boolean, default: true},
      // : "12px",默认字体
      fontSize: {type: String, default: '12px'},
      // : 1,
      scrollPastEnd: {type: [Number, String], default: 1},
      // : 如 "ace/theme/chrome",
      theme: {type: String, default: ''},
      // : 2,
      scrollSpeed: {type: [Number, String], default: 2},
      // : 0,
      dragDelay: {type: [Number, String], default: 0},
      // : true,
      dragEnabled: {type: Boolean, default: true},
      // : 0,
      focusTimout: {type: Number, default: 0},
      // : true,
      tooltipFollowsMouse: {type: Boolean, default: true},
      // : 1,
      firstLineNumber: {type: Number, default: 1},
      // : false,
      overwrite: {type: Boolean, default: false},
      // : "auto",
      newLineMode: {type: String, default: 'auto'},
      // : true,
      useWorker: {type: Boolean, default: true},
      // : true,软空格
      useSoftTabs: {type: Boolean, default: true},
      // : 4,空格大小
      tabSize: {type: Number, default: 4},
      // : "off", "free", number
      wrap: {type: [Number, String], default: 'off'},
      // : true,
      indentedSoftWrap: {type: Boolean, default: true},
      // : 如 "ace/mode/javascript",
      mode: {type: String, default: ''},
      // : true,
      enableMultiselect: {type: Boolean, default: true},
      // : true,
      enableBlockSelect: {type: Boolean, default: true},
      // : true,
      // spellcheck: {type: Boolean, default: true},
      // : true,
      // loadDroppedFile: {type: Boolean, default: true},
      // : false,
      // useElasticTabstops: {type: Boolean, default: false},
      // : false,
      // useIncrementalSearch: {type: Boolean, default: false},
      // : true,
      enableEmmet: {type: Boolean, default: true},
      // : true,
      // enableBasicAutocompletion: {type: Boolean, default: true},
      // : false,
      // enableLiveAutocompletion: {type: Boolean, default: false},
      // : true
      // enableSnippets: {type: Boolean, default: true}
    //! PARAM
    }
  }
  let params
  function makeProps () {
    let props = makeParams()
    params = Object.keys(props)
    let arr = [
      ['value', String, ''],
      ['width', [String, Number], '100%'],
      ['height', [String, Number], '100%'],
      ['placeholder', String, ''],
      ['delay', [Boolean, Number], false],
    ]
    arr.forEach(([key, type, def]) => {
      props[key] = {
        type,
        default: def
      }
    })
    return props
  }
  import ace from 'brace'
  import 'brace/ext/emmet'
  export default {
    props: makeProps(),
    watch: {
      value (newValue) {
        let value = this.$editor.getValue()
        if (value !== newValue) {
          this.$editor.setValue(newValue)
        }
      },
      placeholder: function (newValue) {
        if (this.$nodeHolder) {
          this.$nodeHolder.textContent = newValue
        }
      }
    },
    computed: {
      calcWidth () {
        if (parseFloat(this.width) === this.width) {
          return `${this.width}px`
        }
        return this.width
      },
      calcHeight() {
        if (parseFloat(this.height) === this.height) {
          return `${this.height}px`
        }
        return this.height
      }
    },
    methods: {
      updateEditor () {
        let editor = this.$editor
        // editor.$blockScrolling = Infinity
        let shouldShow = !editor.session.getValue().length
        let node = editor.renderer.emptyMessageNode
        if (!shouldShow && node) {
          editor.renderer.scroller.removeChild(node)
          editor.renderer.emptyMessageNode = null
          this.$nodeHolder = null
        } else if (shouldShow && !node) {
          node = editor.renderer.emptyMessageNode = document.createElement("div")
          node.textContent = this.placeholder || ''
          node.className = "ace_invisible ace_placeHolder"
          node.style.padding = "0 20px"
          this.$nodeHolder = node
          editor.renderer.scroller.appendChild(node)
        }
      }
    },
    mounted () {
      let editor = this.$editor = ace.edit(this.$el)
      editor.$blockScrolling = Infinity
      editor.on('change', () => {
        let value = editor.getValue()
        if (this.value !== value) {
          if (this.delay) {
            this.debounceUpdate(value)
          } else {
            this.$emit('input', value)
          }
          this.updateEditor()
        }
      })
      params.forEach(key => {
        this.$editor.setOption(key, this[key])
        this.$watch(key, (newValue) => {
          this.$editor.setOption(key, newValue)
        })
      })
      this.debounceUpdate = (() => {
        let timer = null
        let val = null
        return (value) => {
          val = value
          clearTimeout(timer)
          timer = setTimeout(() => {
            this.$emit('input', value)
          }, this.delay)
        }
      })()
      this.$editor.setValue(this.value)
      this.updateEditor()
    }
  }
</script>
