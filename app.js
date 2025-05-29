const express = require('express')
const app = express()

app.use(express.json())

const usuarios = [
    { id: "1", nome: "João", email: "joao@hotmail.com.br"}
    //,
    //{ id: "2", nome: "Emilio", email: "emilio@hotmail.com.br"},
    //{ id: "3", nome: "Rodrigo", email: "rodrigo@hotmail.com.br"},
    //{ id: "4", nome: "Fernando", email: "fernando@hotmail.com.br"}

    /*Pq cargas d'água ele só deleta quando os usuários estão aqui ?? Se eu inicio e insiro os registros dos "usuarios.json",
    o get pega eles, mas o delete não...*/

    /*
        curl.exe -X GET http://localhost:3000/usuarios
        curl.exe -X POST http://localhost:3000/usuarios -H "Content-Type: application/json" --data-binary "@usuarios.json"
        curl.exe -X GET "http://localhost:3000/usuarios/buscar?nome=Rodrigo"
        curl.exe -X DELETE "http://localhost:3000/usuarios/3"
    */
]

app.get('/usuarios', (req, res) => {
    res.json(usuarios)
})

/*Para inserir usuário pelo arquivo usuarios.json*/
app.post('/usuarios', (req, res) => {
    const novosUsuarios = req.body.map((usuario, index) => ({
        id: usuarios.length + index + 1,
        nome: usuario.nome,
        email: usuario.email
    }));

    usuarios.push(...novosUsuarios);
    res.status(201).json(novosUsuarios);
})

/*Para pesquisar pelo nome do usuário e obter seu id e e-mail*/
app.get('/usuarios/buscar', (req, res) => {
    const { nome } = req.query;

    if (!nome) {
        return res.status(400).json({ erro: 'Parâmetro nome é obrigatório' });
    }

    const usuario = usuarios.find(u => u.nome.toLowerCase() === nome.toLowerCase());

    if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    res.json({ id: usuario.id, nome: usuario.nome, email: usuario.email });
});

/*Para deletar o usuário pelo id dele*/

app.delete('/usuarios/:id', (req, res) => {
    const usuarioIndex = usuarios.findIndex(u => u.id === String(req.params.id));

    if (usuarioIndex === -1) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    const [usuarioDeletado] = usuarios.splice(usuarioIndex, 1);
    res.status(200).json({ mensagem: 'Usuário deletado com sucesso', usuario: usuarioDeletado });
});


app.listen(3000, () => {
    console.log('Servidor inicializado, escutando porta 3000')
})
