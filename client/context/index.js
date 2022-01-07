import { useReducer, createContext, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

// initial state
const initialState = {
  user: null,
};

// create context
const Context = createContext();

// reducer function responsible for updating state and data from the state
const rootReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };

    case "LOGOUT":
      return { ...state, user: null };

    default:
      return state;
  }
};

// context provider
const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);

  // router
  const router = useRouter();

  useEffect(() => {
    dispatch({
      type: "LOGIN",
      payload: JSON.parse(window.localStorage.getItem("user")),
    });
  }, []);

  // handle expired token
  axios.interceptors.response.use(
    function (response) {
      // status code that lies within the range of 2xx causes this fn to trigger
      return response;
    },
    function (error) {
      // status code outside of 2xx
      let res = error.response;
      if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
        return new Promise((resolve, reject) => {
          axios
            .get("/api/logout")
            .then((data) => {
              console.log("401 error: LOGOUT");
              dispatch({ type: "LOGOUT" });
              window.localStorage.removeItem("user");
              router.push("/login");
            })
            .catch((err) => {
              console.log("AXIOS INTERCEPTORS ERROR");
              reject(error);
            });
        });
      }

      return Promise.reject(error);
    }
  );

  // get csrf token
  useEffect(() => {
    const getCsrfToken = async () => {
      const { data } = await axios.get("/api/csrf-token");
      //   console.log("CSRF", data);
      axios.defaults.headers["X-CSRF-Token"] = data.getCsrfToken;
    };

    getCsrfToken();
  }, []);

  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};

export { Context, Provider };
