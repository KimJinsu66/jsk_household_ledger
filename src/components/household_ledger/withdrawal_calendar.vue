<template>
  <div class="withdrawal-main">
    <div class="withdrawal__month">
      <div v-for="month in 12" v-bind:key="month">
        <a :href="createWithdrawalMonthPage(month)" :class="isActiveMonth(month)">{{ month }}</a>
      </div>
    </div>

    <div class="withdrawal__total">
      {{ this.$route.query.month }}月: {{ calculateTotalWithdrawal() }}
    </div>

    <div class="withdrawal-calendar">
      <div class="withdrawal-calendar__header">
        <div 
          v-for="day in dayOfTheWeeks" 
          v-bind:key="day"
          class="withdrawal-calendar__day">
          {{ day }}
        </div>
      </div>

      <div v-for="weak in daysInThatMonth()" v-bind:key="weak" class="withdrawal-calendar__weak">
        <div 
          v-for="date in weak" 
          v-bind:key="date"
          @click="alertWithdrawals(date.date)"
          class="withdrawal-calendar__date">
          {{ date.date }}
          <div 
            v-for="withdrawal in checkWithdrawalsOverThree(date.withdrawals)" 
            v-bind:key="withdrawal">
            {{ withdrawal.amountOfMoney }} {{ withdrawal.category}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase';

export default {
  data () {
    return {
      withDrawals: [],
      dayOfTheWeeks: ['일', '월', '화', '수', '목', '금', '토'],
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
      return `/withdrawal/calendar?year=2021&month=${i}`; // 향후 년도 바꿔야함
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
      const withDrawalsMap = 
        this.withDrawals.map(withdrawal => parseInt(withdrawal.amountOfMoney));
      const totalWithDrawal = withDrawalsMap.reduce(function(sum, withdrawal) {
        return sum + withdrawal;
      }, 0);

      return totalWithDrawal;
    },
    calculateNumberOfDaysPerMonth () {
      const now = new Date();
      const numberOfDays = new Date(now.getFullYear(), this.$route.query.month, 0).getDate();

      return numberOfDays;
    },
    daysInThatMonth () {
      let dayOfTheMonth = [];
      const firstDay = new Date(this.$route.query.year, this.$route.query.month - 1, 1).getDay();

      for (let i = 0; i < firstDay; i++) {
        dayOfTheMonth.push(' ');
      }

      for (let date = 1; date <= this.calculateNumberOfDaysPerMonth(); date++) {
        dayOfTheMonth.push({
          'date': date,
          withdrawals: this.filterDayWithdrawals(date)
        });
      }
      
      dayOfTheMonth = this.divisionArray(7, dayOfTheMonth);

      return dayOfTheMonth;
    },
    divisionArray (n, array) {
      const arr = array;
      const len = arr.length;
      const cnt = Math.floor(len / n);
      let   tmp = [];

      for (var i = 0; i <= cnt; i++) {
        tmp.push(arr.splice(0, n));
      }

      return tmp;
    },
    filterDayWithdrawals (date) {
      const activeMonth = 
        this.$route.query.month < 10 ? `0${this.$route.query.month}` : this.$route.query.month;
      const activeDate = date < 10 ? `0${date}` : date;

      const filterWithdrawals = this.withDrawals.filter(withdrawal => withdrawal.date.indexOf(
        `${this.$route.query.year}-${activeMonth}-${activeDate}`) !== -1
      );

      return filterWithdrawals;
    },
    checkWithdrawalsOverThree (withDrawals) {
      if (withDrawals === undefined) return;
      if (withDrawals.length < 3) return withDrawals;
      
      const widhDrawalsLength = withDrawals.length;
      withDrawals = withDrawals.slice(0, 2);
      withDrawals.push({amountOfMoney: '남은', category: `${widhDrawalsLength - 2}개의 지출 확인`});


      return withDrawals;
    },
    alertWithdrawals (date) {
      const filterDayWithdrawals = this.filterDayWithdrawals(date);
      let text = '';

      if (filterDayWithdrawals.length === 0) {
        alert(`${date}일은 지출이 없습니다`);
        return;
      }

      text += `${date}일\n`;

      for (const withdrawal of filterDayWithdrawals) {
        console.log(withdrawal);
        text += `${withdrawal.amountOfMoney}円 : ${withdrawal.category} : ${withdrawal.memo}\n`;
      }

      alert(text);
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
        padding: 10px 30px;
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
    &-calendar {
      &__header {
        display: flex;
        background-color: lighten($background-color-medium-sea-green, 15%);
        font-size: 1.1rem;
        font-weight: bold;
      }
      &__day {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 14.1%;
        height: 35px;
        color: $font-color-white;
        border: 1px solid lighten($border-color-gray, 30%);
      }
      &__weak {
        display: flex;
      }
      &__date {
        width: 14.1%;
        height: 100px;
        border: 1px solid lighten($border-color-gray, 30%);
      }
    }
    &__link {
      height: 50px;
      text-align: right;
      a {
        background-color: lighten($background-color-gold, 5%); 
        border-radius: 10px;
        padding: 8px 13px;
        font-size: 1.3rem;
        color: $font-color-white;
      }
    }
  }
</style>
