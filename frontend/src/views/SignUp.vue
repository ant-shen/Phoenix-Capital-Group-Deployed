<template>
  <div class="signup">
    <h2>Sign Up</h2>
    <form @submit.prevent="register">
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">Sign Up</button>
    </form>
    <p>Already have an account? <router-link to="/">Login</router-link></p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SignUp',
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    async register() {
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/auth/signup`, {
          email: this.email,
          password: this.password,
        });
        this.$store.dispatch('login', response.data.token);
        this.$router.push('/dashboard');
      } catch (error) {
        console.error('Registration failed:', error);
        alert('Registration failed. Please try again.');
      }
    },
  },
};
</script>

<style scoped>
/* Container styling */
.signup {
  max-width: 500px;
  margin: auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* Heading styling */
h2 {
  color: #333;
  margin-bottom: 20px;
}

/* Form styling */
form {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* Form elements styling */
label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 15px;
}

input[type="email"]:focus,
input[type="password"]:focus {
  border-color: #007bff;
  outline: none;
}

/* Button styling */
button[type="submit"] {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
}

button[type="submit"]:disabled {
  background-color: #c0c0c0;
  cursor: not-allowed;
}

button[type="submit"]:hover {
  background-color: #0056b3;
}

/* Link styling */
p {
  margin-top: 15px;
}

router-link {
  color: #007bff;
  text-decoration: none;
}

router-link:hover {
  text-decoration: underline;
}
</style>

