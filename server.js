const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken"); 
dotenv.config();
const bcrypt = require('bcryptjs');
const app = express();
const port = 5000;
const mongoose = require('mongoose');
const User = require('./models/User');
// Defining the schema



// conecta-se ao banco de dados que no caso é 
// MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});

// Middleware que permite que o Express leia dados em JSON e aceite varias requisições sem sar problema no cors
app.use(cors({
  origin: '*', // Permite que qualquer URL acesse a API
  methods: ['GET', 'POST'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
}));
app.use(bodyParser.json()); // Permite que o Express leia dados em JSON

// Configuração do nodemailer para enviar e-mails
let transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io', // Servidor SMTP que é usado para enviar e-mails
  port: 587,                 // Porta do servidor SMTP
    secure: false,   
    auth: {
        user: process.env.MAILTRAP_USER,// Usuário do servidor SMTP
        pass: process.env.MAILTRAP_PASS,// Senha do servidor SMTP
    },
});

//
// Rota de Registro
//

app.post("/signup", async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Nome, email e senha são obrigatórios" });
    }

    try {
        // Verifique se o usuário já existe no banco de dados
        const userExists = await User.findOne({ email: email });
        // Não permite que o usuário se registre duas vezes
        if (userExists) {
            return res.status(400).json({ message: "Usuário já existe" });
        }

        // Criptografe a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crie um novo usuário no banco de dados
        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword,
        });

        // Salve o novo usuário
        await newUser.save();

        res.status(201).json({ message: "Usuário registrado com sucesso" });

    } catch (error) {

        console.error("Erro ao cadastrar o usuário:", error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
});

//
// Rota de Login
//

app.post("/login", async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email e senha são obrigatórios" });
    }

    try {
        // Verifique se o usuário existe no banco de dados
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        // Verifique se a senha corresponde
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Senha incorreta" });
        }

        // Se a senha estiver correta, gere um token JWT para o usuário
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: "Login bem-sucedido", token });

        res.redirect('http://localhost:5500/succesfulLogin/success.html');

    } catch (error) {

        console.error("Erro durante o login:", error);
        res.status(500).json({ message: "Erro interno do servidor" });

    }
});

//
// Rota de esqueci a senha
//

app.post("/forgot-password", async (req, res) => {

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        // Usa o modelo de usuário para verificar se o usuário existe

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Cria um token JWT com o email do usuário
        const resetToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Cria o link de redefinição de senha (antigamente era 3000)
        const resetLink = `http://localhost:5000/reset-password?token=${resetToken}`;

        // Email que será enviado
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "Reset Your Password",
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`, // Ao clicar no link, o usuário será redirecionado para a página de redefinição de senha
        };

        // Envia o email com o link de redefinição de senha
        transporter.sendMail(mailOptions, (error, info) => {

            if (error) {

                console.error("Error sending email:", error);
                return res.status(500).json({ message: `Error sending email: ${error.message}` });

            }

            res.status(200).json({ message: "Password reset link sent" });
        });

    } catch (error) {

        console.error("Internal server error:", error);
        res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
});

//
// Obtem a funcao de redefinição de senha
//

app.get("/reset-password", (req, res) => {
    // Checa se o token está presente na query string 
    const token = req.query.token; // http://localhost:5000/reset-password?token=token_value

    if (!token) {
        return res.status(400).send("Token is required");
    }

    // Here, you would render a password reset form on the frontend
    // If you're using a front-end framework, you might redirect to the frontend form.
    // For now, we will just return a simple message.
    res.redirect(`http://localhost:5500/resetPassword/resetPassword.html?token=${token}`);
});

// app.post("/reset-password", async (req, res) => {
//     const { token, newPassword } = req.body;

//     try {
//         // Verify token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const userEmail = decoded.email;

//         // Hash the new password
//         const hashedPassword = await bcrypt.hash(newPassword, 10);

//         // Update the password in the database
//         const result = await pool.query("UPDATE users SET password = $1 WHERE email = $2", 
//             [hashedPassword, userEmail]);

//         if (result.rowCount === 0) {
//             return res.status(400).json({ success: false, message: "User not found" });
//         }

//         res.json({ success: true, message: "Password updated successfully!" });

//     } catch (error) {
//         console.error("Error updating password:", error);
//         res.status(400).json({ success: false, message: "Invalid or expired token" });
//     }
// });


//
// Rota de redefinição de senha
//

app.post("/reset-password", async (req, res) => {

    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ success: false, message: "Token e senha são obrigatórios" });
    }

    try {
        // Verifique o token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userEmail = decoded.email;

        // Verifique se a nova senha é válida (pode adicionar mais validações de senha aqui)
        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: "A senha deve ter pelo menos 6 caracteres" });
        }

        // Faça o hash da nova senha
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Atualize a senha do usuário no MongoDB
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ success: false, message: "Usuário não encontrado" });
        }

        // Atualize a senha
        user.password = hashedPassword;
        await user.save();

        res.json({ success: true, message: "Senha atualizada com sucesso!" });

    } catch (error) {

        console.error("Erro ao atualizar a senha:", error);
        res.status(400).json({ success: false, message: "Token inválido ou expirado" });
        
    }
});
// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
