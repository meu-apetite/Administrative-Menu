import { useRoutes } from 'react-router-dom'
import { AuthContext, AuthProvider } from 'contexts/auth'
import authRoutes from 'routes/authRoutes'
import adminRoutes from 'routes/adminRoutes'
import theme from 'theme/default'
import { ThemeProvider } from '@mui/material'
import { useContext, useEffect } from 'react'

const GlobalStyles = () => (
  <style>
    {`
      input:-webkit-autofill, input:-webkit-autofill:hover, 
      input:-webkit-autofill:focus, input:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 30px #02020200 inset !important;
        background-color: inherit !important;
        color: inherit !important;
      }
    `}
  </style>
)

const Routes = () => {
  const authContext = useContext(AuthContext)
  const { authenticationStatus } = authContext

  const AuthRoutes = () => {
    const routes = useRoutes([...authRoutes])
    return <>{routes}</>
  }

  const AdminRoutes = () => {
    const routes = useRoutes([...adminRoutes])
    return <>{routes}</>
  }

  useEffect(() => {}, [])

  return (
    <div>
      {authenticationStatus === null ? (
        <>Carregando</>
      ) : (
        authenticationStatus === 'logged' ? <AdminRoutes /> : <AuthRoutes  />
      )}
    </div>
  )
}

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
