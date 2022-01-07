// Nextjs uses App component to initialise pages
// specifically _app.js
// This component runs before any page gets ready for users to see
import TopNav from "../components/TopNav";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.css";
import "../public/css/styles.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "../context";

function MyApp({ Component, pageProps }) {
  return (
    <Provider>
      <ToastContainer position="top-center" />
      <TopNav />
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
