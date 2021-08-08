import { LOAD_AUTH, CLEAR_AUTH } from './actionTypes';
/*
{
    auth: {
        info...
    },
    projects: {
      
    }
}
*/
export const changeAuth = (auth_action, auth) => {
  if (auth_action === LOAD_AUTH) {
    return { type: LOAD_AUTH, auth };
  } else if (auth_action === CLEAR_AUTH) {
    console.log('logout');
    return { type: CLEAR_AUTH, auth };
  } else {
    return undefined;
  }
};

export const setProjects = (actionType: string, projects: Array<Object>) => {
  return { type: actionType, projects };
};
