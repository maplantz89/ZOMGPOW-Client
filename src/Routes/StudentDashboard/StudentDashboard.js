import React from 'react';
import StudentAuthApiService from '../../Services/student-auth-api-service';
import { Link } from 'react-router-dom';
import StudentTimer from '../../Components/Timer/StudentTimer';
import StudentContext from '../../Contexts/StudentContext';
import './StudentDashboard.css';

class StudentDashboard extends React.Component{
  static contextType = StudentContext;
  state = {
    studentId: null,
    goals: [],
    subgoals: [],
    error: null,
    timer: false,
    show: true,
    evaluations:[],
  };

  componentDidMount() {
    this.setState({
      studentId: this.context.user.id
    })
    StudentAuthApiService.getStudentGoals(this.context.user.id)
      .then(res => {
        const student_goals = res.goals;
        const student_subgoals = res.subgoals;
        this.setState({
          goals: student_goals,
          subgoals: student_subgoals
        })
      })
      .catch(res => {
        this.setState({ error: res.error })
      })
  }

  handleLogoutClick = () => {
    this.context.processLogout();
  }

  renderStudentLogout(){
    return (
      <nav>
        <Link 
          onClick={this.handleLogoutClick}
          to='/'
          className='green-button button'>
          Logout
        </Link>
        <Link
        to='/student/exitTicket'
        className='button blue-button'
        >Exit Ticket</Link>
      </nav>
    )
  }

  toggleTimer = () => {
    this.setState({
      show: !this.state.show,
    })
  }

  findStudentWithTimer = (studentTimers, currStudent) => {
    //currStudent is student username
    let currTimer = studentTimers.find(timer => timer.student === currStudent)
    return currTimer;
  }

  render() {
    let currStudent = this.context.user.username;
    let currTimer = this.findStudentWithTimer(this.props.studentTimers, currStudent);
    const learningTarget = this.state.goals.map((goal, index) => <li key={index}>{goal.goal_title}</li>)
    const subGoals = this.state.subgoals.map((sub, index) => <li key={index}>{sub.subgoal_title}</li>)

    return(
      <section className="student-dashboard-section">
        <div className="links">
          {this.renderStudentLogout()}
        </div>  

      <div className='goals-container'>
        <h2>Learning Target: </h2>
        <ul>
        <p>{learningTarget.pop()}</p>
        {(subGoals.length > 0) 
        ?
        <div> 
        <h2>Current Goal: </h2>
        <p>{subGoals}</p>
        </div>
        : <></>}
        </ul>
      </div>

      <div className='timer-container'>
        <button 
        className='button blue-button'
        onClick={this.toggleTimer}>{this.state.show ? 'Hide' : 'Timer'}</button>
        <div className={this.state.show ? '' : 'hidden'}>
          <StudentTimer currTimer={currTimer}/>
        </div>
      </div>

      <Link to='/selfEvaluate'>Ready to self-evaluate?</Link>  
      
      {(subGoals.length > 1) 
      ? <div> 
      <h3>Previous Goals</h3>
      {/* need to display all subgoals but the last one */}
      <ul>{subGoals}</ul>
      </div>
      : <></>}

      </section>
    )
  }
}

export default StudentDashboard;