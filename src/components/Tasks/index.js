import React, {Component} from 'react'
import Cookies from 'js-cookie'
import {FiLogOut} from 'react-icons/fi'
import {
  MdOutlineAddToPhotos,
  MdDeleteOutline,
  MdDownloading,
} from 'react-icons/md'
import {FaHome} from 'react-icons/fa'
import {IoMdMore} from 'react-icons/io'
import {Redirect, Link} from 'react-router-dom'
import './index.css'

class Tasks extends Component {
  state = {
    showAddTask: false,
    title: '',
    description: '',
    status: 'PENDING',
    assignor: 'ADMIN',
    assignee: '',
    tasks: [],
    users: [],
    showError: true,
    loadingTasks: false,
  }

  componentDidMount() {
    this.getTasks()
    this.getUsers()
  }

  async getTasks() {
    this.setState({loadingTasks: true})
    const url = 'https://assignment-3ooo.onrender.com/tasks'
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('jwt_token')}`,
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch tasks')
      }
      const data = await response.json()
      const tasks = data.map(task => {
        const {_id, ...rest} = task
        return {id: _id, ...rest}
      })
      if (tasks.length > 0) {
        this.setState({showError: false})
      }
      this.setState({tasks, loadingTasks: false})
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  async getUsers() {
    const url = 'https://assignment-3ooo.onrender.com/users'
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('jwt_token')}`,
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      const data = await response.json()
      const users = data.map(task => {
        const {_id, ...rest} = task
        return {id: _id, ...rest}
      })
      this.setState({users})
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  renderstatusField = () => {
    const {status} = this.state
    return (
      <>
        <label className="input-label" htmlFor="status">
          STATUS
        </label>
        <select
          className=" username-input-field"
          id="status"
          onChange={this.onChangeStatus}
        >
          <option value="PENDING">PENDING</option>
          <option value="INPROGRESS">IN PROGRESS</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>
      </>
    )
  }

  rendertitleField = () => {
    const {title} = this.state
    return (
      <>
        <label className="input-label" htmlFor="title">
          TITLE
        </label>
        <input
          type="text"
          id="title"
          className="username-input-field"
          value={title}
          onChange={this.onChangeTitle}
          placeholder="Enter Title"
        />
      </>
    )
  }

  renderassigneeField = () => {
    const {assignee, users} = this.state
    return (
      <>
        <label className="input-label" htmlFor="assignee">
          ASSIGN TO
        </label>
        <select
          className="username-input-field"
          id="assignee"
          onChange={this.onChangeAssignee}
        >
          {users.map(each => (
            <option value={each.username} key={each.id}>
              {each.username}
            </option>
          ))}
        </select>
      </>
    )
  }

  renderdescriptionField = () => {
    const {description} = this.state
    return (
      <>
        <label className="input-label" htmlFor="desc">
          TITLE
        </label>
        <input
          type="text"
          id="desc"
          className="username-input-field"
          value={description}
          onChange={this.onChangeDescription}
          placeholder="Enter Description"
        />
      </>
    )
  }

  renderassignorField = () => {
    const {assignor} = this.state
    return (
      <>
        <label className="input-label" htmlFor="assignor">
          ASSIGNOR
        </label>
        <select
          className="username-input-field"
          id="assignor"
          onChange={this.onChangeAssignor}
        >
          <option value="ADMIN">ADMIN</option>
        </select>
      </>
    )
  }

