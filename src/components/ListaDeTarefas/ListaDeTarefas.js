import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ListaDeTarefas.css";

export default function ListaDeTarefas() {
  const [tarefa, setTarefa] = useState("");
  const [tarefas, setTarefas] = useState([]);

  const handleAdd = () => {
    const nome = tarefa.trim();

    if (nome === "") {
      toast.warning("Digite uma tarefa antes de adicionar.");
      return;
    }

    const duplicada = tarefas.some((t) => t.texto.toLowerCase() === nome.toLowerCase());
    if (duplicada) {
      toast.error("Essa tarefa já foi adicionada.");
      return;
    }

    setTarefas([...tarefas, { id: Date.now(), texto: nome, feito: false }]);
    setTarefa("");
    toast.success("Tarefa adicionada com sucesso!");
  };

  const toggleFeito = (id) => {
    setTarefas((prev) =>
      prev.map((t) => (t.id === id ? { ...t, feito: !t.feito } : t))
    );
  };

  const removerTarefa = (id) => {
    const tarefaExcluida = tarefas.find((t) => t.id === id);
    setTarefas((prev) => prev.filter((t) => t.id !== id));
    if (tarefaExcluida) {
      toast.info(`Tarefa "${tarefaExcluida.texto}" excluída.`);
    }
  };

  return (
    <div
      className="todo-container"
      data-testid="todo-container"
      data-qa="todo-container"
    >
      <h2
        className="todo-title"
        data-testid="todo-title"
        data-qa="todo-title"
      >
        📋 Lista de Tarefas
      </h2>

      <div
        className="todo-form"
        data-testid="todo-form"
        data-qa="todo-form"
      >
        <input
          type="text"
          placeholder="Digite uma tarefa..."
          value={tarefa}
          onChange={(e) => setTarefa(e.target.value)}
          className="todo-input"
          data-testid="todo-input"
          data-qa="todo-input"
        />
        <button
          onClick={handleAdd}
          className="todo-btn"
          data-testid="todo-btn-add"
          data-qa="todo-btn-add"
        >
          Adicionar
        </button>
      </div>

      <ul
        className="todo-list"
        data-testid="todo-list"
        data-qa="todo-list"
      >
        {tarefas.map((t) => (
          <li
            key={t.id}
            className={`todo-item ${t.feito ? "feito" : ""}`}
            data-testid={`todo-item-${t.id}`}
            data-qa={`todo-item-${t.id}`}
          >
            <span
              onClick={() => toggleFeito(t.id)}
              data-testid={`todo-text-${t.id}`}
              data-qa={`todo-text-${t.id}`}
            >
              {t.texto}
            </span>
            <button
              className="todo-remove"
              onClick={() => removerTarefa(t.id)}
              data-testid={`todo-remove-${t.id}`}
              data-qa={`todo-remove-${t.id}`}
            >
              ✖
            </button>
          </li>
        ))}
        {tarefas.length === 0 && (
          <p
            className="todo-vazio"
            data-testid="todo-vazio"
            data-qa="todo-vazio"
          >
            Sem tarefas no momento.
          </p>
        )}
      </ul>

      <ToastContainer position="top-right" autoClose={4000} />
    </div>
  );
}
