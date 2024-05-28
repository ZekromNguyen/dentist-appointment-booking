import TodoList from "./components/TodoList";

function Login() {
  return (

    <div className="all">
      <div><h3 className="title">Login Page</h3></div>
      <div className="div-sdt">
        <input type="text" className="sdt" placeholder="Enter phone number..." />
      </div>
      <div className="div-password">
        <input type="password" className="password" placeholder="password" />
      </div>
      <div className="div-login">
        <button className="login-button">Login</button>
      </div>
      <div className="shift"></div>
      <div>
        <a className="text-forget" href="">Forgoten password ?</a>
      </div>
      <div className="button-create-div">
        <button className="create-button">Create new account</button>
      </div>
      <TodoList />
    </div>

  );
}

export default Login;