  onDeleteItem = async id => {
    const url = `https://assignment-3ooo.onrender.com/tasks/${id}`
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('jwt_token')}`,
        },
      })
      if (!response.ok) {
        throw new Error('Failed to delete task')
      }
      this.getTasks()
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  onChangeTitle = event => {
    this.setState({title: event.target.value})
  }

  onChangeDescription = event => {
    this.setState({description: event.target.value})
  }

  onChangeStatus = event => {
    this.setState({status: event.target.value})
  }

  onChangeAssignee = event => {
    this.setState({assignee: event.target.value})
  }

  onChangeAssignor = event => {
    this.setState({assignor: event.target.value})
  }

  onSubmitSuccess = token => {
    const {history} = this.props
    Cookies.set('jwt_token', token, {expires: 30})
    const tokens = Cookies.get('jwt_token')
    console.log(tokens)
    history.replace('/tasks')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {assignee, assignor, title, description, status} = this.state
    const userDetails = {assignee, assignor, title, description, status}
    const url = 'https://assignment-3ooo.onrender.com/task'
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(userDetails),
    }
    try {
      const response = await fetch(url, options)
      const data = await response.json()
      this.setState({showAddTask: false})
      if (response.ok === true) {
        this.getTasks()
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  onAddTaskEnable = () => {
    this.setState({showAddTask: true, showError: false})
  }

  onLogout = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/')
  }

  onStatusChange = async (event, taskId) => {
    const newStatus = event.target.value
    const url = `https://assignment-3ooo.onrender.com/tasks/${taskId}`
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('jwt_token')}`,
        },
        body: JSON.stringify({status: newStatus}),
      })
      if (!response.ok) {
        throw new Error('Failed to update task status')
      }
      const data = await response.json()
      this.getTasks()
      console.log(data.message)
    } catch (error) {
      console.error('Error updating task status:', error)
    }
  }

  render() {
    const {
      title,
      description,
      status,
      assignee,
      assignor,
      showAddTask,
      tasks,
      showError,
      loadingTasks,
    } = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/" />
    }
    let tasksContent
    if (loadingTasks) {
      tasksContent = (
        <div className="loader">
          <h1>Loading ...</h1>
          <MdDownloading className="load-icon" />
        </div>
      )
    } else if (tasks.length > 0) {
      tasksContent = (
        <>
          <h1 className="todo-title">Tasks Todo </h1>
          <ul className="tasks-todo-continer">
            {tasks.map(each => (
              <li key={each.id} className={`todo ${each.status}`}>
                <p className="todo-item">Task Title : {each.title}</p>
                <p className="todo-item">Assignor : {each.assignor}</p>
                <p className="todo-item">Assignee : {each.assignee}</p>
                <p className="todo-item">Status: {each.status}</p>
                <label className="todo-item" htmlFor="change">
                  Change Status
                </label>
                <select
                  className="select"
                  id={each.id}
                  onChange={e => this.onStatusChange(e, each.id)}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="INPROGRESS">IN PROGRESS</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
                <button
                  className="delete-button"
                  label="a"
                  onClick={() => this.onDeleteItem(each.id)}
                  type="button"
                >
                  <MdDeleteOutline className="icons" />
                </button>
              </li>
            ))}
          </ul>
        </>
      )
    } else if (showError) {
      tasksContent = (
        <div className="no-task-found-container">
          <img
            src="https://img.freepik.com/free-vector/hand-drawn-no-data-illustration_23-2150544943.jpg"
            className="not-found-img"
          />
          <h1 className="no-tasks">No Tasks Found!!</h1>
        </div>
      )
    }
    return (
      <>
        <div className="task-container">
          <ul className="header-container">
            <li>
              <p className="title">Task Manager</p>
            </li>
            <li>
              <div className="add-task-button">
                <button
                  onClick={this.onAddTaskEnable}
                  className="delete-button "
                  type="button"
                >
                  Add Task
                </button>
                <MdOutlineAddToPhotos />
              </div>
            </li>
            <li className="search-bar">
              <input type="search" className="search" />
              <img
                src="https://img.freepik.com/free-photo/search-icon-front-side-with-white-background_187299-39962.jpg"
                className="tasks-profile"
              />
            </li>

            <li>
              <Link to="/settings" className="link">
                <img
                  src="https://img.freepik.com/free-photo/gear-front-side-white-background_187299-40157.jpg"
                  className="tasks-profile"
                />
              </Link>
            </li>
            <li>
              <Link to="/profile" className="link">
                <img
                  alt="profile"
                  src="https://img.freepik.com/free-photo/user-profile-icon-front-side-with-white-background_187299-40010.jpg"
                  className="tasks-profile"
                />
              </Link>
            </li>
            <li>
              <button
                className=" delete-button"
                label="h"
                onClick={this.onLogout}
              >
                <FiLogOut className="logout" />
              </button>
              <button
                className=" delete-button"
                label="h"
                onClick={this.onLogout}
              >
                <IoMdMore className="more" />
              </button>
            </li>
          </ul>
        </div>
        <div className="tasks">
          {showAddTask && (
            <form className="task-form-container" onSubmit={this.submitForm}>
              <div className="input-container">{this.rendertitleField()}</div>
              <div className="input-container">
                {this.renderdescriptionField()}
              </div>
              <div className="input-container">{this.renderstatusField()}</div>
              <div className="input-container">
                {this.renderassigneeField()}
              </div>
              <div className="input-container">
                {this.renderassignorField()}
              </div>
              <button type="submit" className="login-button">
                Add
              </button>
            </form>
          )}
          {tasksContent}
        </div>
      </>
    )
  }
}

export default Tasks
