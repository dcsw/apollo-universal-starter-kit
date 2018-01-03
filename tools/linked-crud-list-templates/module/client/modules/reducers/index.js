const defaultState = {
  yyyy: { id: null, content: '' }
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case 'YYYY_SELECT':
      return {
        ...state,
        yyyy: action.value
      };

    default:
      return state;
  }
}
