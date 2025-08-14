// ... imports
import { useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const userInputRef = useRef(null);

  const USUARIO_PADRAO = "admin";
  const SENHA_PADRAO = "admin";

  const handleLogin = () => {
    if (!usuario || !senha) {
      if (!usuario) toast.error("Informe o usuário!");
      if (!senha) toast.error("Informe a senha!");
      return;
    }

    if (usuario === USUARIO_PADRAO && senha === SENHA_PADRAO) {
      toast.success("Login efetuado com sucesso!");
      setUsuario("");
      setSenha("");
      setTimeout(() => userInputRef.current?.focus(), 0);
    } else {
      toast.error("Usuário ou senha incorretos!");
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    toast.info("Entre em contato com o administrador.");
  };

  return (
    <div className="login-card" id="login-card" data-testid="login-card" data-qa="login-card">
      <h1 className="login-title" id="login-title" data-testid="login-title" data-qa="login-title">
        Entrar no Auto Teste Lab
      </h1>

      <label className="login-label" htmlFor="usuario-input" id="usuario-label" data-testid="usuario-label" data-qa="usuario-label">
        Usuário
      </label>
      <input
        ref={userInputRef}
        className="login-input"
        id="usuario-input"
        name="usuario"
        data-testid="usuario-input"
        data-qa="usuario-input"
        type="text"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        placeholder="Digite seu usuário"
      />

      <label className="login-label" htmlFor="senha-input" id="senha-label" data-testid="senha-label" data-qa="senha-label">
        Senha
      </label>
      <input
        className="login-input"
        id="senha-input"
        name="senha"
        data-testid="senha-input"
        data-qa="senha-input"
        type="password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        placeholder="Digite sua senha"
      />

    
      <p className="login-info">Usuario padrão: <strong>admin</strong></p>
      <p className="login-info">Senha padrão: <strong>admin</strong></p>

      <div className="login-actions" id="login-actions" data-testid="login-actions" data-qa="login-actions">
        <button
          className="login-btn"
          id="login-btn"
          name="login-btn"
          data-testid="login-btn"
          data-qa="login-btn"
          onClick={handleLogin}
        >
          Entrar
        </button>

        <a
          href="#"
          className="login-link"
          id="forgot-password-link"
          data-testid="forgot-password-link"
          data-qa="forgot-password-link"
          onClick={handleForgotPassword}
        >
          Esqueci minha senha
        </a>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        toastClassName="toast"
        bodyClassName="toast-body"
        data-testid="toast-container"
        data-qa="toast-container"
      />
    </div>
  );
}
