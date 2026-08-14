import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, X, Send, Headset } from 'lucide-react'

const FAQS = [
  {
    keywords: ['price', 'pricing', 'cost', 'rate', 'charge'],
    answer: 'Pricing depends on the service — most categories start around ₹250–350/hr. You can see exact rates on each service page under "Pricing".',
  },
  {
    keywords: ['service', 'services', 'offer', 'category', 'categories'],
    answer: 'We offer Aged Care, Personal Care, Nursing Services, Domestic Assistance, and Social Companionship & Travel Assistance. Browse all of them under "Care Type & Services".',
  },
  {
    keywords: ['book', 'booking', 'schedule', 'appointment'],
    answer: 'To book: log in with your phone number, pick a service, fill in your address and schedule, and we\'ll match you with an available caregiver.',
  },
  {
    keywords: ['payment', 'pay', 'razorpay', 'upi'],
    answer: 'Payments are handled securely via Razorpay — UPI, cards, and netbanking are all supported. You\'ll get a WhatsApp confirmation after payment.',
  },
  {
    keywords: ['cancel', 'refund'],
    answer: 'To cancel or request a refund on a booking, please reach out to our support team — they can process it from their end.',
  },
  {
    keywords: ['caregiver', 'staff', 'nurse', 'verified'],
    answer: 'All our caregivers are background-verified and trained for their specific care category before being listed on the platform.',
  },
]

const GREETING = {
  role: 'bot',
  text: "Hi! I'm the Book My Carers assistant. Ask me about pricing, services, or how booking works.",
}

function findAnswer(message) {
  const lower = message.toLowerCase()
  const match = FAQS.find((faq) => faq.keywords.some((k) => lower.includes(k)))
  return match?.answer
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([GREETING])
  const [input, setInput] = useState('')
  const [escalated, setEscalated] = useState(false)

  function handleSend(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    const userMsg = { role: 'user', text }
    const answer = findAnswer(text)
    const botMsg = {
      role: 'bot',
      text:
        answer ??
        "I don't have an answer for that yet. Would you like me to connect you with a human support agent?",
    }
    setMessages((m) => [...m, userMsg, botMsg])
    setInput('')
  }

  function handleEscalate() {
    setEscalated(true)
    setMessages((m) => [
      ...m,
      { role: 'bot', text: 'Connecting you to a human support agent — someone will respond here shortly.' },
    ])
  }

  return (
    <>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-brand-600 text-white shadow-lg shadow-brand-600/40"
        aria-label="Open chat support"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-5 z-40 flex h-[28rem] w-[22rem] max-w-[90vw] flex-col overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-2xl shadow-brand-900/20"
          >
            <div className="flex items-center gap-2 bg-brand-600 px-4 py-3 text-white">
              <MessageCircle size={18} />
              <div>
                <p className="text-sm font-semibold">Book My Carers Support</p>
                <p className="text-xs text-brand-100">Usually replies instantly</p>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm ${
                    m.role === 'bot'
                      ? 'bg-brand-50 text-slate-700'
                      : 'ml-auto bg-brand-600 text-white'
                  }`}
                >
                  {m.text}
                </div>
              ))}
              {!escalated && (
                <button
                  onClick={handleEscalate}
                  className="flex items-center gap-1.5 text-xs font-medium text-brand-700 hover:underline"
                >
                  <Headset size={13} />
                  Talk to a human
                </button>
              )}
            </div>

            <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-brand-100 p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question…"
                className="h-10 flex-1 rounded-full border border-brand-200 px-4 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
              <button
                type="submit"
                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-brand-600 text-white hover:bg-brand-700"
                aria-label="Send"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
