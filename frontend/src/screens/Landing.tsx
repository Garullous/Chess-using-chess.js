import { useNavigate } from "react-router-dom"
import { Button } from "../components/Button";

export const Landing = () => {
    const navigate = useNavigate();
    return <div className="flex justify-center">
        <div className="pt-8 ">
            <div className="grid grid-cols-1 gap-4
            md:grid-cols-2">
                <div className="flex justify-center">
                    <img src={"/chess.jpg"} className="max-w-96" />
                </div>
                <div className="pt-16">
                    <div className="flex justify-center">
                        <h1 className="text-4xl text-white font-bald">Play Chess online on the site #2!</h1>
                    </div>
                    <div className="mt-8 flex justify-center">
                        <Button onClick={()  =>{
                            navigate("/game")
                        }}>
                            Play Online
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
}