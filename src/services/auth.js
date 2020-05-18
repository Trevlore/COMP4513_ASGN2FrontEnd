import { navigate } from 'gatsby';
import * as _ from 'lodash';
import jwt from "jsonwebtoken"

export const isBrowser = () => typeof window !== "undefined"

export const getToken = () => {
  const tokenObj = JSON.parse(window.localStorage.getItem("token"));
  if (isBrowser() && tokenObj!=null && ! _.isEmpty(tokenObj)) {
    const decoded = jwt.decode(tokenObj.token);
    if (new Date(decoded['exp'] * 1000) > Date.now()) {
      return tokenObj;
    }
  }
  return {}
}

const setToken = token =>
  window.localStorage.setItem("token", JSON.stringify(token))

export const handleLogin = async (values) => {
    try {
        const response = await fetch(`https://demos-277419.uc.r.appspot.com/api/login`, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values)
        });
        const status = await response.status;

        const userData = await response.json();

        if( userData && status !== 401) {
          return setToken(userData);
        }


      } catch(e) {
        console.log(e);
      }

  return false
}

export const isLoggedIn = () => {
  const token = getToken();
  return Object.entries(token).length !==0
}

export const logout = () => {
  setToken({});
  navigate('/app/login/');
}

export const makeAuthUrl = (url) => {
    const authToken = getToken().token;
    return `${url}?auth_token=${authToken}`
};
