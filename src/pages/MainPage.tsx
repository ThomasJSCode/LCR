import { useNavigate } from 'react-router-dom'
import rightIcon from '../assets/right.png'
import centerIcon from '../assets/center.png'
import leftIcon from '../assets/left.png'
import './MainPage.css'


function MainPage() {

  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate('/startGame')
  }

  return (
    <>
      <div>
        <img src={leftIcon} className="left" />
        <img src={centerIcon} className="center" />
        <img src={rightIcon} className="right" />
      </div>
      <h1>Left, Center, Right</h1>
      <div className="card">
        <button onClick={() => handleNavigate()}>
          Click Here to Start Game
        </button>
      </div>
    </>
  )
}

export default MainPage
