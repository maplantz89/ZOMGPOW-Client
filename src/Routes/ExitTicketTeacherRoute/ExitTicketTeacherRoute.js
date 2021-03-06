import React from 'react';
import config from '../../config';
import TokenService from '../../Services/token-service';
import { Link } from 'react-router-dom';
import TeacherAuthApiService from '../../Services/teacher-auth-api-service';
import TeacherContext from '../../Contexts/TeacherContext';
import StudentResponseDisplay from '../../Components/StudentResponseDisplay/StudentResponseDisplay';

class ExitTicketTeacherRoute extends React.Component {

  state = {
    error: null,
    exitTicketQuestion: null, 
    exitTicketOptions: null, 
    exitTicketCorrectAnswer: null, 
    studentAnswers: [], 
    classId: null,
    loaded: false,
    students: []
  }

  static contextType = TeacherContext;

  componentDidMount() {
    let classId = this.state.classId;
    if(TokenService.getAuthToken() && !classId){

    TeacherAuthApiService.getTeacherClasses()
      .then(classes => this.context.setClass(classes[0]))
      .then(() => this.setState({
        loaded: true,
        classId: this.context.teacherClass.id
      }))
      .then(() => {
        return fetch(`${config.API_ENDPOINT}/goals/class/${this.state.classId}`, {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            authorization: `bearer ${TokenService.getAuthToken()}`
          }
        }).then((res) => {
          
          if(!res){
            return res.json().then(e => Promise.reject(e));
          }
          return res.json();
        }).then(res => {
          let goal = res.goals.pop();
          this.setState({
            exitTicketQuestion: goal.exit_ticket_question,
            exitTicketOptions: goal.exit_ticket_options,
            exitTicketCorrectAnswer: goal.exit_ticket_correct_answer,
            loaded: true
          })
        })
        .catch(error => {
          console.error({ error })
        })
      })

    } else {
      const classId = this.context.teacherClass.id;
      this.setState({
        loaded: true,
        classId
      })
    }
  }

  displayStudents = (resStudents) => {
    this.setState({
      students: resStudents.students,
    })
  }

  displayStudentResponses = () => {
    if (this.state.exitTicketQuestion) {
      return (
        <section className='TeacherDashboardRoute-student-list TeacherDashboardRoute-section' >
          <div className='student-answers'>
            <h2>Student Responses</h2>
          </div>
          <StudentResponseDisplay 
            displayStudents= {this.displayStudents} 
            classId={this.state.classId} 
            students={this.state.students}/>
        </section>
      ) 
    } else {
      return <></>
    }
  }

  render() {
    let options = this.state.exitTicketOptions ?
      this.state.exitTicketOptions.map((option, index) => <li key={index}>{option}</li>)
      : ''

      if(!this.state.loaded){
        return <div>loading...</div>
      }
    return (
      <div>
        <section>
        <h2>{this.state.exitTicketQuestion ? 'Exit Ticket Prompt:' : `You didn't create an exit ticket this time!`}</h2>
        <h3>{this.state.exitTicketQuestion? this.state.exitTicketQuestion : ''}</h3>
        <ul>{options}</ul>
        <h3>{this.state.exitTicketCorrectAnswer ? `Correct Answer: ${this.state.exitTicketCorrectAnswer}` : ''}</h3>
        </section>
        <div className='student-answers'>
          {this.state.exitTicketQuestion && <h2>Student Responses</h2>}
        </div>
        <section className='TeacherDashboardRoute-section'>
        <div className='TeacherDashboardRoute-student-list'>
          {this.state.exitTicketQuestion && 
          <StudentResponseDisplay 
            displayStudents= {this.displayStudents} 
            classId={this.state.classId} 
            students={this.state.students}/>}
        </div>
        </section>
        <Link to={'/dashboard/teacher'} className='button green-button'>Return to Dashboard</Link> 
      </div>
    )
  }
}

export default ExitTicketTeacherRoute;