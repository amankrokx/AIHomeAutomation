import './App.css'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'

const routes = {
  '/': () => <Home />,
  '/login': () => <Login />,
}

function App() {
  const { pathname } = window.location
  const route = routes[pathname] || (() => <h1>Not Found</h1>)

  return route()
}

export default App
