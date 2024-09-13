<template>
  <div class="dashboard">
    <!-- Your existing template code -->
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
</style>
