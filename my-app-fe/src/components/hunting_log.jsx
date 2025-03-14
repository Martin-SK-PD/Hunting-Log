import Announcement_card from "./announcement";


function Hunting_log(){
  
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
                <th scope="col">Lovec</th>
                <th scope="col">Oblasť</th>
                <th scope="col">Miesto/Štruktúra</th>
                <th scope="col">Ulovená zver</th>
                <th scope="col">Váha</th>
                <th scope="col">Čas strelenia</th>    
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Tručka M.</td>
                <td>Medziriečie</td>
                <td>Posed pod lesom</td>
                <td>Jeleň</td>
                <td>200 kg</td>
                <td>23:15</td>
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


            
export default Hunting_log
