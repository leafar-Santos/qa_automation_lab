import { useState, useEffect } from "react";
import "./CarrinhoDeCompras.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import produtosJson from "../../data/produtos.json";

export default function CarrinhoDeCompras() {
  const [itens, setItens] = useState([]);
  const [busca, setBusca] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 6;
  const [cupom, setCupom] = useState("");
  const [desconto, setDesconto] = useState(0);
  const [cep, setCep] = useState("");
  const [frete, setFrete] = useState(0);

  useEffect(() => {
    setProdutos(produtosJson);
    setProdutosFiltrados(produtosJson);
    const salvo = localStorage.getItem("carrinho");
    try {
      const dados = salvo ? JSON.parse(salvo) : [];
      setItens(dados);
    } catch {
      setItens([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("carrinho", JSON.stringify(itens));
  }, [itens]);

  const atualizarEstoque = (id, delta) => {
    setProdutos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, estoque: p.estoque + delta } : p))
    );
    setProdutosFiltrados((prev) =>
      prev.map((p) => (p.id === id ? { ...p, estoque: p.estoque + delta } : p))
    );
  };

  const adicionarAoCarrinho = (produto) => {
    const estoqueAtual = produtos.find((p) => p.id === produto.id)?.estoque ?? 0;
    if (estoqueAtual <= 0) return toast.warning("Estoque insuficiente.");

    const existente = itens.find((item) => item.id === produto.id);
    if (existente) {
      setItens((prev) =>
        prev.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        )
      );
    } else {
      setItens([...itens, { ...produto, quantidade: 1 }]);
    }
    atualizarEstoque(produto.id, -1);
    toast.success("Produto adicionado ao carrinho.");
  };

  const atualizarQuantidade = (id, delta) => {
    const itemAtual = itens.find((i) => i.id === id);
    if (!itemAtual) return;

    const novaQuantidade = itemAtual.quantidade + delta;
    if (novaQuantidade < 1) return;

    const estoqueAtual = produtos.find((p) => p.id === id)?.estoque ?? 0;
    if (delta > 0 && estoqueAtual < 1) {
      return toast.warning("Estoque insuficiente.");
    }

    setItens((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantidade: novaQuantidade } : item
      )
    );

    atualizarEstoque(id, -delta);
  };

  const removerItem = (id) => {
    const itemRemovido = itens.find((i) => i.id === id);
    if (!itemRemovido) return;
    atualizarEstoque(id, itemRemovido.quantidade);
    setItens((prev) => prev.filter((item) => item.id !== id));
    toast.info(`${itemRemovido.nome} removido do carrinho.`);
  };

  const aplicarCupom = () => {
    if (!cupom.trim()) {
      toast.warning("Informe um cupom antes de aplicar.");
      return;
    }
    if (itens.length === 0) {
      toast.warning("Adicione itens ao carrinho antes de aplicar o cupom.");
      return;
    }
    if (cupom === "MEUDESCONTO10") {
      const descontoCalculado = total * 0.1;
      setDesconto(descontoCalculado);
      toast.success("Cupom aplicado com 10% de desconto!");
    } else {
      setDesconto(0);
      toast.error("Cupom inválido.");
    }
  };

  const removerCupom = () => {
    setCupom("");
    setDesconto(0);
    toast.info("Cupom removido.");
  };

  const removerFrete = () => {
    setCep("");
    setFrete(0);
    toast.info("Frete removido.");
  };

  const calcularFrete = () => {
    if (!cep.trim()) {
      setFrete(0);
      toast.warning("Informe o CEP");
      return;
    }
    const base = parseInt(cep.charAt(0));
    const valor = base >= 5 ? 29.9 : 15.9;
    setFrete(valor);
    toast.success(`Frete calculado: R$ ${valor.toFixed(2)}`);
  };

  const limparCarrinho = () => {
    if (itens.length === 0) {
      toast.info("Carrinho já está vazio.");
      return;
    }
    itens.forEach((item) => atualizarEstoque(item.id, item.quantidade));
    setItens([]);
    setCupom("");
    setDesconto(0);
    setFrete(0);
    setCep("");
    toast.success("Carrinho esvaziado com sucesso.");
  };

  const finalizarCompra = () => {
    if (itens.length === 0) {
      toast.warning("Adicione itens antes de finalizar a compra.");
      return;
    }
    toast.success("Compra finalizada com sucesso!");
    limparCarrinho();
  };

  const total = itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  const totalComDesconto = total - desconto + frete;

  const buscarProduto = () => {
    const resultado = produtos.filter((item) =>
      item.nome.toLowerCase().includes(busca.toLowerCase())
    );
    setProdutosFiltrados(resultado);
    setPaginaAtual(1);
  };

  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const itensPaginados = produtosFiltrados.slice(indiceInicial, indiceInicial + itensPorPagina);
  const totalPaginas = Math.ceil(produtosFiltrados.length / itensPorPagina);

  return (
    <div className="cart-wrapper">
      <h2 className="cart-title">🛒 Carrinho de Compras</h2>

      <div className="cart-form">
        <input
          placeholder="Buscar produto..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <button onClick={buscarProduto}>🔍 Buscar</button>
      </div>

      <div className="cart-layout">
        <div className="product-grid">
          {itensPaginados.length === 0 ? (
            <p className="cart-empty">Nenhum produto encontrado.</p>
          ) : (
            itensPaginados.map((produto) => (
              <div key={produto.id} className="product-card">
                <h4>{produto.nome}</h4>
                <p>{produto.descricao}</p>
                <p>R$ {produto.preco.toFixed(2)}</p>
                <p className="estoque">Disponível: {produto.estoque}</p>
                <button onClick={() => adicionarAoCarrinho(produto)} disabled={produto.estoque === 0}>
                  {produto.estoque === 0 ? "Indisponível" : "Adicionar ao carrinho"}
                </button>
              </div>
            ))
          )}

          {totalPaginas > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numero) => (
                <button
                  key={numero}
                  onClick={() => setPaginaAtual(numero)}
                  className={paginaAtual === numero ? "active" : ""}
                >
                  {numero}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="carrinho-lateral">
          <h3 className="cart-title">🧾 Itens no Carrinho</h3>

          <div className="cart-list">
            {itens.length === 0 ? (
              <p className="cart-empty">Nenhum item no carrinho.</p>
            ) : (
              <ul>
                {itens.map((item) => (
                  <li key={item.id} className="cart-item">
                    <div className="item-info">
                      <strong>{item.nome}</strong>
                      <span>R$ {item.preco.toFixed(2)}</span>
                      <span>Subtotal: R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                      <span>Estoque: {item.estoque + item.quantidade} unidades</span>
                    </div>
                    <div className="item-controls">
                      <div className="item-actions">
                        <button onClick={() => atualizarQuantidade(item.id, -1)} disabled={item.quantidade <= 1}>-</button>
                        <span>{item.quantidade}</span>
                        <button onClick={() => atualizarQuantidade(item.id, 1)}>+</button>
                      </div>
                      <button className="item-remove" onClick={() => removerItem(item.id)}>✖</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="cart-total">
            <span>Total:</span>
            <strong>R$ {total.toFixed(2)}</strong>
          </div>

          {desconto > 0 && (
            <div className="cart-desconto">
              <span>Desconto:</span>
              <strong>- R$ {desconto.toFixed(2)}</strong>
              <button className="remover-cupom" onClick={removerCupom}>Remover Cupom</button>
            </div>
          )}

          {frete > 0 && (
            <div className="cart-frete-info">
              <span>Frete:</span>
              <strong>R$ {frete.toFixed(2)}</strong>
              <button className="remover-frete" onClick={removerFrete}>Remover Frete</button>
            </div>
          )}

          <div className="cart-frete-cupom">
            <input
              placeholder="Digite o CEP"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
            />
            <button onClick={calcularFrete}>Calcular Frete</button>
            <input
              placeholder="MEUDESCONTO10"
              value={cupom}
              onChange={(e) => setCupom(e.target.value)}
            />
            <button onClick={aplicarCupom}>Aplicar Cupom</button>
          </div>

          <div className="cart-total-final">
            <span>Total com Desconto e Frete:</span>
            <strong>R$ {totalComDesconto.toFixed(2)}</strong>
          </div>

          <div className="cart-actions">
            <button onClick={limparCarrinho}>🧹 Esvaziar Carrinho</button>
            <button onClick={finalizarCompra}>💳 Finalizar Compra</button>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
