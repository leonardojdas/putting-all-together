export function MenuPanel(props){
    return (
        <div className="container border rounded-1 no-padding">
            <div id="container-buttons" className="container-fluid bg-dark bg-opacity-10 d-flex justify-content-center">
                <div><input type="button" id="addButton" value="Add" onClick={props.handleMethods} className="btn btn-outline-primary" /></div>
                <div><input type="button" id="updateButton" value="Update" onClick={props.handleMethods} className="btn btn-outline-primary" /></div>
                <div><input type="button" id="deleteButton" value="Delete" onClick={props.handleMethods} className="btn btn-outline-danger" /></div>
            </div>

            <div id="methodsPanel" className={props.handleState.showMenu ? "container row" : "container row hidden"}>

                <div className="col-12 text-center py-3 fw-bolder">
                    Method: <span id="methodTitle">{props.handleState.currentMethod}</span>
                </div>

                <div className="form-floating mb-3 col-6">
                    <input type="number" id="itemId"
                        onChange={props.handleFormChange} 
                        className="form-control" placeholder="ID" min="100" max="999" />
                    <label htmlFor="floatingInput" className="label">ID</label>
                </div>

                <div className="form-floating mb-3 col-6">
                    <select className="form-select" id="itemCategory"
                        onChange={props.handleFormChange} 
                        aria-label=""
                    >
                        <option id="categoryAPP" value="APP">APP (Appetizer)</option>
                        <option id="categoryENT" value="ENT">ENT (Entree)</option>
                        <option id="categoryDES" value="DES">DES (Desert)</option>
                    </select>
                    <label htmlFor="floatingSelect" className="label">Category</label>
                </div>

                <div className="form-floating mb-3 col-12">
                    <input type="text" id="itemDescription"
                        onChange={props.handleFormChange}
                        className="form-control" placeholder="Description"
                    />
                    <label htmlFor="floatingInput" className="label">Description</label>
                </div>

                <div className="form-floating mb col-6">
                    <input type="number" id="itemPrice"
                        onChange={props.handleFormChange}
                        className="form-control" placeholder="Price" min="0" max=""
                    />
                    <label htmlFor="floatingInput" className="label">Price</label>
                </div>

                <div className="form-floating mb-3 col-6">
                    <select className="form-select" id="itemVegetarian"
                        onChange={props.handleFormChange} 
                        aria-label=""
                    >
                        <option id="categoryAPP" value="true">Yes</option>
                        <option id="categoryENT" value="false">No</option>
                    </select>
                    <label htmlFor="floatingSelect" className="label">Vegetarian</label>
                </div>

                <div id="container-buttons" className="container-fluid bg-opacity-10 d-flex justify-content-center">
                    <button type="button" id="submitButton" className="btn btn-outline-dark" onClick={props.handleConfirmAction}>Confirm action</button>
                </div>
            </div>
        </div>
    );
}