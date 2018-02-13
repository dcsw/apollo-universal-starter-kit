const defaultState = {
  // START-TEMPLATE-0
  // yyyy: { id: null, content: '' }
  // END-TEMPLATE-0
  // TARGET-TEMPLATE-0
};

export default function(state = defaultState, action) {
  switch (action.type) {
    // START-TEMPLATE-1
    // case 'YYYY_SELECT':
    //   return {
    //     ...state,
    //     yyyy: action.value
    //   };
    // END-TEMPLATE-1
    // TARGET-TEMPLATE-1

    default:
      return state;
  }
}
