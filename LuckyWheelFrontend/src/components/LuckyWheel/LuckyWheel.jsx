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
        const response = await fetch("http://localhost:3000/prizes/get", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log("Premios recibidos del backend:", data);

        setPrizes(data);

        // Si generateWheelData es async, usamos await aquí
        const updatedWheelData = await generateWheelData(data);
        console.log("Datos generados para la ruleta:", updatedWheelData);

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
    const totalVisualizations = Math.min(prizesInStock.length * 3, 9); // Por ejemplo, un máximo de 9 visualizaciones

    for (let i = 0; i < totalVisualizations; i++) {
      const prize = prizesInStock[i % prizesInStock.length]; // Alternar entre premios

      // Definir el estilo según el premio
      let style;
      switch (prize.option) {
        case "Yerbera":
          style = { backgroundColor: "#BC0D0D", textColor: "white" };
          break;
        case "Bolso Matero":
          style = { backgroundColor: "black", textColor: "white" };
          break;
        case "Segui Participando":
          style = { backgroundColor: "white", textColor: "black" };
          break;
        default:
          style = { backgroundColor: "gray", textColor: "white" };
      }

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
    console.log(prize);

    // Verificar si tiene stock
    if (prize && prize.stock > 0) {
      try {
        // Hacer una llamada al backend para actualizar el stock
        const response = await fetch("http://localhost:3000/prizes/update", {
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
    if (user.spinCount >= 200) {
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
          spinDuration={0.3}
          outerBorderWidth={3}
          outerBorderColor="white"
          innerRadius={10}
          radiusLineWidth={0}
          fontSize={20}
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
      <div className="footer">
        <Link to="https://nlerchdev.com/" target="_blank">Desarrollado por Nicolás Lerch</Link>
      </div>
    </>
  );
}

export default LuckyWheel;
