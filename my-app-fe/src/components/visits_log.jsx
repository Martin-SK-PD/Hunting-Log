import Announcement_card from "./announcement";

function Visits_log(){
  
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-4 order-lg-2">
         <Announcement_card />
        </div>

        <div className="col-lg-8 order-lg-1">

        <div className="card my-md-3 m-3 p-2 h-100">
          <div className="card-title px-3 pt-2">
            <h4 className="text-start font-weight-bold m-2">Záznamy zo dňa: 13.3.2025 </h4>
          </div>


          <div className="card-body">
                             
          <table className="table table-striped table-hover text-center">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Meno</th>
                <th scope="col">Oblasť</th>
                <th scope="col">Miesto/Štruktúra</th>
                <th scope="col">Akcia</th>
                <th scope="col">Čas príchodu</th>
                <th scope="col">Čas odchodu</th>    
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Košovský M.</td>
                <td>Nad Lubínom</td>
                <td>-</td>
                <td>Pochodzka</td>
                <td>14:00</td>
                <td>15:30</td>
              </tr>
                              
              <tr>
                <th scope="row">2</th>
                <td>Tručka M.</td>
                <td>Medziriečie</td>
                <td>Posed pod lesom</td>
                <td>Lov</td>
                <td>21:30</td>
                <td>23:45</td>
              </tr>

              <tr>
                <th scope="row">3</th>
                <td>Košovský M.</td>
                <td>Čúrová</td>
                <td>Nový krmelec</td>
                <td>Prikrmovanie</td>
                <td>6:30</td>
                <td>7:30</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  </div>
  );
}


            
export default Visits_log