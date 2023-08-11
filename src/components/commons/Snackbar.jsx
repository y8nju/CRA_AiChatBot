import { useContext } from "react";
import { LayoutContext } from "../../context/layoutContext";
import { useEffect } from "react";
import { useCallback } from "react";

const Snackbar = ()=>{
    const { isSnacbar, handleSnackbar } = useContext(LayoutContext);
    useEffect(() => {
        if(isSnacbar.open) {
            setTimeout(() => {
                handleSnackbar({
                    open: false,
                    text: ''
                })
            }, 2500)
        }
    }, [isSnacbar])

    return (
        <div className="snackbar">
            {isSnacbar.text}
        </div>
    )
}

export default Snackbar;