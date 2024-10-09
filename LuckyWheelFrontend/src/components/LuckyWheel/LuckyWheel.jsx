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

function LuckyWheel() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [spinCount, setSpinCount] = useState(0);
  const [showResult, setShowResult] = useState(false);

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
      const newPrizeNumber = Math.floor(Math.random() * data.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  const handleStop = () => {
    setSpinCount(spinCount + 1);
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
        data={data}
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