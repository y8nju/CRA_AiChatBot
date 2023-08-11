import InfoIcon from '@material-ui/icons/Info';

const Info = ({type, text})=>{


    return (
        <div className={`commons_info ${type}`}>
            <InfoIcon size="samll" className='infoIcon' />
            {text}
        </div>
    )
}

export default Info;
