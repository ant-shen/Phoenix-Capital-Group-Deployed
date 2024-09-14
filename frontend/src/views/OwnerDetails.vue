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
        <input type="text" id="section" v-model="section" required />
        <span v-if="!isSectionValid">Section must be exactly 3 digits.</span>
      </div>
      <div>
        <label for="township">Township:</label>
        <input type="text" id="township" v-model="township" required />
        <span v-if="!isTownshipValid">Township must be 3 digits followed by "N" or "S".</span>
      </div>
      <div>
        <label for="range">Range:</label>
        <input type="text" id="range" v-model="range" required />
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
      owner: {},
      landHoldings: [],
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
      const apiUrl = process.env.VUE_APP_API_BASE_URL;

      // Fetch the owner details
      const ownerResponse = await axios.get(`${apiUrl}/api/owners/${ownerId}`, {
        headers: {
          Authorization: `Bearer ${this.$store.state.token}`,
        },
      });
      this.owner = ownerResponse.data;

      // Fetch the land holdings for this owner
      const holdingsResponse = await axios.get(`${apiUrl}/api/landholdings?owner=${ownerId}`, {
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
        const apiUrl = process.env.VUE_APP_API_BASE_URL;

        const response = await axios.post(
          `${apiUrl}/api/landholdings`,
          {
            name: `${this.section}-${this.township}-${this.range}`,
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
        this.resetForm();
      } catch (error) {
        console.error('Failed to create land holding:', error);
        alert('Failed to create land holding.');
      }
    },
    async deleteLandHolding(holdingId) {
      try {
        const apiUrl = process.env.VUE_APP_API_BASE_URL;

        await axios.delete(`${apiUrl}/api/landholdings/${holdingId}`, {
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
    resetForm() {
      this.legalEntity = '';
      this.netMineralAcres = '';
      this.mineralOwnerRoyalty = '';
      this.section = '';
      this.township = '';
      this.range = '';
      this.titleSource = '';
    },
  },
};
</script>

<style scoped>
/* Container styling */
.owner-details {
  max-width: 700px;
  margin: auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* Heading styling */
h2 {
  color: #333;
  margin-bottom: 10px;
}

h3 {
  color: #444;
  margin-top: 20px;
  margin-bottom: 10px;
}

/* List styling */
ul {
  padding-left: 20px;
  list-style-type: none;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
}

button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

button:hover {
  background-color: #c82333;
}

/* Form styling */
form {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
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
  margin-bottom: 15px;
}

input[type="text"]:focus,
input[type="number"]:focus,
select:focus {
  border-color: #007bff;
  outline: none;
}

/* Error message styling */
.error-message {
  color: red;
  font-size: 0.9em;
  margin-top: 5px;
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
</style>

