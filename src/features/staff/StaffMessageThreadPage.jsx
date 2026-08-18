import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Send } from 'lucide-react'
import { getChatThread, sendChatMessage } from '../../lib/mockApi'
import { useSession } from '../../lib/session'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

export default function StaffMessageThreadPage() {
  const { t } = useTranslation()
  const { session } = useSession()
  const { userId } = useParams()
  const [messages, setMessages] = useState(null)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const listRef = useRef(null)

  async function load() {
    setMessages(await getChatThread(session.id, userId))
  }

  useEffect(() => {
    load()
  }, [session.id, userId])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const userName = messages?.[0]?.userName || t('staffMessages.careSeeker')

  async function handleSend(e) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    setSending(true)
    const message = await sendChatMessage({ staffId: session.id, userId, userName, from: 'staff', text: trimmed })
    setMessages((m) => [...(m ?? []), message])
    setText('')
    setSending(false)
  }

  if (!messages) return null

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/staff/messages" className="flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline">
        <ArrowLeft size={14} /> {t('staffMessages.title')}
      </Link>

      <h1 className="mt-3 text-2xl font-semibold text-slate-900">{userName}</h1>

      <Card className="mt-5" animate={false}>
        <div ref={listRef} className="flex max-h-[26rem] min-h-[12rem] flex-col gap-2 overflow-y-auto pr-1">
          {messages.length === 0 ? (
            <p className="my-auto text-center text-sm text-slate-400">{t('staffMessages.emptyThread')}</p>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${
                  m.from === 'staff' ? 'self-end bg-brand-600 text-white' : 'self-start bg-brand-50 text-slate-700'
                }`}
              >
                {m.text}
              </div>
            ))
          )}
        </div>
        <form onSubmit={handleSend} className="mt-3 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('staffMessages.replyPlaceholder')}
            className="h-11 flex-1 rounded-lg border border-brand-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition-shadow focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />
          <Button type="submit" size="sm" disabled={!text.trim() || sending} aria-label={t('staffMessages.send')}>
            <Send size={16} />
          </Button>
        </form>
      </Card>
    </div>
  )
}
