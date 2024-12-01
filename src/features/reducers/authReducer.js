// actions.js

export const loginSuccess = (token) => ({
  type: 'LOGIN_SUCCESS',
  payload: token,
});
export const Cr = (Cr) => ({
  type: 'Cr',
  payload: Cr,
});

export const SetRole = (Role) => ({
  type: 'SetRole',
  payload: Role,
});
export const loginSuccessGoogle = (googleToken) => ({
  type: 'LOGIN_SUCCESS_GOOGLE',
  payload: googleToken,
});
 
export const logoutGoogle = () => ({
  type: 'LOGOUTGOOGLE',

});
export const logout = () => ({
  type: 'LOGOUT',
});
// reducer.js
const initialState = {
  token: null,
  googleToken: null,
  isAuthenticated: false,
  Role:null,
  Cr:null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGOUT':
      return {
        ...state,
        token:null,
        isAuthenticated: false,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        token: action.payload,
        isAuthenticated: true,

      };
      case 'LOGIN_SUCCESS_GOOGLE':
        return {
          ...state,
          googleToken: action.payload,
          isAuthenticated: true,

        };
        case 'LOGOUTGOOGLE':
          return {
            ...state,
            googleToken: null,

    
          };
          case 'SetRole':
            return {
              ...state,
              Role: action.payload,
  
      
            };
            case 'Cr':
              return {
                ...state,
                Cr:action.payload,
        
              };

           

          
     
    default:
      return state;
  }
};

export default authReducer;
