// import React from 'react'
import { useState } from "react";
import { Wheel } from "react-custom-roulette";
import PrizeWindow from "../PrizeWindow/PrizeWindow";
import "./LuckyWheel.css";

const data = [
  {
    option: "Yerbera",
    style: { backgroundColor: "#BC0D0D", textColor: "white" },
    gender: "fem",
    img: "yerbera.jpg",
  },
  {
    option: "Segui Participando",
    style: { backgroundColor: "white", textColor: "black", fontSize: "18" },

  },
  {
    option: "Bolso Matero",
    style: { backgroundColor: "black", textColor: "white" },
    gender: "masc",
    img: "set-matero-6.webp",
  },
  {
    option: "Yerbera",
    style: { backgroundColor: "#BC0D0D", textColor: "white" },
    gender: "fem",
    img: "yerbera.jpg",
  },
  {
    option: "Segui Participando",
    style: { backgroundColor: "white", textColor: "black", fontSize: "18" },
  },
  {
    option: "Bolso Matero",
    style: { backgroundColor: "black", textColor: "white" },
    gender: "masc",
    img: "set-matero-6.webp",
  },
  {
    option: "Yerbera",
    style: { backgroundColor: "#BC0D0D", textColor: "white" },
    gender: "fem",
    img: "yerbera.jpg",
  },
  {
    option: "Segui Participando",
    style: { backgroundColor: "white", textColor: "black", fontSize: "18" },
  },
  {
    option: "Bolso Matero",
    style: { backgroundColor: "black", textColor: "white" },
    gender: "masc",
    img: "set-matero-6.webp",
  },
];

const originalPrizes = [
  { option: "Yerbera", stock: 3, img: "yerbera.jpg", gender: "fem" },
  { option: "Bolso Matero", stock: 2, img: "set-matero-6.webp", gender: "masc" },
  { option: "Segui Participando", stock: 5 }
];

function generateWheelData() {
  const visibleData = [];

  originalPrizes.forEach((prize) => {
    // Solo agregar si el stock es mayor a 0
    if (prize.stock > 0) {
      // Agregar 3 visualizaciones del premio, para que aparezcan en la ruleta
      for (let i = 0; i < 3; i++) {
        visibleData.push({
          option: prize.option,
          img: prize.img,
          gender: prize.gender,
          style: {
            backgroundColor: prize.option === "Segui Participando" ? "white" : "#BC0D0D",
            textColor: prize.option === "Segui Participando" ? "black" : "white",
          }
        });
      }
    }
  });

  return visibleData;
}

function handlePrizeWon(prizeName, setWheelData) {
  // Buscar el premio en la lista original
  const prize = originalPrizes.find(p => p.option === prizeName);

  // Verificar si tiene stock
  if (prize && prize.stock > 0) {
    // Reducir el stock
    prize.stock -= 1;

    // Si el stock llega a 0, eliminarlo de la ruleta
    if (prize.stock === 0) {
      console.log(`${prize.option} se ha agotado.`);
    }

    // Regenerar los datos visibles para la ruleta
    const updatedWheelData = generateWheelData();

    // Actualizar el estado de la ruleta con los nuevos datos
    setWheelData(updatedWheelData);
  }
}


function LuckyWheel() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [spinCount, setSpinCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [wheelData, setWheelData] = useState(generateWheelData());


  const handleSpinClick = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user.spinCount >= 20) {
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
    handlePrizeWon(wonPrize, setWheelData); // Actualizar stock y ruleta
    setMustSpin(false);
    setShowResult(true);
  };

  const handleBackToStart = (e) => {
    e.preventDefault();
    window.location.href = "/";
    localStorage.removeItem("user");
  };



  return (
    <>
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
      <button className="spin-button" onClick={handleSpinClick}>
        GIRÁ Y GANÁ!
      </button>
      <button className="spin-button" onClick={handleBackToStart}>
        VOLVER AL INICIO
      </button>

      <PrizeWindow
        data={data[prizeNumber]}
        showResult={showResult}
        setShowResult={setShowResult}
      />
    </>
  );
}

export default LuckyWheel;