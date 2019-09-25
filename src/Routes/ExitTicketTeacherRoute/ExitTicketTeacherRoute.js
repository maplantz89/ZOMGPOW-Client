import React from 'react';
import config from '../../config';
import TokenService from '../../Services/token-service';
import TeacherAuthApiService from '../../Services/teacher-auth-api-service';
import TeacherContext from '../../Contexts/TeacherContext';

class ExitTicketTeacherRoute extends React.Component {

  state = {
    error: null,
    exitTicketQuestion: null, //'Test prompt question?'
    exitTicketOptions: [], //['option #1', 'option #2', 'option #3', 'option #4']
    exitTicketCorrectAnswer: null, //'A'
    studentAnswers: [], 
    classId: 1,
  }

  static contextType = TeacherContext;

  componentDidMount() {

    fetch(`${config.API_ENDPOINT}/goals/class/${this.state.classId}`, {
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
      console.log(res);
      // this.setState({
      //   //
      // })
    })
    .catch(error => {
      console.error({ error })
    })



    // let classId;

    // if (TokenService.hasAuthToken()){
    //   if (!this.state.classId) {
    //     TeacherAuthApiService.getTeacherClasses()
    //     .then(classes => {
    //       this.context.setClass(classes[0]);
    //       classId = this.context.teacherClass.id;
    //     })
    //     .then(
    //       console.log(this.state.classId)
    //     //   () => this.setState({
    //     //   classId: classId
    //     // })
    //   )
    //     .then(
    //       console.log(this.state.classId, 'ID??'),
    //       console.log(`${config.API_ENDPOINT}/goals/class/${this.state.classId}`),
          
    //           )
    //         } 
  //}
}


  render() {
    let options = this.state.exitTicketOptions.length > 1 ?
      this.state.exitTicketOptions.map((option, index) => <li key={index}>{option}</li>)
      : ''
    return (
      <div>Exit Ticket Teacher Route
        <h2>{this.state.exitTicketQuestion ? 'Exit Ticket Prompt:' : `You didn't create an exit ticket this time!`}</h2>
        <h3>{this.state.exitTicketQuestion? this.state.exitTicketQuestion : ''}</h3>
        <ul>{options}</ul>
        {/* <div className='student-answers'>
          <h2>Student Responses</h2>
        </div> */}
      </div>
    )
  }
}

export default ExitTicketTeacherRoute;