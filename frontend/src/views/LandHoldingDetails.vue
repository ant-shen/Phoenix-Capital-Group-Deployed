<template>
  <div>
    <h2>Land Holding Details</h2>
    <form @submit.prevent="updateLandHolding">
      <div>
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="landHolding.name" required />
      </div>
      <div>
        <label for="legalEntity">Legal Entity:</label>
        <input type="text" id="legalEntity" v-model="landHolding.legalEntity" required />
      </div>
      <div>
        <label for="netMineralAcres">Net Mineral Acres:</label>
        <input type="number" id="netMineralAcres" v-model="landHolding.netMineralAcres" required />
      </div>
      <div>
        <label for="mineralOwnerRoyalty">Mineral Owner Royalty (%):</label>
        <input type="number" id="mineralOwnerRoyalty" v-model="landHolding.mineralOwnerRoyalty" required />
      </div>
      <div>
        <label for="section">Section:</label>
        <input type="text" id="section" v-model="landHolding.section" required @input="validateSection" />
        <span v-if="!isSectionValid" class="error-message">Section must be exactly 3 digits.</span>
      </div>
      <div>
        <label for="township">Township:</label>
        <input type="text" id="township" v-model="landHolding.township" required @input="validateTownship" />
        <span v-if="!isTownshipValid" class="error-message">Township must be 3 digits followed by "N" or "S".</span>
      </div>
      <div>
        <label for="range">Range:</label>
        <input type="text" id="range" v-model="landHolding.range" required @input="validateRange" />
        <span v-if="!isRangeValid" class="error-message">Range must be 3 digits followed by "E" or "W".</span>
      </div>
      <div>
        <label for="titleSource">Title Source:</label>
        <select id="titleSource" v-model="landHolding.titleSource" required>
          <option value="Class A">Class A</option>
          <option value="Class B">Class B</option>
          <option value="Class C">Class C</option>
          <option value="Class D">Class D</option>
        </select>
      </div>
      <button type="submit" :disabled="!isFormValid">Update Land Holding</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      landHolding: {
        name: '',
        legalEntity: '',
        netMineralAcres: '',
        mineralOwnerRoyalty: '',
        section: '',
        township: '',
        range: '',
        titleSource: 'Class A',
      },
      isSectionValid: true,
      isTownshipValid: true,
      isRangeValid: true,
      isFormValid: true,
    };
  },
  created() {
    this.fetchLandHolding();
  },
  methods: {
    async fetchLandHolding() {
      const id = this.$route.params.id;
      try {
        const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/api/landholdings/${id}`);
        const data = await response.json();
        this.landHolding = data;
      } catch (error) {
        console.error('Error fetching land holding:', error);
      }
    },
    validateSection() {
      const sectionPattern = /^\d{3}$/;
      this.isSectionValid = sectionPattern.test(this.landHolding.section);
      this.checkFormValidity();
    },
    validateTownship() {
      const townshipPattern = /^\d{3}[NS]$/;
      this.isTownshipValid = townshipPattern.test(this.landHolding.township);
      this.checkFormValidity();
    },
    validateRange() {
      const rangePattern = /^\d{3}[EW]$/;
      this.isRangeValid = rangePattern.test(this.landHolding.range);
      this.checkFormValidity();
    },
    checkFormValidity() {
      this.isFormValid = this.isSectionValid && this.isTownshipValid && this.isRangeValid;
    },
    async updateLandHolding() {
      if (!this.isFormValid) {
        alert('Please correct the form errors before submitting.');
        return;
      }

      const sectionName = `${this.landHolding.section}-${this.landHolding.township}-${this.landHolding.range}`;
      const updatedLandHolding = {
        ...this.landHolding,
        sectionName,
      };

      const id = this.$route.params.id;
      try {
        const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/api/landholdings/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedLandHolding),
        });

        if (!response.ok) {
          throw new Error('Failed to update land holding');
        }
        this.$router.push('/owners/${this.landHolding.ownerId}');
      } catch (error) {
        console.error('Error updating land holding:', error);
        alert('Failed to update land holding.');
      }
    },
  },
};
</script>

<style>
.error-message {
  color: red;
  font-size: 0.9em;
}
</style>
