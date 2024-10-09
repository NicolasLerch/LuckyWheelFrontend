export default function PrizeWindow({ data, showResult, setShowResult }) {

    const handleSpinAgain = (event) =>{
        event.preventDefault()
        setShowResult(false)
    }

  return showResult ? (
    <div className="overlay">
            <div className="prize-window-container">
                {data.option === "Segui Participando" ? (
                    <h2>Intenta de nuevo!</h2>
                ) : data.gender === "fem" ? (
                    <>
                    <h2>Ganaste una {data.option}</h2>
                    <img src="/css/yerbera.jpg" alt="yerbera"/>
                    </>
                ) : data.gender === "masc" ? (
                    <>
                    <h2>Ganaste un {data.option}</h2>
                    <img src="/css/set-matero-6.webp" alt="set matero"></img>                    
                    </>
                    
                ): (null)}

                <button className="spin-again-button" type="button" onClick={handleSpinAgain}>Volver a tirar</button>
            </div>
        </div>
  ) : null;
}