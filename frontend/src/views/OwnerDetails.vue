<template>
  <div class="owner-details">
    <h2>{{ owner.ownerName }}</h2>
    <p>Address: {{ owner.address }}</p>
    
    <!-- Land Holdings List -->
    <h3>Land Holdings</h3>
    <ul>
      <li v-for="holding in landHoldings" :key="holding._id">
        <router-link :to="'/landholding/' + holding._id">
          {{ holding.name }} - {{ holding.legalEntity }}
        </router-link>
        <!-- Delete Button -->
        <button @click="deleteLandHolding(holding._id)">Delete</button>
      </li>
    </ul>

    <!-- Create Land Holding Form -->
    <form @submit.prevent="createLandHolding">
      <h3>Create New Land Holding</h3>
      <div>
        <label for="legalEntity">Legal Entity:</label>
        <input type="text" id="legalEntity" v-model="legalEntity" required />
      </div>
      <div>
        <label for="netMineralAcres">Net Mineral Acres:</label>
        <input type="number" id="netMineralAcres" v-model="netMineralAcres" required />
      </div>
      <div>
        <label for="mineralOwnerRoyalty">Mineral Owner Royalty (%):</label>
        <input type="number" id="mineralOwnerRoyalty" v-model="mineralOwnerRoyalty" required />
      </div>
      <div>
        <label for="section">Section:</label>
        <input type="text" id="section" v-model="section" required pattern="\d{3}" />
        <span v-if="!isSectionValid">Section must be exactly 3 digits.</span>
      </div>
      <div>
        <label for="township">Township:</label>
        <input type="text" id="township" v-model="township" required pattern="\d{3}[NS]" />
        <span v-if="!isTownshipValid">Township must be 3 digits followed by "N" or "S".</span>
      </div>
      <div>
        <label for="range">Range:</label>
        <input type="text" id="range" v-model="range" required pattern="\d{3}[EW]" />
        <span v-if="!isRangeValid">Range must be 3 digits followed by "E" or "W".</span>
      </div>
      <div>
        <label for="titleSource">Title Source:</label>
        <select id="titleSource" v-model="titleSource" required>
          <option value="Class A">Class A</option>
          <option value="Class B">Class B</option>
          <option value="Class C">Class C</option>
          <option value="Class D">Class D</option>
        </select>
      </div>
      <button type="submit">Create Land Holding</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'OwnerDetails',
  data() {
    return {
      owner: {}, // Initialize as empty object
      landHoldings: [], // Initialize as empty array
      legalEntity: '',
      netMineralAcres: '',
      mineralOwnerRoyalty: '',
      section: '',
      township: '',
      range: '',
      titleSource: '',
      isSectionValid: true,
      isTownshipValid: true,
      isRangeValid: true,
    };
  },
  async created() {
    try {
      const ownerId = this.$route.params.id;
      
      // Fetch the owner details
      const ownerResponse = await axios.get(`http://localhost:5001/api/owners/${ownerId}`, {
        headers: {
          Authorization: `Bearer ${this.$store.state.token}`,
        },
      });
      this.owner = ownerResponse.data;

      // Fetch the land holdings for this owner
      const holdingsResponse = await axios.get(`http://localhost:5001/api/landholdings?owner=${ownerId}`, {
        headers: {
          Authorization: `Bearer ${this.$store.state.token}`,
        },
      });
      this.landHoldings = holdingsResponse.data;
    } catch (error) {
      console.error('Failed to fetch owner or land holdings:', error);
      this.$router.push('/dashboard');
    }
  },
  methods: {
    validateFields() {
      const sectionPattern = /^\d{3}$/;
      const townshipPattern = /^\d{3}[NS]$/;
      const rangePattern = /^\d{3}[EW]$/;

      this.isSectionValid = sectionPattern.test(this.section);
      this.isTownshipValid = townshipPattern.test(this.township);
      this.isRangeValid = rangePattern.test(this.range);

      return this.isSectionValid && this.isTownshipValid && this.isRangeValid;
    },
    async createLandHolding() {
      if (!this.validateFields()) {
        return;
      }

      try {
        const ownerId = this.$route.params.id;
        const response = await axios.post(
          'http://localhost:5001/api/landholdings',
          {
            name: `${this.section}-${this.township}-${this.range}`, // Use a combination for name
            owner: ownerId,
            legalEntity: this.legalEntity,
            netMineralAcres: this.netMineralAcres,
            mineralOwnerRoyalty: this.mineralOwnerRoyalty,
            section: this.section,
            township: this.township,
            range: this.range,
            titleSource: this.titleSource,
          },
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
            },
          }
        );
        this.landHoldings.push(response.data);
        // Clear form fields after submission
        this.legalEntity = '';
        this.netMineralAcres = '';
        this.mineralOwnerRoyalty = '';
        this.section = '';
        this.township = '';
        this.range = '';
        this.titleSource = '';
      } catch (error) {
        console.error('Failed to create land holding:', error);
        alert('Failed to create land holding.');
      }
    },
    async deleteLandHolding(holdingId) {
      try {
        await axios.delete(`http://localhost:5001/api/landholdings/${holdingId}`, {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
          },
        });
        this.landHoldings = this.landHoldings.filter(holding => holding._id !== holdingId);
      } catch (error) {
        console.error('Failed to delete land holding:', error);
        alert('Failed to delete land holding.');
      }
    },
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
