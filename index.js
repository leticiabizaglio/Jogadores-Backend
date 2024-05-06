const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'jogadores',
    password: 'ds564',
    port: 7007,
});

// CRUD dos Jogadores

// Retorna todos os jogadores
app.get('/jogadores', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM jogadores');
        res.json({
            // total: result.rows,
            jogadores: result.rows
        })
    } catch (error) {
        console.log("Erro ao obter jogadores: " + error);
        res.status(500).send("Erro ao obter todos os jogadores");
    }
});

// Retorna um jogador pelo id
app.get('/jogadores/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM jogadores WHERE id = $1', [id]);
        if (!result.rowCount === 0) {
            res.status(404).send({ message: "Jogador não encontrado" });
        } else {
            res.status(200).send({ message: "Jogador encontrado", jogadores: result.rows[0] });
        }
    } catch (error) {
        console.log("Erro ao obter jogador: " + error);
        res.status(500).send("Erro ao obter o jogador");
    }
});


// Rota para buscar um jogador pelo nome
app.get('/jogadores/nome/:nome', async (req, res) => {
    try {
        const { nome } = req.params;
        const result = await pool.query('SELECT * FROM jogadores WHERE nome = $1', [nome]);
        if (!result.rowCount === 0) {
            res.status(404).send({ message: "Jogador não encontrado" });
        } else {
            res.status(200).send({ message: "Jogador encontrado", jogadores: result.rows[0] });
        }
    } catch (error) {
        console.log("Erro ao obter jogador: " + error);
        res.status(500).send("Erro ao obter o jogador");
    }
});


// Rota para adicionar um novo jogador
app.post('/jogadores', async (req, res) => {
    try {
        const { nome, idade, velocidade, habilidade, posicao, time } = req.body;

        await pool.query('INSERT INTO jogadores (nome, idade, velocidade, habilidade, posicao, time) VALUES ($1, $2, $3, $4, $5, $6)', [nome, idade, velocidade, habilidade, posicao, time]);
        res.status(201).send({ message: "Jogador criado com sucesso" });
    } catch (error) {
        console.log("Erro ao criar jogador: " + error);
        res.status(500).send("Erro ao criar o jogador");
    }
});


// Rota para atualizar um jogador
app.put('/jogadores/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, idade, velocidade, habilidade, posicao, time } = req.body;

        await pool.query('UPDATE jogadores SET nome = $1, idade = $2, velocidade = $3, habilidade = $4, posicao = $5, time = $6 WHERE id = $7', [nome, idade, velocidade, habilidade, posicao, time, id]);
        res.status(201).send({ message: "Jogador atualizado com sucesso" });
    } catch (error) {
        console.log("Erro ao atualizar jogador: " + error);

        res.status(500).send("Erro ao atualizar o jogador");
    }
});

// Rota para deletar um jogador
app.delete('/jogadores/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query('DELETE FROM jogadores WHERE id = $1', [id]);
        res.status(200).send({ message: "Jogador deletado com sucesso" });
    } catch (error) {
        console.log("Erro ao deletar jogador: " + error);
        res.status(500).send("Erro ao deletar o jogador");
    }
});


// BATALHAS

// Rota para realizar uma batalha entre dois jogadores
app.post('/batalha', async (req, res) => {
    try {
        const result1 = await pool.query('SELECT * FROM jogadores OFFSET floor(random() * (SELECT COUNT(*) FROM jogadores)) LIMIT 1');
        const result2 = await pool.query('SELECT * FROM jogadores OFFSET floor(random() * (SELECT COUNT(*) FROM jogadores)) LIMIT 1');
        
        const jogador1 = result1.rows[0];
        const jogador2 = result2.rows[0];

        
        // Simula a batalha (aqui você pode definir a lógica de quem vence)
    } catch (error) {}
})

// app.post('/batalha', async (req, res) => {
//     try {
//         // Seleciona aleatoriamente dois jogadores
//         const result1 = await pool.query('SELECT * FROM jogadores OFFSET floor(random() * (SELECT COUNT(*) FROM jogadores)) LIMIT 1');
//         const result2 = await pool.query('SELECT * FROM jogadores OFFSET floor(random() * (SELECT COUNT(*) FROM jogadores)) LIMIT 1');
        
//         const jogador1 = result1.rows[0];
//         const jogador2 = result2.rows[0];

//         // Simula a batalha (aqui você pode definir a lógica de quem vence)
//         const vencedor = Math.random() < 0.5 ? jogador1 : jogador2;

//         // Insere os dados da batalha na tabela 'batalhas'
//         await pool.query('INSERT INTO batalhas (jogador1_id, jogador2_id, vencedor_id, nome, idade, velocidade, habilidade, posicao, time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [jogador1.id, jogador2.id, vencedor.id, vencedor.nome, vencedor.idade, vencedor.velocidade, vencedor.habilidade, vencedor.posicao, vencedor.time]);

//         res.status(200).send({ message: "Batalha realizada com sucesso", vencedor });
//     } catch (error) {
//         console.log("Erro ao realizar a batalha: " + error);
//         res.status(500).send("Erro ao realizar a batalha");
//     }
// });



// Rota de teste
app.get('/', (req, res) => {
    res.send({ message: 'Servidor funcionando!' });
});


// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor iniciado na porta ${port}`);
})