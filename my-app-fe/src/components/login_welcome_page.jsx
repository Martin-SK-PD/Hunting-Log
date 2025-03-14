import { Link } from "react-router-dom";


function Login_welcome_page() {

    return(

        <div className="container-fluid">
            <div className="row">


                <div className="col-md-6">
                    <div className="card my-md-3 m-3 p-2 h-100">
                        
                        <div className="card-body">


                            <h3 className="card-title text-center">Prihlásenie</h3>
                            <form>
                                <label htmlFor="prihlas_meno" className="mt-3">Prihlasovacie meno / email:</label>
                                <input type="text" name="prihlas_meno" id="prihlas_meno" className="form-control" />
                                
                                <label htmlFor="password" className="mt-3">Heslo:</label>
                                <input type="password" name="password" id="password" className="form-control" />
                            </form>
                            
                            <div className="row my-4">
                                <div className="col-6">
                                    <a href="" className="btn btn-success ">Prihlasiť sa</a>
                                </div>
                                <div className="col-6 text-end">
                                    <Link className="btn" to="/registracia">Registracia</Link>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>



                <div className="col-md-6">
                    <div className="card my-md-3 m-3 p-2 h-100 text-center">
                        
                        <div className="card-body">
                             <h3 className="text-center font-weight-bold m-2">Polovnicka kniha</h3>
                             <p className="text-center p-2">Vitajte na stránke ___________. Táto stránka je projektom, <br /> ktorý má pomôcť polovníkom 
                            zaznámenávať ich aktivity.</p>

                        
                        </div>

                        
                    </div>
                    

                    
                </div>

            

            </div>
        </div>
    );

}

export default Login_welcome_page