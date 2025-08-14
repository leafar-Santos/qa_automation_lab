import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CadastroUsuarioLab.css";

export default function CadastroUsuario() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    dataNascimento: "",
    sexo: "",
    cargo: "",
  });

  const [previewData, setPreviewData] = useState(null);

  const sexoLabels = {
    masculino: "Masculino",
    feminino: "Feminino",
    outro: "Outro",
    "nao-dizer": "Prefiro não dizer",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const allFilled = Object.values(formData).every(
    (v) => String(v).trim() !== ""
  );

  const handleSalvar = () => {
    if (!allFilled) {
      toast.error("Preencha os campos obrigatórios!");
      return;
    }
    setPreviewData(formData);
    setFormData({
      nome: "",
      email: "",
      cpf: "",
      telefone: "",
      dataNascimento: "",
      sexo: "",
      cargo: "",
    });
    toast.success("Usuário cadastrado com sucesso!");
  };

  const handleLimpar = () => {
    const isDirty =
      Object.values(formData).some((v) => String(v).trim() !== "") ||
      !!previewData;

    setFormData({
      nome: "",
      email: "",
      cpf: "",
      telefone: "",
      dataNascimento: "",
      sexo: "",
      cargo: "",
    });
    setPreviewData(null);

    if (isDirty) toast.info("Dados limpos.");
  };

  return (
    <div className="cad-wrapper" data-testid="cad-wrapper" data-qa="cad-wrapper">
      {/* FORM */}
      <div className="cad-card" id="cad-card" data-testid="cad-card" data-qa="cad-card">
        <h1 className="cad-title" id="cad-title" data-testid="cad-title" data-qa="cad-title">
          Cadastro de Usuário
        </h1>

        <div className="cad-field" id="cad-field-nome" data-testid="cad-field-nome" data-qa="cad-field-nome">
          <label className="cad-label" htmlFor="nome-input" id="nome-label" data-testid="nome-label" data-qa="nome-label">
            Nome completo
          </label>
          <input
            type="text"
            className="cad-input"
            id="nome-input"
            name="nome"
            data-testid="nome-input"
            data-qa="nome-input"
            placeholder="Nome Sobrenome"
            value={formData.nome}
            onChange={handleChange}
          />
        </div>

        <div className="cad-field" id="cad-field-email" data-testid="cad-field-email" data-qa="cad-field-email">
          <label className="cad-label" htmlFor="email-input" id="email-label" data-testid="email-label" data-qa="email-label">
            E-mail
          </label>
          <input
            type="email"
            className="cad-input"
            id="email-input"
            name="email"
            data-testid="email-input"
            data-qa="email-input"
            placeholder="seu_email@email.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="cad-field" id="cad-field-cpf" data-testid="cad-field-cpf" data-qa="cad-field-cpf">
          <label className="cad-label" htmlFor="cpf-input" id="cpf-label" data-testid="cpf-label" data-qa="cpf-label">
            CPF
          </label>
          <input
            type="text"
            className="cad-input"
            id="cpf-input"
            name="cpf"
            data-testid="cpf-input"
            data-qa="cpf-input"
            placeholder="000.000.000-00"
            value={formData.cpf}
            onChange={handleChange}
          />
        </div>

        <div className="cad-field" id="cad-field-telefone" data-testid="cad-field-telefone" data-qa="cad-field-telefone">
          <label className="cad-label" htmlFor="telefone-input" id="telefone-label" data-testid="telefone-label" data-qa="telefone-label">
            Telefone
          </label>
          <input
            type="text"
            className="cad-input"
            id="telefone-input"
            name="telefone"
            data-testid="telefone-input"
            data-qa="telefone-input"
            placeholder="(11) 99999-9999"
            value={formData.telefone}
            onChange={handleChange}
          />
        </div>

        <div className="cad-field" id="cad-field-data-nascimento" data-testid="cad-field-data-nascimento" data-qa="cad-field-data-nascimento">
          <label className="cad-label" htmlFor="data-nascimento-input" id="data-nascimento-label" data-testid="data-nascimento-label" data-qa="data-nascimento-label">
            Data de nascimento
          </label>
          <input
            type="date"
            className="cad-input"
            id="data-nascimento-input"
            name="dataNascimento"
            data-testid="data-nascimento-input"
            data-qa="data-nascimento-input"
            value={formData.dataNascimento}
            onChange={handleChange}
          />
        </div>

        <div className="cad-field" id="cad-field-sexo" data-testid="cad-field-sexo" data-qa="cad-field-sexo">
          <label className="cad-label" htmlFor="sexo-select" id="sexo-label" data-testid="sexo-label" data-qa="sexo-label">
            Sexo
          </label>
          <select
            className="cad-input"
            id="sexo-select"
            name="sexo"
            data-testid="sexo-select"
            data-qa="sexo-select"
            value={formData.sexo}
            onChange={handleChange}
          >
            <option value="">Selecione</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
            <option value="outro">Outro</option>
            <option value="nao-dizer">Prefiro não dizer</option>
          </select>
        </div>

        <div className="cad-field" id="cad-field-cargo" data-testid="cad-field-cargo" data-qa="cad-field-cargo">
          <label className="cad-label" htmlFor="cargo-input" id="cargo-label" data-testid="cargo-label" data-qa="cargo-label">
            Cargo
          </label>
          <input
            type="text"
            className="cad-input"
            id="cargo-input"
            name="cargo"
            data-testid="cargo-input"
            data-qa="cargo-input"
            placeholder="Analista de QA"
            value={formData.cargo}
            onChange={handleChange}
          />
        </div>

        <div className="cad-actions" data-testid="cad-actions">
          <button className="cad-btn" onClick={handleSalvar} data-testid="cad-btn-salvar">
            Salvar
          </button>
          <button className="cad-btn cad-btn-cancel" onClick={handleLimpar} data-testid="cad-btn-limpar">
            Limpar dados
          </button>
        </div>
      </div>

      {/* Preview */}
      {previewData && (
        <div className="cad-preview" data-testid="cad-preview">
          <h2 className="cad-preview-title">Dados Cadastrados</h2>
          <ul className="cad-preview-list">
            <li><strong>Nome:</strong> <span data-testid="pv-nome">{previewData.nome}</span></li>
            <li><strong>Email:</strong> <span data-testid="pv-email">{previewData.email}</span></li>
            <li><strong>CPF:</strong> <span data-testid="pv-cpf">{previewData.cpf}</span></li>
            <li><strong>Telefone:</strong> <span data-testid="pv-telefone">{previewData.telefone}</span></li>
            <li><strong>Data de Nascimento:</strong> <span data-testid="pv-data">{previewData.dataNascimento}</span></li>
            <li>
              <strong>Sexo:</strong>{" "}
              <span data-testid="pv-sexo">
                {sexoLabels[previewData.sexo] || ""}
              </span>
            </li>
            <li><strong>Cargo:</strong> <span data-testid="pv-cargo">{previewData.cargo}</span></li>
          </ul>
        </div>
      )}

      {/* Toasts */}
      <ToastContainer position="top-right" autoClose={4000} />
    </div>
  );
}
