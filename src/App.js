import {Route, Switch} from 'react-router-dom'
import LoginForm from './components/LoginForm'
import ProtectedRoute from './components/ProtectedRoute'
import Register from './components/Register'
import Home from './components/Home'
import NotFound from './components/NotFound'
import Tasks from './components/Tasks'

import './App.css'

const App = () => (
  <Switch>
    <Route exact path="/login" component={LoginForm} />
    <Route exact path="/register" component={Register} />
    <Route exact path="/" component={Home} />
    <ProtectedRoute exact path="/tasks" component={Tasks} />

    <Route component={NotFound} />
  </Switch>
)

export default App
