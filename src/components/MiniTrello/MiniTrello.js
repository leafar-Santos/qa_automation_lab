import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./MiniTrello.css";

export default function MiniTrello() {
  const [novoTitulo, setNovoTitulo] = useState("");
  const [cards, setCards] = useState({
    "A Fazer": [],
    "Em Progresso": [],
    "Concluído": [],
  });

  const colunas = Object.keys(cards);

  const adicionarCard = () => {
    const titulo = novoTitulo.trim();

    if (!titulo) {
      toast.warning("Informe um título para a tarefa!");
      return;
    }

    const duplicado = Object.values(cards).some(coluna =>
      coluna.some(card => card.titulo.toLowerCase() === titulo.toLowerCase())
    );

    if (duplicado) {
      toast.error("Essa tarefa já foi cadastrada!");
      return;
    }

    const novoCard = { id: Date.now(), titulo };
    setCards(prev => ({
      ...prev,
      "A Fazer": [...prev["A Fazer"], novoCard],
    }));

    setNovoTitulo("");
    toast.success("Tarefa adicionada com sucesso!");
  };

  const excluirCard = (coluna, id) => {
    setCards(prev => ({
      ...prev,
      [coluna]: prev[coluna].filter(card => card.id !== id),
    }));
    toast.info("Tarefa excluída!");
  };

  const onDragStart = (e, cardId, sourceColumn) => {
    e.dataTransfer.setData("cardId", cardId);
    e.dataTransfer.setData("sourceColumn", sourceColumn);
  };

  const onDrop = (e, targetColumn) => {
    const cardId = e.dataTransfer.getData("cardId");
    const sourceColumn = e.dataTransfer.getData("sourceColumn");

    if (!cardId || !sourceColumn || sourceColumn === targetColumn) return;

    const card = cards[sourceColumn].find((c) => c.id.toString() === cardId);
    if (!card) return;

    setCards(prev => {
      const updatedSource = prev[sourceColumn].filter(c => c.id.toString() !== cardId);
      const updatedTarget = [...prev[targetColumn], card];

      return {
        ...prev,
        [sourceColumn]: updatedSource,
        [targetColumn]: updatedTarget,
      };
    });
  };

  const allowDrop = (e) => e.preventDefault();

  const getColumnClass = (coluna) => {
    switch (coluna) {
      case "A Fazer": return "trello-column trello-col-afazer";
      case "Em Progresso": return "trello-column trello-col-fazendo";
      case "Concluído": return "trello-column trello-col-concluido";
      default: return "trello-column";
    }
  };

  return (
    <div className="trello-wrapper" data-testid="mini-trello-wrapper">
      <h2 className="trello-title">Mini Trello (Drag & Drop)</h2>

      <div className="trello-form" data-testid="trello-form">
        <input
          type="text"
          className="trello-input"
          placeholder="Nova tarefa..."
          value={novoTitulo}
          onChange={(e) => setNovoTitulo(e.target.value)}
          data-testid="trello-input"
        />
        <button
          className="trello-btn"
          onClick={adicionarCard}
          data-testid="btn-add-card"
        >
          Adicionar
        </button>
      </div>

      <div className="trello-board">
        {colunas.map((coluna) => (
          <div
            className={getColumnClass(coluna)}
            key={coluna}
            onDrop={(e) => onDrop(e, coluna)}
            onDragOver={allowDrop}
            data-testid={`coluna-${coluna}`}
          >
            <h3 className="trello-col-title">{coluna}</h3>
            {cards[coluna].map((card) => (
              <div
                className="trello-card"
                key={card.id}
                draggable
                onDragStart={(e) => onDragStart(e, card.id, coluna)}
                data-testid={`card-${card.id}`}
              >
                <span>{card.titulo}</span>
                <button
                  className="trello-remove"
                  onClick={() => excluirCard(coluna, card.id)}
                  data-testid={`btn-remover-${card.id}`}
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
