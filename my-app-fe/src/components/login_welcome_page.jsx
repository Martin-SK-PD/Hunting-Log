import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

function Login_welcome_page() {


    const [form, setForm] = useState({ email_username: "", password: "" });
    const navigate = useNavigate();

    const { login } = useAuth();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const onSubmitForm = async (e) => {
        e.preventDefault();
        try {

            const trimmedForm = {
                email_username: form.email_username.trim(),
                password: form.password,
            };
              
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(trimmedForm),
            });

            const data = await response.json();

            if (response.ok && data.jwtToken) {
                login(data.jwtToken); 
                toast.success("Prihlásenie úspešné");
                navigate("/navstevy"); 
            } else {
                toast.error("Neplatné prihlasovacie údaje");
            }
        } catch (err) {
            console.error(err.message);
            toast.error("Chyba servera");
        }
    };

    return (

        <div className="container-fluid">
            <div className="row">


                <div className="col-md-6">
                    <div className="card my-md-3 m-3 p-2 h-100">

                        <div className="card-body">


                            <h3 className="card-title text-center">Prihlásenie</h3>
                            <form onSubmit={onSubmitForm}>
                                <label htmlFor="email_username" className="mt-3">Prihlasovacie meno / email:</label>
                                <input type="text" name="email_username" id="email_username" className="form-control"
                                    value={form.email_username} onChange={handleChange} required />

                                <label htmlFor="password" className="mt-3">Heslo:</label>
                                <input type="password" name="password" id="password" className="form-control"
                                    value={form.password} onChange={handleChange} required />


                                <div className="row my-4">
                                    <div className="col-6">
                                        <button type="submit" className="btn btn-success">Prihlásiť sa</button>
                                    </div>
                                    <div className="col-6 text-end">
                                        <Link className="btn" to="/registracia">Registracia</Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>



                <div className="col-md-6">
                    <div className="card my-md-3 m-3 p-2 h-100 text-center">

                        <div className="card-body">
                            <h3 className="text-center font-weight-bold m-2">Polovnicka kniha</h3>
                            <p className="text-center p-2">
                            <br/>
                            Vitajte na stránke Poľovnícka kniha.<br /> <br/>
                            Táto aplikácia vznikla ako študentský projekt s cieľom uľahčiť evidenciu návštev, úlovkov a správu poľovníckeho revíru.<br />
                            <br />
                            Aplikácia je navrhnutá tak, aby bola prehľadná, praktická a ľahko použiteľná pre každého poľovníka.
                            </p>


                        </div>


                    </div>



                </div>



            </div>
        </div>
    );

}

export default Login_welcome_page