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

    if (name === "cpf") {
      const numeros = value.replace(/\D/g, "").slice(0, 11);
      const formatado = numeros
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1-$2");
      setFormData((prev) => ({ ...prev, cpf: formatado }));
      return;
    }

    if (name === "telefone") {
      const numeros = value.replace(/\D/g, "").slice(0, 11);
      const formatado = numeros
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
      setFormData((prev) => ({ ...prev, telefone: formatado }));
      return;
    }

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

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    if (!emailValido) {
      toast.error("E-mail inválido!");
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
    <div className="cad-wrapper">
      <div className="cad-card">
        <h1 className="cad-title">Cadastro de Usuário</h1>

        <div className="cad-field">
          <label className="cad-label" htmlFor="nome-input">Nome completo</label>
          <input
            type="text"
            className="cad-input"
            id="nome-input"
            name="nome"
            placeholder="Nome Sobrenome"
            value={formData.nome}
            onChange={handleChange}
          />
        </div>

        <div className="cad-field">
          <label className="cad-label" htmlFor="email-input">E-mail</label>
          <input
            type="email"
            className="cad-input"
            id="email-input"
            name="email"
            placeholder="seu_email@email.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="cad-field">
          <label className="cad-label" htmlFor="cpf-input">CPF</label>
          <input
            type="text"
            className="cad-input"
            id="cpf-input"
            name="cpf"
            placeholder="000.000.000-00"
            value={formData.cpf}
            onChange={handleChange}
          />
        </div>

        <div className="cad-field">
          <label className="cad-label" htmlFor="telefone-input">Telefone</label>
          <input
            type="text"
            className="cad-input"
            id="telefone-input"
            name="telefone"
            placeholder="(11) 99999-9999"
            value={formData.telefone}
            onChange={handleChange}
          />
        </div>

        <div className="cad-field">
          <label className="cad-label" htmlFor="data-nascimento-input">Data de nascimento</label>
          <input
            type="date"
            className="cad-input"
            id="data-nascimento-input"
            name="dataNascimento"
            value={formData.dataNascimento}
            onChange={handleChange}
          />
        </div>

        <div className="cad-field">
          <label className="cad-label" htmlFor="sexo-select">Sexo</label>
          <select
            className="cad-input"
            id="sexo-select"
            name="sexo"
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

        <div className="cad-field">
          <label className="cad-label" htmlFor="cargo-input">Cargo</label>
          <input
            type="text"
            className="cad-input"
            id="cargo-input"
            name="cargo"
            placeholder="Analista de QA"
            value={formData.cargo}
            onChange={handleChange}
          />
        </div>

        <div className="cad-actions">
          <button className="cad-btn" onClick={handleSalvar}>Salvar</button>
          <button className="cad-btn cad-btn-cancel" onClick={handleLimpar}>Limpar dados</button>
        </div>
      </div>

      {previewData && (
        <div className="cad-preview">
          <h2 className="cad-preview-title">Dados Cadastrados</h2>
          <ul className="cad-preview-list">
            <li><strong>Nome:</strong> {previewData.nome}</li>
            <li><strong>Email:</strong> {previewData.email}</li>
            <li><strong>CPF:</strong> {previewData.cpf}</li>
            <li><strong>Telefone:</strong> {previewData.telefone}</li>
            <li><strong>Data de Nascimento:</strong> {previewData.dataNascimento}</li>
            <li><strong>Sexo:</strong> {sexoLabels[previewData.sexo] || ""}</li>
            <li><strong>Cargo:</strong> {previewData.cargo}</li>
          </ul>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={4000} />
    </div>
  );
}