
function loading() {
    return (
        <>
            <div style={{top: "0", left: "0", width: "100%", height: "100%", background: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))", position: "fixed", zIndex: "999"}}>
                <div className="loading-container">
                    <div className="loading"></div>
                    <div id="loading-text">loading</div>
                </div>
            </div>
        </>
    )
}

export default loading