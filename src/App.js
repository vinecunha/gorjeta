import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Slider } from 'primereact/slider';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './App.css';

const ContaRestaurante = () => {
  const [numPessoas, setNumPessoas] = useState(1);
  const [igualitaria, setIgualitaria] = useState(true);
  const [itensConta, setItensConta] = useState([{ valor: 0, sidebarVisivel: false }]);
  const [porcentagemGorjeta, setPorcentagemGorjeta] = useState(10);
  const [totalConta, setTotalConta] = useState(0);
  const [dataAtual, setDataAtual] = useState(new Date());
  const [itensSidebar, setItensSidebar] = useState([]);
  const [indexSidebarAtivo, setindexSidebarAtivo] = useState(-1);


  const handleNumPessoasChange = (valor) => {
    const num = parseInt(valor);
    setNumPessoas(num > 0 ? num : 1);

    if (num > itensConta.length) {
      const diferenca = num - itensConta.length;
      const novosItens = Array.from({ length: diferenca }, () => ({
        valor: 0,
        sidebarVisivel: false,
      }));
      setItensConta([...itensConta, ...novosItens]);
    } else if (num < itensConta.length) {
      const novosItens = itensConta.slice(0, num);
      setItensConta(novosItens);
    }
  };

  const handlePorcentagemGorjetaChange = (valor) => {
    setPorcentagemGorjeta(valor >= 0 ? parseFloat(valor) : 10);
  };

  const handleValorItemChange = (index, valor) => {
    const novosItens = [...itensConta];
    novosItens[index] = { ...novosItens[index], valor: parseFloat(valor) };
    setItensConta(novosItens);
  };  

  const handleItensSidebarChange = (index, valor) => {
    const novosItensSidebar = [...itensSidebar];
    novosItensSidebar[index] = parseFloat(valor);
    setItensSidebar(novosItensSidebar);
  };

  const handleTotalContaChange = (valor) => {
    setTotalConta(valor ? parseFloat(valor) : 0);
  };

  const handleAdicionarItem = (index) => {
    setindexSidebarAtivo(index);
    const novosItens = [...itensConta];
    novosItens[index].sidebarVisivel = true;
    setItensConta(novosItens);
    setItensSidebar(novosItens[index].itensSidebar || []);
  };

  const handleAdicionarItemSidebar = () => {
    setItensSidebar([...itensSidebar, 0]);
  };

  const handleSidebarAdicionarItem = (index) => {
    const novosItensConta = [...itensConta];
    const totalSidebar = itensSidebar.reduce((total, item) => total + parseFloat(item), 0);
  
    novosItensConta

[index].valor = totalSidebar;
    novosItensConta[index].sidebarVisivel = false;
    novosItensConta[index].itensSidebar = [...itensSidebar];
    setItensConta(novosItensConta);
    setItensSidebar([]);
  };

  const handleRemoverItemSidebar = (index) => {
    const novosItensSidebar = [...itensSidebar];
    novosItensSidebar.splice(index, 1);
    setItensSidebar(novosItensSidebar);
  };

  const calcularTotalPorPessoa = (index) => {
    if (igualitaria) {
      const item = itensConta[index];
      const valorGorjeta = totalConta * (porcentagemGorjeta / 100);
      const totalPorPessoa = (totalConta + valorGorjeta) / numPessoas;
      return totalPorPessoa;
    } else {
      const item = itensConta[index];
      const valorGorjeta = item.valor * (porcentagemGorjeta / 100);
      const totalPorPessoa = item.valor + valorGorjeta;
      return totalPorPessoa;
    }
  };

  useEffect(() => {
    const timerID = setInterval(() => {
      setDataAtual(new Date());
    }, 1000);

    return () => {
      clearInterval(timerID);
    };
  }, []);

  return (
    <div style={{maxWidth: '540px'}}className='container-sm bg-white rounded my-5 py-5 d-flex flex-column align-items-center'>
      <h3>SplitBill+</h3>
      <p className='d-flex flex-row align-items-center'>
        <i className='pi pi-clock mx-1'></i>
        {dataAtual.toLocaleString()}
      </p>
      <div>
        <Button
          label='Divisão igualitária'
          className={`mx-1 ${igualitaria ? 'p-button-primary' : 'p-button-outlined'}`}
          onClick={() => setIgualitaria(true)}
        />
        <Button
          label='Divisão por consumo'
          className={`mx-1 ${!igualitaria ? 'p-button-primary' : 'p-button-outlined'}`}
          onClick={() => setIgualitaria(false)}
        />
      </div>
      <div className='mt-3 d-flex flex-column justify-content-between align-items-start'>
        <span className='p-float-label mt-4'>
          <InputNumber
            id='pessoas'
            min={1}
            value={numPessoas}
            onChange={(e) => handleNumPessoasChange(e.value)}
          />
          <label htmlFor='pessoas'>Quantas Pessoas?</label>
        </span>
        {igualitaria ? (
          <>
            <span className='p-float-label mt-4'>
              <InputNumber
                id='total'
                min={0}
                value={totalConta}
                onChange={(e) => handleTotalContaChange(e.value)}
                mode="currency"
                currency='BRL'
                locale='pt-BR'
              />
              <label htmlFor='total'>Qual o total da conta?</label>
            </span>
          </>
        ) : (
          numPessoas >= 1 && (
            <>
              {itensConta.map((item, index) => (
                <div className='d-flex flex-row justify-content-between align-items-start' key={index}>
                  <span className='p-float-label mt-4'>
                    <InputNumber
                      value={item.valor}
                      onChange={(e) => handleValorItemChange(index, e.value)}
                      mode="currency"
                      currency='BRL'
                      locale='pt-BR'
                      disabled
                    />
                    <label htmlFor='total'>{`Qual o total da pessoa ${index + 1}?`}</label>
                    <Button
                      icon='pi pi-pencil'
                      className='mx-1'
                      onClick={() => handleAdicionarItem(index)}
                    />
                  </span>
                  <Sidebar
                    visible={item.sidebarVisivel}
                    onHide={() => {
                      const novosItens = [...itensConta];
                      novosItens[index].sidebarVisivel = false;
                      setItensConta(novosItens);
                      setItensSidebar([]);
                    }}
                  >
                    <div className='p-fluid'>
                      <h5>Relacionar Itens consumidos</h5>
                      <Button
                        label="Adicionar item"
                        icon="pi pi-plus"
                        className='mt-5'
                        text
                        severity='primary'
                        onClick={handleAdicionarItemSidebar}
                      />
                      {index === indexSidebarAtiva && itensSidebar.length > 0 && (
                        <>
                          <h5 className="mt-5">Itens da Barra Lateral:</h5>
                          {itensSidebar.map((itemSidebar, indexSidebar) => (
                            <div key={indexSidebar} className='p-field d-flex flex-row justify-content-between align-items-end'>
                              <div>
                                <label htmlFor={`itemSidebar${indexSidebar}`}>Valor:</label>
                                <InputNumber
                                  id={`itemSidebar${indexSidebar}`}
                                  value={itemSidebar}
                                  onChange={(e) => handleValorItemSidebarChange(indexSidebar, e.value)}
                                  mode="currency"
                                  currency='BRL'
                                  locale='pt-BR'
                                />
                              </div>
                              <Button
                                icon='pi pi-trash'
                                className='mx-1'
                                severity='danger'
                                text
                                onClick={() => handleRemoverItemSidebar(indexSidebar)}
                              />
                            </div>
                          ))}
                          <Button
                            label='Finalizar consumo'
                            className='p-button-success mt-5'
                            onClick={() => handleAdicionarItemSidebar(index)}
                          />
                        </>
                      )}
                    </div>
                  </Sidebar>

                </div>
              ))}
            </>
          )
        )}

        <span className='p-float-label mt-4'>
          <InputText
            value={porcentagemGorjeta}
            onChange={(e) => handlePorcentagemGorjetaChange(e.target.value)}
          />
          <Slider
            value={porcentagemGorjeta}
            onChange={(e) => handlePorcentagemGorjetaChange(e.value)}
            min={0}
            max={100}
          />
          <label htmlFor='gorjeta'>% de Gorjeta</label>
        </span>
      </div>

      <h3 className='mt-5'>Total por pessoa:</h3>
      <ul>
        {itensConta.map((item, index) => (
          <li key={index}>{`Pessoa ${index + 1}: R$ ${calcularTotalPorPessoa(index).toFixed(2)}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default ContaRestaurante;