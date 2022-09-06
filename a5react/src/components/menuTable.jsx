export function MenuTable(props){
    return (
        <div id="table-items" className="container">
            <table className="table table-striped">
                <thead className="table-dark">
                    <tr>
                        <th className="col-1">ID</th>
                        <th className="col-1">Category</th>
                        <th className="col-8">Description</th>
                        <th className="col-1">Price</th>
                        <th className="col-1">Vegetarian</th>
                    </tr>
                </thead>
                <tbody id="items" onClick={props.handleItemClicked}>
                    {props.handleState.items.map((i) => {
                        return (
                            <tr
                                key={i.item.id}
                                className={i.selected ? "selected" : ""}
                            >
                                <td>{i.item.id}</td>
                                <td>{i.item.category}</td>
                                <td>{i.item.description}</td>
                                <td>{i.item.price}</td>
                                <td>{(i.item.vegetarian ? "Yes" : "No")}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
}