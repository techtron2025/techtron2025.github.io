import Clipboard from 'clipboard' //引入cliboard
import { Message } from 'element-ui' //消息提示

function clipboardSuccess(msg) {
    Message.success('复制成功')
}

function clipboardError(msg) {
    Message.error('复制失败')
}

export default function handleClipboard(text, event, msg) {
  const clipboard = new Clipboard(event.target, {
    text: () => text,
  })
  clipboard.on('success', () => {
    clipboardSuccess(msg)
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    clipboardError(msg)
    clipboard.destroy()
  })
  clipboard.onClick(event)
}
