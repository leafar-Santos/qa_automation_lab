import React, { useState } from "react";
import "./Calculadora.css";

export default function Calculadora() {
  const [resultado, setResultado] = useState("");

  const operadores = ["/", "*", "+", "-"];

  const handleClick = (valor) => {
    if (valor === ".") {
      const partes = resultado.split(/[\+\-\*\/]/);
      const ultimaParte = partes[partes.length - 1];
      if (ultimaParte.includes(".")) return;
    }

    if (operadores.includes(valor)) {
      if (resultado === "") return;
      const ultimoChar = resultado.trim().slice(-1);
      if (operadores.includes(ultimoChar)) return;

      setResultado((prev) => `${prev.trim()} ${valor} `);
    } else {
      setResultado((prev) => prev + valor);
    }
  };

  const calcular = () => {
    try {
      setResultado(eval(resultado.replace(/\s/g, "")).toString());
    } catch {
      setResultado("Erro");
    }
  };

  const limpar = () => {
    setResultado("");
  };

  const apagarUltimo = () => {
    setResultado((prev) => prev.trimEnd().slice(0, -1));
  };

  return (
    <div className="calculadora-wrapper">
      <h2 className="calculadora-title">Calculadora</h2>

      <input
        type="text"
        value={resultado}
        className="calculadora-display"
        readOnly
      />

      <div className="calculadora-botoes">
        {["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "=", "+"].map((btn) => (
          <button
            key={btn}
            className={
              btn === "="
                ? "btn-igual"
                : operadores.includes(btn)
                ? "btn-operador"
                : ""
            }
            onClick={() => (btn === "=" ? calcular() : handleClick(btn))}
          >
            {btn}
          </button>
        ))}

        <button className="btn-del" onClick={apagarUltimo}>
          ⌫
        </button>
        <button className="btn-limpar" onClick={limpar}>
          C
        </button>
      </div>
    </div>
  );
}
