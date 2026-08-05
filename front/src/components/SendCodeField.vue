<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { getErrMsg } from '@/utils/error'
const props = defineProps<{
  email: string
  code: string
  sendCodeFn: (email: string) => Promise<any>
}>()

const emit = defineEmits<{
  'update:email': [value: string]
  'update:code': [value: string]
}>()

const sending = ref(false)
const countdown = ref(0)
const errorMsg = ref('')
const successMsg = ref('')
let timer: ReturnType<typeof setInterval> | null = null

const countdownText = computed(() => {
  if (sending.value) return '发送中...'
  if (countdown.value > 0) return `${countdown.value}s 后重发`
  return '发送验证码'
})

watch(() => props.email, () => {
  errorMsg.value = ''
  successMsg.value = ''
  emit('update:code', '')
  if (timer) { clearInterval(timer); timer = null }
  countdown.value = 0
})

const handleSend = async () => {
  if (!props.email || countdown.value > 0 || sending.value) return
  errorMsg.value = ''
  successMsg.value = ''
  sending.value = true
  try {
    await props.sendCodeFn(props.email)
    successMsg.value = '验证码已发送，请查收邮件'
    countdown.value = 60
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer!)
        timer = null
      }
    }, 1000)
  } catch (err: any) {
    errorMsg.value = getErrMsg(err, '发送失败')
  } finally {
    sending.value = false
  }
}

const onCodeInput = (val: string) => emit('update:code', val.replace(/\D/g, '').slice(0, 6))

onUnmounted(() => { if (timer) clearInterval(timer) })
</script>

<template>
  <div class="send-code-field">
    <div class="email-row">
      <el-input
        :model-value="email"
        placeholder="请输入邮箱"
        clearable
        @update:model-value="emit('update:email', $event)"
        @keyup.enter="handleSend"
      />
      <el-button
        type="primary"
        :disabled="!email || countdown > 0"
        :loading="sending"
        class="send-btn"
        @click="handleSend"
      >{{ countdownText }}</el-button>
    </div>
    <el-alert v-if="successMsg" :title="successMsg" type="success" show-icon :closable="false" class="alert" />
    <el-alert v-if="errorMsg" :title="errorMsg" type="error" show-icon :closable="false" class="alert" />
    <el-input
      :model-value="code"
      placeholder="请输入6位验证码"
      maxlength="6"
      @update:model-value="onCodeInput"
    />
  </div>
</template>

<style scoped>
.send-code-field { display: flex; flex-direction: column; gap: 10px; }
.email-row { display: flex; gap: 8px; }
.email-row .el-input { flex: 1; }
.send-btn { flex-shrink: 0; white-space: nowrap; }
.alert { margin: 0; }
</style>
