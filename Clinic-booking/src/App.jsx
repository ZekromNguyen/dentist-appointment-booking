import './App.css'
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home/Home';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import LoginDentist from './components/LoginDentist/LoginDentist';
function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />} ></Route>
        <Route path="/loginDentist" element={<LoginDentist />}></Route>
      </Routes>

    </div>
  )
}

export default App
