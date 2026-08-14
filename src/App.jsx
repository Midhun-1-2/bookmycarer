import { BrowserRouter } from 'react-router-dom'
import { SessionProvider } from './lib/session'
import AppRouter from './app/AppRouter'

function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <AppRouter />
      </SessionProvider>
    </BrowserRouter>
  )
}

export default App
