import test from 'ava'
import {expect} from 'chai'
import {shallow} from 'vue-test-utils'
import AceEditor from '../../src/AceEditor.vue'

test('simple', async (t) => {
  let {vm} = shallow(AceEditor, {
    propsData: { value: 's' }
  })
  setTimeout(() => {
    expect(vm.$editor.getValue()).to.eql(vm.value)
    vm.value = '23'
    expect(vm.value).to.eql('23')
    setTimeout(() => {
      expect(vm.$editor.getValue()).to.eql(vm.value)
    })
  })
  t.pass()
})
