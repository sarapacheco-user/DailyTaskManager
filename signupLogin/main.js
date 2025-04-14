// Handle form submission for the "Forgot Password" flow

//
// Rota de esqueci a senha
//

document.getElementById('forgotPassword').addEventListener('click', () => {

  const email = prompt("Please enter your email to reset the password:");

  if (email) {

    fetch('http://localhost:5000/forgot-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }), // Manda o email para o servidor como JSON
    })
    .then((response) => response.json()) // Converte a resposta em JSON
    .then((data) => {
        if (data.message === 'Password reset link sent') {
            alert("A password reset link has been sent to your email!"); // Mostra um alerta de sucesso
        } else {
            alert("An error occurred: " + data.message);// Mostra um alerta de erro
        }
    })
    .catch((error) => {
        console.error("Error during the fetch operation:", error); // Mostra um erro no console
        alert("An error occurred. Please try again later.");// Mostra um alerta de erro
    });
  } else {
    alert("Please enter a valid email."); // Mostra um alerta de erro
  }
}); // <-- Correct closing of the event listener

//
// Rota de signup
//

document.getElementById('signupForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const formData = new FormData(this);
// monta o objeto com os dados do formulário
  const userData = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
  };
//  console log para debug 
  fetch('http://localhost:5000/signup', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
  })
  .then(response => response.json()) // Converte a resposta em JSON
  .then(data => {
      if (data.message === "Usuário registrado com sucesso" ) { // Verifica se o usuário foi registrado com sucesso
          alert('Registration successful!');    // Mostra um alerta de sucesso
          window.location.href = '/succesfulLogin/success.html'; // Redireciona para a página de destino
      } else {
          alert('Registration failed: ' + data.message); // Mostra um alerta de erro
      }
  })
  .catch(error => {
      console.error('Error during the fetch operation:', error); // Mostra um erro no console
      alert('An error occurred during registration. Please try again later.'); // Mostra um alerta de erro
  });
});

// // Handle form submission for the "Login" form
// document.getElementById('loginForm').addEventListener('submit', function (event) {
//   event.preventDefault();

//   const formData = new FormData(this);
//   const loginData = {
//       email: formData.get('email'),
//       password: formData.get('password'),
//   };

//   fetch('http://localhost:5000/login', {
//       method: 'POST',
//       headers: {
//           'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(loginData),
//   })
//   .then(response => response.json())
//   .then(data => {
//       if (data.message === 'Login successful') {
//           alert('Login successful!');
//           // Redirect to a dashboard or user page
//       } else {
//           alert('Login failed: ' + data.message);
//       }
//   })
//   .catch(error => {
//       console.error('Error during the fetch operation:', error);
//       alert('An error occurred during login. Please try again later.');
//   });
// });
// Handle form submission for the "Login" form

//
// Rota de login
//

document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    // Obtém os dados do formulário
    const formData = new FormData(this);
    // Monta o objeto com os dados do formulário
    const loginData = {
        email: formData.get('email'),
        password: formData.get('password'),
    };
// Faz a requisição para o servidor
    fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
    })
    .then(response => response.json()) // Converte a resposta em JSON
    .then(data => { // Verifica se o login foi bem-sucedido
        if (data.message === 'Login bem-sucedido') {
            // Armazenar o token no localStorage ou sessionStorage
            localStorage.setItem('authToken', data.token);

            alert('Login bem-sucedido!');
            // Redirecionar para a página de dashboard ou página de boas-vindas
            window.location.href = '/succesfulLogin/success.html'; // Mude para a página de destino desejada
        } else {
            alert('Login falhou: ' + data.message); // Mostra um alerta de erro
        }
    })
    .catch(error => {
        console.error('Erro durante a operação de login:', error); // Mostra um erro no console
        alert('Ocorreu um erro ao fazer login. Tente novamente mais tarde.');// Mostra um alerta de erro
    });
});

// 
// Rota de redefinição de senha
//

document.getElementById('resetPasswordButton').addEventListener('click', function() {
    // Obtém a nova senha do campo de formulário
    const newPassword = document.getElementById('newPassword').value;
    
    // Obtém o token da URL da página
    const urlParams = new URLSearchParams(window.location.search);
    // Obtém o token da URL
    const token = urlParams.get("token");
  
    if (newPassword && token) {
        // Envia a nova senha com o token para o servidor
        fetch('http://localhost:5000/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, newPassword }),
        })
        .then(response => response.json()) // Converte a resposta em JSON
        .then(data => {
            if (data.success) { // Verifica se a senha foi redefinida com sucesso
                alert('Sua senha foi redefinida com sucesso.');
                window.location.href = "/signupLogin/index.html";  // Redireciona para login ou outra página
            } else {
                alert('Erro ao redefinir a senha: ' + data.message); // Mostra um alerta de erro
            }
        })
        .catch(error => {

            console.error('Erro durante a operação de fetch:', error); // Mostra um erro no console 
            alert('Ocorreu um erro ao redefinir a senha.'); // Mostra um alerta de erro
        });
    } else {
        alert('Por favor, insira uma senha válida.'); // Mostra um alerta de erro
    }
  });
// Handle the "Change Password" form submission 
