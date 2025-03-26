function createTodo(object) {
    let div = document.createElement('div');
    let h2 = document.createElement('h2');
    let p = document.createElement('p');
    div.appendChild(h2);
    div.appendChild(p);
    h2.textContent = object.title;
    p.textContent = object.description;
    return div;
}

export {createTodo};