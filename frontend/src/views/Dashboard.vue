<template>
  <div>
    <h1>Dashboard</h1>
    <p v-if="!owners.length">No owners found.</p>
    <ul v-else>
      <li v-for="owner in owners" :key="owner._id">{{ owner.ownerName }}</li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Dashboard',
  data() {
    return {
      owners: []
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
    }
  }
}
</script>
