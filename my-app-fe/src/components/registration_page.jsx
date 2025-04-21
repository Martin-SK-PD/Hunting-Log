import React, { useState} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Registration(){

  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    username: "", email: "", password: "", first_name: "", last_name: "", street: "", house_number: "",
    postal_code: "", city: "", hunting_ground_id: "", hunting_ground_name: "", is_admin: false
  });
  
  const [isAdmin, setIsAdmin] = useState(false);

    
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
  
    setInputs((prev) => ({
      ...prev,
      [name]: val,
    }));
  
    if (name === "is_admin") {
      setIsAdmin(checked);
    }
  };
    
  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { ...inputs };
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
  
      const parseRes = await response.json();
  
      if (response.ok) {
        console.log("uspešne registrovane")
        toast.success("Registrácia prebehla úspešne!");
  
        setTimeout(() => {
          navigate("/"); 
        }, 500);
      } else {
       
        toast.error(parseRes.error || "Chyba pri registrácii.");
      }
    } catch (err) {
      console.error(err.message);
      toast.error("Chyba servera. Skúste znova.");
    }
  };



    return(

        <div className="container-fluid">
            <div className="row ">

                <div className="col-lg-8 ">
                    <div className="card my-md-3 m-3 p-2 ">
                        
                        <div className="card-title">
                            <h4 className="text-center font-weight-bold m-2">Registračný formulár</h4>                             
                        </div>
                        <div className="card-body">
                            <form onSubmit={onSubmitForm}>

                                <div className="row">
                                    <div className="col-md-6">
                                        <label htmlFor="first_name" className="mt-2">Meno:</label>
                                        <input type="text" value={inputs.first_name} onChange={handleChange}
                                         name="first_name" id="first_name" className="form-control" required />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="last_name" className="mt-2">Priezvisko:</label>
                                        <input type="text" name="last_name" id="last_name" value={inputs.last_name} onChange={handleChange} 
                                        className="form-control" required/>        
                                    </div>
                                </div>
                                

                                <label htmlFor="username" className="mt-2">Prihlasovacie meno:</label>
                                <input type="text" name="username" id="username" 
                                  value={inputs.username} onChange={handleChange} className="form-control" required/>

                                <label htmlFor="email" className="mt-2">Email:</label>
                                <input type="email" name="email" id="email" className="form-control" 
                                  value={inputs.email} onChange={handleChange} required/>
                                
                                <label htmlFor="password" className="mt-2">Heslo:</label>
                                <input type="password" name="password" id="password" className="form-control" 
                                  value={inputs.password} onChange={handleChange} required/>

                                <div className="row">
                                    <div className="col-md-8">
                                        <label htmlFor="street" className="mt-2">Ulica:</label>
                                        <input type="text" name="street" id="street" 
                                          value={inputs.street} onChange={handleChange} className="form-control"/>
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="house_number" className="mt-2" >Číslo domu:</label>
                                        <input type="text" name="house_number" id="house_number" 
                                         value={inputs.house_number} onChange={handleChange} className="form-control" required/>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-8">
                                        <label htmlFor="city" className="mt-2">Mesto:</label>
                                        <input type="text" name="city" id="city" className="form-control" 
                                        value={inputs.city} onChange={handleChange} required/>
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="postal_code" className="mt-2" >Psč:</label>
                                         <input type="number" name="postal_code" id="postal_code" className="form-control" 
                                         value={inputs.postal_code} onChange={handleChange} required/>
                                    </div>
                                </div>

                                
                                {isAdmin ? (
                                  <div className="row mt-2">
                                    <div className="col-md-3">
                                      <label htmlFor="hunting_ground_id">Kód revíru:</label>
                                      <input type="number" name="hunting_ground_id" id="hunting_ground_id" 
                                       value={inputs.hunting_ground_id} onChange={handleChange} className="form-control" required/>
                                    </div>

                                    <div className="col-md-3">
                                      <label htmlFor="hunting_ground_name">Názov revíru:</label>
                                      <input type="text" value={inputs.hunting_ground_name} onChange={handleChange} name="hunting_ground_name" 
                                      id="hunting_ground_name" className="form-control" required />
                                    </div>

                                    <div className="col-md-3 my-md-auto pt-2 mt-2 text-sm-start text-md-center">
                                      <label htmlFor="isAdmin">Registrovať sa ako správca:&nbsp;</label>
                                      <input type="checkbox" name="is_admin" id="is_admin"
                                        checked={isAdmin}  onChange={handleChange} />
                                    </div>

                                    <div className="col-md-3 my-md-auto pt-2 mt-2 text-sm-end">
                                      <button type="submit" className="btn btn-light px-sm-2 px-md-4">Registrovať sa</button>
                                    </div>
                                  </div>
                                ) : (

                                  <div className="row mt-2">
                                    <div className="col-md-4">
                                      <label htmlFor="cislo_reviru">Kód revíru:</label>
                                      <input type="number" name="hunting_ground_id" id="hunting_ground_id" 
                                        value={inputs.hunting_ground_id} onChange={handleChange} className="form-control" step="none" required />
                                    </div>

                                    <div className="col-md-5 col-sm-6 my-md-auto pt-2 mt-2 text-sm-start text-md-center">
                                      <label htmlFor="isAdmin">Registrovať sa ako správca:&nbsp;</label>
                                      <input type="checkbox" name="is_admin"id="is_admin"
                                       checked={isAdmin}  onChange={handleChange} />
                                    </div>

                                    <div className="col-md-3 col-sm-6 my-md-auto pt-2 mt-2 text-sm-end">
                                      <button type="submit" className="btn btn-light px-sm-2 px-md-4">Registrovať sa</button>
                                    </div>
                                  </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>


            
                
            </div>
        </div>
    
    

    );

}


export default Registration