// import React from 'react'
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Wheel } from "react-custom-roulette";
import PrizeWindow from "../PrizeWindow/PrizeWindow";
import "./LuckyWheel.css";

function LuckyWheel() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [spinCount, setSpinCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [wheelData, setWheelData] = useState(generateWheelData());
  const [prizes, setPrizes] = useState([]);

  useEffect(() => {
    const fetchPrizesAndUpdateWheelData = async () => {
      try {
        const response = await fetch("https://luckywheelbackend.onrender.com/prizes/get", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();

        setPrizes(data);

        // Si generateWheelData es async, usamos await aquí
        const updatedWheelData = await generateWheelData(data);

        setWheelData(updatedWheelData);
      } catch (error) {
        console.error("Error al obtener los premios:", error);
      }
    };

    fetchPrizesAndUpdateWheelData();
  }, []);


  async function generateWheelData(prizes) {
    const visibleData = [];
    const prizesInStock = [];
    
    // Filtrar premios que tienen stock
    prizes.forEach((prize) => {
        if (prize.stock > 0) {
            prizesInStock.push(prize);
        }
    });

    console.log("stock", prizesInStock);

    // Determinar la cantidad máxima de visualizaciones por premio
    const totalVisualizations = Math.min(prizesInStock.length * 3, 18); // Aumentar el total de visualizaciones

    // Colores alternativos para los premios
    const colors = ["#BC0D0D", "black", "white"];
    
    for (let i = 0; i < totalVisualizations; i++) {
        const prize = prizesInStock[i % prizesInStock.length]; // Alternar entre premios
        const colorIndex = i % colors.length; // Alternar entre colores
        

        // Establecer el estilo usando el color alternado
        let style = {
            backgroundColor: colors[colorIndex],
            textColor: colors[colorIndex] === "white" ? "black" : "white", // Cambiar el color del texto si el fondo es blanco
            fontSize: prize.option === "Segui Participando" ? "16" : "20",
        };

        // Agregar el premio al array intercalado
        visibleData.push({
            option: prize.option,
            img: prize.img,
            gender: prize.gender,
            style: style,
        });
    }

    return visibleData.length > 0 ? visibleData : [];
}


  async function handlePrizeWon(prizeName, setWheelData) {
    // Encontrar el premio en la lista actual
    const prize = prizes.find((p) => p.option === prizeName);

    // Verificar si tiene stock
    if (prize && prize.stock > 0) {
      try {
        // Hacer una llamada al backend para actualizar el stock
        const response = await fetch("https://luckywheelbackend.onrender.com/prizes/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ option: prizeName }), // Enviar el nombre del premio
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // Actualizar los premios locales con los datos del backend
          setPrizes(data.prizes);

          // Generar los nuevos datos de la ruleta con los premios actualizados
          setTimeout(() => {
            const updatedWheelData = generateWheelData();
            setWheelData(updatedWheelData);
          }, 100000);
        } else {
          console.error("Error actualizando el stock:", data.message);
        }
      } catch (error) {
        console.error("Error en la llamada al backend:", error);
      }
    }
  }

  const handleSpinClick = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user.spinCount >= 2) {
      alert("Ya has tirado dos veces, no puedes continuar");
    } else {
      const newSpinCount = user.spinCount + 1;
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          spinCount: newSpinCount,
        })
      );
      setShowResult(false);
      const newPrizeNumber = Math.floor(Math.random() * wheelData.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  const handleStop = () => {
    setSpinCount(spinCount + 1);
    const wonPrize = wheelData[prizeNumber].option;
    // Primero actualiza el stock
    handlePrizeWon(wonPrize, setWheelData).then(() => {
      // Después de actualizar el stock, muestra el resultado
      setMustSpin(false);
      setShowResult(true);
    });
  };

  const handleBackToStart = (e) => {
    e.preventDefault();
    window.location.href = "/";
    localStorage.removeItem("user");
  };

  return (
    <>
      {wheelData.length > 0 ? (
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          onStopSpinning={handleStop}
          data={wheelData}
          backgroundColors={["#BC0D0D", "#BC0D0D"]}
          textColors={["#ffffff"]}
          spinDuration={0.6}
          outerBorderWidth={1}
          outerBorderColor="white"
          innerRadius={0}
          radiusLineWidth={0}
          // fontSize={20}
          textDistance={58}
        />
      ) : (
        <p>Cargando premios...</p>
      )}
      <button className="spin-button" onClick={handleSpinClick}>
        GIRÁ Y GANÁ!
      </button>
      <button className="spin-button" onClick={handleBackToStart}>
        VOLVER AL INICIO
      </button>

      {wheelData.length > 0 && (
        <PrizeWindow
          data={wheelData[prizeNumber]}
          showResult={showResult}
          setShowResult={setShowResult}
        />
      )}
      
    </>
  );
}

export default LuckyWheel;