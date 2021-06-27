<template>
  <div class="withdrawal-input">
    <h1>WithDrawal</h1>
    <div class="withdrawal__display">
      <div class="withdrawal__display-japan">
        <h1>🇯🇵</h1>
        <h1>{{ totalWithDrawal }}¥ </h1>
      </div>

      <div class="withdrawal__display-korea">
        <h1>🇰🇷</h1>
        <h1>{{ exchangeToWon() }}₩</h1>
      </div>
    </div>
    
    <div class="withdrawal__inputs">
      <input type="text" placeholder="금액" v-model="amountOfMoney">

      <select v-model="category" class="withdrawal__select">
        <option v-for="category_option in categories" v-bind:value="category_option.value" v-bind:key="category_option">
          {{ category_option.text }}
        </option>
      </select>

      <input type="text" placeholder="메모" v-model="memo">
    </div>
    
    <div>
      <button class="withdrawal__button" @click="addWithDrawal">Register</button>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  data () {
    return {
      totalWithDrawal: 0,
      widthDrawals: [],
      amountOfMoney: 0,
      category: '',
      memo: '',
      db: firebase.firestore(),
      categories: [
        { text: '식료품', value: '식료품' },
        { text: '외식', value: '외식' },
        { text: '교통비', value: '교통비' },
        { text: '의류', value: '의류' },
        { text: '의료', value: '의료' },
        { text: '기타', value: '기타' }
      ]  
    }
  },
  created () {
    this.getWidthDrawal();
    this.totalWithDrawal = this.calculateTotalWithDrawal();
  },
  methods: {
    async addWithDrawal () {
      await this.db.collection("withdrawals").add({
        //DBに突っ込みたいもの
        email: 'jinsu6688@gmail.com',
        amountOfMoney: this.amountOfMoney,
        category: this.category,
        memo: this.memo,
        date: this.customerFormatDate()
      }).then((doc) => { // eslint-disable-line no-unused-vars
        this.widthDrawals.push(parseInt(this.amountOfMoney));
        this.calculateTotalWithDrawal();
      }).catch((error) => {
        console.log(error);
      });
    },
    async getWidthDrawal () {
      await this.db.collection("withdrawals").where("email", "==", 'jinsu6688@gmail.com').get()
        .then((querySnapshot) => {
          querySnapshot.forEach( (doc) => {
            this.widthDrawals.push(parseInt(doc.data().amountOfMoney));
          });
          this.calculateTotalWithDrawal();
        }).catch( (error) => {
          console.log(`データの取得に失敗しました (${error})`);
        });
    },
    calculateTotalWithDrawal () {
      const totalWithDrawal = this.widthDrawals.reduce(function add(sum, currValue) {
        return sum + currValue;
      }, 0);
   
      this.totalWithDrawal = totalWithDrawal;
    },
    customerFormatDate() {
      const gmtDate = new Date();

      let month = 1 + gmtDate.getMonth();
      month = month >= 10 ? month : '0' + month;

      let day = gmtDate.getDate();
      day = day >= 10 ? day : '0' + day;

      const FormatDate = 
        `${gmtDate.getFullYear()}-${month}-${day} ${gmtDate.getHours()}:${gmtDate.getMinutes()}`;
      
      return FormatDate;
    },
    exchangeToWon () {
      return Math.floor(this.totalWithDrawal * 10.19);
    }
  },
}
</script>

<style scoped>
.withdrawal {
  height: 100%;
}
.withdrawal__display {
  display: flex;
  justify-content: center;
}
.withdrawal__display-japan,
.withdrawal__display-korea {
  display: flex;
  padding: 0 10px;
  /* margin-right: 30px; */
  border: 1px solid #bdbdbd;
}
.withdrawal__inputs {
    margin-top: 20px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}
.withdrawal__inputs input {
  margin: 10px 0;
  padding: 10px;
  width: 340px;
}
.withdrawal__select {
  margin: 10px 0;
  padding: 10px;
  width: 368px;
}
.withdrawal__button {
  width: 367px;
  height: 50px;
  font-size: 1.2rem;
}
</style>