
type TProps = {
    height: number;
}

const Placeholder = ({height}: TProps) => {
    return (
        <div className="flex-shrink-0 w-full" style={{height: height + 'px'}} />
    )
}

export default Placeholder;