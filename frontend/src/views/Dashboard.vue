<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    
    <!-- Display a message while data is loading -->
    <div v-if="loading">Loading...</div>
    
    <!-- Display error message if there's an error fetching data -->
    <div v-if="error">{{ error }}</div>
    
    <!-- Form to add/edit owners -->
    <div v-if="isEditing">
      <h2>{{ ownerId ? 'Edit Owner' : 'Add New Owner' }}</h2>
      <form @submit.prevent="saveOwner">
        <div>
          <label for="ownerName">Owner Name:</label>
          <input type="text" v-model="ownerName" required />
        </div>
        <div>
          <label for="entityType">Entity Type:</label>
          <select v-model="entityType">
            <option value="Company">Company</option>
            <option value="Individual">Individual</option>
            <!-- Add more options as needed -->
          </select>
        </div>
        <div>
          <label for="ownerType">Owner Type:</label>
          <select v-model="ownerType">
            <option value="Competitor">Competitor</option>
            <option value="Partner">Partner</option>
            <!-- Add more options as needed -->
          </select>
        </div>
        <div>
          <label for="address">Address:</label>
          <input type="text" v-model="address" />
        </div>
        <button type="submit">{{ isEditing ? 'Update Owner' : 'Add Owner' }}</button>
        <button type="button" @click="cancelEdit">Cancel</button>
      </form>
    </div>
    
    <!-- List of owners -->
    <div v-else>
      <p v-if="!owners.length">No owners found.</p>
      <ul v-else>
        <li v-for="owner in owners" :key="owner._id">
          {{ owner.ownerName }}
          <button @click="editOwner(owner)">Edit</button>
          <button @click="deleteOwner(owner._id)">Delete</button>
        </li>
      </ul>
    </div>

    <!-- Logout button -->
    <button @click="logout">Logout</button>
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
      isEditing: false, // Track if we are in edit mode
      loading: true,    // Track loading state
      error: null,      // Track error state
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
      console.log('Owners loaded:', this.owners);
    } catch (error) {
      console.error('Failed to load owners:', error);
      this.error = 'Failed to load owners. Please try again later.';
      this.$router.push('/');
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async saveOwner() {
      try {
        if (this.isEditing) {
          // Update existing owner
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
          // Update owner in the list
          const index = this.owners.findIndex(owner => owner._id === this.ownerId);
          this.$set(this.owners, index, response.data);
        } else {
          // Create new owner
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
        // Clear form fields
        this.resetForm();
      } catch (error) {
        console.error(this.isEditing ? 'Failed to update owner' : 'Failed to create owner', error);
        alert(this.isEditing ? 'Failed to update owner.' : 'Failed to create owner.');
      }
    },
    editOwner(owner) {
      // Populate the form with the selected owner's data
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
      // Clear form fields
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
/* Add your styles here */
.dashboard {
  padding: 20px;
}
button {
  margin-left: 10px;
}
</style>
