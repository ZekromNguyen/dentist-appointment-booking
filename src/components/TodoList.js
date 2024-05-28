import { useState } from "react"


const Mycomponent = () => {
    const [newTodo, setNewtodo] = useState("eric");
    const handlechangeInput = (event) => {
        console.log(event.target.value)
        setNewtodo(event.target.value)
    }

    const [listTodo, setlist] = useState([
        { id: 'todo1', value: 'Dogin hom' },
        { id: 'todo2', value: 'haha' }
    ]);

    const handleAddtodo = () => {
        alert("ok")
        setlist([...listTodo, { id: Math.floor((Math.random() * 10000) + 1), value: newTodo }])
    }
    const handleDeltete = (todoID) => {
        alert("Do you want to delete  " + todoID)
        let newFilter = listTodo.filter(item => item.id !== todoID)
        setlist(newFilter)
    }

    return (

        <div>
            <h2>to do list</h2>
            {listTodo.map((todo, index) => {
                return (
                    <div>{index + 1}.{todo.value} <button onClick={() => handleDeltete(todo.id)}>Delete</button></div>
                )
            })}
            <br />
            <div>My home work :{newTodo}</div>
            <input type={'text'} onChange={(event) => handlechangeInput(event)}></input>
            <button onClick={() => handleAddtodo()}>add to do</button>

        </div >
    )
}

export default Mycomponent;