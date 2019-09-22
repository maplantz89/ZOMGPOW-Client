import React from 'react';
import './LearningTargetForm.css';
import config from '../../config';
import TokenService from '../../Services/token-service';

class LearningTargetForm extends React.Component {
  state = {
    error: null,
    learningTarget: '',
  }
  staticDefaultProps={}

  // Updates state with every user input change
  handleChange = (e) => {
    this.setState({
      learningTarget: e.target.value,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { learningTarget } = e.target;
    const classLearningTarget = {
      goal_title: learningTarget.value,
    }
    fetch(`${config.API_ENDPOINT}/goals/class/${this.props.class_id}`, {
      method: 'POST',
      body: JSON.stringify(classLearningTarget),
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
      this.setState({
        learningTarget: ''
      })
      const { history } = this.props
      history.push('/session')
    })
    .catch(error => {
      console.error({ error })
    })
  }

  render() {
    return (
      <form className='learning-target-form'
        onSubmit={this.handleSubmit}>
            <label htmlFor='learningTarget'>Learning Target:</label>
            <textarea 
              id='learning-target'
              onChange={this.handleChange}
              value={this.state.learningTarget}
              name='learningTarget'
              aria-label='learning target'
              aria-required='true'
              required
              />
            <div>
              <button type='submit'>Start Session</button>
            </div>
          </form>
    )
  }
}

export default LearningTargetForm