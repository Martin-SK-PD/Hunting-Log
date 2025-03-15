

function Registration(){

    return(

        <div className="container-fluid">
            <div className="row ">

                <div className="col-lg-8 ">
                    <div className="card my-md-3 m-3 p-2 ">
                        
                        <div className="card-title">
                            <h4 className="text-center font-weight-bold m-2">Registračný formulár</h4>                             
                        </div>
                        <div className="card-body">
                            <form>

                                <div className="row">
                                    <div className="col-md-6">
                                        <label htmlFor="meno" className="mt-2">Meno:</label>
                                        <input type="text" name="meno" id="meno" className="form-control" required />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="priezvisko" className="mt-2">Priezvisko:</label>
                                        <input type="text" name="priezvisko" id="priezvisko" className="form-control" required/>        
                                    </div>
                                </div>
                                

                                <label htmlFor="prihlas_meno" className="mt-2">Prihlasovacie meno:</label>
                                <input type="text" name="prihlas_meno" id="prihlas_meno" className="form-control" required/>

                                <label htmlFor="email" className="mt-2">Email:</label>
                                <input type="email" name="email" id="email" className="form-control" required/>
                                
                                <label htmlFor="password" className="mt-2">Heslo:</label>
                                <input type="password" name="password" id="password" className="form-control" required/>

                                <div className="row">
                                    <div className="col-md-8">
                                        <label htmlFor="ulica" className="mt-2">Ulica:</label>
                                        <input type="text" name="ulica" id="ulica" className="form-control"/>
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="cislo_domu" className="mt-2" >Číslo domu:</label>
                                         <input type="number" name="cislo_domu" id="cislo_domu" className="form-control" required/>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-8">
                                        <label htmlFor="mesto" className="mt-2">Mesto:</label>
                                        <input type="text" name="mesto" id="mesto" className="form-control" required/>
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="psc" className="mt-2" >Psč:</label>
                                         <input type="number" name="psc" id="psc" className="form-control" required/>
                                    </div>
                                </div>

                                <div className="row mt-2">
                                    
                                    <div className="col-md-4">
                                        <label htmlFor="cislo_reviru" className="">Kód revíru:</label>
                                        <input type="number" name="cislo_reviru" id="cislo_reviru" className="form-control" step="none" required/>
                                    </div>
                                    

                                    <div className="col-md-5 col-sm-6  my-md-auto pt-2 mt-2 text-sm-start text-md-center">
                                        <label htmlFor="spravca">Registrovať sa ako správca:&nbsp;</label>
                                        <input type="checkbox" name="spravca" id="spravca" />
                                    </div>


                                    <div className="col-md-3 col-sm-6 my-md-auto pt-2 mt-2 text-sm-end ">
                                        <a href="" className="btn btn-light px-sm-2 px-md-4 ">Registrovať sa</a>
                                    </div>

                                </div>

                            </form>
                        </div>
                    </div>
                </div>


            
                
            </div>
        </div>
    
    

    );

}


export default Registration