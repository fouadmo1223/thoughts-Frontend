import { Bounce, ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";
import Header from "./componnents/Header";
import AppRoutes from "./routes/AppRoutes";
import { Provider } from "react-redux";
import store from "./redux/store";

const App = () => {
  const location = useLocation();
  const hideHeader =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/verfiy-email" ||
    location.pathname === "/reset-password" ||
    location.pathname === "/new-password";

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />

      <Provider store={store}>
        {!hideHeader && <Header />}
        <AppRoutes />
      </Provider>
    </>
  );
};

export default App;
