

function Announcement_card() {
    return (
      <div className="card my-md-3 m-3 p-2 text-center h-100">
        <div className="card-title pt-2">
          <h4 className="text-center font-weight-bold m-2">Oznamy</h4>
        </div>
        <div className="card-body">
          <ul className="list-group pt-2">
            <li className="list-group-item mt-2">🔧 Stránka je vo vývoji 🔧</li>
            <li className="list-group-item mt-2">
              Lov zvere: <br />
              Lov všetkých zverý je momentálne zakázaný!
            </li>
            <li className="list-group-item mt-2">
              Polovnícky ples: <br />
              V sobotu 22.3.2025 o 19:00 v kultúrnom dome sa bude konať polovnícky ples.
            </li>
          </ul>
        </div>
      </div>
    );
  }
  
  export default Announcement_card;