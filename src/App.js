import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Slider } from 'primereact/slider';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './App.css';

const RestaurantBill = () => {
  const [numPeople, setNumPeople] = useState(1);
  const [billItems, setBillItems] = useState([{ amount: 0 }]);
  const [tipPercentage, setTipPercentage] = useState(0);
  const [totalBill, setTotalBill] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleNumPeopleChange = (value) => {
    const num = parseInt(value);
    setNumPeople(num);

    // Update the bill items array based on the new number of people
    if (num > billItems.length) {
      const diff = num - billItems.length;
      const newItems = Array.from({ length: diff }, () => ({ amount: 0 }));
      setBillItems([...billItems, ...newItems]);
    } else if (num < billItems.length) {
      const newItems = billItems.slice(0, num);
      setBillItems(newItems);
    }
  };

  const handleTipPercentageChange = (value) => {
    setTipPercentage(parseFloat(value));
  };

  const handleItemAmountChange = (index, value) => {
    const newItems = [...billItems];
    newItems[index].amount = parseFloat(value);
    setBillItems(newItems);
  };

  const handleTotalBillChange = (value) => {
    setTotalBill(parseFloat(value));
  };

  const calculateTotalBill = () => {
    let total = 0;

    if (numPeople === 1) {
      total = totalBill;
    } else {
      billItems.forEach((item) => {
        total += item.amount;
      });
    }

    return total;
  };

  const calculateTotalPerPerson = (index) => {
    const item = billItems[index];
    const tipAmount = item.amount * (tipPercentage / 100);
  
    if (numPeople === 1) {
      return totalBill + (totalBill*(tipPercentage / 100));
    } else {
      return item.amount + tipAmount;
    }
  };  

  useEffect(() => {
    const timerID = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => {
      clearInterval(timerID);
    };
  }, []);

  return (
    <div className='container-sm bg-white my-5 d-flex flex-column align-items-center'>
      <h3>Cálculo de Gorjeta</h3>
      <p className='d-flex flex-row align-items-center'>
        <i className='pi pi-clock mx-1'></i>
        {currentDate.toLocaleString()}
      </p>
      <span className="p-float-label mt-4">
        <InputNumber id='pessoas' min={1} value={numPeople} onChange={(e) => handleNumPeopleChange(e.value)} />
        <label htmlFor="pessoas">Quantas Pessoas?</label>
      </span>
      {numPeople > 1 && (
        <div>
          {billItems.map((item, index) => (
            <div key={index} className="p-inputgroup mt-4">
              <InputNumber value={item.amount} onChange={(e) => handleItemAmountChange(index, e.value)} currency="BRL" locale="pt-BR" />
            </div>
          ))}
        </div>
      )}
      {numPeople === 1 && (
        <span className="p-float-label mt-4">
          <InputNumber id="total" min={0} value={totalBill} onChange={(e) => handleTotalBillChange(e.value)} currency="BRL" locale="pt-BR" />
          <label htmlFor="total">Qual o total da conta?</label>
        </span>
      )}
      {numPeople > 1 && (
        <span className="p-float-label mt-4">
          <InputNumber id="total" min={0} value={calculateTotalBill()} disabled currency="BRL" locale="pt-BR" />
          <label htmlFor="total">Qual o total da conta?</label>
        </span>
      )}
      <span className="p-float-label mt-4">
        <InputText value={tipPercentage} onChange={(e) => handleTipPercentageChange(e.target.value)} />
        <Slider value={tipPercentage} onChange={(e) => handleTipPercentageChange(e.value)} />
        <label htmlFor="gorjeta">% de Gorjeta</label>
      </span>

      <h3 className='mt-5'>Total por pessoa:</h3>
      <ul>
        {billItems.map((item, index) => (
          <li key={index}>{`Pessoa ${index + 1}: R$ ${calculateTotalPerPerson(index).toFixed(2)}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default RestaurantBill;
