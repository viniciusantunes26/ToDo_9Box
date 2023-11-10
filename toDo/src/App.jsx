// Importa os módulos necessários do React
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, { useState, useEffect } from "react";

// Define um componente funcional chamado ListaDeTarefas
const ListaDeTarefas = () => {
  // Define estados para diferentes variáveis usando o hook useState
  const [tarefa, setTarefa] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const [tarefasRegistradas, setTarefasRegistradas] = useState([]);
  const [tarefasConcluidas, setTarefasConcluidas] = useState([]);

  // Efeito colateral para carregar tarefas salvas no localStorage quando o componente é montado
  useEffect(() => {
    const tarefasRegistradasSalvas = JSON.parse(
      localStorage.getItem("tarefasRegistradas")
    );
    if (tarefasRegistradasSalvas) {
      setTarefasRegistradas(tarefasRegistradasSalvas);
    }

    const tarefasConcluidasSalvas = JSON.parse(
      localStorage.getItem("tarefasConcluidas")
    );
    if (tarefasConcluidasSalvas) {
      setTarefasConcluidas(tarefasConcluidasSalvas);
    }
  }, []);

  // Efeito colateral para salvar tarefasRegistradas no localStorage quando tarefasRegistradas é alterado
  useEffect(() => {
    setTimeout(() => {
      if (tarefasRegistradas) {
        localStorage.setItem(
          "tarefasRegistradas",
          JSON.stringify(tarefasRegistradas)
        );
      }
    }, 0);
  }, [tarefasRegistradas]);

  // Efeito colateral para salvar tarefasConcluidas no localStorage quando tarefasConcluidas é alterado
  useEffect(() => {
    setTimeout(() => {
      if (tarefasConcluidas) {
        localStorage.setItem(
          "tarefasConcluidas",
          JSON.stringify(tarefasConcluidas)
        );
      }
    }, 0);
  }, [tarefasConcluidas]);

  // Função para verificar se a data é válida
  const isDataValida = (dataString) => {
    const padraoData = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!padraoData.test(dataString)) {
      return false;
    }

    const [dia, mes, ano] = dataString.split("/").map(Number);
    if (mes < 1 || mes > 12 || dia < 1 || dia > 31 || ano < 2022 || ano > 2030) {
      return false;
    }

    return true;
  };

  // Função para lidar com o registro de uma nova tarefa
  const handleRegistrar = () => {
    try {
      if (!tarefa || !descricao || !data) {
        alert("Preencha todos os campos.");
        return;
      }

      if (!isDataValida(data)) {
        alert("Data Inválida.");
        return;
      }

      // Cria um novo objeto de tarefa
      const novaTarefa = {
        tarefa: tarefa,
        descricao: descricao,
        data: data,
      };
      
      // Atualiza o estado das tarefas registradas
      setTarefasRegistradas([...tarefasRegistradas, novaTarefa]);
      // Limpa os campos de entrada
      setTarefa("");
      setDescricao("");
      setData("");
    } catch (error) {
      console.error("Erro", error);
    }
  };

  // Função para lidar com a exclusão de uma tarefa
  const handleExcluir = (indice, tipoLista) => {
    if (tipoLista === "tarefasRegistradas") {
      // Filtra as tarefas registradas, removendo a tarefa com o índice fornecido
      const tarefasAtualizadas = tarefasRegistradas.filter(
        (_, i) => i !== indice
      );
      // Atualiza o estado das tarefas registradas
      setTarefasRegistradas(tarefasAtualizadas);
    } else if (tipoLista === "tarefasConcluidas") {
      // Filtra as tarefas concluídas, removendo a tarefa com o índice fornecido
      const tarefasConcluidasAtualizadas = tarefasConcluidas.filter(
        (_, i) => i !== indice
      );
      // Atualiza o estado das tarefas concluídas
      setTarefasConcluidas(tarefasConcluidasAtualizadas);
    }
  };

  // Função para lidar com a conclusão de uma tarefa
  const handleConcluir = (indice) => {
    // Obtém a tarefa concluída com base no índice
    const tarefaConcluida = tarefasRegistradas[indice];
    // Adiciona a tarefa concluída ao estado das tarefas concluídas
    setTarefasConcluidas([...tarefasConcluidas, tarefaConcluida]);
    // Chama a função de exclusão para remover a tarefa concluída das tarefas registradas
    handleExcluir(indice, "tarefasRegistradas");
  };

  // Renderização do componente
  return (
    <div style={styles.container}>
      <h1 style={styles.todo}>Lista de Tarefas</h1>
      {/* Entradas para o nome, descrição e data da tarefa */}
      <input
        style={styles.input}
        placeholder="Nome da Tarefa"
        onChange={(e) => setTarefa(e.target.value)}
        value={tarefa}
      />
      <input
        style={styles.input}
        placeholder="Descrição"
        onChange={(e) => setDescricao(e.target.value)}
        value={descricao}
      />
      <input
        style={styles.input}
        placeholder="Data de Entrega"
        onChange={(e) => setData(e.target.value)}
        value={data}
      />
      {/* Botão para registrar uma nova tarefa */}
      <button style={styles.registrar} onClick={handleRegistrar}>
        Registrar
      </button>

      {/* Container para exibir tarefas pendentes e concluídas em duas colunas */}
      <div style={styles.tarefasContainer}>
        {/* Coluna para tarefas pendentes */}
        <div>
          <h2 style={styles.heading}>Tarefas Pendentes</h2>
          <ul>
            {tarefasRegistradas.map((item, indice) => (
              <li key={indice}>
                {/* Exibe informações da tarefa */}
                <p>{item.tarefa}</p>
                <p>{item.descricao}</p>
                <p>{item.data}</p>
                {/* Botões para concluir e excluir tarefas pendentes */}
                <button onClick={() => handleConcluir(indice)}>Concluir</button>
                <button
                  onClick={() => handleExcluir(indice, "tarefasRegistradas")}
                >
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Coluna para tarefas concluídas */}
        <div>
          <h2 style={styles.heading}>Tarefas Concluídas</h2>
          <ul>
            {tarefasConcluidas.map((item, indice) => (
              <li key={indice}>
                {/* Exibe informações da tarefa concluída */}
                <p>{item.tarefa}</p>
                <p>{item.descricao}</p>
                <p>{item.data}</p>
                {/* Botão para excluir tarefa concluída */}
                <button
                  onClick={() => handleExcluir(indice, "tarefasConcluidas")}
                >
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Estilos CSS para o componente
const styles = {
  todo: {
    color: "white",
  },
  container: {
    backgroundColor: "gray",
    alignItems: "center",
    display: "grid",
  },
  heading: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "50%",
    height: 30,
    borderColor: "gray",
    borderWidth: 3,
    borderRadius: 15,
    paddingLeft: 10,
    marginBottom: 10,
  },
  registrar: {
    width: "10%",
    marginTop: 10,
    padding: 10,
    backgroundColor: "green",
    color: "white",
    borderRadius: 15,
    cursor: "pointer",
  },
  tarefasContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
};

// Exporta o componente ListaDeTarefas para uso em outros arquivos
export default ListaDeTarefas;
