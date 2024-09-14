<template>
  <div class="dashboard">
    <h2>Dashboard</h2>
    <button @click="logout">Logout</button>

    <!-- Owners List -->
    <div v-if="owners.length > 0">
      <h3>Owners</h3>
      <ul>
        <li v-for="owner in owners" :key="owner._id">
          <router-link :to="'/owner/' + owner._id">{{ owner.ownerName }}</router-link>
          <button @click="editOwner(owner)">Edit</button>
          <button @click="deleteOwner(owner._id)">Delete</button>
          <!-- View Land Holdings Button -->
          <router-link :to="'/owner/' + owner._id">
            <button>View Land Holdings</button>
          </router-link>
        </li>
      </ul>
    </div>

    <!-- Create/Update Owner Form -->
    <form @submit.prevent="saveOwner">
      <h3>{{ isEditing ? 'Update' : 'Create' }} Owner</h3>
      <div>
        <label for="ownerName">Owner Name:</label>
        <input type="text" v-model="ownerName" required />
      </div>
      <div>
        <label for="entityType">Entity Type:</label>
        <select v-model="entityType" required>
          <option value="Company">Company</option>
          <option value="Individual">Individual</option>
          <option value="Investor">Investor</option>
          <option value="Trust">Trust</option>
        </select>
      </div>
      <div>
        <label for="ownerType">Owner Type:</label>
        <select v-model="ownerType" required>
          <option value="Competitor">Competitor</option>
          <option value="Seller">Seller</option>
          <option value="Investor">Investor</option>
          <option value="Professional">Professional</option>
        </select>
      </div>
      <div>
        <label for="address">Address:</label>
        <input type="text" v-model="address" required />
      </div>
      <button type="submit">{{ isEditing ? 'Update' : 'Create' }} Owner</button>
      <button v-if="isEditing" @click="cancelEdit">Cancel</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Dashboard',
  data() {
    return {
      owners: [],
      ownerId: null,
      ownerName: '',
      entityType: 'Company',
      ownerType: 'Competitor',
      address: '',
      isEditing: false,
    };
  },
  async created() {
    try {
      const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/api/owners`, {
        headers: {
          Authorization: `Bearer ${this.$store.state.token}`,
        },
      });
      this.owners = response.data;
    } catch (error) {
      console.error('Failed to fetch owners:', error);
      this.$router.push('/');
    }
  },
  methods: {
    async saveOwner() {
      try {
        if (this.isEditing) {
          const response = await axios.put(
            `${process.env.VUE_APP_API_BASE_URL}/api/owners/${this.ownerId}`,
            {
              ownerName: this.ownerName,
              entityType: this.entityType,
              ownerType: this.ownerType,
              address: this.address,
            },
            {
              headers: {
                Authorization: `Bearer ${this.$store.state.token}`,
              },
            }
          );
          const index = this.owners.findIndex(owner => owner._id === this.ownerId);
          this.$set(this.owners, index, response.data);
        } else {
          const response = await axios.post(
            `${process.env.VUE_APP_API_BASE_URL}/api/owners`,
            {
              ownerName: this.ownerName,
              entityType: this.entityType,
              ownerType: this.ownerType,
              address: this.address,
            },
            {
              headers: {
                Authorization: `Bearer ${this.$store.state.token}`,
              },
            }
          );
          this.owners.push(response.data);
        }
        this.resetForm();
      } catch (error) {
        console.error(this.isEditing ? 'Failed to update owner' : 'Failed to create owner', error);
        alert(this.isEditing ? 'Failed to update owner.' : 'Failed to create owner.');
      }
    },
    editOwner(owner) {
      this.ownerId = owner._id;
      this.ownerName = owner.ownerName;
      this.entityType = owner.entityType;
      this.ownerType = owner.ownerType;
      this.address = owner.address;
      this.isEditing = true;
    },
    async deleteOwner(ownerId) {
      try {
        await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/api/owners/${ownerId}`, {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
          },
        });
        this.owners = this.owners.filter(owner => owner._id !== ownerId);
      } catch (error) {
        console.error('Failed to delete owner:', error);
        alert('Failed to delete owner.');
      }
    },
    cancelEdit() {
      this.resetForm();
    },
    resetForm() {
      this.ownerId = null;
      this.ownerName = '';
      this.entityType = 'Company';
      this.ownerType = 'Competitor';
      this.address = '';
      this.isEditing = false;
    },
    logout() {
      this.$store.dispatch('logout');
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
.dashboard {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #333;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  margin: 5px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #0056b3;
}

form {
  margin-top: 20px;
  background-color: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

h3 {
  color: #333;
}

div {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input[type="text"],
input[type="number"],
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

input[type="text"]:focus,
input[type="number"]:focus,
select:focus {
  border-color: #007bff;
  outline: none;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  background-color: #fff;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

li button {
  margin-left: 5px;
}

.success-message {
  color: green;
  font-size: 1em;
  margin-top: 1em;
}

.error-message {
  color: red;
  font-size: 0.9em;
  margin-top: 1em;
}
</style>

