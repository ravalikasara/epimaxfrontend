import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Register extends Component {
  state = {
    username: '',
    password: '',
    role: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onChangeRole = event => {
    this.setState({role: event.target.value})
  }

  onSubmitSuccess = () => {
    const {history} = this.props

    history.replace('/login')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password, role} = this.state

    const userDetails = {username, password, role}

    const url = 'https://assignment-3ooo.onrender.com/register'

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Specify JSON content type
      },
      body: JSON.stringify(userDetails), // Stringify the object as JSON
    }

    try {
      const response = await fetch(url, options)
      const data = await response.json()

      if (response.ok === true) {
        this.onSubmitSuccess(data.jwtToken)
      } else {
        this.onSubmitFailure(data.message)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  renderPasswordField = () => {
    const {password} = this.state

    return (
      <>
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="password-input-field"
          value={password}
          onChange={this.onChangePassword}
          placeholder="Password"
        />
      </>
    )
  }

  renderRoleField = () => {
    const {role} = this.state

    return (
      <>
        <label className="input-label" htmlFor="role">
          ROLE
        </label>
        <input
          type="text"
          id="role"
          className="password-input-field"
          value={role}
          onChange={this.onChangeRole}
          placeholder="Role"
        />
      </>
    )
  }

  renderUsernameField = () => {
    const {username} = this.state

    return (
      <>
        <label className="input-label" htmlFor="username">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          className="username-input-field"
          value={username}
          onChange={this.onChangeUsername}
          placeholder="Username"
        />
      </>
    )
  }

  render() {
    const {showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    console.log(jwtToken)
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="logins-form-container">
        <form className="form-container" onSubmit={this.submitForm}>
          <div className="logo-container">
            <img
              src="https://static.thenounproject.com/png/1876479-200.png"
              className="login-logo"
              alt="logo"
            />
            <p className="logo-text">Online Task-Manager</p>
          </div>
          <div className="input-container">{this.renderUsernameField()}</div>
          <div className="input-container">{this.renderPasswordField()}</div>
          <div className="input-container">{this.renderRoleField()}</div>
          <button type="submit" className="login-button">
            Register
          </button>
          {showSubmitError && <p className="error-message">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default Register
