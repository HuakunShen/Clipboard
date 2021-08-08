const projects = (state = null, action) => {
  // if (action.type !== '')
  if (!action.projects) return state;
  return action.projects;
};

export default projects;
