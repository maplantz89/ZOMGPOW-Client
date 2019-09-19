import React from 'react';
import LearningTargetForm from '../../Components/LearningTargetForm/LearningTargetForm';
import StudentList from '../../Components/StudentList/StudentList';
import './TeacherDashboardRoute.css';

class TeacherDashboardRoute extends React.Component{

  render() {
    return (
      <section className='TeacherDashboardRoute-section'>
        <div className='TeacherDashboardRoute-learning-target-submit'>
          <LearningTargetForm />
        </div>
        <div className='TeacherDashboardRoute-student-list'>
          <StudentList />
        </div>
      </section>
    );
  }
}

export default TeacherDashboardRoute;