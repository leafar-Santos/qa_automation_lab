import './App.css';
import React, { useEffect, useState } from "react";
import Sidebar from './components/Sidebar/SideBar';
import Login from './components/LoginLab/Login';
import CadastroUsuario from './components/CadastroUsuario/CadastroUsuarioLab';
import ListaDeTarefas from './components/ListaDeTarefas/ListaDeTarefas';
import MiniTrello from './components/MiniTrello/MiniTrello';
import CarrinhoDeCompras from './components/CheckoutPagamento/CarrinhoDeCompras';
import Calculadora from './components/Calculadora/Calculadora';

import {
  FaShoppingCart,
  FaSignInAlt,
  FaUserPlus,
  FaTasks,
  FaProjectDiagram,
  FaCalculator,
} from "react-icons/fa";

// Lê o valor do hash na URL
const getRotaAtual = () => {
  const hash = window.location.hash.replace("#", "");
  return hash || "login";
};

function App() {
  const [rotaAtiva, setRotaAtiva] = useState(getRotaAtual);

  const telas = [
    { id: 'carrinho-de-compras', nome: 'Carrinho De Compras', icon: <FaShoppingCart /> },
    { id: 'login', nome: 'Login', icon: <FaSignInAlt /> },
    { id: 'cadastro-usuario', nome: 'Cadastro de Usuário', icon: <FaUserPlus /> },
    { id: 'lista-de-tarefas', nome: 'Lista de Tarefas', icon: <FaTasks /> },
    { id: 'mini-trello', nome: 'Mini Trello', icon: <FaProjectDiagram /> },
    { id: 'calculadora', nome: 'Calculadora', icon: <FaCalculator /> },
  ];

  // Atualiza a URL quando a rota muda
  const handleNavigate = (id) => {
    setRotaAtiva(id);
    window.location.hash = id;
  };

  // Escuta mudanças no hash (voltar/avançar no navegador)
  useEffect(() => {
    const onHashChange = () => {
      setRotaAtiva(getRotaAtual());
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <div className="container">
      <Sidebar
        items={telas}
        active={rotaAtiva}
        onNavigate={handleNavigate}
      />

      <div className="content">
        {rotaAtiva === 'carrinho-de-compras' && <CarrinhoDeCompras />}
        {rotaAtiva === 'login' && <Login />}
        {rotaAtiva === 'cadastro-usuario' && <CadastroUsuario />}
        {rotaAtiva === 'lista-de-tarefas' && <ListaDeTarefas />}
        {rotaAtiva === 'mini-trello' && <MiniTrello />}
        {rotaAtiva === 'calculadora' && <Calculadora />}
      </div>
    </div>
  );
}

export default App;
