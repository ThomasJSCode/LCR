import { useNavigate } from "react-router-dom";

const LostPage = () => {

    const navigate = useNavigate();
    const handleNavigate = () => {
        navigate('/')
    }

    return (
        <div>This page doesn't exist. Whoops.
            <h1>
                <button onClick={() => handleNavigate()}> Click here to return to the main page.
                </button>
            </h1>
        </div>
    )
}

export default LostPage