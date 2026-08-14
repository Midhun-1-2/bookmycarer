import { Outlet } from 'react-router-dom'
import SplashNav from '../../components/layout/SplashNav'
import Footer from '../../components/layout/Footer'
import ChatbotWidget from '../../features/chatbot/ChatbotWidget'

export default function PublicLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-brand-50">
      <SplashNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ChatbotWidget />
    </div>
  )
}
