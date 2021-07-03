<template>
  <div class="withdrawal-main">
    <div class="withdrawal__link">
      <router-link to="/withdrawal/new">New</router-link>
    </div>
    
    <div class="withdrawal__month">
      <div v-for="month in 12" v-bind:key="month">
        <a :href="createWithdrawalMonthPage(month)" :class="isActiveMonth(month)">{{ month }}</a>
      </div>
    </div>

    <div class="withdrawal__total">
      {{ this.$route.query.month }}月: {{ calculateTotalWithdrawal() }}
    </div>

    <table class="withdrawal-table">
      <thead class="withdrawal-table__thead">
        <tr>
          <th>금액</th>
          <th>날짜</th>
          <th>카테고리</th>
          <th>메모</th>
          <th>삭제</th>
        </tr>
      </thead>

      <tbody class="withdrawal-table__body">
        <tr v-for="(withDrawal, index) in withDrawals" :key="withDrawal.id">
          <td> {{ withDrawal.amountOfMoney }} </td>
          <td> {{ withDrawal.date }}          </td>
          <td> {{ withDrawal.category }}      </td>
          <td> {{ withDrawal.memo }}          </td>
          <td>
            <button 
              @click="deleteWithDrawal(withDrawal.id, index)" 
              class="withdrawal-table__delete-button">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import firebase from 'firebase';

export default {
  data () {
    return {
      withDrawals: [],
      db: firebase.firestore()
    }
  },
  created () {
    this.getWithDrawal();
  },
  methods: {
    async getWithDrawal () {
      const activeMonth = parseInt(this.$route.query.month);
      const startMonth = activeMonth < 10 ? `2021-0${activeMonth}` : `2021-${activeMonth}`;
      let endMonth = activeMonth < 10 ? `2021-0${activeMonth + 1}` : `2021-${activeMonth}`;
      if (activeMonth === 12) endMonth = `2022-01`;

      await this.db.collection('withdrawals')
        .where('email', '==', 'jinsu6688@gmail.com')
        .where('date', '>=', startMonth)
        .where('date', '<', endMonth)
        .orderBy('date').get().then((querySnapshot) => {
          let i = 0;
          querySnapshot.forEach((doc) => {
            this.withDrawals.push(doc.data());
            this.withDrawals[i].id = doc.id;
          });
        }).catch( (error) => {
          console.log(`데이터를 가저오지 못했습니다. 이유는??: (${error})`);
        });
    },
    async deleteWithDrawal (id, index) {
      if (confirm('정말로 삭제하시겠습니까??')) {
        await this.db.collection('withdrawals').doc(id).delete().then(() => {
          this.withDrawals.splice(index, 1);
        }).catch((error) => {
          console.error("데이터를 삭제하지 못했습니다. 이유는??", error);
        });
      }

      if(this.withDrawals.length === 0) location.href(`/withdrawal?page=${this.currentPage - 1}`);
    },
    createWithdrawalMonthPage (i) {
      return `/withdrawal/month?month=${i}`;
    },
    isActiveMonth (month) {
      let isActive = false;
      if (parseInt(this.$route.query.month) === month) isActive = true;
      
      return {
        'withdrawal__month-button': true,
        active: isActive
      };
    },
    calculateTotalWithdrawal () {
      const withDrawalsMap = this.withDrawals.map(withdrawal => parseInt(withdrawal.amountOfMoney));
      const totalWithDrawal = withDrawalsMap.reduce(function(sum, withdrawal){
        return sum + withdrawal;
      }, 0);

      return totalWithDrawal;
    }
  }
}
</script>

<style lang="scss">
  @import '../../assets/sass/base/color';

  .withdrawal {
    &-main {
      text-align: center;
      padding: 0 10%;
    }
    &__month {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 75px;
      margin-bottom: 20px;
      &-button {
        padding: 15px 30px;
        border: 1px solid lighten($border-color-gray, 30%);
        border-radius: 10px;
        color: $font-color-gray;
        font-size: 1.3rem;
      }
      .active {
        background: lighten($background-color-medium-sea-green, 15%);
        color: $font-color-white;
      }
    }
    &__total {
      text-align: right;
      font-size: 1.5rem;
      color: lighten($font-color-gray, 15%);
    }
    &__link {
      height: 50px;
      text-align: right;
      a {
        background-color: lightnen($background-color-gold, 5%); 
        border-radius: 10px;
        padding: 8px 13px;
        font-size: 1.3rem;
        color: $font-color-white;
      }
    }
    &-table {
      width: 100%;
      border: 1px solid lighten($border-color-gray, 30%);
      border-collapse: collapse;
      th, td {
        border-bottom: 1px solid lighten($border-color-gray, 30%);
        padding: 10px;
      }
      &__thead {
        background-color: lightnen($background-color-gold, 5%);
        color: $font-color-white;
      }
      &__delete-button {
        padding: 10px 10px;
        background-color: $background-color-orangered;
        color: $font-color-white;
        border: none;
        border-radius: 5px;
      }
    }
  }
</style>
