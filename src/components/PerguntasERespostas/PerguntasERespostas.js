import { useState, useEffect, useRef } from "react";
import perguntasJson from "../../data/perguntas.json";
import "./PerguntasERespostas.css";

function embaralhar(array) {
  const copia = [...array];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

const dificuldades = {
  facil: 1,
  medio: 2,
  dificil: 3
};

const perguntasUtilizadasGlobal = {
  facil: new Set(),
  medio: new Set(),
  dificil: new Set(),
};

export default function PerguntasERespostas() {
  const TOTAL_PERGUNTAS = 10;
  const [perguntas, setPerguntas] = useState([]);
  const [indice, setIndice] = useState(0);
  const [pontuacao, setPontuacao] = useState(0);
  const [respostaCorreta, setRespostaCorreta] = useState(null);
  const [terminou, setTerminou] = useState(false);
  const [nivel, setNivel] = useState("facil");
  const [telaInicial, setTelaInicial] = useState(true);
  const [tempo, setTempo] = useState(15);
  const timerRef = useRef(null);
  const [ajudasRestantes, setAjudasRestantes] = useState(1);
  const [alternativasOcultas, setAlternativasOcultas] = useState([]);

  const sortearPerguntas = (nivelSelecionado) => {
    const dificuldadeNum = dificuldades[nivelSelecionado];
    const todas = perguntasJson.filter((p) => p.dificuldade === dificuldadeNum);
    const vistas = perguntasUtilizadasGlobal[nivelSelecionado];

    const novasPerguntas = [];
    for (const p of embaralhar(todas)) {
      if (!vistas.has(p.pergunta)) {
        vistas.add(p.pergunta);
        novasPerguntas.push(p);
      }
      if (novasPerguntas.length === TOTAL_PERGUNTAS) break;
    }

    return novasPerguntas;
  };

  const iniciarJogo = () => {
    const novasPerguntas = sortearPerguntas(nivel);
    setPerguntas(novasPerguntas);
    setIndice(0);
    setPontuacao(0);
    setRespostaCorreta(null);
    setTerminou(false);
    setTelaInicial(false);
    setTempo(15);
    setAjudasRestantes(1);
    setAlternativasOcultas([]);
  };

  useEffect(() => {
    if (respostaCorreta !== null || terminou || telaInicial) return;

    setTempo(15);
    timerRef.current = setInterval(() => {
      setTempo((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setRespostaCorreta(-1);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [indice, respostaCorreta, terminou, telaInicial]);

  const proximaPergunta = () => {
    if (indice + 1 < perguntas.length) {
      setIndice(indice + 1);
      setRespostaCorreta(null);
      setAlternativasOcultas([]);
    } else {
      setTerminou(true);
    }
  };

  const responder = (index) => {
    if (respostaCorreta !== null) return;
    clearInterval(timerRef.current);
    setRespostaCorreta(index);
    const correta = perguntas[indice].correta;
    if (index === correta) {
      setPontuacao((p) => p + 1);
    }
  };

  const usarAjuda = () => {
    if (ajudasRestantes > 0 && respostaCorreta === null) {
      const correta = perguntas[indice].correta;
      let indicesErrados = perguntas[indice].alternativas.map((_, i) => i).filter(i => i !== correta);
      const removido = embaralhar(indicesErrados).slice(0, 1);
      setAlternativasOcultas(removido);
      setAjudasRestantes(ajudasRestantes - 1);
    }
  };

  if (telaInicial) {
    return (
      <div className="quiz-show-container light-theme" data-testid="quiz-start">
        <h1 className="quiz-title" data-testid="quiz-title">🎯 Escolha a dificuldade</h1>
        <div className="quiz-options">
          <button className="quiz-button quiz-button-facil" data-cy="btn-facil" onClick={() => { setNivel("facil"); iniciarJogo(); }}>🔰 Fácil</button>
          <button className="quiz-button quiz-button-medio" data-cy="btn-medio" onClick={() => { setNivel("medio"); iniciarJogo(); }}>⚖️ Médio</button>
          <button className="quiz-button quiz-button-dificil" data-cy="btn-dificil" onClick={() => { setNivel("dificil"); iniciarJogo(); }}>🔥 Difícil</button>
        </div>
      </div>
    );
  }

  if (perguntas.length === 0) return null;

  if (terminou) {
    return (
      <div className="quiz-show-container light-theme" data-testid="quiz-end">
        <h1 className="quiz-title">🎉 Fim de Jogo!</h1>
        <p className="quiz-score" data-testid="score">Você acertou {pontuacao} de {TOTAL_PERGUNTAS} perguntas.</p>
        <button className="quiz-button" data-cy="btn-restart" onClick={() => setTelaInicial(true)}>🔁 Jogar Novamente</button>
      </div>
    );
  }

  const atual = perguntas[indice];
  const tempoPercentual = (tempo / 15) * 100;

  return (
    <div className="quiz-show-container light-theme" data-testid="quiz-game">
      <div className="quiz-header">
        <h2 className="quiz-round" data-testid="quiz-round">Pergunta {indice + 1} de {TOTAL_PERGUNTAS}</h2>
        <p className="quiz-score" data-testid="quiz-score">Pontuação: {pontuacao} | 🧠 Ajuda: {ajudasRestantes}</p>
      </div>
      <div className="quiz-timer-bar" data-testid="quiz-timer">
        <div className="timer-fill" style={{ width: `${tempoPercentual}%` }}></div>
      </div>
      <div className="quiz-content">
        <p className="quiz-question" data-testid="quiz-question">💡 {atual.pergunta}</p>
        <div className="quiz-options" data-testid="quiz-options">
          {atual.alternativas.map((alt, i) => (
            <button
              key={i}
              disabled={alternativasOcultas.includes(i)}
              data-testid={`option-${i}`}
              data-cy={`option-${i}`}
              className={`quiz-option-button ${
                alternativasOcultas.includes(i) ? 'neutro' :
                respostaCorreta !== null
                  ? i === atual.correta
                    ? 'acerto'
                    : i === respostaCorreta
                    ? 'erro'
                    : 'neutro'
                  : 'ativo'
              }`}
              onClick={() => responder(i)}
            >
              {alt}
            </button>
          ))}
        </div>
        {respostaCorreta === null && ajudasRestantes > 0 && (
          <button className="quiz-button" data-testid="btn-ajuda" onClick={usarAjuda}>🧠 Usar Ajuda</button>
        )}
        {respostaCorreta !== null && (
          <button className="quiz-button" data-testid="btn-proxima" onClick={proximaPergunta}>👉 Próxima Pergunta</button>
        )}
      </div>
    </div>
  );
}