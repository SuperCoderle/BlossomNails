
function unauthorized() {
    return (
        <>
            <div className="container">
                <div className="boo-wrapper">
                    <div className="boo">
                        <div className="face"></div>
                    </div>
                    <div className="shadow"></div>

                    <h1>Whoops!</h1>
                    <p>
                        We couldn't find the page you
                        <br />
                        were looking for.
                    </p>
                </div>
            </div>
        </>
    )
}

export default unauthorized