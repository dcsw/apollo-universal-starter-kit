const defaultState = {
  description: { id: null, content: '' }
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case 'DESCRIPTION_SELECT':
      return {
        ...state,
        description: action.value
      };

    default:
      return state;
  }
}
