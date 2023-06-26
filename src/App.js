import React, { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Slider } from 'primereact/slider';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';
import { Fieldset } from 'primereact/fieldset';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './App.css';

const RestaurantBill = () => {
  const [numPeople, setNumPeople] = useState(1);
  const [igualitaria, setIgualitaria] = useState(true);
  const [billItems, setBillItems] = useState([{ amount: 0, sidebarVisible: false }]);
  const [tipPercentage, setTipPercentage] = useState(10);
  const [totalBill, setTotalBill] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sidebarItems, setSidebarItems] = useState([]);
  const [activeSidebarIndex, setActiveSidebarIndex] = useState(-1);
  const toast = useRef(null);

  const handleNumPeopleChange = (value) => {
    const num = parseInt(value);
    setNumPeople(num > 0 ? num : 1);

    if (num > billItems.length) {
      const diff = num - billItems.length;
      const newItems = Array.from({ length: diff }, () => ({
        amount: 0,
        sidebarVisible: false,
      }));
      setBillItems([...billItems, ...newItems]);
    } else if (num < billItems.length) {
      const newItems = billItems.slice(0, num);
      setBillItems(newItems);
    }
  };

  const handleTipPercentageChange = (value) => {
    setTipPercentage(value >= 0 ? parseFloat(value) : 10);
  };

  const handleItemAmountChange = (index, value) => {
    const newItems = [...billItems];
    newItems[index] = { ...newItems[index], amount: parseFloat(value) };
    setBillItems(newItems);
  };  

  const handleSidebarItemChange = (index, value) => {
    const newSidebarItems = [...sidebarItems];
    newSidebarItems[index] = parseFloat(value);
    setSidebarItems(newSidebarItems);
  };

  const handleTotalBillChange = (value) => {
    setTotalBill(value ? parseFloat(value) : 0);
  };

  const handleAddItem = (index) => {
    setActiveSidebarIndex(index);
    const newItems = [...billItems];
    newItems[index].sidebarVisible = true;
    setBillItems(newItems);
    setSidebarItems(newItems[index].sidebarItems || []);
  };

  const handleAddSidebarItem = () => {
    setSidebarItems([...sidebarItems, 0]);
  };

  const handleSidebarAddItem = (index) => {
    const newBillItems = [...billItems];
    const sidebarTotal = sidebarItems.reduce((total, item) => total + parseFloat(item), 0);

    toast.current.show({ severity: 'success', summary: 'Sucesso!', detail: 'Consumo atualizado com sucesso!', life: 3000 });
  
    newBillItems[index].amount = sidebarTotal; // Atualize o valor do consumo da pessoa
    newBillItems[index].sidebarVisible = false;
    newBillItems[index].sidebarItems = [...sidebarItems]; // Salve o array de itens da sidebar para a pessoa ativa
    setBillItems(newBillItems);
    setSidebarItems([]);
  };

  const handleRemoveSidebarItem = (index) => {
    const newSidebarItems = [...sidebarItems];
    newSidebarItems.splice(index, 1);
    setSidebarItems(newSidebarItems);
  };

  const handleTotalBillClick = () => {
    if (totalBill === null || totalBill === 0) {
      setTotalBill('');
    }
  };

  const calculateTotalPerPerson = (index) => {
    if (igualitaria) {
      const item = billItems[index];
      const tipAmount = totalBill * (tipPercentage / 100);
      const totalPerPerson = (totalBill + tipAmount) / numPeople;
      return totalPerPerson;
    } else {
      const item = billItems[index];
      const tipAmount = item.amount * (tipPercentage / 100);
      const totalPerPerson = item.amount + tipAmount;
      return totalPerPerson;
    }
  };

  const legendTemplate = (
    <div className="container-fluid d-flex flex-row align-items-center text-secondary">
        <span style={{fontSize: '1rem'}} className="font-bold m-0">Total por Pessoa</span>
    </div>
);

  useEffect(() => {
    const timerID = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => {
      clearInterval(timerID);
    };
  }, []);

  return (
    <div style={{maxWidth: '90vw'}}className='mx-auto bg-white rounded my-5 pt-5 pb-1 d-flex flex-column align-items-center'>
      <h3>SplitBill+</h3>
      <p className='d-flex flex-row align-items-center'>
        <i className='pi pi-clock mx-1'></i>
        {currentDate.toLocaleString()}
      </p>
      <div className='d-flex flex-row justify-content-center align-items-center'>
        <Button
          label='Igualitária'
          className={`mx-1 ${igualitaria ? 'p-button-primary' : 'p-button-text'}`}
          onClick={() => setIgualitaria(true)}
        />
        <Button
          label='Por consumo'
          className={`mx-1 ${!igualitaria ? 'p-button-primary' : 'p-button-text'}`}
          onClick={() => setIgualitaria(false)}
        />
      </div>
      <div className='mt-3 d-flex flex-column justify-content-between align-items-start'>
        <span className='p-float-label mt-4'>
          <InputNumber
            id='pessoas'
            min={1}
            value={numPeople}
            showButtons
            onChange={(e) => handleNumPeopleChange(e.value)}
          />
          <label htmlFor='pessoas'>Quantas Pessoas?</label>
        </span>
        {igualitaria ? (
          <>
            <span className='p-float-label mt-4'>
              <InputNumber
                id='total'
                min={0}
                value={totalBill}
                onFocus={handleTotalBillClick}
                onClick={handleTotalBillClick}
                onChange={(e) => handleTotalBillChange(e.value)}
                minFractionDigits={2}
                prefix='R$ '
              />
              <label htmlFor='total'>Qual o total da conta?</label>
            </span>
          </>
        ) : (
          numPeople >= 1 && (
            <>
              {billItems.map((item, index) => (
                <div className='d-flex flex-row justify-content-between align-items-start' key={index}>
                  <span className='p-float-label mt-4'>
                    <InputNumber
                      value={item.amount}
                      onChange={(e) => handleItemAmountChange(index, e.value)}
                      minFractionDigits={2}
                      prefix='R$ '
                      disabled
                    />
                    <label htmlFor='total'>{`Qual o total da pessoa ${index + 1}?`}</label>
                    <Button
                      icon='pi pi-pencil'
                      onClick={() => handleAddItem(index)}
                    />
                  </span>
                  <Sidebar
                    visible={item.sidebarVisible}
                    onHide={() => {
                      const newItems = [...billItems];
                      newItems[index].sidebarVisible = false;
                      setBillItems(newItems);
                      setSidebarItems([]);
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
                        onClick={handleAddSidebarItem}
                      />
                      {index === activeSidebarIndex && sidebarItems.length > 0 && (
                        <>
                          <h5 className="mt-5">Consumo da pessoa {index+1}:</h5>
                          {sidebarItems.map((sidebarItem, sidebarIndex) => (
                            <div key={sidebarIndex} className='p-field d-flex flex-row justify-content-between align-items-end'>
                              <div>
                                <label htmlFor={`sidebarItem${sidebarIndex}`}>Valor:</label>
                                <InputNumber
                                  id={`sidebarItem${sidebarIndex}`}
                                  min={0}
                                  value={sidebarItem}
                                  onChange={(e) => handleSidebarItemChange(sidebarIndex, e.value)}
                                  onFocus={handleSidebarItemChange}
                                  onClick={handleSidebarItemChange}
                                  minFractionDigits={2}
                                  prefix='R$ '
                                />
                              </div>
                              <Button
                                icon='pi pi-trash'
                                className='mx-1'
                                severity='danger'
                                text
                                onClick={() => handleRemoveSidebarItem(sidebarIndex)}
                              />
                            </div>
                          ))}
                        </>
                      )}
                      <Button
                            label='Finalizar consumo'
                            className='p-button-success mt-5'
                            onClick={() => handleSidebarAddItem(index)}
                      />
                    </div>
                  </Sidebar>
                  <Toast ref={toast} />
                </div>
              ))}
            </>
          )
        )}

        <span className='p-float-label mt-4'>
          <InputText
            value={tipPercentage}
            onChange={(e) => handleTipPercentageChange(e.target.value)}
          />
          <Slider
            value={tipPercentage}
            onChange={(e) => handleTipPercentageChange(e.value)}
            min={0}
            max={100}
          />
          <label htmlFor='gorjeta'>% de Gorjeta</label>
        </span>
      </div>
      
      <Fieldset legend={legendTemplate} className='mt-5 border-0' toggleable>
        <ul>
          {billItems.map((item, index) => (
            <><li key={index} style={{listStyle: 'none'}}>
              {<span className="pi pi-user mx-2"></span>}{`Pessoa ${index + 1}: R$ ${calculateTotalPerPerson(index).toFixed(2)}`}
            </li>
            </>
          ))}
        </ul>
      </Fieldset>
      <Divider />
      <p style={{fontSize: '.8rem'}} className='position-relative bottom-0 text-secondary'>Versão: 1.0.0.2</p>
    </div>
  );
};

export default RestaurantBill;