import './App.css'
import LuckyWheel from './components/LuckyWheel/LuckyWheel.jsx'

function App() {

  return (
    <>
    {/* <h1 className='title'>PARTICIPÁ POR INCREÍBLES PREMIOS</h1> */}
    <img src="/css/super-pyme.png" alt="supervielle PYME" className='wheel-logo-img'></img>
      <div>
      <LuckyWheel />
      </div>
    </>
  )
}

export default App
