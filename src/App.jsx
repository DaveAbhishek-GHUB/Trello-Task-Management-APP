import { Route, Routes } from "react-router-dom"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import HomePage from "./pages/HomePage"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";

function App() {

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  )
}

export default App
