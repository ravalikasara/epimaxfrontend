import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Home extends Component {
  onGetStarted = () => {
    const {history} = this.props

    history.replace('/login')
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    console.log(jwtToken)

    return (
      <div className="Home-container">
        <ul className="headers-container">
          <Link to="/tasks" className="text">
            <p>Home</p>
          </Link>
          <Link to="/login" className="text">
            <p>Log In</p>
          </Link>
          <Link to="/register" className="text">
            <p>Sign Up</p>
          </Link>
        </ul>
        <div className="form-containers">
          <h1 className="heading">Welcome to Task Manager</h1>
          <p className="home-text">
            Where productivity meets simplicity, Take control of your tasks,
            streamline your workflow, and achieve your goals with ease.
          </p>
          <button className="button" type="button" onClick={this.onGetStarted}>
            Lets get started
          </button>
        </div>
      </div>
    )
  }
}

export default Home
