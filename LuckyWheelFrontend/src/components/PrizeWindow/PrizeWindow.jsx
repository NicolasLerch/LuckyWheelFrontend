export default function PrizeWindow({ data, showResult, setShowResult }) {

    const handleSpinAgain = (event) =>{
        event.preventDefault()
        setShowResult(false)
    }

    const handleBackToStart = (e) => {
        e.preventDefault();
        window.location.href = "/";
        // localStorage.removeItem("user");
    }

  return showResult ? (
    <div className="overlay">
            <div className="prize-window-container">
                {data.option === "Segui Participando" ? (
                    <>
                    <h2>Intenta de nuevo!</h2>
                    <h3>Tienes otra oportunidad</h3>
                    <button className="spin-again-button" type="button" onClick={handleSpinAgain}>Volver a tirar</button>
                    </>
                    
                ) : data.gender === "fem" ? (
                    <>
                    <h2>¡Felicidades!</h2>
                    <h2>Ganaste una {data.option}</h2>
                    <img src="/css/yerbera.jpg" alt="yerbera"/>
                    <h3>No te olvides de pedir tu premio antes de volver al inicio</h3>
                    <button className="spin-again-button" type="button" onClick={handleBackToStart}>Volver al inicio</button>
                    </>
                ) : data.gender === "masc" ? (
                    <>
                    <h2>¡Felicidades!</h2>
                    <h2>Ganaste un {data.option}</h2>
                    <img src="/css/set-matero-6.webp" alt="set matero"></img>
                    <h3>No te olvides de pedir tu premio antes de volver al inicio</h3>
                    <button className="spin-again-button" type="button" onClick={handleBackToStart}>Volver al inicio</button>                   
                    </>
                    
                ): (null)}
            </div>
        </div>
  ) : null;
}