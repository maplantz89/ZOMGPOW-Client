import config from '../config';
import TokenService from './token-service';

const TeacherAuthApiService = {
  
  postUser(user) {
    return fetch(`${config.API_ENDPOINT}/register/teacher`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res
      )
     
  },
  postLogin({ email, password }) {
    return fetch(`${config.API_ENDPOINT}/auth/teacher/login`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(err => Promise.reject(err))
          : res.json()
      )
  },
  refreshToken() {
    return fetch(`${config.API_ENDPOINT}/auth/teacher/login`, {
      method: 'PUT',
      headers: {
        'authorization': `Bearer ${TokenService.getAuthToken()}`,
      },
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
  },
  getTeacherClasses() {
    return fetch(`${config.API_ENDPOINT}/class`, {
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
  },
  endSessionGoal(goalData){
    return fetch(`${config.API_ENDPOINT}/goals/goal/${goalData.id}`, {
      method: 'PATCH',
      headers: {
        'authorization': `Bearer ${TokenService.getAuthToken()}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify(goalData)
    })
    .then(res => 
      (!res.ok)
      ? res.json().then(e => Promise.reject(e))
      : res
      )
  },
}

export default TeacherAuthApiService;