import { Resend } from 'resend'
import { Cmail } from '../config/index'

let resend: Resend | null = null

const getResend = (): Resend => {
  if (resend) return resend
  if (!Cmail.apiKey) {
    throw new Error('RESEND_API_KEY 未配置')
  }
  resend = new Resend(Cmail.apiKey)
  return resend
}

// 发送邮箱验证码
export const sendCodeMail = async (to: string, code: string): Promise<void> => {
  const { data, error } = await getResend().emails.send({
    from: Cmail.from,
    to: [to],
    subject: '注册验证码',
    html: `<p>您的验证码是：<b style="font-size:20px">${code}</b></p><p>5 分钟内有效，请勿泄露给他人。</p>`,
  })

  if (error) {
    console.error('Resend 发送失败:', error)
    throw new Error('邮件发送失败')
  }
}
