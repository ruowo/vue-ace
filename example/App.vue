<template>
  <div id="app">
    <div class="container">
      <ace-editor :delay="delay" placeholder="ace editor" :height="height" v-model="text"></ace-editor>
    </div>
    <button @click = "height = 100">height=100</button>
    <button @click = "height = 200">height=200</button>
    <button @click = "height = '100%'">height=100%</button>
    <button @click = "delay = 500">delay=500</button>
    <button @click = "delay = 0">delay=0</button>
    <pre v-html="text"></pre>
  </div>
</template>
<script>
  import AceEditor from '../src/AceEditor.vue'
  export default {
    data () {
      return {
        text: '',
        height: 200,
        delay: 0
      }
    },
    components: {
      AceEditor
    },
    methods: {
    }
  }
</script>
<style lang="sass">
  .container 
    height: 250px
    border: 1px solid gray
</style>