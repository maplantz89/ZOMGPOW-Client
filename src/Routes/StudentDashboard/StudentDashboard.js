import React from 'react';
import StudentAuthApiService from '../../Services/student-auth-api-service';
import { Link } from 'react-router-dom';
import StudentTimer from '../../Components/Timer/StudentTimer';
import StudentContext from '../../Contexts/StudentContext';
import TokenService from '../../Services/token-service';
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
  };
  static contextType = StudentContext;
  renderLogInLinks(){
    return (
      <nav className="login-buttons">
        <Link to='/login/teacher' className='purple-button button'>Teacher Login</Link>
        <Link to='/login/student' className='blue-button button'>Student Login</Link>
        <Link to='/register' className='green-button button'>Sign Up</Link>
      </nav>
    )
  }
  handleLogoutClick = () => {
    this.context.processLogout();
  }
  componentDidMount() {
    this.setState({
      studentId: this.context.user.id
    })
    StudentAuthApiService.getStudentGoals(this.context.user.id)
      .then(res => {
        console.log(res)
        const studentGoals = res.goals;
        const studentSubgoals = res.subgoals;
        this.setState({
          goals: studentGoals,
          subgoals: studentSubgoals
        })
      })
      .catch(res => {
        this.setState({ error: res.error })
      })
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
    </nav>
  )
 }
toggleTimer = () => {
  // toggle css hidden attribute
  // update state
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
    // const prevGoals = this.state.previousGoals.map((goal, index) =>
    //   <li key={index}>{goal}</li>
    // );
    const learningTarget = this.state.goals.map((goal, index) => <li key={index}>{goal.goal_title}</li>)
    const subGoals = this.state.subgoals.map((sub, index) => <li key={index}>{sub.subgoal_title}</li>)

    return(
      <section className="student-dashboard-section">
        <div className="links">
          {TokenService.hasAuthToken() 
          ? this.renderStudentLogout()
          :this.renderLogInLinks()}
        </div>  
      <div className='goals-container'>
        <h2>Learning Target: </h2>
        {/* grabs the first goal for that student */}
        <p>{learningTarget.pop()}</p>

        {(subGoals.length > 0) 
        ?
        <div> 
        <h2>Current Goal: </h2>
        <p>{subGoals}</p>
        </div>
        : <></>}
      </div>

      <div className='timer-container'>
        <button 
        className='button blue-button'
        onClick={this.toggleTimer}>{this.state.show ? 'Hide' : 'Timer'}</button>
        <div className={this.state.show ? '' : 'hidden'}>
          <StudentTimer currTimer={currTimer}/>
        </div>
      </div>

      {(subGoals.length > 1) 
      ?
      <div> 
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