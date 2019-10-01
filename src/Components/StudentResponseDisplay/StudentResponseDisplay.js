import React from 'react';
import StudentAuthApiService from '../../Services/student-auth-api-service';
import './StudentResponseDisplay.css';
import TeacherContext from '../../Contexts/TeacherContext'
import config from '../../config'
import TokenService from '../../Services/token-service'
import openSocket from 'socket.io-client';

class StudentResponseDisplay extends React.Component {

  static contextType = TeacherContext;
  socket = openSocket('http://localhost:8000');

  state = {
    error: null,
    userInput: '',
    newStudent: null,
    classId: null,
    isDeleting: false,
  }

  componentDidMount() {
    // Fetch students from API
    let classId = this.context.teacherClass.id
    this.setState({
      classId: classId
    })
    return fetch(`${config.API_ENDPOINT}/class/${classId}/students`, {
      method: 'GET',
      headers: {
        'authorization': `Bearer ${TokenService.getAuthToken()}`,
      },
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
      .then(resStudents => {
        this.props.displayStudents(resStudents)
      })
      .catch(res => {
        this.setState({ error: res.error })
      })
  }

  handleDeleteStudent = (username, classId) => {
    this.setState({isDeleting: true})
    StudentAuthApiService.deleteStudent(username, classId)
      .then(res => {
        if(!res.ok){
          this.setState({error: res.error})
        } else {
          this.props.removeStudent(username)
          this.setState({isDeleting: false})
        }
      })
  }

  // Updates state with every user input change
  handleChange = (e) => {
    this.setState({
      userInput: e.target.value,
    })
  }

  handleSubmit = (e) => { 
    e.preventDefault();
    this.setState({
      newStudent: this.state.userInput,
    })
    // Use Student Api Service to post student - PSUEDO CODE
    let newStudent = { full_name: this.state.userInput, class_id: this.state.classId }
    StudentAuthApiService.postStudent(newStudent)
      .then(res => {
        this.props.addStudents(res)
        this.setState({
          userInput: '',
        })

      })
      .catch(res => {
        this.setState({
          error: res.error,
          newStudent: null,
          userInput: '',
        })
      })
  }

  render() {
    const { error, classId, isDeleting} = this.state;
    const fullname = this.props.students.map((student, index) => <li key={index}>{student.full_name}</li>)
    const response = this.props.students.map((student, index) => <li key={index}>response</li>)
    
    if(isDeleting){
      return (<div>loading...</div>)
    } 
    return(
      <div className='StudentResponseDisplay-container'>
      <h2>Students</h2>
      <div className='alert' role='alert'>
        {error && <p>{error}</p>}
      </div>
      {fullname.length < 1 
            ? <p>Add your students!</p> 
            :
            <div className='StudentResponseDisplay'>
              <div className='student-name'>
                <h3>Student Name</h3>
                <ul>
                  {fullname}
                </ul>
              </div>
              <div className='student-response'>
                <h3>Response</h3>
                <ul>
                  {response}
                </ul>
              </div>
            </div>
      }
      </div>
    )
  }
}

export default StudentResponseDisplay;
