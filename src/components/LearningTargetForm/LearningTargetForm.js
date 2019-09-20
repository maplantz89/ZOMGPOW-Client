import React from 'react';
import './LearningTargetForm.css';

class LearningTargetForm extends React.Component {

  state = {
    error: null,
    learningTarget: '',
  }

  // Updates state with every user input change
  handleChange = (e) => {
    this.setState({
      learningTarget: e.target.value,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // Post learning target to API -- WHAT ENDPOINT?


    this.setState({
      learningTarget: ''
    })
    // REDIRECT to session page?  Is this how?
    // this.props.history.push('')
  }

  render() {
    return (
      <form className='learning-target-form'>
            <label htmlFor='learning-target'>Learning Target:</label>
            <textarea 
              id='learning-target'
              onChange={this.handleChange}
              value={this.state.learningTarget}
              name='learning-target'
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